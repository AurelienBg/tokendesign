<script setup lang="ts">
/**
 * Upstream go/no-go gate rendered as an INTERACTIVE visual decision tree:
 * a spine of yes/no nodes; clicking an answer lights the path and either jumps
 * to a leaf (verdict, with a concrete example) or continues down to a terminal
 * split. A result banner summarizes the reached leaf; reset clears it.
 * Also readable as a static map before any click. Bilingual, self-contained.
 */
import { isSplit, type Gate, type GateLeaf, type GateTone } from '~/utils/content/gates'

const props = defineProps<{ gate: Gate }>()

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const finalSplit = computed(() => (isSplit(props.gate.final) ? props.gate.final : null))
const finalLeaf = computed<GateLeaf | null>(() => (isSplit(props.gate.final) ? null : props.gate.final))

const LEAF: Record<GateTone, string> = {
  no: 'border-border-accent text-ink-mid bg-bg-elevated',
  warn: 'border-warn/45 text-warn bg-warn/5',
  private: 'border-info/40 text-info bg-info/5',
  yes: 'border-accent/50 text-accent bg-accent/5'
}

// ── interaction state ──
const answers = reactive<Record<number, 'exit' | 'else'>>({})
const finalAnswer = ref<'yes' | 'no' | null>(null)

const started = computed(() => Object.keys(answers).length > 0 || finalAnswer.value !== null)
/** A node is on the live path if every earlier node was answered "else". */
function reachable(i: number): boolean {
  for (let k = 0; k < i; k++) if (answers[k] !== 'else') return false
  return true
}
const exitIndex = computed(() => {
  for (let i = 0; i < props.gate.steps.length; i++) {
    if (answers[i] === 'exit') return i
    if (answers[i] !== 'else') return -1
  }
  return -1
})
const finalReached = computed(() => props.gate.steps.every((_, i) => answers[i] === 'else'))
const resultLeaf = computed<GateLeaf | null>(() => {
  const exited = props.gate.steps[exitIndex.value]
  if (exited) return exited.leaf
  if (finalReached.value) {
    if (finalSplit.value && finalAnswer.value) return finalAnswer.value === 'yes' ? finalSplit.value.yes : finalSplit.value.no
    if (finalLeaf.value) return finalLeaf.value
  }
  return null
})

function pick(i: number, v: 'exit' | 'else') {
  answers[i] = v
  for (const k of Object.keys(answers)) if (Number(k) > i) delete answers[Number(k)]
  if (v === 'exit') finalAnswer.value = null
}
function pickFinal(v: 'yes' | 'no') { finalAnswer.value = v }
function reset() {
  for (const k of Object.keys(answers)) delete answers[Number(k)]
  finalAnswer.value = null
}

const dim = (on: boolean) => (started.value && !on ? 'opacity-40' : '')
</script>

<template>
  <article class="card p-5 sm:p-6">
    <header class="mb-5">
      <p class="kicker mb-2">{{ gate.kicker[loc] }}</p>
      <h3 class="font-display text-2xl font-semibold leading-tight mb-2">{{ gate.title[loc] }}</h3>
      <p class="text-ink-mid text-[14px] leading-relaxed max-w-2xl">{{ gate.lead[loc] }}</p>
    </header>

    <!-- result banner -->
    <div v-if="resultLeaf" class="rounded-lg border-2 px-4 py-3 mb-5 flex items-start gap-3" :class="LEAF[resultLeaf.tone]">
      <span class="text-lg leading-none" aria-hidden="true">✓</span>
      <div class="flex-1 min-w-0">
        <p class="font-display text-[16px] font-semibold">{{ resultLeaf.label[loc] }}</p>
        <p v-if="resultLeaf.note" class="text-[13px] text-ink-mid mt-0.5 leading-snug">{{ resultLeaf.note[loc] }}</p>
        <p v-if="resultLeaf.example" class="text-[12px] text-ink-low mt-1 italic">{{ loc === 'fr' ? 'ex.' : 'e.g.' }} {{ resultLeaf.example[loc] }}</p>
      </div>
      <button type="button" class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low hover:text-danger shrink-0" @click="reset">{{ loc === 'fr' ? 'reset' : 'reset' }}</button>
    </div>

    <div class="flex items-center justify-between mb-4">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">{{ gate.flowLabel[loc] }}</p>
      <p class="font-mono text-[10px] text-ink-low">{{ loc === 'fr' ? 'clique tes réponses' : 'click your answers' }}</p>
    </div>

    <!-- TREE -->
    <div class="relative pl-6">
      <span aria-hidden="true" class="absolute left-[6px] top-2 bottom-6 w-px bg-border-accent" />

      <div class="flex flex-col gap-5">
        <div v-for="(s, i) in gate.steps" :key="i" class="relative transition-opacity" :class="dim(reachable(i))">
          <!-- node dot -->
          <span
            aria-hidden="true"
            class="absolute -left-6 top-2.5 h-3 w-3 rounded-full border-2"
            :class="answers[i] ? 'border-accent bg-accent' : 'border-accent bg-bg-card'"
          />
          <div class="flex items-stretch gap-2.5 flex-wrap sm:flex-nowrap">
            <!-- decision node + answer buttons -->
            <div class="flex-1 min-w-[200px] rounded-lg border border-border-accent bg-bg-card px-3.5 py-2.5">
              <p class="text-[13.5px] text-ink-high"><span class="font-mono text-[10px] text-ink-low mr-1.5">{{ i + 1 }}</span>{{ s.q[loc] }}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  type="button"
                  class="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  :class="answers[i] === 'exit' ? 'border-accent bg-accent text-accent-on' : 'border-border-subtle text-ink-mid hover:border-accent'"
                  @click="pick(i, 'exit')"
                >{{ s.exitWhen[loc] }}</button>
                <button
                  type="button"
                  class="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  :class="answers[i] === 'else' ? 'border-accent bg-accent text-accent-on' : 'border-border-subtle text-ink-mid hover:border-accent'"
                  @click="pick(i, 'else')"
                >{{ gate.elseLabel[loc] }} ↓</button>
              </div>
            </div>
            <!-- branch → leaf -->
            <div class="flex items-center gap-2 shrink-0 transition-opacity" :class="answers[i] && answers[i] !== 'exit' ? 'opacity-40' : ''">
              <span aria-hidden="true" class="text-ink-low">→</span>
              <div
                class="rounded-lg border px-3 py-1.5 max-w-[240px] transition-shadow"
                :class="[LEAF[s.leaf.tone], answers[i] === 'exit' ? 'ring-2 ring-accent' : '']"
              >
                <p class="text-[12.5px] font-medium leading-tight">{{ s.leaf.label[loc] }}</p>
                <p v-if="s.leaf.note" class="text-[11px] text-ink-mid mt-0.5 leading-snug">{{ s.leaf.note[loc] }}</p>
                <p v-if="s.leaf.example" class="text-[10.5px] text-ink-low mt-1 italic">{{ loc === 'fr' ? 'ex.' : 'e.g.' }} {{ s.leaf.example[loc] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- terminal node -->
        <div class="relative transition-opacity" :class="dim(finalReached || !started)">
          <span aria-hidden="true" class="absolute -left-6 top-2.5 h-3 w-3 rounded-full border-2 border-accent" :class="finalAnswer ? 'bg-accent' : 'bg-bg-card'" />
          <template v-if="finalSplit">
            <div class="rounded-lg border border-border-accent bg-bg-card px-3.5 py-2.5 mb-2.5">
              <span class="text-[13.5px] text-ink-high">{{ finalSplit.q[loc] }}</span>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <button
                  type="button"
                  class="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  :class="finalAnswer === 'yes' ? 'border-accent bg-accent text-accent-on' : 'border-border-subtle text-ink-mid hover:border-accent'"
                  @click="pickFinal('yes')"
                >{{ finalSplit.yesWhen[loc] }}</button>
                <button
                  type="button"
                  class="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  :class="finalAnswer === 'no' ? 'border-accent bg-accent text-accent-on' : 'border-border-subtle text-ink-mid hover:border-accent'"
                  @click="pickFinal('no')"
                >{{ finalSplit.noWhen[loc] }}</button>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <div
                class="rounded-lg border px-3 py-2 transition-shadow"
                :class="[LEAF[finalSplit.yes.tone], finalAnswer === 'yes' ? 'ring-2 ring-accent' : finalAnswer === 'no' ? 'opacity-40' : '']"
              >
                <p class="text-[13px] font-semibold leading-tight">✓ {{ finalSplit.yes.label[loc] }}</p>
                <p v-if="finalSplit.yes.note" class="text-[11.5px] text-ink-mid mt-0.5 leading-snug">{{ finalSplit.yes.note[loc] }}</p>
                <p v-if="finalSplit.yes.example" class="text-[10.5px] text-ink-low mt-1 italic">{{ loc === 'fr' ? 'ex.' : 'e.g.' }} {{ finalSplit.yes.example[loc] }}</p>
              </div>
              <div
                class="rounded-lg border px-3 py-2 transition-shadow"
                :class="[LEAF[finalSplit.no.tone], finalAnswer === 'no' ? 'ring-2 ring-accent' : finalAnswer === 'yes' ? 'opacity-40' : '']"
              >
                <p class="text-[13px] font-semibold leading-tight">✓ {{ finalSplit.no.label[loc] }}</p>
                <p v-if="finalSplit.no.note" class="text-[11.5px] text-ink-mid mt-0.5 leading-snug">{{ finalSplit.no.note[loc] }}</p>
                <p v-if="finalSplit.no.example" class="text-[10.5px] text-ink-low mt-1 italic">{{ loc === 'fr' ? 'ex.' : 'e.g.' }} {{ finalSplit.no.example[loc] }}</p>
              </div>
            </div>
          </template>
          <div v-else-if="finalLeaf" class="rounded-lg border px-4 py-3" :class="[LEAF[finalLeaf.tone], finalReached ? 'ring-2 ring-accent' : '']">
            <p class="font-display text-[16px] font-semibold">✓ {{ finalLeaf.label[loc] }}</p>
            <p v-if="finalLeaf.note" class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ finalLeaf.note[loc] }}</p>
            <p v-if="finalLeaf.example" class="text-[11.5px] text-ink-low mt-1 italic">{{ loc === 'fr' ? 'ex.' : 'e.g.' }} {{ finalLeaf.example[loc] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- callouts -->
    <div class="flex flex-col gap-2.5 mt-6">
      <div
        v-for="(c, i) in gate.callouts" :key="i"
        class="rounded-lg border-l-2 p-3.5"
        :class="c.tone === 'warn' ? 'border-l-warn bg-warn/5' : 'border-l-info bg-info/5'"
      >
        <p class="text-[13px] text-ink-mid leading-relaxed">
          <span class="mr-1.5" aria-hidden="true">{{ c.tone === 'warn' ? '⚠️' : '💡' }}</span>{{ c.text[loc] }}
        </p>
      </div>
    </div>

    <!-- sources & resources -->
    <div v-if="gate.resources?.length || gate.sources" class="mt-5 pt-4 border-t border-border-subtle">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ loc === 'fr' ? 'Sources & pour aller plus loin' : 'Sources & go deeper' }}</p>
      <p v-if="gate.sources" class="text-[12px] text-ink-low mb-2.5 leading-snug">{{ gate.sources[loc] }}</p>
      <div v-if="gate.resources?.length" class="flex flex-wrap gap-2">
        <a
          v-for="r in gate.resources" :key="r.href[loc]"
          :href="r.href[loc]" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 font-mono text-[11px] text-ink-mid hover:border-accent hover:text-accent no-underline transition-colors"
        >{{ r.label[loc] }} ↗</a>
      </div>
    </div>

    <NuxtLink v-if="gate.ctaTo && gate.ctaLabel" :to="localePath(gate.ctaTo)" class="btn-primary mt-5">{{ gate.ctaLabel[loc] }}</NuxtLink>
  </article>
</template>
