<script setup lang="ts">
import type { Angle } from '~/composables/useCloudProjects'

const props = defineProps<{ angle: Angle; state: object; suggestedName?: string }>()

const { user } = useAuth()
const { save } = useCloudProjects()
const { t } = useI18n()
const localePath = useLocalePath()

const name = ref(props.suggestedName ?? '')
const status = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const err = ref<string | null>(null)

watch(name, () => {
  if (status.value !== 'saving') status.value = 'idle'
})

async function doSave() {
  if (!name.value.trim()) {
    err.value = t('cloud.nameRequired')
    status.value = 'error'
    return
  }
  status.value = 'saving'
  err.value = null
  try {
    // Plain snapshot — strip reactivity before it hits the network.
    await save(props.angle, name.value.trim(), JSON.parse(JSON.stringify(props.state)))
    status.value = 'saved'
  } catch (e) {
    status.value = 'error'
    err.value = e instanceof Error ? e.message : t('cloud.error')
  }
}
</script>

<template>
  <div class="card p-4 print:hidden">
    <!-- Signed out: prompt to sign in -->
    <ClientOnly>
      <div v-if="!user" class="flex items-center justify-between gap-3 flex-wrap">
        <p class="text-[13px] text-ink-mid">{{ t('cloud.signInToSave') }}</p>
        <NuxtLink :to="localePath('/login')" class="btn-ghost text-sm px-3.5 py-2">{{ t('login.signIn') }}</NuxtLink>
      </div>

      <!-- Signed in: name + save -->
      <div v-else class="flex items-center gap-2 flex-wrap">
        <input
          v-model="name"
          type="text"
          maxlength="120"
          class="flex-1 min-w-[160px] rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-[14px] text-ink-high placeholder:text-ink-low focus:outline-none focus:border-accent transition-colors"
          :placeholder="t('cloud.namePlaceholder')"
        >
        <button class="btn-primary px-4 py-2 text-sm" :disabled="status === 'saving'" @click="doSave">
          {{ status === 'saving' ? t('cloud.saving') : status === 'saved' ? t('cloud.saved') : t('cloud.save') }}
        </button>
        <NuxtLink
          v-if="status === 'saved'"
          :to="localePath('/dossiers')"
          class="font-mono text-[11px] uppercase tracking-[0.12em] text-accent hover:underline"
        >{{ t('cloud.viewAll') }} →</NuxtLink>
      </div>
    </ClientOnly>
    <p v-if="err" class="mt-2 text-[13px] text-danger">{{ err }}</p>
  </div>
</template>
