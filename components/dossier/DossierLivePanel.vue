<script setup lang="ts">
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { useDossier } from '~/composables/useDossier'
import { REQUIRED_B1, REQUIRED_B2 } from '~/utils/content/intake'
import type { ProjectState } from '~/utils/engine'
import type { QuestionKey } from '~/utils/content/types'

defineEmits<{ (e: 'open'): void }>()

const store = useActiveProjectStore()
const { t } = useI18n()
const { classInfo, secondaryNames, flags, flagsCount, stages, confirmCount } = useDossier(store)

const requiredKeys = computed<QuestionKey[]>(() => {
  const req: QuestionKey[] = [...REQUIRED_B1, ...REQUIRED_B2]
  if (store.rapport === 'titre') req.push('titre_type')
  if (store.rapport === 'adosse' || store.rapport === 'titre') req.push('couverture')
  return req
})
const missing = computed(() =>
  requiredKeys.value.filter((k) => store.$state[k as keyof ProjectState] == null).length
)
const complete = computed(() => missing.value === 0)
const itemCount = computed(() => stages.value.reduce((n, s) => n + s.items.length, 0))
</script>

<template>
  <aside class="card p-5 lg:sticky lg:top-[80px]">
    <p class="kicker mb-3">{{ t('create.livePanel') }}</p>

    <!-- Completeness -->
    <div
      class="mb-4 flex items-center gap-2 rounded-md border px-3 py-2 text-[13px]"
      :class="complete ? 'border-teal/40 text-teal' : 'border-border-subtle text-ink-low'"
    >
      <span aria-hidden="true">{{ complete ? '✓' : '○' }}</span>
      <span>{{ complete ? t('create.complete') : t('create.missing', { n: missing }) }}</span>
    </div>

    <!-- Likely class -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low">{{ t('create.likelyClass') }}</p>
        <span v-if="!complete" class="font-mono text-[10px] uppercase tracking-[0.12em] text-warn">· {{ t('create.provisional') }}</span>
      </div>
      <p class="font-display text-xl font-semibold mt-1" :class="complete ? 'text-ink-high' : 'text-ink-mid'">{{ classInfo.name }}</p>
      <p v-if="secondaryNames.length" class="mt-1 text-[12px] text-warn">
        <span aria-hidden="true">⚑</span> {{ t('create.alsoPlausibleShort', { classes: secondaryNames.join(' · ') }) }}
      </p>
    </div>

    <!-- Watch points -->
    <div class="mb-4">
      <p class="text-[13px] mb-2" :class="flagsCount ? 'text-warn' : 'text-teal'">
        {{ flagsCount ? `⚑ ${t('create.watchCount', { n: flagsCount })}` : t('create.vigNone') }}
      </p>
      <ul v-if="flagsCount" class="space-y-1">
        <li v-for="f in flags" :key="f.key" class="flex gap-1.5 text-[12.5px] text-ink-mid">
          <span class="text-warn leading-tight" aria-hidden="true">›</span><span>{{ f.title }}</span>
        </li>
      </ul>
    </div>

    <!-- Counts + CTA -->
    <div class="flex items-center gap-3 text-[12px] text-ink-low border-t border-border-subtle pt-3 mb-4">
      <span>✓ {{ itemCount }} · {{ t('create.sec3') }}</span>
      <span v-if="confirmCount">⚐ {{ confirmCount }}</span>
    </div>
    <button class="btn-primary w-full justify-center" @click="$emit('open')">{{ t('create.fullDossier') }}</button>
  </aside>
</template>
