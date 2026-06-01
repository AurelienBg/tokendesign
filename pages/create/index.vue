<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => `${t('angles.create.title')} — Token Design` })
</script>

<template>
  <div>
    <div class="wrap max-w-3xl pt-8 print:hidden">
      <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
        {{ t('create.backHub') }}
      </NuxtLink>
    </div>
    <CreateWizard />
  </div>
</template>
