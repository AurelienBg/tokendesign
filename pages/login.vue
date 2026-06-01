<script setup lang="ts">
/**
 * /login — opt-in auth. Google + magic-link (XRPL wallet sign-in added with
 * its server routes). Blueprint identity, local-first messaging.
 */
const { t } = useI18n()
const localePath = useLocalePath()
const { sendMagicLink, signInWithGoogle, isAuthenticated } = useAuth()

const email = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error' | 'oauth'>('idle')
const errorMessage = ref<string | null>(null)

useHead({ title: () => `${t('login.title')} — Token Design` })

// Already signed in → bounce home.
watchEffect(() => {
  if (isAuthenticated.value) navigateTo(localePath('/'))
})

async function submit() {
  if (!email.value.includes('@')) {
    errorMessage.value = t('login.invalidEmail')
    status.value = 'error'
    return
  }
  status.value = 'sending'
  errorMessage.value = null
  try {
    await sendMagicLink(email.value)
    status.value = 'sent'
  } catch (e) {
    status.value = 'error'
    errorMessage.value = e instanceof Error ? e.message : t('login.genericError')
  }
}

async function handleGoogle() {
  status.value = 'oauth'
  errorMessage.value = null
  try {
    await signInWithGoogle()
  } catch (e) {
    status.value = 'error'
    errorMessage.value = e instanceof Error ? e.message : t('login.genericError')
  }
}
</script>

<template>
  <main class="wrap max-w-md py-16 sm:py-24">
    <NuxtLink
      :to="localePath('/')"
      class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
    >{{ t('create.backHub') }}</NuxtLink>

    <div class="card p-8 mt-4 space-y-6">
      <div>
        <p class="kicker mb-2">{{ t('login.kicker') }}</p>
        <h1 class="font-display text-2xl font-semibold text-ink-high">{{ t('login.title') }}</h1>
        <p class="text-sm text-ink-mid mt-1.5">{{ t('login.subtitle') }}</p>
      </div>

      <template v-if="status !== 'sent'">
        <!-- Google -->
        <button
          type="button"
          class="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border-subtle bg-bg-elevated text-ink-high hover:border-accent transition-colors disabled:opacity-50"
          :disabled="status === 'oauth' || status === 'sending'"
          @click="handleGoogle"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.78 2.72v2.26h2.88c1.69-1.55 2.66-3.84 2.66-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.46-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.45 15.98 5.48 18 9 18z" />
            <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.28-1.71V4.96H.96A8.98 8.98 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.45 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" />
          </svg>
          <span>{{ status === 'oauth' ? t('login.redirecting') : t('login.signInWithGoogle') }}</span>
        </button>

        <!-- divider -->
        <div class="flex items-center gap-3">
          <div class="flex-1 border-t border-border-subtle" />
          <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">{{ t('login.or') }}</span>
          <div class="flex-1 border-t border-border-subtle" />
        </div>

        <!-- Magic link -->
        <form class="space-y-3" @submit.prevent="submit">
          <label for="email" class="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low">{{ t('login.emailLabel') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-border-subtle bg-bg-elevated px-4 py-2.5 text-ink-high placeholder:text-ink-low focus:outline-none focus:border-accent transition-colors"
            :placeholder="t('login.emailPlaceholder')"
          >
          <button type="submit" class="btn-primary w-full justify-center" :disabled="status === 'sending' || status === 'oauth'">
            {{ status === 'sending' ? t('login.sending') : t('login.sendLink') }}
          </button>
        </form>

        <p v-if="errorMessage" class="text-sm text-danger">{{ errorMessage }}</p>
      </template>

      <!-- Sent confirmation -->
      <div v-else class="space-y-3">
        <div class="card border-l-2 border-l-info p-4">
          <p class="text-sm text-ink-high"><span class="glyph text-info mr-1.5" aria-hidden="true">✦</span>{{ t('login.sentTitle') }}</p>
          <p class="text-xs text-ink-mid mt-2">{{ t('login.sentBody', { email }) }}</p>
        </div>
        <button type="button" class="btn-ghost w-full justify-center" @click="status = 'idle'">{{ t('login.useDifferentEmail') }}</button>
      </div>

      <p class="text-xs text-ink-low text-center border-t border-border-subtle pt-4">{{ t('login.localFirstHint') }}</p>
    </div>
  </main>
</template>
