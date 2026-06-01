<script setup lang="ts">
const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="fixui theme-toggle px-3.5 py-2.5 cursor-pointer transition hover:border-accent hover:text-accent"
    :aria-label="t('controls.theme')"
    @click="toggle"
  >
    <span class="glyph text-sm leading-none" aria-hidden="true">{{ isDark ? '☀' : '◐' }}</span>
    <span class="hidden sm:inline">{{ isDark ? t('controls.light') : t('controls.dark') }}</span>
  </button>
</template>
