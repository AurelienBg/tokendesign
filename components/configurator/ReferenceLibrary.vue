<script setup lang="ts">
import { REFCASES } from '~/utils/content/refcases'
import { AXIS_SHORT, AXIS_VALUE, AXIS_ORDER, FONCTIONS_ORDER, DROITS_ORDER } from '~/utils/content/axislabels'
import { LABS } from '~/utils/content/dossier'

const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const facetAxes = ['rapport', 'debiteur', 'garant', 'transfer', 'fongibilite'] as const
type FacetAxis = (typeof facetAxes)[number]

const filters = reactive<Record<FacetAxis, string | null>>({
  rapport: null, debiteur: null, garant: null, transfer: null, fongibilite: null
})
const query = ref('')
const view = ref<'cards' | 'matrix'>('cards')

function toggle(axis: FacetAxis, v: string) {
  filters[axis] = filters[axis] === v ? null : v
}
function resetFilters() {
  facetAxes.forEach((a) => (filters[a] = null))
  query.value = ''
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return REFCASES.filter((c) => {
    for (const a of facetAxes) {
      if (filters[a] && c.v[a] !== filters[a]) return false
    }
    if (q) {
      const hay = `${c.name[loc.value]} ${c.note[loc.value]} ${c.v.fonctions.join(' ')} ${c.v.droits.join(' ')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})

const activeCount = computed(() => facetAxes.filter((a) => filters[a]).length + (query.value.trim() ? 1 : 0))

const matrixAxes = ['fongibilite', 'rapport', 'couverture', 'debiteur', 'garant', 'transfer'] as const
</script>

<template>
  <div>
    <!-- Facets + controls -->
    <div class="card p-4 mb-5">
      <div class="flex flex-col gap-3">
        <div v-for="axis in facetAxes" :key="axis" class="flex flex-wrap items-center gap-1.5">
          <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low w-20 shrink-0">{{ AXIS_SHORT[loc][axis] }}</span>
          <button
            v-for="v in AXIS_ORDER[axis]"
            :key="v"
            type="button"
            class="rounded-full border px-2.5 py-1 text-[12px] transition"
            :class="filters[axis] === v ? 'border-accent bg-accent/10 text-ink-high' : 'border-border-subtle text-ink-mid hover:border-border-accent'"
            @click="toggle(axis, v)"
          >{{ AXIS_VALUE[loc][axis]?.[v] ?? v }}</button>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4">
        <input
          v-model="query"
          type="search"
          :placeholder="t('configurator.search')"
          class="flex-1 min-w-[160px] rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm text-ink-high placeholder:text-ink-low focus:outline-none focus:border-accent"
        >
        <button
          class="btn-ghost text-sm px-3.5 py-2"
          :class="activeCount ? 'border-accent text-accent' : ''"
          @click="resetFilters"
        >{{ t('configurator.resetFilters') }}<span v-if="activeCount"> ({{ activeCount }})</span></button>
        <div class="inline-flex rounded-lg border border-border-subtle overflow-hidden">
          <button
            type="button"
            class="px-3 py-2 text-[12px] font-mono uppercase tracking-[0.1em] transition"
            :class="view === 'cards' ? 'bg-accent text-accent-on' : 'text-ink-mid hover:text-accent'"
            @click="view = 'cards'"
          >{{ t('configurator.viewCards') }}</button>
          <button
            type="button"
            class="px-3 py-2 text-[12px] font-mono uppercase tracking-[0.1em] transition"
            :class="view === 'matrix' ? 'bg-accent text-accent-on' : 'text-ink-mid hover:text-accent'"
            @click="view = 'matrix'"
          >{{ t('configurator.viewMatrix') }}</button>
        </div>
      </div>
      <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low">
        {{ t('configurator.count', { n: filtered.length, total: REFCASES.length }) }}
      </p>
    </div>

    <!-- Empty -->
    <p v-if="!filtered.length" class="text-ink-mid text-sm py-6">{{ t('configurator.emptyLib') }}</p>

    <!-- Cards -->
    <div v-else-if="view === 'cards'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CaseCard v-for="c in filtered" :key="c.id" :case="c" />
    </div>

    <!-- Matrix -->
    <div v-else class="overflow-x-auto rounded-xl border border-border-subtle">
      <table class="w-full border-collapse text-[12px]">
        <thead>
          <tr class="bg-bg-elevated text-ink-low">
            <th class="text-left font-medium px-3 py-2 sticky left-0 bg-bg-elevated">{{ t('configurator.colCase') }}</th>
            <th v-for="a in matrixAxes" :key="a" class="text-left font-medium px-3 py-2 font-mono uppercase tracking-[0.08em] text-[10px]">{{ AXIS_SHORT[loc][a] }}</th>
            <th v-for="f in FONCTIONS_ORDER" :key="f" class="px-2 py-2 font-mono text-[10px]" :title="LABS[loc].fonctions[f]">{{ (LABS[loc].fonctions[f] ?? f).slice(0, 4) }}</th>
            <th v-for="d in DROITS_ORDER" :key="d" class="px-2 py-2 font-mono text-[10px]" :title="LABS[loc].droits[d]">{{ (LABS[loc].droits[d] ?? d).slice(0, 4) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id" class="border-t border-border-subtle">
            <td class="px-3 py-2 text-ink-high font-medium sticky left-0 bg-bg-card whitespace-nowrap">{{ c.name[loc] }}</td>
            <td v-for="a in matrixAxes" :key="a" class="px-3 py-2 text-ink-mid whitespace-nowrap" :class="a === 'rapport' ? 'text-accent' : ''">{{ AXIS_VALUE[loc][a]?.[c.v[a]] ?? c.v[a] }}</td>
            <td v-for="f in FONCTIONS_ORDER" :key="f" class="px-2 py-2 text-center" :class="c.v.fonctions.includes(f) ? 'text-accent' : 'text-ink-low/40'">{{ c.v.fonctions.includes(f) ? '●' : '·' }}</td>
            <td v-for="d in DROITS_ORDER" :key="d" class="px-2 py-2 text-center" :class="c.v.droits.includes(d) ? 'text-ok' : 'text-ink-low/40'">{{ c.v.droits.includes(d) ? '●' : '·' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
