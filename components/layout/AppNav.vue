<script setup lang="ts">
/**
 * Global nav (burger) — direct access to every page + the 6-stage lifecycle
 * progression (Conception highlighted = where Token Design helps). Order is
 * provisional; to be reorganised later.
 */
const open = ref(false)
const localePath = useLocalePath()
const route = useRoute()
const { t, tm, rt } = useI18n()

interface NavLink { to: string; label: string; external?: boolean }
const links = computed<NavLink[]>(() => [
  { to: '/', label: t('hub.navHome') },
  { to: '/overview', label: t('hub.navOverview') },
  { to: '/create', label: t('angles.create.title') },
  { to: '/build', label: t('angles.build.title') },
  { to: '/configurator', label: t('configurator.kicker') },
  { to: '/learn/frame', label: t('hub.guideFrame') },
  { to: '/learn/build', label: t('hub.guideBuild') },
  { to: '/dossiers', label: t('cloud.myDossiers') },
  { to: '/resources', label: t('hub.navResources') },
  { to: 'https://aurelienbg.github.io/assetcustody/', label: t('hub.navCustody'), external: true }
])

const stages = computed(() => (tm('create.stageNames') as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0])))

function isActive(to: string): boolean {
  const target = localePath(to)
  return to === '/' ? route.path === target : route.path.startsWith(target)
}

const rootEl = ref<HTMLElement | null>(null)
function onDocClick(e: MouseEvent) {
  if (open.value && !rootEl.value?.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
// Close on navigation.
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <div ref="rootEl" class="relative">
    <button
      type="button"
      class="grid h-8 w-8 place-items-center rounded-md border border-border-subtle text-ink-mid hover:text-accent hover:border-accent transition-colors"
      :aria-label="t('hub.navMenu')"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="text-base leading-none" aria-hidden="true">☰</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border-subtle bg-bg-card shadow-lg z-50 overflow-hidden"
    >
      <nav class="p-2">
        <template v-for="l in links" :key="l.to">
          <a
            v-if="l.external"
            :href="l.to"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-lg px-3 py-2 text-[14px] no-underline transition-colors text-ink-mid hover:bg-bg-elevated hover:text-ink-high"
          >{{ l.label }}</a>
          <NuxtLink
            v-else
            :to="localePath(l.to)"
            class="block rounded-lg px-3 py-2 text-[14px] no-underline transition-colors"
            :class="isActive(l.to) ? 'bg-accent/10 text-accent font-medium' : 'text-ink-mid hover:bg-bg-elevated hover:text-ink-high'"
          >{{ l.label }}</NuxtLink>
        </template>
      </nav>

      <div class="border-t border-border-subtle p-3">
        <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low mb-2">{{ t('hub.navLifecycle') }}</p>
        <ol class="flex flex-col gap-1">
          <li v-for="(s, i) in stages" :key="i" class="flex items-center gap-2 text-[13px]">
            <span
              class="grid h-4 w-4 shrink-0 place-items-center rounded-full border font-mono text-[9px]"
              :class="i === 0 ? 'border-accent text-accent' : 'border-border-accent text-ink-low'"
            >{{ i + 1 }}</span>
            <span :class="i === 0 ? 'text-accent font-medium' : 'text-ink-mid'">{{ s }}</span>
            <span v-if="i === 0" class="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-low">· {{ t('hub.navHere') }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
