<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { INTAKE } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

const props = defineProps<{ keys: QuestionKey[] }>()

const store = useProjectStore()

// Filter by each question's conditional `show` predicate (reactive on state).
const visibleKeys = computed(() =>
  props.keys.filter((k) => {
    const show = INTAKE[k].show
    return show ? show(store.$state) : true
  })
)
</script>

<template>
  <div class="flex flex-col gap-9">
    <QuestionField
      v-for="(k, i) in visibleKeys"
      :key="k"
      :question-key="k"
      :index="i"
    />
  </div>
</template>
