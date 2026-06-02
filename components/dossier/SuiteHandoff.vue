<script setup lang="ts">
/**
 * Suite hand-off — Token Design is the high-level framing/triage step. From the
 * dossier we point to the deeper apps of the suite (Grounds upstream, then
 * Tokenlab / Regul8). External links, opened in a new tab.
 */
const { t } = useI18n()

const apps = [
  { key: 'canvas', href: 'https://groundscoach.vercel.app', glyph: '◳' },
  { key: 'tokenomics', href: 'https://tokenlabapp.vercel.app', glyph: '◈' },
  { key: 'regulation', href: 'https://regul8app.vercel.app', glyph: '⚖' }
] as const
</script>

<template>
  <section class="border-t border-border-subtle pt-6 mt-8 print:hidden">
    <p class="kicker mb-2">{{ t('create.deeper.kicker') }}</p>
    <h3 class="font-display text-xl font-semibold mb-1">{{ t('create.deeper.title') }}</h3>
    <p class="text-ink-mid text-sm mb-5 max-w-2xl">{{ t('create.deeper.intro') }}</p>

    <div class="grid gap-3 sm:grid-cols-3">
      <a
        v-for="a in apps"
        :key="a.key"
        :href="a.href"
        target="_blank"
        rel="noopener"
        class="card-hover block p-4 no-underline text-ink-high hover:-translate-y-0.5"
      >
        <span class="glyph text-xl text-accent" aria-hidden="true">{{ a.glyph }}</span>
        <h4 class="font-medium mt-2">{{ t(`create.deeper.${a.key}`) }}</h4>
        <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ t(`create.deeper.${a.key}Desc`) }}</p>
        <span class="inline-block mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{{ t('create.deeper.open') }} ↗</span>
      </a>
    </div>

    <p class="text-[12px] text-ink-low mt-4">{{ t('create.deeper.note') }}</p>
  </section>
</template>
