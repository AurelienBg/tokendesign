<script setup lang="ts">
/**
 * Build-path guide (authority / custody) in the same learn-guide style.
 * Substance from bilingual content; connective prose EN for now (sandbox).
 */
import type { AuthorityLevel, AuthorityFlagKey, RiskBand } from '~/utils/authority'
import { XRPL_MAP, AUTH_FLAGS, BANDS, AUTH_CHECKLIST } from '~/utils/content/authority'

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const toc = ['1 · The principle', '2 · Authority scale', '3 · Dimensions', '4 · Risk & red flags', '5 · XRPL mapping', '6 · Custody checklist']

const levels: { key: AuthorityLevel; name: string; desc: string }[] = [
  { key: 'read', name: 'Read', desc: 'observe — no action' },
  { key: 'propose', name: 'Propose', desc: 'user signs each tx' },
  { key: 'authorize', name: 'Authorize', desc: 'act within limits' },
  { key: 'deposit', name: 'Hold / deposit', desc: 'you control the funds' }
]
const dims = [
  'Scope — narrow ↔ broad',
  'Duration — one-shot ↔ indefinite',
  'Revocability — user ↔ irrevocable',
  'Consent — per-action ↔ blanket',
  'Key-holder — user ↔ you (custodian)'
]
const bands: { key: RiskBand; tone: string }[] = [
  { key: 'low', tone: 'text-ok border-ok/40' },
  { key: 'medium', tone: 'text-warn border-warn/40' },
  { key: 'high', tone: 'text-danger border-danger/40' },
  { key: 'critical', tone: 'text-danger border-danger/40' }
]
const flagKeys: AuthorityFlagKey[] = ['deposit_custody', 'custodian_keys', 'blanket_broad', 'irrevocable', 'indefinite_lock']
const checklist = computed(() => Object.values(AUTH_CHECKLIST[loc.value]))

// Branching flow — escalating authority.
const flow: { q: string; yes: string; tone: string }[] = [
  { q: 'Only reads balances / history (no action)?', yes: 'Read — low', tone: 'text-ok border-ok/40' },
  { q: 'Only builds transactions the user signs themselves?', yes: 'Propose — low', tone: 'text-ok border-ok/40' },
  { q: 'Acts within limits the user delegated (user keeps the keys)?', yes: 'Authorize — medium+', tone: 'text-warn border-warn/40' }
]
const flowFallback = { label: 'Hold / deposit — custody (high–critical)', tone: 'text-danger border-danger/40' }
</script>

<template>
  <article>
    <header class="mb-8 max-w-2xl">
      <p class="kicker mb-3">Guide · Build an app</p>
      <h2 class="font-display text-3xl font-semibold leading-tight mb-3">Power over users' assets → risk & custody</h2>
      <p class="text-ink-mid leading-relaxed">For apps that act on users' tokens, the question isn't the token's class but how much <b>authority</b> you take over the wallet — with what reversibility, and who holds the keys. Not legal advice.</p>
    </header>

    <!-- Decision flow (escalating authority) -->
    <section class="mb-12">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-3">Decision flow — escalating authority</p>
      <div class="flex flex-col gap-2">
        <template v-for="(n, i) in flow" :key="i">
          <div class="card p-3.5 flex flex-wrap items-center gap-3">
            <span class="font-mono text-[11px] text-ink-low shrink-0">{{ i + 1 }}</span>
            <span class="flex-1 min-w-[180px] text-[14px] text-ink-high">{{ n.q }}</span>
            <span class="font-mono text-[11px] text-ok shrink-0" aria-hidden="true">→ yes</span>
            <span class="rounded-full border px-2.5 py-1 text-[12px] font-medium shrink-0" :class="n.tone">{{ n.yes }}</span>
          </div>
          <div class="text-center font-mono text-[10px] text-ink-low" aria-hidden="true">↓ no</div>
        </template>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[11px] text-ink-low shrink-0">→</span>
          <span class="rounded-full border px-2.5 py-1 text-[12px] font-medium" :class="flowFallback.tone">{{ flowFallback.label }}</span>
        </div>
      </div>
    </section>

    <nav class="card p-4 mb-10">
      <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low mb-2">In this guide</p>
      <ul class="grid sm:grid-cols-2 gap-1 text-[14px] text-ink-mid">
        <li v-for="s in toc" :key="s">{{ s }}</li>
      </ul>
    </nav>

    <!-- 1 · Principle -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">1</span>The principle</h3>
      <div class="card border-l-2 border-l-info p-4">
        <p class="text-[14px] text-ink-high"><span class="mr-1.5" aria-hidden="true">💡</span>“Issuer” isn't the question. <b>Authority</b> is: the more power you take over users' assets — and the less they can revoke it — the heavier your obligations (segregation, CASP/custody regimes).</p>
      </div>
    </section>

    <!-- 2 · Authority scale -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">2</span>Authority scale (escalating)</h3>
      <div class="grid sm:grid-cols-4 gap-3">
        <div v-for="(l, i) in levels" :key="l.key" class="card p-4">
          <p class="font-mono text-[11px] text-ink-low">{{ i + 1 }}</p>
          <p class="font-display text-lg font-semibold text-accent mt-1">{{ l.name }}</p>
          <p class="text-[13px] text-ink-mid mt-1">{{ l.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 3 · Dimensions -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">3</span>Dimensions</h3>
      <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
        <div v-for="d in dims" :key="d" class="flex gap-2 text-[14px] text-ink-mid"><span class="text-accent" aria-hidden="true">·</span><span>{{ d }}</span></div>
      </div>
    </section>

    <!-- 4 · Risk & red flags -->
    <section class="mb-12">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">4</span>Risk &amp; red flags</h3>
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
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">5</span>XRPL mapping</h3>
      <div class="card border-l-2 border-l-warn p-4 mb-4">
        <p class="text-[13px] text-ink-mid"><span class="mr-1.5" aria-hidden="true">⚠️</span>XRPL has no ERC-20 blanket <code>approve</code>. Prefer native, ledger-enforced objects. <b>Permission Delegation (XLS-75) is proposed, not yet live on mainnet.</b></p>
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="l in levels" :key="l.key" class="rounded-lg border border-border-subtle p-3.5">
          <p class="font-medium text-[14px] text-ink-high">{{ l.name }} — {{ XRPL_MAP[loc][l.key].title }}</p>
          <p class="text-[13px] text-ink-mid mt-0.5 mb-2">{{ XRPL_MAP[loc][l.key].body }}</p>
          <ul class="flex flex-col gap-1">
            <li v-for="(p, j) in XRPL_MAP[loc][l.key].primitives" :key="j" class="flex gap-2 text-[13px] text-ink-high"><span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ p }}</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6 · Custody checklist -->
    <section class="mb-10">
      <h3 class="font-display text-xl font-semibold mb-3"><span class="font-mono text-sm text-ink-low mr-2">6</span>Custody checklist</h3>
      <ul class="flex flex-col gap-2">
        <li v-for="(c, i) in checklist" :key="i" class="flex gap-2.5 text-[14px] text-ink-high"><span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ c }}</span></li>
      </ul>
    </section>

    <NuxtLink :to="localePath('/build')" class="btn-primary">🎯 Assess your app →</NuxtLink>
  </article>
</template>
