<script setup lang="ts">
const { t } = useI18n()

useHead({ title: () => `${t('angles.create.title')} — Token Design` })
</script>

<template>
  <CreateBoard />
</template>
