<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => `${t('angles.analyze.title')} — Token Design` })
</script>

<template>
  <div>
    <div class="wrap max-w-3xl pt-8 print:hidden">
      <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
        {{ t('create.backHub') }}
      </NuxtLink>
      <h1 class="font-display text-2xl sm:text-3xl font-semibold mt-4">{{ t('analyze.title') }}</h1>
      <p class="text-ink-mid mt-2 max-w-xl">{{ t('analyze.sub') }}</p>
    </div>
    <AnalyzeWizard />
  </div>
</template>
