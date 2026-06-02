<script setup lang="ts">
import { useAuthorityStore } from '~/stores/authority'
import { AUTH_QUESTIONS, type AuthQuestionDef } from '~/utils/content/authority'
import type { AuthorityState, AuthorityLevel } from '~/utils/authority'

type DimensionKey = Exclude<keyof AuthorityState, 'actions'>

const store = useAuthorityStore()
const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const showResult = ref(false)
const error = ref<string | null>(null)

// Dimensions appear once the effective (highest) authority is authorize/deposit.
const dimensioned = computed(() => store.assessment.level === 'authorize' || store.assessment.level === 'deposit')
const visibleQuestions = computed(() => AUTH_QUESTIONS.filter((q) => !q.dimensioned || dimensioned.value))

function isSelected(q: AuthQuestionDef, v: string): boolean {
  return q.multi ? store.actions.includes(v as AuthorityLevel) : store.$state[q.key] === v
}
function onSelect(q: AuthQuestionDef, v: string) {
  if (q.multi) store.toggleAction(v as AuthorityLevel)
  else store.setSingle(q.key as DimensionKey, v)
}
function answered(q: AuthQuestionDef): boolean {
  return q.multi ? store.actions.length > 0 : store.$state[q.key] != null
}

function assess() {
  for (const q of visibleQuestions.value) {
    if (!answered(q)) {
      error.value = t('build.alert', { q: q.text[loc.value].label })
      return
    }
  }
  error.value = null
  showResult.value = true
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function restart() {
  store.reset()
  error.value = null
  showResult.value = false
}
function resetAll() {
  if (typeof window !== 'undefined' && !window.confirm(t('create.resetConfirm'))) return
  restart()
}
</script>

<template>
  <div>
    <!-- Intake -->
    <section v-if="!showResult" class="wrap max-w-3xl py-10 sm:py-14">
      <div class="flex items-start justify-between gap-3 mb-9">
        <div>
          <p class="kicker mb-2">{{ t('build.questionsH') }}</p>
          <p class="text-ink-mid max-w-xl">{{ t('build.questionsSub') }}</p>
        </div>
        <button
          v-if="store.hasActions"
          class="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors"
          @click="resetAll"
        >{{ t('create.btnRestart') }}</button>
      </div>

      <div class="flex flex-col gap-9">
        <fieldset v-for="q in visibleQuestions" :key="q.key" class="border-0 p-0 m-0">
          <legend class="text-base font-medium text-ink-high mb-1 p-0">{{ q.text[loc].label }}</legend>
          <p v-if="q.text[loc].hint" class="text-[13px] text-ink-low mb-3">{{ q.text[loc].hint }}</p>
          <div class="grid gap-2" :class="q.order.length > 2 ? 'sm:grid-cols-2' : ''">
            <OptionButton
              v-for="v in q.order"
              :key="v"
              :title="q.text[loc].options[v]!.title"
              :example="q.text[loc].options[v]!.example"
              :selected="isSelected(q, v)"
              @select="onSelect(q, v)"
            />
          </div>
        </fieldset>
      </div>

      <p v-if="error" class="mt-6 text-sm text-danger">{{ error }}</p>
      <div class="mt-8 flex justify-end gap-3 border-t border-border-subtle pt-6">
        <button class="btn-primary" @click="assess">{{ t('build.assess') }}</button>
      </div>
    </section>

    <!-- Result -->
    <AuthorityDossier v-else @restart="restart" />
  </div>
</template>
