<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { provideProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE, BLOCK_B1, BLOCK_B2, REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

const store = useProjectStore()
provideProjectStore(store)
const { t } = useI18n()
const localePath = useLocalePath()

const showDossier = ref(false)
const blockB2 = BLOCK_B2

const visibleB1 = computed(() =>
  BLOCK_B1.filter((k) => {
    const show = INTAKE[k].show
    return !show || show(store.$state)
  })
)
const requiredKeys = computed<QuestionKey[]>(() => {
  const req: QuestionKey[] = [...REQUIRED_B1, ...REQUIRED_B2]
  if (store.rapport === 'titre') req.push('titre_type')
  if (store.rapport === 'adosse' || store.rapport === 'titre') req.push('couverture')
  return req
})

async function revealDossier() {
  showDossier.value = true
  await nextTick()
  if (typeof document !== 'undefined') document.getElementById('dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function backToQuestions() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
function restart() {
  if (typeof window !== 'undefined' && !window.confirm(t('create.resetConfirm'))) return
  store.reset()
  showDossier.value = false
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <div class="wrap max-w-5xl py-8 sm:py-10">
      <NuxtLink
        :to="localePath('/')"
        class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
      >{{ t('create.backHub') }}</NuxtLink>

      <div class="mt-4 mb-9">
        <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ t('create.frameTitle') }}</h1>
        <p class="text-ink-mid mt-1.5 max-w-2xl">{{ t('create.b1Sub') }}</p>
      </div>

      <!-- 2/3 inputs · 1/3 live panel -->
      <div class="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
        <div class="space-y-10 min-w-0">
          <section>
            <p class="kicker mb-4">{{ t('create.identityGroup') }}</p>
            <IntakeTable :keys="visibleB1" :required-keys="requiredKeys" />
          </section>
          <section>
            <p class="kicker mb-4">{{ t('create.launchGroup') }}</p>
            <IntakeTable :keys="blockB2" :required-keys="requiredKeys" />
          </section>
        </div>

        <FramePanel @open="revealDossier" @reset="restart" />
      </div>
    </div>

    <!-- Full dossier below (inputs stay above) -->
    <div v-if="showDossier" id="dossier" class="border-t border-border-subtle">
      <div class="wrap max-w-4xl pt-6 print:hidden">
        <button
          class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent transition-colors"
          @click="backToQuestions"
        >↑ {{ t('create.backToQuestions') }}</button>
      </div>
      <DossierView mode="create" @restart="restart" />
    </div>
  </div>
</template>
