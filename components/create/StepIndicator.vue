<script setup lang="ts">
const props = withDefaults(defineProps<{ activeIndex: number; labelsKey?: string }>(), {
  labelsKey: 'create.stepLabels'
})
const { tm, rt } = useI18n()

const labels = computed(() =>
  (tm(props.labelsKey) as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
)
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-low">
    <template v-for="(label, i) in labels" :key="i">
      <span class="flex items-center gap-2">
        <span
          class="grid h-[22px] w-[22px] place-items-center rounded-full border text-[11px]"
          :class="i < props.activeIndex
            ? 'border-accent text-accent'
            : i === props.activeIndex
              ? 'border-accent bg-accent text-accent-on'
              : 'border-border-accent text-ink-low'"
        >
          <span aria-hidden="true">{{ i < props.activeIndex ? '✓' : i + 1 }}</span>
        </span>
        <span :class="i === props.activeIndex ? 'text-ink-high' : ''">{{ label }}</span>
      </span>
      <span v-if="i < labels.length - 1" class="h-px w-5 bg-border-accent" />
    </template>
  </div>
</template>
