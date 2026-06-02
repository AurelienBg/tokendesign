<script setup lang="ts">
/**
 * Suite hand-off — Token Design is the high-level framing/triage step. The
 * dossier ends by pointing to the deeper apps of the suite, ordered/flagged by
 * relevance to the retained class. External links, new tab.
 */
import type { TokenClass } from '~/utils/engine'

const props = defineProps<{ cls?: TokenClass }>()
const { t } = useI18n()

interface SuiteApp {
  key: string
  href: string
  glyph: string
}
const APPS: SuiteApp[] = [
  { key: 'canvas', href: 'https://groundscoach.vercel.app', glyph: '◳' },
  { key: 'tokenomics', href: 'https://tokenlabapp.vercel.app', glyph: '◈' },
  { key: 'regulation', href: 'https://regul8app.vercel.app', glyph: '⚖' },
  { key: 'pitch', href: 'https://pitchcraftapp.vercel.app', glyph: '✦' },
  { key: 'gamification', href: 'https://gameframeapp.vercel.app', glyph: '◇' }
]

const heavy = computed(() => props.cls === 'emt' || props.cls === 'art' || props.cls === 'instrument')

function recommended(key: string): boolean {
  if (key === 'tokenomics') return true // every token has tokenomics
  if (key === 'regulation') return heavy.value // regulated classes → dig into rules
  return false
}

// Recommended apps first, original order otherwise.
const ordered = computed(() =>
  [...APPS].sort((a, b) => Number(recommended(b.key)) - Number(recommended(a.key)))
)
</script>

<template>
  <section class="border-t border-border-subtle pt-6 mt-8 print:hidden">
    <p class="kicker mb-2">{{ t('create.deeper.kicker') }}</p>
    <h3 class="font-display text-xl font-semibold mb-1">{{ t('create.deeper.title') }}</h3>
    <p class="text-ink-mid text-sm mb-5 max-w-2xl">{{ t('create.deeper.intro') }}</p>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="a in ordered"
        :key="a.key"
        :href="a.href"
        target="_blank"
        rel="noopener"
        class="card-hover block p-4 no-underline text-ink-high hover:-translate-y-0.5"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="glyph text-xl text-accent" aria-hidden="true">{{ a.glyph }}</span>
          <span
            v-if="recommended(a.key)"
            class="font-mono text-[9px] uppercase tracking-[0.14em] text-accent border border-accent/40 rounded-full px-1.5 py-0.5"
          >{{ t('create.deeper.recommended') }}</span>
        </div>
        <h4 class="font-medium mt-2">{{ t(`create.deeper.${a.key}`) }}</h4>
        <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ t(`create.deeper.${a.key}Desc`) }}</p>
        <span class="inline-block mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{{ t('create.deeper.open') }} ↗</span>
      </a>
    </div>

    <p class="text-[12px] text-ink-low mt-4">{{ t('create.deeper.note') }}</p>
  </section>
</template>
