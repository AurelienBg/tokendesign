<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { INTAKE, BLOCK_B1, BLOCK_B2, REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

type Step = 'fork' | 'b1' | 'autres' | 'b2' | 'dossier'

const store = useProjectStore()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const step = ref<Step>('fork')
const error = ref<string | null>(null)

const activeIndex = computed(() => {
  switch (step.value) {
    case 'fork': return 0
    case 'b1':
    case 'autres': return 1
    case 'b2': return 2
    case 'dossier': return 3
  }
  return 0
})

function label(key: QuestionKey): string {
  return INTAKE[key].text[locale.value === 'fr' ? 'fr' : 'en'].label
}

/** First unanswered required key (`?` counts as answered), or null. */
function firstMissing(keys: QuestionKey[]): QuestionKey | null {
  for (const k of keys) {
    const v = store.$state[k as keyof typeof store.$state]
    if (v == null) return k
  }
  return null
}

function requiredB1(): QuestionKey[] {
  const req: QuestionKey[] = [...REQUIRED_B1]
  if (store.rapport === 'titre') req.push('titre_type')
  if (store.rapport === 'adosse' || store.rapport === 'titre') req.push('couverture')
  return req
}

function fail(key: QuestionKey) {
  error.value = key === 'titre_type' ? t('create.alertTitre') : t('create.alertAnswer', { q: label(key) })
}

function goFromFork() {
  error.value = null
  step.value = store.chemin.includes('creer') ? 'b1' : 'autres'
}

function nextB1() {
  const miss = firstMissing(requiredB1())
  if (miss) return fail(miss)
  error.value = null
  step.value = 'b2'
}

function nextB2() {
  const miss = firstMissing(REQUIRED_B2)
  if (miss) return fail(miss)
  error.value = null
  step.value = 'dossier'
}

function restart() {
  store.reset()
  error.value = null
  step.value = 'fork'
}

// Scroll to top on every step change.
watch(step, () => {
  error.value = null
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
})

const blockB1 = BLOCK_B1
const blockB2 = BLOCK_B2
</script>

<template>
  <div>
    <!-- Progress (hidden on the fork) -->
    <div v-if="step !== 'fork'" class="sticky top-[57px] z-30 border-b border-border-subtle/70 backdrop-blur-md print:hidden"
         style="background-color: rgb(var(--bg-base) / 0.7)">
      <div class="wrap max-w-3xl py-3">
        <StepIndicator :active-index="activeIndex" />
      </div>
    </div>

    <!-- Fork -->
    <ForkStep v-if="step === 'fork'" @continue="goFromFork" />

    <!-- Autres (build-an-app cul-de-sac) -->
    <AutresInfo v-else-if="step === 'autres'" @back="step = 'fork'" />

    <!-- Block 1 — identity -->
    <section v-else-if="step === 'b1'" class="wrap max-w-3xl py-10 sm:py-14">
      <p class="kicker mb-2">{{ t('create.b1H') }}</p>
      <p class="text-ink-mid mb-3 max-w-xl">{{ t('create.b1Sub') }}</p>
      <NuxtLink
        :to="localePath('/configurator')"
        class="inline-flex items-center gap-2 mb-9 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-accent no-underline"
      >
        <span class="glyph text-accent" aria-hidden="true">⊞</span>{{ t('configurator.fromCreate') }}
      </NuxtLink>
      <IntakeBlock :keys="blockB1" />
      <p v-if="error" class="mt-6 text-sm text-danger">{{ error }}</p>
      <div class="mt-8 flex justify-between gap-3 border-t border-border-subtle pt-6">
        <button class="btn-ghost" @click="step = 'fork'">{{ t('create.btnBack') }}</button>
        <button class="btn-primary" @click="nextB1">{{ t('create.btnContinue') }}</button>
      </div>
    </section>

    <!-- Block 2 — launch -->
    <section v-else-if="step === 'b2'" class="wrap max-w-3xl py-10 sm:py-14">
      <p class="kicker mb-2">{{ t('create.b2H') }}</p>
      <p class="text-ink-mid mb-9 max-w-xl">{{ t('create.b2Sub') }}</p>
      <IntakeBlock :keys="blockB2" />
      <p v-if="error" class="mt-6 text-sm text-danger">{{ error }}</p>
      <div class="mt-8 flex justify-between gap-3 border-t border-border-subtle pt-6">
        <button class="btn-ghost" @click="step = 'b1'">{{ t('create.btnBack') }}</button>
        <button class="btn-primary" @click="nextB2">{{ t('create.btnGenerate') }}</button>
      </div>
    </section>

    <!-- Dossier -->
    <DossierView v-else-if="step === 'dossier'" @restart="restart" />
  </div>
</template>
