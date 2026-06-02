<script setup lang="ts">
import type { ReferenceCase } from '~/utils/content/refcases'
import { AXIS_SHORT, AXIS_VALUE } from '~/utils/content/axislabels'
import { LABS } from '~/utils/content/dossier'

const props = defineProps<{ case: ReferenceCase }>()
const { locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const axes = ['fongibilite', 'rapport', 'couverture', 'debiteur', 'garant', 'transfer'] as const

const flags = computed(() => [
  ...props.case.v.fonctions.map((f) => LABS[loc.value].fonctions[f] ?? f),
  ...props.case.v.droits.map((d) => LABS[loc.value].droits[d] ?? d)
])
</script>

<template>
  <div class="card p-4 transition hover:border-accent/50 hover:-translate-y-0.5">
    <h4 class="font-display text-lg font-semibold mb-3">{{ props.case.name[loc] }}</h4>
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px] mb-3">
      <template v-for="axis in axes" :key="axis">
        <dt class="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low self-center">{{ AXIS_SHORT[loc][axis] }}</dt>
        <dd
          class="text-ink-high"
          :class="axis === 'rapport' ? 'text-accent font-medium' : props.case.v[axis] === 'na' ? 'text-ink-low' : ''"
        >{{ AXIS_VALUE[loc][axis]?.[props.case.v[axis]] ?? props.case.v[axis] }}</dd>
      </template>
    </dl>
    <div class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="(f, i) in flags"
        :key="i"
        class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid border border-border-subtle rounded px-1.5 py-0.5"
      >{{ f }}</span>
      <span v-if="!flags.length" class="text-ink-low text-[13px]">—</span>
    </div>
    <p class="text-[13px] text-ink-mid leading-relaxed border-t border-border-subtle pt-3">{{ props.case.note[loc] }}</p>
  </div>
</template>
