<script setup lang="ts">
/**
 * Configurator-style intake table: one row per question (category label +
 * tooltip on the left, clickable pills on the right). Shared by Create and
 * Analyze; rows bind to the active project store via BoardField.
 */
import type { QuestionKey } from '~/utils/content/types'

const props = withDefaults(defineProps<{ keys: QuestionKey[]; requiredKeys?: QuestionKey[] }>(), {
  requiredKeys: () => []
})
</script>

<template>
  <div class="card p-5 sm:p-6 flex flex-col gap-4">
    <BoardField
      v-for="k in keys"
      :key="k"
      :question-key="k"
      :required="props.requiredKeys.includes(k)"
    />
  </div>
</template>
