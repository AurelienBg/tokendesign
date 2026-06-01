<script setup lang="ts">
import type { CloudProject } from '~/composables/useCloudProjects'
import { useProjectStore, useAnalyzeStore } from '~/stores/project'
import { useAuthorityStore } from '~/stores/authority'

definePageMeta({ middleware: 'auth' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { list, remove } = useCloudProjects()

const projectStore = useProjectStore()
const analyzeStore = useAnalyzeStore()
const authorityStore = useAuthorityStore()

useHead({ title: () => `${t('cloud.myDossiers')} — Token Design` })

const items = ref<CloudProject[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function refresh() {
  loading.value = true
  error.value = null
  try {
    items.value = await list()
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('cloud.error')
  } finally {
    loading.value = false
  }
}
onMounted(refresh)

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(locale.value)
}

function open(p: CloudProject) {
  const state = { ...p.state } as never
  if (p.angle === 'create') {
    projectStore.$patch(state)
    navigateTo(localePath('/create'))
  } else if (p.angle === 'analyze') {
    analyzeStore.$patch(state)
    navigateTo(localePath('/analyze'))
  } else {
    authorityStore.$patch(state)
    navigateTo(localePath('/build'))
  }
}

async function del(p: CloudProject) {
  if (typeof window !== 'undefined' && !window.confirm(t('cloud.deleteConfirm'))) return
  await remove(p.id)
  await refresh()
}
</script>

<template>
  <main class="wrap max-w-3xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">{{ t('create.backHub') }}</NuxtLink>
    <h1 class="font-display text-2xl sm:text-3xl font-semibold mt-4 mb-8">{{ t('cloud.myDossiers') }}</h1>

    <p v-if="loading" class="text-ink-mid">{{ t('cloud.loading') }}</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <p v-else-if="!items.length" class="text-ink-mid">{{ t('cloud.empty') }}</p>

    <ul v-else class="flex flex-col gap-3">
      <li v-for="p in items" :key="p.id" class="card p-4 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-accent border border-accent/40 rounded-full px-1.5 py-0.5">{{ t(`angles.${p.angle}.title`) }}</span>
            <span class="font-medium text-ink-high truncate">{{ p.name }}</span>
          </div>
          <p class="text-[12px] text-ink-low mt-1">{{ fmtDate(p.updated_at) }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button class="btn-ghost text-sm px-3 py-1.5" @click="open(p)">{{ t('cloud.open') }}</button>
          <button class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors" @click="del(p)">{{ t('cloud.delete') }}</button>
        </div>
      </li>
    </ul>
  </main>
</template>
