<script setup lang="ts">
/**
 * Presentational intake field for the /resources design sandbox —
 * "configurator style": label + horizontal pills. Pure UI (local state in the
 * page), no engine/store, so playing here never touches a real project.
 */
import { INTAKE } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'

const props = defineProps<{ questionKey: QuestionKey; selected: string | string[] | null }>()
defineEmits<{ (e: 'toggle', value: string): void }>()

const { t, locale } = useI18n()
const def = computed(() => INTAKE[props.questionKey])
const text = computed(() => def.value.text[locale.value === 'fr' ? 'fr' : 'en'])
const multi = computed(() => def.value.type === 'multi')

function on(v: string): boolean {
  const s = props.selected
  return Array.isArray(s) ? s.includes(v) : s === v
}
</script>

<template>
  <div>
    <div class="flex items-baseline gap-2 mb-2">
      <span class="text-[13.5px] font-medium text-ink-high">{{ text.label }}</span>
      <span v-if="text.hint" class="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low">{{ text.hint }}</span>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="v in def.order"
        v-show="text.options[v]"
        :key="v"
        type="button"
        class="inline-flex items-center border px-2.5 py-1.5 text-[13px] transition"
        :class="[
          multi ? 'rounded-md' : 'rounded-full',
          on(v)
            ? (multi ? 'border-accent text-accent bg-accent/10' : 'border-accent bg-accent text-accent-on font-medium')
            : 'border-border-subtle text-ink-mid hover:border-accent/60'
        ]"
        @click="$emit('toggle', v)"
      >
        <span v-if="multi" class="font-mono text-[11px] mr-1.5 text-accent leading-none" aria-hidden="true">{{ on(v) ? '✓' : '+' }}</span>
        {{ text.options[v]?.title }}
      </button>
      <button
        v-if="def.unsure"
        type="button"
        class="rounded-full border px-2.5 py-1.5 text-[13px] italic transition"
        :class="on('?') ? 'border-warn bg-warn/10 text-warn' : 'border-border-subtle text-ink-low hover:border-accent/60'"
        @click="$emit('toggle', '?')"
      >{{ t('create.unsure') }}</button>
    </div>
  </div>
</template>
