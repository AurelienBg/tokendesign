<script setup lang="ts">
/**
 * Frame-path guide (Regul8 learn-guide style): numbered sections, callouts,
 * a 3-column class infographic, and a "next step" CTA. Substance pulled from
 * the bilingual content; connective prose is EN for now (sandbox eval).
 */
import type { TokenClass } from '~/utils/engine'
import { CLASSES } from '~/utils/content/classes'
import { REDFLAGS } from '~/utils/content/redflags'

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const toc = [
  '1 · The principle',
  '2 · The regulatory classes',
  '3 · Red flags',
  '4 · Launch lifecycle'
]

// MiCA trio for the infographic.
const micaTrio: { cls: TokenClass; peg: string; ex: string }[] = [
  { cls: 'emt', peg: 'Single-currency peg', ex: 'USDC, EURC' },
  { cls: 'art', peg: 'Basket / asset peg', ex: 'basket stablecoins' },
  { cls: 'utility', peg: 'No stabilization', ex: 'UNI, utility/governance' }
]
const offMica: { cls: TokenClass; note: string }[] = [
  { cls: 'instrument', note: 'Pays revenue / equity-like → MiFID II (prospectus, market approvals).' },
  { cls: 'nft', note: 'Genuinely unique → mostly outside MiCA (until series / fractionalization).' }
]

const rules = [
  'rights include “revenues”  OR  claim on a financial underlying  →  Instrument',
  'non-fungible / semi-fungible  →  NFT',
  'pegged to one official currency  →  EMT',
  'pegged to a basket / crypto  →  ART',
  'otherwise  →  Utility / other crypto-asset'
]

const redFlagKeys = ['security', 'algo', 'limbo', 'nftserie', 'retail', 'custody', 'juridiction', 'incoherence'] as const
const stages = ['Conception', 'Issuance', 'Distribution', 'Life', 'End']
</script>

<template>
  <article>
    <header class="mb-8 max-w-2xl">
      <p class="kicker mb-3">Guide · Frame a token</p>
      <h2 class="font-display text-3xl font-semibold leading-tight mb-3">From answers to a regulatory class</h2>
      <p class="text-ink-mid leading-relaxed">How the deterministic engine turns a few plain-language answers into a likely EU class, watch points and a launch checklist. Substance over form — never the technical standard. Not legal advice.</p>
    </header>

    <!-- TOC -->
    <nav class="card p-4 mb-10">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">In this guide</p>
      <ul class="grid sm:grid-cols-2 gap-1 text-[14px] text-ink-mid">
        <li v-for="s in toc" :key="s">{{ s }}</li>
      </ul>
    </nav>

    <!-- 1 · Principle -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">1</span>The principle</h3>
      <div class="card border-l-2 border-l-info p-4">
        <p class="text-[14px] text-ink-high"><span class="mr-1.5" aria-hidden="true">💡</span>We read the token's <b>substance</b> — fungibility, what it represents, who owes/attests, transferability, functions, rights — not its MPT/IOU/NFT form. Unanswered axes take the <b>prudent</b> assumption, tagged “to confirm”.</p>
      </div>
    </section>

    <!-- 2 · Classes -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">2</span>The regulatory classes</h3>

      <!-- MiCA trio infographic -->
      <div class="grid sm:grid-cols-3 gap-3 mb-4">
        <div v-for="c in micaTrio" :key="c.cls" class="card p-4">
          <p class="font-display text-lg font-semibold text-accent">{{ CLASSES[loc][c.cls].name }}</p>
          <p class="text-[13px] text-ink-mid mt-1">{{ c.peg }}</p>
          <p class="font-mono text-[11px] text-ink-low mt-2">{{ c.ex }}</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-3 mb-5">
        <div v-for="c in offMica" :key="c.cls" class="rounded-lg border border-border-subtle p-3">
          <p class="font-medium text-ink-high text-[14px]">{{ CLASSES[loc][c.cls].name }}</p>
          <p class="text-[13px] text-ink-mid mt-0.5">{{ c.note }}</p>
        </div>
      </div>

      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">Ordered rules — first match wins</p>
      <ol class="flex flex-col gap-1.5">
        <li v-for="(r, i) in rules" :key="i" class="flex gap-3 text-[14px] text-ink-mid">
          <span class="font-mono text-[11px] text-ink-low mt-0.5">{{ i + 1 }}</span><span>{{ r }}</span>
        </li>
      </ol>
    </section>

    <!-- 3 · Red flags -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">3</span>Red flags</h3>
      <p class="text-ink-mid text-sm mb-4 max-w-2xl">Cumulative overlays that don't change the class but flag a boundary or a risk.</p>
      <div class="flex flex-col gap-2.5">
        <div v-for="k in redFlagKeys" :key="k" class="card border-l-2 border-l-warn p-3.5">
          <p class="font-medium text-[14px] text-ink-high"><span class="text-warn mr-1.5" aria-hidden="true">⚠️</span>{{ REDFLAGS[loc][k].title }}</p>
          <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ REDFLAGS[loc][k].body }}</p>
        </div>
      </div>
    </section>

    <!-- 4 · Lifecycle -->
    <section class="mb-10">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">4</span>Launch lifecycle</h3>
      <div class="flex flex-wrap items-center gap-2 mb-2">
        <template v-for="(s, i) in stages" :key="s">
          <span class="rounded-md border border-border-subtle px-3 py-1.5 text-[13px] text-ink-high">{{ s }}</span>
          <span v-if="i < stages.length - 1" class="text-ink-low" aria-hidden="true">→</span>
        </template>
      </div>
      <p class="text-[12px] text-ink-low">Ratchets (points of no return): authorization-before-issuance · retail marketing · taking custody.</p>
    </section>

    <!-- Next step -->
    <NuxtLink :to="localePath('/create')" class="btn-primary">🎯 Frame your token →</NuxtLink>
  </article>
</template>
