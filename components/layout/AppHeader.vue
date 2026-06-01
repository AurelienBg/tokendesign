<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()
const { user, signOut } = useAuth()

async function logout() {
  try {
    await signOut()
  } catch {
    // non-blocking — the user asked to sign out
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border-subtle/70 backdrop-blur-md print:hidden"
          style="background-color: rgb(var(--bg-base) / 0.72)">
    <div class="wrap max-w-5xl flex items-center justify-between py-3">
      <NuxtLink :to="localePath('/')" class="no-underline text-ink-high">
        <AppLogo />
      </NuxtLink>
      <div class="flex items-center gap-2">
        <ClientOnly>
          <button
            v-if="user"
            type="button"
            class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors"
            :title="user.email ?? ''"
            @click="logout"
          >{{ t('login.signOut') }}</button>
          <NuxtLink
            v-else
            :to="localePath('/login')"
            class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-accent no-underline transition-colors"
          >{{ t('login.signIn') }}</NuxtLink>
        </ClientOnly>
        <LangSwitcher />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
