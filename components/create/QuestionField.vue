<script setup lang="ts">
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'
import type { ProjectState, Fonction, Droit } from '~/utils/engine'

const props = defineProps<{ questionKey: QuestionKey; index?: number }>()

const store = useActiveProjectStore()
const { locale } = useI18n()
const { t } = useI18n()

const def = computed(() => INTAKE[props.questionKey])
const text = computed(() => def.value.text[locale.value === 'fr' ? 'fr' : 'en'])
const isMulti = computed(() => def.value.type === 'multi')

// Current answer (string | null for single, string[] for multi).
const answer = computed(() => store.$state[props.questionKey as keyof ProjectState])

function isSelected(value: string): boolean {
  const a = answer.value
  return Array.isArray(a) ? (a as string[]).includes(value) : a === value
}

function select(value: string) {
  if (isMulti.value) {
    store.toggleMulti(props.questionKey as 'fonctions' | 'droits', value as Fonction | Droit)
  } else {
    // Single-choice axes (chemin is handled in ForkStep, never here).
    store.setSingle(props.questionKey as Exclude<QuestionKey, 'chemin' | 'fonctions' | 'droits'>, value)
  }
}
</script>

<template>
  <fieldset class="border-0 p-0 m-0">
    <legend class="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-1 p-0">
      <span class="text-base font-medium text-ink-high">{{ text.label }}</span>
      <span v-if="isMulti" class="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
        {{ t('create.multiTag') }}
      </span>
    </legend>
    <p v-if="text.hint" class="text-[13px] text-ink-low mb-3">{{ text.hint }}</p>

    <div class="grid gap-2" :class="def.order.length > 4 ? 'sm:grid-cols-2' : ''">
      <template v-for="value in def.order" :key="value">
        <OptionButton
          v-if="text.options[value]"
          :title="text.options[value]!.title"
          :example="text.options[value]!.example"
          :selected="isSelected(value)"
          :multi="isMulti"
          @select="select(value)"
        />
      </template>

      <OptionButton
        v-if="def.unsure"
        :title="t('create.unsure')"
        :selected="isSelected('?')"
        @select="select('?')"
      />
    </div>
  </fieldset>
</template>
