<script setup lang="ts">
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE, QUESTION_LABEL } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'
import type { ProjectState, Fonction, Droit } from '~/utils/engine'

const props = defineProps<{ questionKey: QuestionKey; required?: boolean }>()

const store = useActiveProjectStore()
const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const def = computed(() => INTAKE[props.questionKey])
const text = computed(() => def.value.text[loc.value])
const category = computed(() => QUESTION_LABEL[loc.value][props.questionKey])
const isMulti = computed(() => def.value.type === 'multi')

const tipOpen = ref(false)

const answer = computed(() => store.$state[props.questionKey as keyof ProjectState])
const unanswered = computed(() => {
  const a = answer.value
  return Array.isArray(a) ? a.length === 0 : a == null
})
function isSelected(value: string): boolean {
  const a = answer.value
  return Array.isArray(a) ? (a as string[]).includes(value) : a === value
}
function select(value: string) {
  if (isMulti.value) {
    store.toggleMulti(props.questionKey as 'fonctions' | 'droits', value as Fonction | Droit)
  } else {
    store.setSingle(props.questionKey as Exclude<QuestionKey, 'chemin' | 'fonctions' | 'droits'>, value)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 sm:items-center">
    <!-- Category label + custom tooltip popover holding the full question -->
    <div
      class="relative flex items-center gap-1.5 cursor-help w-fit"
      @mouseenter="tipOpen = true"
      @mouseleave="tipOpen = false"
    >
      <span
        v-if="required && unanswered"
        class="h-1.5 w-1.5 rounded-full bg-warn shrink-0"
        aria-hidden="true"
      />
      <span class="font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap" :class="required && unanswered ? 'text-ink-mid' : 'text-ink-low'">{{ category }}</span>
      <button
        type="button"
        class="grid h-4 w-4 place-items-center rounded-full border border-border-accent text-[10px] leading-none text-ink-low hover:border-accent hover:text-accent transition-colors"
        :aria-label="text.label"
        @focus="tipOpen = true"
        @blur="tipOpen = false"
        @click="tipOpen = !tipOpen"
      >?</button>
      <div
        v-if="tipOpen"
        role="tooltip"
        class="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-lg border border-border-subtle bg-bg-card shadow-lg p-2.5 text-[12.5px] text-ink-high leading-snug"
      >{{ text.label }}</div>
    </div>

    <!-- Options -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="value in def.order"
        v-show="text.options[value]"
        :key="value"
        type="button"
        :aria-label="`${category}: ${text.options[value]?.title}`"
        :aria-pressed="isSelected(value)"
        :title="text.options[value]?.example || undefined"
        class="inline-flex items-center whitespace-nowrap border px-2.5 py-1.5 text-[13px] transition"
        :class="[
          isMulti ? 'rounded-md' : 'rounded-full',
          isSelected(value)
            ? 'border-accent text-accent bg-accent/10 font-medium'
            : 'border-border-subtle text-ink-mid hover:border-accent/60 hover:text-ink-high'
        ]"
        @click="select(value)"
      >
        <span v-if="isMulti" class="font-mono text-[11px] mr-1.5 text-accent leading-none" aria-hidden="true">{{ isSelected(value) ? '✓' : '+' }}</span>
        {{ text.options[value]?.title }}
      </button>

      <button
        v-if="def.unsure"
        type="button"
        :aria-pressed="isSelected('?')"
        class="rounded-full border px-2.5 py-1.5 text-[13px] italic whitespace-nowrap transition"
        :class="isSelected('?') ? 'border-warn bg-warn/10 text-warn' : 'border-border-subtle text-ink-low hover:border-accent/60'"
        @click="select('?')"
      >{{ t('create.unsure') }}</button>
    </div>
  </div>
</template>
