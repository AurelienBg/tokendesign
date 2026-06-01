<script setup lang="ts">
defineProps<{
  title: string
  example?: string
  selected: boolean
  multi?: boolean
}>()
defineEmits<{ (e: 'select'): void }>()
</script>

<template>
  <button
    type="button"
    class="group flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition"
    :class="selected
      ? 'border-accent bg-accent/5'
      : 'border-border-subtle hover:border-border-accent bg-bg-card'"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <span
      class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition"
      :class="[
        multi ? 'rounded-[5px]' : 'rounded-full',
        selected ? 'border-accent' : 'border-border-accent'
      ]"
    >
      <span
        v-if="selected"
        class="bg-accent"
        :class="multi ? 'h-2 w-2 rounded-[2px]' : 'h-2 w-2 rounded-full'"
      />
    </span>
    <span class="min-w-0">
      <span class="block text-[15px] leading-snug text-ink-high">{{ title }}</span>
      <span v-if="example" class="block text-[13px] leading-snug text-ink-low mt-0.5">{{ example }}</span>
    </span>
  </button>
</template>
