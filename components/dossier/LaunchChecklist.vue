<script setup lang="ts">
import type { StageView } from '~/composables/useDossier'

defineProps<{ stages: StageView[] }>()
const { t, tm, rt } = useI18n()

const stageNames = computed(() =>
  (tm('create.stageNames') as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
)

// Local check state (UI only — not persisted; the dossier is derived).
const checked = reactive<Set<string>>(new Set())
function toggle(id: string) {
  if (checked.has(id)) checked.delete(id)
  else checked.add(id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="stage in stages"
      :key="stage.id"
      class="overflow-hidden rounded-xl border border-border-subtle bg-bg-card"
    >
      <div class="flex items-center gap-3 border-b border-border-subtle bg-bg-elevated px-4 py-3">
        <span class="grid h-6 w-6 place-items-center rounded-full border border-border-accent font-mono text-xs text-ink-mid">
          {{ stage.index }}
        </span>
        <span class="font-medium text-ink-high">{{ stageNames[stage.index] }}</span>
        <span
          v-if="stage.weight === 'heavy'"
          class="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-danger border border-danger/40 rounded-full px-2 py-0.5"
        >{{ t('create.wHeavy') }}</span>
        <span
          v-else-if="stage.weight === 'light'"
          class="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-ok border border-ok/40 rounded-full px-2 py-0.5"
        >{{ t('create.wLight') }}</span>
      </div>

      <ul class="divide-y divide-border-subtle">
        <li v-for="item in stage.items" :key="item.id">
          <button
            type="button"
            class="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-bg-elevated/60"
            :aria-pressed="checked.has(item.id)"
            @click="toggle(item.id)"
          >
            <span
              class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition"
              :class="checked.has(item.id) ? 'border-accent bg-accent text-accent-on' : 'border-border-accent'"
            >
              <span v-if="checked.has(item.id)" class="text-xs leading-none" aria-hidden="true">✓</span>
            </span>
            <span class="text-[15px] leading-snug" :class="checked.has(item.id) ? 'text-ink-low line-through' : 'text-ink-high'">
              {{ item.label }}
              <span
                v-if="item.cliquet"
                class="ml-1.5 inline-block align-middle font-mono text-[10px] uppercase tracking-[0.12em] text-danger border border-danger/40 rounded-full px-1.5 py-0.5 no-underline"
              >{{ t('create.cliquet') }}</span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
