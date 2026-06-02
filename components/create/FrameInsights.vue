<script setup lang="ts">
/**
 * Live identity insights for the Frame flow — the configurator's two
 * superpowers, brought into the main flow: morphological coherence check
 * (forbidden / near-empty cells) and "resembles which real case?" matching
 * against the 17 reference cases. Reads the active project store.
 */
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { coherence, type ConfigState } from '~/utils/engine'
import { REFCASES, CATEGORICAL_AXES, type CategoricalAxis } from '~/utils/content/refcases'

const store = useActiveProjectStore()
const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

/** '?' (unsure) reads as "unknown" → null for coherence/matching. */
function clean<T>(x: T | '?' | null | undefined): T | null {
  return x === '?' || x == null ? null : (x as T)
}

const config = computed<ConfigState>(() => ({
  fongibilite: store.fongibilite,
  rapport: clean(store.rapport),
  couverture: clean(store.couverture),
  debiteur: clean(store.debiteur),
  garant: clean(store.garant),
  transfer: store.transfer,
  fonctions: store.fonctions,
  droits: store.droits
}))

const messages = computed(() => coherence(config.value))

const setAxes = computed<CategoricalAxis[]>(() =>
  CATEGORICAL_AXES.filter((a) => clean(store[a as keyof typeof store] as string | null) != null)
)
const matches = computed<string[]>(() => {
  const axes = setAxes.value
  if (axes.length === 0) return []
  return REFCASES.filter((c) => axes.every((a) => c.v[a] === clean(store[a as keyof typeof store] as string | null)))
    .map((c) => c.name[loc.value])
})

const tone: Record<string, string> = { err: 'text-danger', warn: 'text-warn', ok: 'text-ok' }
const glyph: Record<string, string> = { err: '✕', warn: '≈', ok: '✓' }

const show = computed(() => messages.value.length > 0 || matches.value.length > 0)
</script>

<template>
  <div v-if="show" class="card p-4 mt-4">
    <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low mb-2">{{ t('create.liveCheck') }}</p>

    <ul v-if="messages.length" class="flex flex-col gap-1.5 mb-3">
      <li v-for="m in messages" :key="m.key" class="flex items-start gap-2 text-[13px]" :class="tone[m.level]">
        <span class="font-mono shrink-0" aria-hidden="true">{{ glyph[m.level] }}</span>
        <span>{{ t(`configurator.coherence.${m.key}`) }}</span>
      </li>
    </ul>

    <p v-if="matches.length" class="text-[13px] text-ink-mid">
      <span class="text-ink-low">{{ t('configurator.resembles') }}</span>
      <b class="text-ink-high"> {{ matches.join(', ') }}</b>
    </p>
  </div>
</template>
