<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <span class="inline-flex items-center gap-2 select-none">
    <span class="glyph text-accent text-lg leading-none" aria-hidden="true">◈</span>
    <span class="font-display text-lg font-semibold tracking-tight">{{ t('app.name') }}</span>
  </span>
</template>
