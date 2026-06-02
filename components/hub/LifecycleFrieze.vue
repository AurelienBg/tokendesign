<script setup lang="ts">
/**
 * Lifecycle frieze — orientation map on the hub. Shows the token lifecycle
 * stages with "Conception" (where Token Design helps) highlighted. The
 * "Build an app" path is a parallel track, not a stage.
 */
const { t, tm, rt } = useI18n()

const stages = computed(() =>
  (tm('create.stageNames') as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
)
</script>

<template>
  <section>
    <p class="font-mono text-xs uppercase tracking-[0.16em] text-ink-low mb-3">{{ t('hub.lifecycleKicker') }}</p>
    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-2">
        <template v-for="(s, i) in stages" :key="i">
          <span
            class="rounded-md border px-3 py-1.5 text-[13px]"
            :class="i === 0 ? 'border-accent text-accent font-medium' : 'border-border-subtle text-ink-mid'"
          >{{ s }}</span>
          <span v-if="i < stages.length - 1" class="text-ink-low" aria-hidden="true">→</span>
        </template>
      </div>
      <p class="text-[12px] text-ink-low mt-3">{{ t('hub.lifecycleNote') }}</p>
    </div>
  </section>
</template>
