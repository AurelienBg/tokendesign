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

const rowBase =
  'flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-[13.5px] leading-snug transition'
const rowOn = 'border-accent bg-accent/10 text-ink-high'
const rowOff = 'border-border-subtle text-ink-mid hover:border-accent/60 hover:text-ink-high'
</script>

<template>
  <div class="card p-4">
    <div class="mb-3">
      <h3 class="text-[14px] font-semibold text-ink-high leading-snug">{{ text.label }}</h3>
      <p v-if="text.hint" class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low mt-1">
        {{ text.hint }}<span v-if="isMulti"> · {{ t('create.multiTag') }}</span>
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <template v-for="value in def.order" :key="value">
        <button
          v-if="text.options[value]"
          type="button"
          :aria-pressed="isSelected(value)"
          :class="[rowBase, isSelected(value) ? rowOn : rowOff]"
          @click="select(value)"
        >
          <!-- single → radio dot · multi → checkbox -->
          <span
            class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center border"
            :class="[isMulti ? 'rounded-[4px]' : 'rounded-full', isSelected(value) ? 'border-accent' : 'border-border-accent']"
          >
            <span
              v-if="isSelected(value)"
              :class="isMulti ? 'text-accent text-[10px] leading-none font-bold' : 'h-2 w-2 rounded-full bg-accent'"
              aria-hidden="true"
            >{{ isMulti ? '✓' : '' }}</span>
          </span>
          <span>
            {{ text.options[value]!.title }}
            <span v-if="text.options[value]!.example" class="block text-[11px] text-ink-low mt-0.5">{{ text.options[value]!.example }}</span>
          </span>
        </button>
      </template>

      <!-- "I don't know" -->
      <button
        v-if="def.unsure"
        type="button"
        :aria-pressed="isSelected('?')"
        :class="[rowBase, isSelected('?') ? 'border-warn bg-warn/10 text-warn' : rowOff, 'italic']"
        @click="select('?')"
      >
        <span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border" :class="isSelected('?') ? 'border-warn' : 'border-border-accent'">
          <span v-if="isSelected('?')" class="h-2 w-2 rounded-full bg-warn" aria-hidden="true" />
        </span>
        <span>{{ t('create.unsure') }}</span>
      </button>
    </div>
  </div>
</template>
