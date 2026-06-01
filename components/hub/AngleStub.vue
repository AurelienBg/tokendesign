<script setup lang="ts">
defineProps<{
  glyph: string
  title: string
  desc: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="wrap py-20">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('stub.back') }}
    </NuxtLink>

    <div class="mt-8 flex items-center gap-3">
      <span class="glyph text-3xl text-accent leading-none" aria-hidden="true">{{ glyph }}</span>
      <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low border border-border-subtle rounded-full px-2 py-0.5">
        {{ t('stub.badge') }}
      </span>
    </div>

    <h1 class="font-display text-3xl sm:text-4xl font-semibold mt-4 mb-3">{{ title }}</h1>
    <p class="text-ink-mid max-w-xl leading-relaxed">{{ desc }}</p>

    <p class="mt-6 text-sm text-ink-low max-w-xl">
      <i18n-t keypath="stub.body" tag="span" scope="global">
        <template #engine>
          <code class="font-mono text-accent">utils/engine.ts</code>
        </template>
      </i18n-t>
    </p>
  </div>
</template>
