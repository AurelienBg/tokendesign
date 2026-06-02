<script setup lang="ts">
/**
 * Configurator-style intake table: one row per question (category label +
 * tooltip on the left, clickable pills on the right). A light dotted divider
 * separates the single-choice questions from the multi-choice ones.
 */
import { INTAKE } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

const props = withDefaults(defineProps<{ keys: QuestionKey[]; requiredKeys?: QuestionKey[] }>(), {
  requiredKeys: () => []
})

/** True before the first multi-choice question (single → multi boundary). */
function isMultiBoundary(k: QuestionKey, i: number): boolean {
  if (INTAKE[k].type !== 'multi') return false
  const prev = props.keys[i - 1]
  return i === 0 || (prev != null && INTAKE[prev].type !== 'multi')
}
</script>

<template>
  <div class="card p-5 sm:p-6 flex flex-col gap-4">
    <template v-for="(k, i) in keys" :key="k">
      <div v-if="isMultiBoundary(k, i)" class="border-t border-dashed border-border-accent -mx-1" aria-hidden="true" />
      <BoardField :question-key="k" :required="props.requiredKeys.includes(k)" />
    </template>
  </div>
</template>
