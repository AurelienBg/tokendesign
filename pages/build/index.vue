<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => `${t('angles.build.title')} — Token Design` })
</script>

<template>
  <div>
    <div class="wrap max-w-3xl pt-8 print:hidden">
      <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
        {{ t('create.backHub') }}
      </NuxtLink>
      <h1 class="font-display text-2xl sm:text-3xl font-semibold mt-4">{{ t('build.title') }}</h1>
      <p class="text-ink-mid mt-2 max-w-xl">{{ t('build.sub') }}</p>
    </div>
    <AuthorityWizard />
  </div>
</template>
