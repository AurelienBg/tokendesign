<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => `${t('configurator.kicker')} — Token Design` })

const constraints = [
  { badge: 'forbidden', tone: 'text-danger border-danger/40', key: 'c1' },
  { badge: 'empty', tone: 'text-warn border-warn/40', key: 'c2' },
  { badge: 'valid', tone: 'text-ok border-ok/40', key: 'c3' },
  { badge: 'rule', tone: 'text-info border-info/40', key: 'c4' },
  { badge: 'rule', tone: 'text-info border-info/40', key: 'c5' }
] as const
</script>

<template>
  <div class="wrap max-w-4xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('configurator.backHub') }}
    </NuxtLink>

    <!-- Intro -->
    <header class="mt-6 mb-12 max-w-2xl">
      <p class="kicker mb-3">{{ t('configurator.kicker') }}</p>
      <h1 class="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-4">{{ t('configurator.title') }}</h1>
      <p class="text-lg text-ink-mid leading-relaxed">{{ t('configurator.sub') }}</p>
    </header>

    <!-- 01 Principle -->
    <section class="mb-12">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="card p-5">
          <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent block mb-2">{{ t('configurator.principle.tag1') }}</span>
          <h3 class="font-display text-lg font-semibold mb-2">{{ t('configurator.principle.h1') }}</h3>
          <p class="text-sm text-ink-mid leading-relaxed">{{ t('configurator.principle.p1') }}</p>
        </div>
        <div class="card p-5">
          <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent block mb-2">{{ t('configurator.principle.tag2') }}</span>
          <h3 class="font-display text-lg font-semibold mb-2">{{ t('configurator.principle.h2') }}</h3>
          <p class="text-sm text-ink-mid leading-relaxed">{{ t('configurator.principle.p2') }}</p>
        </div>
      </div>

      <div class="card p-5 mt-4">
        <h3 class="font-display text-lg font-semibold mb-1">{{ t('configurator.principle.calloutH') }}</h3>
        <p class="text-sm text-ink-mid leading-relaxed mb-4">{{ t('configurator.principle.calloutP') }}</p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-lg border border-border-subtle p-4">
            <span class="font-mono text-[10px] text-accent">A4</span>
            <h4 class="font-medium mt-1 mb-1">{{ t('configurator.principle.debtorH') }}</h4>
            <p class="text-[13px] text-ink-mid leading-relaxed">{{ t('configurator.principle.debtorP') }}</p>
          </div>
          <div class="rounded-lg border border-border-subtle p-4">
            <span class="font-mono text-[10px] text-accent">A5</span>
            <h4 class="font-medium mt-1 mb-1">{{ t('configurator.principle.guarantorH') }}</h4>
            <p class="text-[13px] text-ink-mid leading-relaxed">{{ t('configurator.principle.guarantorP') }}</p>
          </div>
        </div>
        <p class="text-[13px] text-ink-low leading-relaxed border-t border-border-subtle mt-4 pt-3">{{ t('configurator.principle.example') }}</p>
      </div>
    </section>

    <!-- 02 Constraints -->
    <section class="mb-12">
      <h2 class="font-display text-xl font-semibold mb-1">{{ t('configurator.constraintsH') }}</h2>
      <p class="text-ink-mid text-sm mb-5 max-w-2xl">{{ t('configurator.constraintsSub') }}</p>
      <div class="flex flex-col gap-2.5">
        <div v-for="c in constraints" :key="c.key" class="flex items-start gap-3 card p-3.5">
          <span class="font-mono text-[10px] uppercase tracking-[0.1em] border rounded-full px-2 py-0.5 shrink-0 mt-0.5" :class="c.tone">
            {{ t(`configurator.con.${c.badge}`) }}
          </span>
          <p class="text-[14px] text-ink-mid leading-relaxed">{{ t(`configurator.con.${c.key}`) }}</p>
        </div>
      </div>
    </section>

    <!-- Library -->
    <!-- (The live axis configurator now lives in the Frame flow.) -->
    <section>
      <h2 class="font-display text-xl font-semibold mb-1">{{ t('configurator.libraryH') }}</h2>
      <p class="text-ink-mid text-sm mb-5 max-w-2xl">{{ t('configurator.librarySub') }}</p>
      <ReferenceLibrary />
    </section>
  </div>
</template>
