<script setup lang="ts">
import { useAnalyzeStore } from '~/stores/project'
import { provideProjectStore } from '~/composables/useActiveProjectStore'
import { useDossier } from '~/composables/useDossier'
import { INTAKE, BLOCK_B1, BLOCK_B2, REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { ProjectState } from '~/utils/engine'
import type { QuestionKey } from '~/utils/content/types'

const store = useAnalyzeStore()
provideProjectStore(store)
const { t } = useI18n()
const localePath = useLocalePath()
const { classInfo, flagsCount, secondaryNames } = useDossier(store)

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
const missing = computed(() => requiredKeys.value.filter((k) => store.$state[k as keyof ProjectState] == null).length)
const total = computed(() => requiredKeys.value.length)
const answered = computed(() => total.value - missing.value)
const progressPct = computed(() => (total.value ? Math.round((answered.value / total.value) * 100) : 0))
const untouched = computed(() => missing.value === requiredKeys.value.length)
const complete = computed(() => missing.value === 0)

async function revealDossier() {
  showDossier.value = true
  await nextTick()
  if (typeof document !== 'undefined') {
    document.getElementById('dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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
    <div class="pb-28">
      <div class="wrap max-w-4xl py-8 sm:py-10">
        <NuxtLink
          :to="localePath('/')"
          class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
        >{{ t('create.backHub') }}</NuxtLink>

        <div class="mt-4 mb-9">
          <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ t('analyze.title') }}</h1>
          <p class="text-ink-mid mt-1.5 max-w-2xl">{{ t('analyze.sub') }}</p>
        </div>

        <section class="mb-10">
          <p class="kicker mb-4">{{ t('analyze.identH') }}</p>
          <IntakeTable :keys="visibleB1" :required-keys="requiredKeys" />
        </section>

        <section class="mb-8">
          <p class="kicker mb-4">{{ t('analyze.condH') }}</p>
          <IntakeTable :keys="blockB2" :required-keys="requiredKeys" />
        </section>
      </div>

      <div v-if="showDossier" id="dossier" class="border-t border-border-subtle">
        <div class="wrap max-w-4xl pt-6 print:hidden">
          <button
            class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent transition-colors"
            @click="backToQuestions"
          >↑ {{ t('create.backToQuestions') }}</button>
        </div>
        <DossierView mode="analyze" @restart="restart" />
      </div>
    </div>

    <!-- Sticky live summary bar -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg-card/90 backdrop-blur-md print:hidden">
      <div class="wrap max-w-4xl flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-1 w-24 rounded-full bg-border-subtle overflow-hidden">
              <div class="h-full bg-accent transition-all duration-300" :style="{ width: progressPct + '%' }" />
            </div>
            <span class="font-mono text-[10px] text-ink-low">{{ t('create.progress', { done: answered, total }) }}</span>
          </div>
          <p v-if="untouched" class="text-[13px] text-ink-low">{{ t('create.startHint') }}</p>
          <template v-else>
            <p class="text-[13px] leading-tight">
              <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low">{{ t('create.likelyClass') }}</span>
              <span class="ml-2 font-semibold text-ink-high">{{ classInfo.name }}</span>
              <span v-if="!complete" class="ml-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-warn">· {{ t('create.provisional') }}</span>
            </p>
            <p class="text-[12px] mt-0.5" :class="flagsCount ? 'text-warn' : 'text-ok'">
              {{ flagsCount ? `⚑ ${t('create.watchCount', { n: flagsCount })}` : t('create.vigNone') }}
              <span v-if="secondaryNames.length" class="text-warn"> · {{ t('create.alsoPlausibleShort', { classes: secondaryNames.join(' · ') }) }}</span>
            </p>
          </template>
        </div>
        <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors"
            @click="restart"
          >{{ t('create.btnRestart') }}</button>
          <button class="btn-primary px-4 py-2 text-sm" @click="revealDossier">{{ t('analyze.diagnose') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
