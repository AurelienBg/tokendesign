<script setup lang="ts">
defineEmits<{ (e: 'back'): void }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="wrap py-12 sm:py-16 max-w-2xl">
    <div class="flex items-center gap-3 mb-4">
      <span class="glyph text-2xl text-accent leading-none" aria-hidden="true">⬡</span>
      <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low border border-border-subtle rounded-full px-2 py-0.5">
        {{ t('create.autresBadge') }}
      </span>
    </div>

    <h1 class="font-display text-2xl sm:text-3xl font-semibold mb-2">{{ t('create.autresH') }}</h1>
    <p class="text-accent font-medium mb-5">{{ t('create.autresT') }}</p>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-ink-mid leading-relaxed mb-4" v-html="t('create.autresP1')" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-ink-mid leading-relaxed" v-html="t('create.autresP2')" />

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button class="btn-ghost" @click="$emit('back')">{{ t('create.btnBack') }}</button>
      <NuxtLink :to="localePath('/build')" class="btn-primary no-underline">{{ t('angles.build.title') }} →</NuxtLink>
    </div>
  </section>
</template>
