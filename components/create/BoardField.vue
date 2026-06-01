<script setup lang="ts">
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'
import type { ProjectState, Fonction, Droit } from '~/utils/engine'

const props = defineProps<{ questionKey: QuestionKey }>()

const store = useActiveProjectStore()
const { t, locale } = useI18n()

const def = computed(() => INTAKE[props.questionKey])
const text = computed(() => def.value.text[locale.value === 'fr' ? 'fr' : 'en'])
const isMulti = computed(() => def.value.type === 'multi')

const answer = computed(() => store.$state[props.questionKey as keyof ProjectState])
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
  <div>
    <div class="flex items-baseline gap-2 mb-1.5">
      <span class="text-[14px] font-medium text-ink-high">{{ text.label }}</span>
      <span v-if="text.hint" class="text-[12px] text-ink-low">· {{ text.hint }}</span>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <template v-for="value in def.order" :key="value">
        <!-- single → filled pill (radio) · multi → chip with +/✓ -->
        <button
          v-if="text.options[value]"
          type="button"
          :aria-pressed="isSelected(value)"
          class="inline-flex items-center border px-2.5 py-1.5 text-[13px] transition"
          :class="[
            isMulti ? 'rounded-md' : 'rounded-full',
            isSelected(value)
              ? (isMulti ? 'border-accent text-accent bg-accent/10' : 'border-accent bg-accent text-accent-on font-medium')
              : 'border-border-subtle text-ink-mid hover:border-border-accent'
          ]"
          @click="select(value)"
        >
          <span v-if="isMulti" class="font-mono text-[11px] mr-1.5 text-accent leading-none" aria-hidden="true">{{ isSelected(value) ? '✓' : '+' }}</span>
          {{ text.options[value]!.title }}
        </button>
      </template>

      <button
        v-if="def.unsure"
        type="button"
        :aria-pressed="isSelected('?')"
        class="inline-flex items-center rounded-full border px-2.5 py-1.5 text-[13px] italic transition"
        :class="isSelected('?') ? 'border-warn bg-warn/10 text-warn' : 'border-border-subtle text-ink-low hover:border-border-accent'"
        @click="select('?')"
      >{{ t('create.unsure') }}</button>
    </div>
  </div>
</template>
