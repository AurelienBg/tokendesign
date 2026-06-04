<script setup lang="ts">
/**
 * Renders an upstream go/no-go gate (blockchain? / token?) as a VISUAL decision
 * tree: a vertical spine of decision nodes, each branching off to a leaf
 * (verdict); the spine ends in a terminal split (two leaves). Bilingual.
 * Self-contained so it can be lifted into Grounds later.
 */
import { isSplit, type Gate, type GateLeaf, type GateTone } from '~/utils/content/gates'

const props = defineProps<{ gate: Gate }>()

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const finalSplit = computed(() => (isSplit(props.gate.final) ? props.gate.final : null))
const finalLeaf = computed<GateLeaf | null>(() => (isSplit(props.gate.final) ? null : props.gate.final))
const finalBranches = computed(() => {
  const f = finalSplit.value
  return f ? [{ when: f.yesWhen, leaf: f.yes }, { when: f.noWhen, leaf: f.no }] : []
})

const LEAF: Record<GateTone, string> = {
  no: 'border-border-accent text-ink-mid bg-bg-elevated',
  warn: 'border-warn/45 text-warn bg-warn/5',
  private: 'border-info/40 text-info bg-info/5',
  yes: 'border-accent/50 text-accent bg-accent/5'
}
</script>

<template>
  <article class="card p-5 sm:p-6">
    <header class="mb-6">
      <p class="kicker mb-2">{{ gate.kicker[loc] }}</p>
      <h3 class="font-display text-2xl font-semibold leading-tight mb-2">{{ gate.title[loc] }}</h3>
      <p class="text-ink-mid text-[14px] leading-relaxed max-w-2xl">{{ gate.lead[loc] }}</p>
    </header>

    <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-4">{{ gate.flowLabel[loc] }}</p>

    <!-- TREE: spine of decision nodes, each branching to a leaf -->
    <div class="relative pl-6">
      <!-- spine line -->
      <span aria-hidden="true" class="absolute left-[6px] top-2 bottom-6 w-px bg-border-accent" />

      <div class="flex flex-col gap-5">
        <div v-for="(s, i) in gate.steps" :key="i" class="relative">
          <!-- node dot -->
          <span aria-hidden="true" class="absolute -left-6 top-2.5 h-3 w-3 rounded-full border-2 border-accent bg-bg-card" />
          <div class="flex items-stretch gap-2.5 flex-wrap sm:flex-nowrap">
            <!-- decision node -->
            <div class="flex-1 min-w-[180px] rounded-lg border border-border-accent bg-bg-card px-3.5 py-2.5">
              <span class="font-mono text-[10px] text-ink-low mr-1.5">{{ i + 1 }}</span>
              <span class="text-[13.5px] text-ink-high">{{ s.q[loc] }}</span>
            </div>
            <!-- branch → leaf -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="font-mono text-[10px] text-ink-low whitespace-nowrap">{{ s.exitWhen[loc] }}</span>
              <span aria-hidden="true" class="text-ink-low">→</span>
              <div class="rounded-lg border px-3 py-1.5 max-w-[230px]" :class="LEAF[s.leaf.tone]">
                <p class="text-[12.5px] font-medium leading-tight">{{ s.leaf.label[loc] }}</p>
                <p v-if="s.leaf.note" class="text-[11px] text-ink-mid mt-0.5 leading-snug">{{ s.leaf.note[loc] }}</p>
              </div>
            </div>
          </div>
          <!-- "otherwise ↓" connector -->
          <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low mt-1.5 ml-0.5" aria-hidden="true">{{ gate.elseLabel[loc] }} ↓</p>
        </div>

        <!-- terminal node -->
        <div class="relative">
          <span aria-hidden="true" class="absolute -left-6 top-2.5 h-3 w-3 rounded-full border-2 border-accent bg-accent" />
          <template v-if="finalSplit">
            <div class="rounded-lg border border-border-accent bg-bg-card px-3.5 py-2.5 mb-2.5">
              <span class="text-[13.5px] text-ink-high">{{ finalSplit.q[loc] }}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-2.5">
              <div v-for="branch in finalBranches" :key="branch.when[loc]" class="flex items-start gap-2">
                <span class="font-mono text-[10px] text-ink-low mt-2 shrink-0">{{ branch.when[loc] }} →</span>
                <div class="flex-1 rounded-lg border px-3 py-2" :class="LEAF[branch.leaf.tone]">
                  <p class="text-[13px] font-semibold leading-tight">✓ {{ branch.leaf.label[loc] }}</p>
                  <p v-if="branch.leaf.note" class="text-[11.5px] text-ink-mid mt-0.5 leading-snug">{{ branch.leaf.note[loc] }}</p>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="finalLeaf" class="rounded-lg border px-4 py-3" :class="LEAF[finalLeaf.tone]">
            <p class="font-display text-[16px] font-semibold">✓ {{ finalLeaf.label[loc] }}</p>
            <p v-if="finalLeaf.note" class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ finalLeaf.note[loc] }}</p>
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
