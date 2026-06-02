<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useHead({ title: () => `${t('hub.guideBuild')} — Token Design` })
</script>

<template>
  <main class="wrap max-w-4xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('create.backHub') }}
    </NuxtLink>
    <div class="mt-6">
      <BuildGuide />
    </div>
  </main>
</template>
