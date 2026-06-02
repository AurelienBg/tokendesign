<script setup lang="ts">
const { t } = useI18n()

useHead({ title: () => `${t('angles.analyze.title')} — Token Design` })
</script>

<template>
  <AnalyzeWizard />
</template>
