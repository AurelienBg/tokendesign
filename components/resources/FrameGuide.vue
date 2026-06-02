<script setup lang="ts">
/**
 * Frame-path guide (Regul8 learn-guide style): branching flow + numbered
 * sections + callouts + class infographic + CTA. Fully i18n (guideFrame.*);
 * class/red-flag substance from the bilingual content modules.
 */
import type { TokenClass } from '~/utils/engine'
import { CLASSES } from '~/utils/content/classes'
import { REDFLAGS } from '~/utils/content/redflags'

const { t, tm, rt } = useI18n()
const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

function arr(key: string): string[] {
  return (tm(key) as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
}
const toc = computed(() => arr('guideFrame.tocItems'))
const flowQ = computed(() => arr('guideFrame.flowQ'))
const flowYes = computed(() => arr('guideFrame.flowYes'))
const pegs = computed(() => arr('guideFrame.pegs'))
const offNotes = computed(() => arr('guideFrame.offNotes'))
const rules = computed(() => arr('guideFrame.rules'))
const stages = computed(() => arr('create.stageNames'))

const flowTones = ['text-danger border-danger/40', 'text-info border-info/40', 'text-accent border-accent/40', 'text-accent border-accent/40']
const micaTrio: { cls: TokenClass; ex: string }[] = [
  { cls: 'emt', ex: 'USDC, EURC' },
  { cls: 'art', ex: 'basket stablecoins' },
  { cls: 'utility', ex: 'UNI, utility/governance' }
]
const offMica: TokenClass[] = ['instrument', 'nft']
const redFlagKeys = ['security', 'algo', 'limbo', 'nftserie', 'retail', 'custody', 'juridiction', 'incoherence'] as const
</script>

<template>
  <article>
    <header class="mb-8 max-w-2xl">
      <p class="kicker mb-3">{{ t('hub.guideFrame') }}</p>
      <h2 class="font-display text-3xl font-semibold leading-tight mb-3">{{ t('guideFrame.title') }}</h2>
      <p class="text-ink-mid leading-relaxed">{{ t('guideFrame.lead') }}</p>
    </header>

    <!-- Decision flow (branching) -->
    <section class="mb-12">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-3">{{ t('guideFrame.flowLabel') }}</p>
      <div class="flex flex-col gap-2">
        <template v-for="(q, i) in flowQ" :key="i">
          <div class="card p-3.5 flex flex-wrap items-center gap-3">
            <span class="font-mono text-[11px] text-ink-low shrink-0">{{ i + 1 }}</span>
            <span class="flex-1 min-w-[180px] text-[14px] text-ink-high">{{ q }}</span>
            <span class="font-mono text-[11px] text-ok shrink-0" aria-hidden="true">→</span>
            <span class="rounded-full border px-2.5 py-1 text-[12px] font-medium shrink-0" :class="flowTones[i]">{{ flowYes[i] }}</span>
          </div>
          <div class="text-center font-mono text-[10px] text-ink-low" aria-hidden="true">↓</div>
        </template>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[11px] text-ink-low shrink-0">→</span>
          <span class="rounded-full border border-ok/40 text-ok px-2.5 py-1 text-[12px] font-medium">{{ t('guideFrame.flowFallback') }}</span>
        </div>
      </div>
    </section>

    <!-- TOC -->
    <nav class="card p-4 mb-10">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('guideFrame.toc') }}</p>
      <ul class="grid sm:grid-cols-2 gap-1 text-[14px] text-ink-mid">
        <li v-for="(s, i) in toc" :key="i">{{ s }}</li>
      </ul>
    </nav>

    <!-- 1 · Principle -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">1</span>{{ t('guideFrame.s1') }}</h3>
      <div class="card border-l-2 border-l-info p-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-[14px] text-ink-high"><span class="mr-1.5" aria-hidden="true">💡</span><span v-html="t('guideFrame.s1body')" /></p>
      </div>
    </section>

    <!-- 2 · Classes -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">2</span>{{ t('guideFrame.s2') }}</h3>
      <div class="grid sm:grid-cols-3 gap-3 mb-4">
        <div v-for="(c, i) in micaTrio" :key="c.cls" class="card p-4">
          <p class="font-display text-lg font-semibold text-accent">{{ CLASSES[loc][c.cls].name }}</p>
          <p class="text-[13px] text-ink-mid mt-1">{{ pegs[i] }}</p>
          <p class="font-mono text-[11px] text-ink-low mt-2">{{ c.ex }}</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-3 mb-5">
        <div v-for="(cls, i) in offMica" :key="cls" class="rounded-lg border border-border-subtle p-3">
          <p class="font-medium text-ink-high text-[14px]">{{ CLASSES[loc][cls].name }}</p>
          <p class="text-[13px] text-ink-mid mt-0.5">{{ offNotes[i] }}</p>
        </div>
      </div>
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('guideFrame.rulesLabel') }}</p>
      <ol class="flex flex-col gap-1.5">
        <li v-for="(r, i) in rules" :key="i" class="flex gap-3 text-[14px] text-ink-mid">
          <span class="font-mono text-[11px] text-ink-low mt-0.5">{{ i + 1 }}</span><span>{{ r }}</span>
        </li>
      </ol>
    </section>

    <!-- 3 · Red flags -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">3</span>{{ t('guideFrame.s3') }}</h3>
      <p class="text-ink-mid text-sm mb-4 max-w-2xl">{{ t('guideFrame.s3lead') }}</p>
      <div class="flex flex-col gap-2.5">
        <div v-for="k in redFlagKeys" :key="k" class="card border-l-2 border-l-warn p-3.5">
          <p class="font-medium text-[14px] text-ink-high"><span class="text-warn mr-1.5" aria-hidden="true">⚠️</span>{{ REDFLAGS[loc][k].title }}</p>
          <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ REDFLAGS[loc][k].body }}</p>
        </div>
      </div>
    </section>

    <!-- 4 · Lifecycle -->
    <section class="mb-10">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">4</span>{{ t('guideFrame.s4') }}</h3>
      <div class="flex flex-wrap items-center gap-2 mb-2">
        <template v-for="(s, i) in stages" :key="i">
          <span class="rounded-md border border-border-subtle px-3 py-1.5 text-[13px] text-ink-high">{{ s }}</span>
          <span v-if="i < stages.length - 1" class="text-ink-low" aria-hidden="true">→</span>
        </template>
      </div>
      <p class="text-[12px] text-ink-low">{{ t('guideFrame.ratchets') }}</p>
    </section>

    <NuxtLink :to="localePath('/create')" class="btn-primary">🎯 {{ t('guideFrame.cta') }}</NuxtLink>
  </article>
</template>
