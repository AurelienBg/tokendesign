<script setup lang="ts">
/**
 * Build-path guide (authority / custody) in the learn-guide style. Fully i18n
 * (guideBuild.*); risk/flag/XRPL substance from the bilingual content modules.
 */
import type { AuthorityLevel, AuthorityFlagKey, RiskBand } from '~/utils/authority'
import { XRPL_MAP, AUTH_FLAGS, BANDS, AUTH_CHECKLIST } from '~/utils/content/authority'

const { t, tm, rt, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

function arr(key: string): string[] {
  return (tm(key) as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
}
const toc = computed(() => arr('guideBuild.tocItems'))
const flowQ = computed(() => arr('guideBuild.flowQ'))
const flowYes = computed(() => arr('guideBuild.flowYes'))
const levelName = computed(() => arr('guideBuild.levelName'))
const levelDesc = computed(() => arr('guideBuild.levelDesc'))
const dims = computed(() => arr('guideBuild.dims'))

const levelKeys: AuthorityLevel[] = ['read', 'propose', 'authorize', 'deposit']
const flowTones = ['text-ok border-ok/40', 'text-ok border-ok/40', 'text-warn border-warn/40']
const bands: { key: RiskBand; tone: string }[] = [
  { key: 'low', tone: 'text-ok border-ok/40' },
  { key: 'medium', tone: 'text-warn border-warn/40' },
  { key: 'high', tone: 'text-danger border-danger/40' },
  { key: 'critical', tone: 'text-danger border-danger/40' }
]
const flagKeys: AuthorityFlagKey[] = ['deposit_custody', 'custodian_keys', 'blanket_broad', 'irrevocable', 'indefinite_lock']
const checklist = computed(() => Object.values(AUTH_CHECKLIST[loc.value]))
</script>

<template>
  <article>
    <header class="mb-8 max-w-2xl">
      <p class="kicker mb-3">{{ t('hub.guideBuild') }}</p>
      <h2 class="font-display text-3xl font-semibold leading-tight mb-3">{{ t('guideBuild.title') }}</h2>
      <p class="text-ink-mid leading-relaxed">{{ t('guideBuild.lead') }}</p>
    </header>

    <!-- Decision flow -->
    <section class="mb-12">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-3">{{ t('guideBuild.flowLabel') }}</p>
      <div class="flex flex-col gap-2">
        <template v-for="(q, i) in flowQ" :key="i">
          <div class="card p-3.5 flex flex-wrap items-center gap-3">
            <span class="font-mono text-[11px] text-ink-low shrink-0">{{ i + 1 }}</span>
            <span class="flex-1 min-w-[180px] text-[14px] text-ink-high">{{ q }}</span>
            <span class="font-mono text-[11px] text-ok shrink-0" aria-hidden="true">→</span>
            <span class="rounded-full border px-2.5 py-1 text-[12px] font-medium shrink-0" :class="flowTones[i]">{{ flowYes[i] }}</span>
          </div>
          <div class="text-center font-mono text-[10px] text-ink-low" aria-hidden="true">↓</div>
        </template>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[11px] text-ink-low shrink-0">→</span>
          <span class="rounded-full border border-danger/40 text-danger px-2.5 py-1 text-[12px] font-medium">{{ t('guideBuild.flowFallback') }}</span>
        </div>
      </div>
    </section>

    <!-- TOC -->
    <nav class="card p-4 mb-10">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('guideBuild.toc') }}</p>
      <ul class="grid sm:grid-cols-2 gap-1 text-[14px] text-ink-mid">
        <li v-for="(s, i) in toc" :key="i">{{ s }}</li>
      </ul>
    </nav>

    <!-- 1 · Principle -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">1</span>{{ t('guideBuild.s1') }}</h3>
      <div class="card border-l-2 border-l-info p-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-[14px] text-ink-high"><span class="mr-1.5" aria-hidden="true">💡</span><span v-html="t('guideBuild.s1body')" /></p>
      </div>
    </section>

    <!-- 2 · Authority scale -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">2</span>{{ t('guideBuild.s2') }}</h3>
      <div class="grid sm:grid-cols-4 gap-3">
        <div v-for="(k, i) in levelKeys" :key="k" class="card p-4">
          <p class="font-mono text-[11px] text-ink-low">{{ i + 1 }}</p>
          <p class="font-display text-lg font-semibold text-accent mt-1">{{ levelName[i] }}</p>
          <p class="text-[13px] text-ink-mid mt-1">{{ levelDesc[i] }}</p>
        </div>
      </div>
    </section>

    <!-- 3 · Dimensions -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">3</span>{{ t('guideBuild.s3') }}</h3>
      <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
        <div v-for="(d, i) in dims" :key="i" class="flex gap-2 text-[14px] text-ink-mid"><span class="text-accent" aria-hidden="true">·</span><span>{{ d }}</span></div>
      </div>
    </section>

    <!-- 4 · Risk & red flags -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">4</span>{{ t('guideBuild.s4') }}</h3>
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <template v-for="(b, i) in bands" :key="b.key">
          <span class="rounded-full border px-3 py-1 text-[12px] font-medium" :class="b.tone">{{ BANDS[loc][b.key].name }}</span>
          <span v-if="i < bands.length - 1" class="text-ink-low" aria-hidden="true">→</span>
        </template>
      </div>
      <div class="flex flex-col gap-2.5">
        <div v-for="k in flagKeys" :key="k" class="card border-l-2 border-l-danger p-3.5">
          <p class="font-medium text-[14px] text-ink-high"><span class="text-danger mr-1.5" aria-hidden="true">⚠️</span>{{ AUTH_FLAGS[loc][k].title }}</p>
          <p class="text-[13px] text-ink-mid mt-1 leading-relaxed">{{ AUTH_FLAGS[loc][k].body }}</p>
        </div>
      </div>
    </section>

    <!-- 5 · XRPL mapping -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">5</span>{{ t('guideBuild.s5') }}</h3>
      <div class="card border-l-2 border-l-warn p-4 mb-4">
        <p class="text-[13px] text-ink-mid"><span class="mr-1.5" aria-hidden="true">⚠️</span>{{ t('guideBuild.xrplNote') }}</p>
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="(k, i) in levelKeys" :key="k" class="rounded-lg border border-border-subtle p-3.5">
          <p class="font-medium text-[14px] text-ink-high">{{ levelName[i] }} — {{ XRPL_MAP[loc][k].title }}</p>
          <p class="text-[13px] text-ink-mid mt-0.5 mb-2">{{ XRPL_MAP[loc][k].body }}</p>
          <ul class="flex flex-col gap-1">
            <li v-for="(p, j) in XRPL_MAP[loc][k].primitives" :key="j" class="flex gap-2 text-[13px] text-ink-high"><span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ p }}</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6 · Custody checklist -->
    <section class="mb-10">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">6</span>{{ t('guideBuild.s6') }}</h3>
      <ul class="flex flex-col gap-2">
        <li v-for="(c, i) in checklist" :key="i" class="flex gap-2.5 text-[14px] text-ink-high"><span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ c }}</span></li>
      </ul>
    </section>

    <NuxtLink :to="localePath('/build')" class="btn-primary">🎯 {{ t('guideBuild.cta') }}</NuxtLink>
  </article>
</template>
