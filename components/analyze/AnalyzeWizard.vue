<script setup lang="ts">
import { useAnalyzeStore } from '~/stores/project'
import { provideProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE, BLOCK_B1, BLOCK_B2, REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

type Step = 'b1' | 'b2' | 'dossier'

const store = useAnalyzeStore()
provideProjectStore(store)
const { t, locale } = useI18n()

const step = ref<Step>('b1')
const error = ref<string | null>(null)
const activeIndex = computed(() => (step.value === 'b1' ? 0 : step.value === 'b2' ? 1 : 2))

function label(key: QuestionKey): string {
  return INTAKE[key].text[locale.value === 'fr' ? 'fr' : 'en'].label
}
function firstMissing(keys: QuestionKey[]): QuestionKey | null {
  for (const k of keys) {
    if (store.$state[k as keyof typeof store.$state] == null) return k
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
  step.value = 'b1'
}
watch(step, () => {
  error.value = null
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
})

const blockB1 = BLOCK_B1
const blockB2 = BLOCK_B2
</script>

<template>
  <div>
    <div class="sticky top-[57px] z-30 border-b border-border-subtle/70 backdrop-blur-md print:hidden"
         style="background-color: rgb(var(--bg-base) / 0.7)">
      <div class="wrap max-w-3xl py-3">
        <StepIndicator :active-index="activeIndex" labels-key="analyze.stepLabels" />
      </div>
    </div>

    <!-- Identity -->
    <section v-if="step === 'b1'" class="wrap max-w-3xl py-10 sm:py-14">
      <p class="kicker mb-2">{{ t('analyze.identH') }}</p>
      <p class="text-ink-mid mb-9 max-w-xl">{{ t('analyze.identSub') }}</p>
      <IntakeBlock :keys="blockB1" />
      <p v-if="error" class="mt-6 text-sm text-danger">{{ error }}</p>
      <div class="mt-8 flex justify-end gap-3 border-t border-border-subtle pt-6">
        <button class="btn-primary" @click="nextB1">{{ t('create.btnContinue') }}</button>
      </div>
    </section>

    <!-- Conditions -->
    <section v-else-if="step === 'b2'" class="wrap max-w-3xl py-10 sm:py-14">
      <p class="kicker mb-2">{{ t('analyze.condH') }}</p>
      <p class="text-ink-mid mb-9 max-w-xl">{{ t('analyze.condSub') }}</p>
      <IntakeBlock :keys="blockB2" />
      <p v-if="error" class="mt-6 text-sm text-danger">{{ error }}</p>
      <div class="mt-8 flex justify-between gap-3 border-t border-border-subtle pt-6">
        <button class="btn-ghost" @click="step = 'b1'">{{ t('create.btnBack') }}</button>
        <button class="btn-primary" @click="nextB2">{{ t('analyze.diagnose') }}</button>
      </div>
    </section>

    <!-- Diagnosis -->
    <DossierView v-else mode="analyze" @restart="restart" />
  </div>
</template>
