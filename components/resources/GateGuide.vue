<script setup lang="ts">
/**
 * Renders an upstream go/no-go gate (blockchain? / token?) as a branching
 * decision flow + callouts + final verdict. Bilingual via the Gate content.
 * Self-contained so it can be lifted into Grounds later.
 */
import type { Gate, GateTone } from '~/utils/content/gates'

defineProps<{ gate: Gate }>()

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const TONE: Record<GateTone, string> = {
  no: 'border-border-accent text-ink-mid bg-bg-elevated',
  maybe: 'border-warn/40 text-warn bg-warn/5',
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

    <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-3">{{ gate.flowLabel[loc] }}</p>
    <div class="flex flex-col gap-2">
      <template v-for="(s, i) in gate.steps" :key="i">
        <!-- question → early exit -->
        <div class="rounded-lg border border-border-subtle p-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="font-mono text-[11px] text-ink-low shrink-0">{{ i + 1 }}</span>
          <span class="flex-1 min-w-[180px] text-[14px] text-ink-high">{{ s.q[loc] }}</span>
          <span class="font-mono text-[11px] shrink-0 text-ink-low">{{ s.exitWhen[loc] }}</span>
          <span class="font-mono text-[11px] shrink-0" aria-hidden="true">→</span>
          <span class="rounded-full border px-2.5 py-1 text-[12px] font-medium" :class="TONE[s.tone]">{{ s.exitLabel[loc] }}</span>
        </div>
        <!-- "otherwise ↓" connector -->
        <div class="flex items-center gap-2 pl-1 text-ink-low" aria-hidden="true">
          <span class="font-mono text-[10px] uppercase tracking-[0.12em]">{{ gate.elseLabel[loc] }}</span>
          <span class="font-mono text-[10px]">↓</span>
        </div>
      </template>

      <!-- final positive verdict -->
      <div class="rounded-lg border px-4 py-3" :class="TONE.yes">
        <p class="font-display text-[16px] font-semibold">✓ {{ gate.finalLabel[loc] }}</p>
        <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ gate.finalNote[loc] }}</p>
      </div>
    </div>

    <!-- callouts -->
    <div class="flex flex-col gap-2.5 mt-5">
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

    <NuxtLink v-if="gate.ctaTo && gate.ctaLabel" :to="localePath(gate.ctaTo)" class="btn-primary mt-5">{{ gate.ctaLabel[loc] }}</NuxtLink>
  </article>
</template>
