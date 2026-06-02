<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const angles = [
  { key: 'create', to: '/create', glyph: '◈', available: true },
  { key: 'build', to: '/build', glyph: '⬡', available: true }
] as const
</script>

<template>
  <div class="wrap max-w-5xl py-16 sm:py-24">
    <!-- Hero -->
    <section class="max-w-2xl">
      <p class="kicker mb-4">{{ t('hub.kicker') }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <h1 class="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-5" v-html="t('hub.title')" />
      <p class="text-lg text-ink-mid leading-relaxed">{{ t('hub.subtitle') }}</p>
    </section>

    <!-- Angles -->
    <section class="mt-14">
      <p class="font-mono text-xs uppercase tracking-[0.16em] text-ink-low mb-4">
        {{ t('hub.chooseAngle') }}
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <AngleCard
          v-for="a in angles"
          :key="a.key"
          :to="a.to"
          :glyph="a.glyph"
          :available="a.available"
          :title="t(`angles.${a.key}.title`)"
          :desc="t(`angles.${a.key}.desc`)"
          :cta="t(`angles.${a.key}.cta`)"
        />
      </div>
      <NuxtLink
        :to="localePath('/configurator')"
        class="inline-flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
      >
        <span class="glyph text-accent" aria-hidden="true">⊞</span>{{ t('configurator.fromCreate') }}
      </NuxtLink>
    </section>

    <!-- Disclaimer -->
    <section class="mt-16 max-w-2xl">
      <div class="card border-l-2 border-l-warn p-4 text-sm text-ink-mid">
        <span class="glyph text-warn mr-2" aria-hidden="true">⚖</span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="t('hub.disclaimer')" />
      </div>
    </section>
  </div>
</template>
