<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { INTAKE } from '~/utils/content/intake'
import type { Chemin } from '~/utils/engine'

defineEmits<{ (e: 'continue'): void }>()

const store = useProjectStore()
const { t, locale } = useI18n()

const def = INTAKE.chemin
const text = computed(() => def.text[locale.value === 'fr' ? 'fr' : 'en'])
</script>

<template>
  <section class="wrap py-12 sm:py-16">
    <p class="kicker mb-3">{{ t('create.forkH') }}</p>
    <p class="text-ink-mid mb-8 max-w-xl">{{ t('create.forkSub') }}</p>

    <div class="mb-2 flex items-baseline gap-2">
      <span class="text-base font-medium text-ink-high">{{ text.label }}</span>
      <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">{{ t('create.multiTag') }}</span>
    </div>
    <p v-if="text.hint" class="text-[13px] text-ink-low mb-4">{{ text.hint }}</p>

    <div class="grid gap-2 sm:grid-cols-2">
      <OptionButton
        v-for="value in def.order"
        :key="value"
        :title="text.options[value]!.title"
        :example="text.options[value]!.example"
        :selected="store.chemin.includes(value as Chemin)"
        multi
        @select="store.toggleChemin(value as Chemin)"
      />
    </div>

    <div class="mt-8 flex justify-end">
      <button class="btn-primary disabled:opacity-40 disabled:pointer-events-none"
              :disabled="store.chemin.length === 0"
              @click="$emit('continue')">
        {{ t('create.btnContinue') }}
      </button>
    </div>
  </section>
</template>
