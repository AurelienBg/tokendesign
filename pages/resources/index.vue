<script setup lang="ts">
/**
 * /resources — INTERNAL design sandbox (not linked from the hub).
 *  1. Intake mockup in "configurator style" (label + pills) to evaluate the
 *     layout. Local-only state — never touches a real project.
 *  2. Static decision-tree diagram of the deterministic engine (spec §4).
 */
import { INTAKE, BLOCK_B1, BLOCK_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

const { t } = useI18n()
const localePath = useLocalePath()
useHead({ title: 'Resources (sandbox) — Token Design' })

// ---- Mockup local state (isolated from the real stores) ----
const ans = reactive<Record<string, string | string[]>>({ fonctions: [], droits: [] })
function selected(k: QuestionKey): string | string[] | null {
  return (ans[k] as string | string[] | undefined) ?? null
}
function toggle(k: QuestionKey, v: string) {
  if (INTAKE[k].type === 'multi') {
    const arr = (ans[k] ??= []) as string[]
    const i = arr.indexOf(v)
    if (i >= 0) arr.splice(i, 1)
    else arr.push(v)
  } else {
    ans[k] = ans[k] === v ? '' : v
  }
}

const b1 = BLOCK_B1
const b2 = BLOCK_B2

// ---- Static decision-tree content ----
const classRules = [
  { n: 1, cond: 'rights include “revenues” OR (claim + financial underlying)', cls: 'Instrument', reg: 'MiFID II', tone: 'text-danger' },
  { n: 2, cond: 'fungibility = non-fungible / semi', cls: 'NFT', reg: 'mostly outside MiCA', tone: 'text-info' },
  { n: 3, cond: 'stability target = single currency', cls: 'EMT', reg: 'MiCA Title IV', tone: 'text-accent' },
  { n: 4, cond: 'stability target = basket / crypto', cls: 'ART', reg: 'MiCA Title III', tone: 'text-accent' },
  { n: 5, cond: 'otherwise (fallback)', cls: 'Utility', reg: 'MiCA Title II', tone: 'text-ok' }
]
const redFlags = [
  ['limbo', 'stable target + diffuse/absent debtor'],
  ['security', 'utility/NFT + promised gain → reclassification risk'],
  ['algo', 'stable target + no reserve'],
  ['nftserie', 'NFT issued as series / investment-geared'],
  ['retail', 'heavy class + retail distribution (point of no return)'],
  ['custody', 'you hold users’ funds/keys'],
  ['juridiction', 'outside the EU → re-qualify'],
  ['incoherence', 'native + debtor/reserve (contradiction)']
] as const
const stages = ['Conception', 'Issuance', 'Distribution', 'Life', 'End']
</script>

<template>
  <main class="wrap max-w-5xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('create.backHub') }}
    </NuxtLink>

    <div class="card border-l-2 border-l-warn p-3.5 mt-4 mb-10">
      <p class="text-[13px] text-ink-mid"><span class="glyph text-warn mr-1.5" aria-hidden="true">⚑</span>Internal design sandbox — not linked from the hub. UI explorations &amp; engine map.</p>
    </div>

    <!-- ── 1. Intake mockup — configurator style ──────────────── -->
    <section class="mb-16">
      <p class="kicker mb-2">Mockup · configurator style</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Intake — label + pills, 2 columns</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">Local-only mockup to judge the layout. Selections here do nothing.</p>

      <div class="card p-6 mb-5">
        <p class="kicker mb-5">Identity</p>
        <div class="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <MockField v-for="k in b1" :key="k" :question-key="k" :selected="selected(k)" @toggle="(v) => toggle(k, v)" />
        </div>
      </div>
      <div class="card p-6">
        <p class="kicker mb-5">Launch</p>
        <div class="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <MockField v-for="k in b2" :key="k" :question-key="k" :selected="selected(k)" @toggle="(v) => toggle(k, v)" />
        </div>
      </div>
    </section>

    <!-- ── 2. Decision tree (static) ──────────────────────────── -->
    <section>
      <p class="kicker mb-2">Engine map · static</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Decision tree</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">How the deterministic engine turns answers into a dossier (spec §4). Not legal advice.</p>

      <div class="flex flex-col items-stretch gap-3">
        <!-- A.1 -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-1">A.1 · prudent defaults</p>
          <p class="text-[14px] text-ink-mid">Unanswered axes → conservative assumption, tagged “to confirm”.</p>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- A.2 classify -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-3">A.2 · classify — first match wins</p>
          <ol class="flex flex-col gap-2">
            <li v-for="r in classRules" :key="r.n" class="flex items-start gap-3 text-[14px]">
              <span class="font-mono text-[11px] text-ink-low mt-0.5">{{ r.n }}</span>
              <span class="text-ink-mid flex-1">{{ r.cond }}</span>
              <span class="font-mono text-ink-low">→</span>
              <span class="font-semibold w-24 shrink-0" :class="r.tone">{{ r.cls }}</span>
              <span class="text-[12px] text-ink-low w-40 shrink-0 hidden sm:block">{{ r.reg }}</span>
            </li>
          </ol>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- A.3 red flags -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-warn mb-3">A.3 · red flags — cumulative overlays</p>
          <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
            <div v-for="[key, trigger] in redFlags" :key="key" class="flex items-start gap-2 text-[13px]">
              <span class="text-warn" aria-hidden="true">⚑</span>
              <span><span class="font-mono text-[11px] text-ink-low">{{ key }}</span> — <span class="text-ink-mid">{{ trigger }}</span></span>
            </div>
          </div>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- D checklist -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ok mb-3">D · launch checklist — lifecycle, filtered by class + ratchets</p>
          <div class="flex flex-wrap items-center gap-2">
            <template v-for="(s, i) in stages" :key="s">
              <span class="rounded-md border border-border-subtle px-3 py-1.5 text-[13px] text-ink-high">{{ s }}</span>
              <span v-if="i < stages.length - 1" class="text-ink-low" aria-hidden="true">→</span>
            </template>
          </div>
          <p class="text-[12px] text-ink-low mt-3">Ratchets (points of no return): authorization-before-issuance · retail marketing · taking custody.</p>
        </div>
      </div>
    </section>
  </main>
</template>
