<script setup lang="ts">
/**
 * Frame live panel (right column, 1/3). Updates as the inputs change:
 * progress, likely class (+ secondary), live coherence, "resembles which of
 * the 17 cases", watch points — plus the full-dossier CTA + reset.
 */
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { useDossier } from '~/composables/useDossier'
import { coherence, type ConfigState } from '~/utils/engine'
import { REFCASES, CATEGORICAL_AXES, type CategoricalAxis } from '~/utils/content/refcases'
import { REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { ProjectState } from '~/utils/engine'
import type { QuestionKey } from '~/utils/content/types'

const emit = defineEmits<{ (e: 'open'): void; (e: 'reset'): void }>()

const store = useActiveProjectStore()
const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
const { classInfo, flags, flagsCount, secondaryNames } = useDossier(store)

// ── progression ──
const requiredKeys = computed<QuestionKey[]>(() => {
  const req: QuestionKey[] = [...REQUIRED_B1, ...REQUIRED_B2]
  if (store.rapport === 'titre') req.push('titre_type')
  if (store.rapport === 'adosse' || store.rapport === 'titre') req.push('couverture')
  return req
})
const missing = computed(() => requiredKeys.value.filter((k) => store.$state[k as keyof ProjectState] == null).length)
const total = computed(() => requiredKeys.value.length)
const answered = computed(() => total.value - missing.value)
const progressPct = computed(() => (total.value ? Math.round((answered.value / total.value) * 100) : 0))
const untouched = computed(() => missing.value === requiredKeys.value.length)
const complete = computed(() => missing.value === 0)

// ── coherence + resemblance (ex-configurator) ──
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

const mTone: Record<string, string> = { err: 'text-danger', warn: 'text-warn', ok: 'text-ok' }
const mGlyph: Record<string, string> = { err: '✕', warn: '≈', ok: '✓' }
</script>

<template>
  <aside class="card p-5 lg:sticky lg:top-[80px]">
    <p class="kicker mb-3">{{ t('create.livePanel') }}</p>

    <!-- progress -->
    <div class="flex items-center gap-2 mb-4">
      <div class="h-1 flex-1 rounded-full bg-border-subtle overflow-hidden">
        <div class="h-full bg-accent transition-all duration-300" :style="{ width: progressPct + '%' }" />
      </div>
      <span class="font-mono text-[10px] text-ink-low shrink-0">{{ t('create.progress', { done: answered, total }) }}</span>
    </div>

    <p v-if="untouched" class="text-[13px] text-ink-low">{{ t('create.startHint') }}</p>

    <template v-else>
      <!-- likely class -->
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low">{{ t('create.likelyClass') }}</p>
          <span v-if="!complete" class="font-mono text-[10px] uppercase tracking-[0.12em] text-warn">· {{ t('create.provisional') }}</span>
        </div>
        <p class="font-display text-xl font-semibold mt-1" :class="complete ? 'text-ink-high' : 'text-ink-mid'">{{ classInfo.name }}</p>
        <p v-if="secondaryNames.length" class="mt-1 text-[12px] text-warn">⚑ {{ t('create.alsoPlausibleShort', { classes: secondaryNames.join(' · ') }) }}</p>
      </div>

      <!-- resembles (library-style) -->
      <div v-if="matches.length" class="mb-4">
        <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low mb-1.5">{{ t('configurator.resembles') }}</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="m in matches" :key="m" class="rounded-full border border-accent/40 bg-accent/5 px-2.5 py-1 text-[12px] text-accent">{{ m }}</span>
        </div>
      </div>

      <!-- coherence -->
      <ul v-if="messages.length" class="flex flex-col gap-1.5 mb-4">
        <li v-for="m in messages" :key="m.key" class="flex items-start gap-2 text-[12.5px]" :class="mTone[m.level]">
          <span class="font-mono shrink-0" aria-hidden="true">{{ mGlyph[m.level] }}</span>
          <span>{{ t(`configurator.coherence.${m.key}`) }}</span>
        </li>
      </ul>

      <!-- watch points -->
      <p class="text-[13px] mb-4" :class="flagsCount ? 'text-warn' : 'text-ok'">
        {{ flagsCount ? `⚑ ${t('create.watchCount', { n: flagsCount })}` : t('create.vigNone') }}
      </p>
    </template>

    <div class="border-t border-border-subtle pt-4 flex flex-col gap-2">
      <button class="btn-primary w-full justify-center" @click="emit('open')">{{ t('create.fullDossier') }}</button>
      <button class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors" @click="emit('reset')">{{ t('create.btnRestart') }}</button>
    </div>
  </aside>
</template>
