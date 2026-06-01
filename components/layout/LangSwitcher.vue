<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// `locales` may be string[] or LocaleObject[]; normalize to {code,label}.
const options = computed(() =>
  (locales.value as Array<{ code: string }>).map((l) => ({
    code: l.code,
    label: l.code.toUpperCase()
  }))
)
</script>

<template>
  <div class="fixui lang-sel px-1.5 py-1 gap-0.5">
    <NuxtLink
      v-for="opt in options"
      :key="opt.code"
      :to="switchLocalePath(opt.code as 'en' | 'fr')"
      class="px-2.5 py-1 rounded-full font-mono text-[11px] tracking-[0.1em] transition"
      :class="opt.code === locale
        ? 'bg-accent text-accent-on'
        : 'text-ink-low hover:text-accent'"
    >
      {{ opt.label }}
    </NuxtLink>
  </div>
</template>
