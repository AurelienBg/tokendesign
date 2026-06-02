<script setup lang="ts">
defineProps<{
  to: string
  glyph: string
  title: string
  desc: string
  cta: string
  available?: boolean
}>()

const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="localePath(to)"
    class="card-hover group block p-6 no-underline text-ink-high hover:-translate-y-0.5"
    :aria-disabled="available === false ? 'true' : undefined"
  >
    <div class="flex items-start justify-between gap-4">
      <span class="glyph text-2xl text-accent leading-none" aria-hidden="true">{{ glyph }}</span>
      <span
        v-if="available === false"
        class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low border border-border-subtle rounded-full px-2 py-0.5"
      >
        {{ t('angles.soon') }}
      </span>
    </div>
    <h3 class="font-display text-xl font-semibold mt-4 mb-1.5">{{ title }}</h3>
    <p class="text-sm text-ink-mid leading-relaxed">{{ desc }}</p>
    <span class="inline-block mt-4 font-mono text-xs uppercase tracking-[0.14em] text-accent group-hover:translate-x-0.5 transition-transform">
      {{ cta }} →
    </span>
  </NuxtLink>
</template>
