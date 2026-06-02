<script setup lang="ts">
/**
 * /resources — INTERNAL design sandbox (not linked from the hub).
 *  1. Intake mockup in "configurator style" (label + pills), local-only state.
 *  2. Interactive decision-tree explorer: classify rules expand to their
 *     obligations, red flags expand to their explanation (bilingual content).
 */
import { INTAKE, BLOCK_B1, BLOCK_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'
import type { TokenClass, RedFlagKey } from '~/utils/engine'
import type { AuthorityLevel, AuthorityFlagKey } from '~/utils/authority'
import { CLASSES } from '~/utils/content/classes'
import { REDFLAGS } from '~/utils/content/redflags'
import { AUTH_FLAGS, XRPL_MAP } from '~/utils/content/authority'

const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
const localePath = useLocalePath()
useHead({ title: 'Resources (sandbox) — Token Design' })

// ---- Mockup local state (isolated from the real stores) ----
const ans = reactive<Record<string, string | string[]>>({ fonctions: [], droits: [] })
function selected(k: QuestionKey): string | string[] | null {
  return (ans[k] as string | string[] | undefined) ?? null
}
function toggle(k: QuestionKey, v: string) {
  if (INTAKE[k].type === 'multi') {
    const arr = (ans[k] ??= []) as string[]
    const i = arr.indexOf(v)
    if (i >= 0) arr.splice(i, 1)
    else arr.push(v)
  } else {
    ans[k] = ans[k] === v ? '' : v
  }
}
const b1 = BLOCK_B1
const b2 = BLOCK_B2

// ---- Interactive decision tree ----
const classRules: { n: number; cls: TokenClass; cond: string; tone: string }[] = [
  { n: 1, cls: 'instrument', cond: 'rights include “revenues”  OR  (claim + financial underlying)', tone: 'text-danger' },
  { n: 2, cls: 'nft', cond: 'fungibility = non-fungible / semi', tone: 'text-info' },
  { n: 3, cls: 'emt', cond: 'stability target = single official currency', tone: 'text-accent' },
  { n: 4, cls: 'art', cond: 'stability target = basket / crypto', tone: 'text-accent' },
  { n: 5, cls: 'utility', cond: 'otherwise (fallback)', tone: 'text-ok' }
]
const redFlags: { key: RedFlagKey; trigger: string }[] = [
  { key: 'limbo', trigger: 'stable target + diffuse/absent debtor' },
  { key: 'security', trigger: 'utility/NFT + promised gain' },
  { key: 'algo', trigger: 'stable target + no reserve' },
  { key: 'nftserie', trigger: 'NFT as series / investment-geared' },
  { key: 'retail', trigger: 'heavy class + retail distribution' },
  { key: 'custody', trigger: 'you hold users’ funds/keys' },
  { key: 'juridiction', trigger: 'outside the EU' },
  { key: 'incoherence', trigger: 'native + debtor/reserve' }
]
const stages = ['Conception', 'Issuance', 'Distribution', 'Life', 'End']

// Default: everything expanded (the full tree is visible at a glance);
// click a row to collapse/expand it.
const openClasses = reactive(new Set<TokenClass>(classRules.map((r) => r.cls)))
const openFlags = reactive(new Set<RedFlagKey>(redFlags.map((f) => f.key)))
function toggleClass(c: TokenClass) {
  if (openClasses.has(c)) openClasses.delete(c)
  else openClasses.add(c)
}
function toggleFlag(k: RedFlagKey) {
  if (openFlags.has(k)) openFlags.delete(k)
  else openFlags.add(k)
}

// ---- Build path (authority) tree ----
const authLevels: { key: AuthorityLevel; cond: string }[] = [
  { key: 'read', cond: 'observe balances / history — no action' },
  { key: 'propose', cond: 'build a tx; the user signs each one' },
  { key: 'authorize', cond: 'act within delegated limits' },
  { key: 'deposit', cond: 'users send assets to an account you control' }
]
const authLevelName: Record<AuthorityLevel, string> = {
  read: 'Read', propose: 'Propose', authorize: 'Authorize', deposit: 'Hold / deposit'
}
const authDimensions = [
  'Scope — narrow ↔ broad',
  'Duration — one-shot ↔ indefinite',
  'Revocability — user ↔ irrevocable',
  'Consent — per-action ↔ blanket',
  'Key-holder — user ↔ you (custodian)'
]
const riskBands: { key: 'low' | 'medium' | 'high' | 'critical'; label: string; tone: string }[] = [
  { key: 'low', label: 'Low', tone: 'text-ok border-ok/40' },
  { key: 'medium', label: 'Medium', tone: 'text-warn border-warn/40' },
  { key: 'high', label: 'High', tone: 'text-danger border-danger/40' },
  { key: 'critical', label: 'Critical', tone: 'text-danger border-danger/40' }
]
const authFlags: { key: AuthorityFlagKey; trigger: string }[] = [
  { key: 'deposit_custody', trigger: 'level = deposit (you carry users’ funds)' },
  { key: 'custodian_keys', trigger: 'you hold users’ keys' },
  { key: 'blanket_broad', trigger: 'blanket consent + broad scope' },
  { key: 'irrevocable', trigger: 'authority the user can’t revoke' },
  { key: 'indefinite_lock', trigger: 'indefinite + not user-revocable' }
]
const openLevels = reactive(new Set<AuthorityLevel>(authLevels.map((l) => l.key)))
const openAuthFlags = reactive(new Set<AuthorityFlagKey>(authFlags.map((f) => f.key)))
function toggleLevel(k: AuthorityLevel) {
  if (openLevels.has(k)) openLevels.delete(k)
  else openLevels.add(k)
}
function toggleAuthFlag(k: AuthorityFlagKey) {
  if (openAuthFlags.has(k)) openAuthFlags.delete(k)
  else openAuthFlags.add(k)
}
</script>

<template>
  <main class="wrap max-w-5xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('create.backHub') }}
    </NuxtLink>

    <div class="card border-l-2 border-l-warn p-3.5 mt-4 mb-10">
      <p class="text-[13px] text-ink-mid"><span class="glyph text-warn mr-1.5" aria-hidden="true">⚑</span>Internal design sandbox — not linked from the hub. UI explorations &amp; engine map.</p>
    </div>

    <!-- ── 1. Intake mockup — configurator style ──────────────── -->
    <section class="mb-16">
      <p class="kicker mb-2">Mockup · configurator style</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Intake — label + pills, 2 columns</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">Local-only mockup to judge the layout. Selections here do nothing.</p>

      <div class="card p-6 mb-5">
        <p class="kicker mb-5">Identity</p>
        <div class="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <MockField v-for="k in b1" :key="k" :question-key="k" :selected="selected(k)" @toggle="(v) => toggle(k, v)" />
        </div>
      </div>
      <div class="card p-6">
        <p class="kicker mb-5">Launch</p>
        <div class="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <MockField v-for="k in b2" :key="k" :question-key="k" :selected="selected(k)" @toggle="(v) => toggle(k, v)" />
        </div>
      </div>
    </section>

    <!-- ── 2. Decision tree (interactive) ─────────────────────── -->
    <section>
      <p class="kicker mb-2">Engine map · Frame</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Frame a token — decision tree</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">Click a class to see its obligations, a red flag to see why. Not legal advice.</p>

      <div class="flex flex-col items-stretch gap-3">
        <!-- A.1 -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-1">A.1 · prudent defaults</p>
          <p class="text-[14px] text-ink-mid">Unanswered axes → conservative assumption, tagged “to confirm”.</p>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- A.2 classify (clickable) -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-3">A.2 · classify — first match wins</p>
          <ol class="flex flex-col gap-1.5">
            <li v-for="r in classRules" :key="r.cls">
              <button
                type="button"
                class="flex w-full items-center gap-3 text-left text-[14px] rounded-lg px-2 py-1.5 hover:bg-bg-elevated transition-colors"
                :aria-expanded="openClasses.has(r.cls)"
                @click="toggleClass(r.cls)"
              >
                <span class="font-mono text-[11px] text-ink-low">{{ r.n }}</span>
                <span class="text-ink-mid flex-1">{{ r.cond }}</span>
                <span class="font-mono text-ink-low" aria-hidden="true">→</span>
                <span class="font-semibold w-28 shrink-0" :class="r.tone">{{ CLASSES[loc][r.cls].name }}</span>
                <span class="text-ink-low text-[11px]" aria-hidden="true">{{ openClasses.has(r.cls) ? '▾' : '▸' }}</span>
              </button>
              <div v-if="openClasses.has(r.cls)" class="ml-7 mt-1 mb-2 rounded-lg border border-border-subtle bg-bg-elevated/50 p-3">
                <p class="text-[13px] text-ink-mid mb-2">{{ CLASSES[loc][r.cls].reg }}</p>
                <ul class="flex flex-col gap-1.5">
                  <li v-for="(o, i) in CLASSES[loc][r.cls].obl" :key="i" class="flex gap-2 text-[13px] text-ink-high">
                    <span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ o }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ol>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- A.3 red flags (clickable) -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-warn mb-3">A.3 · red flags — cumulative overlays</p>
          <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1">
            <div v-for="f in redFlags" :key="f.key">
              <button
                type="button"
                class="flex w-full items-start gap-2 text-left text-[13px] rounded-lg px-2 py-1.5 hover:bg-bg-elevated transition-colors"
                :aria-expanded="openFlags.has(f.key)"
                @click="toggleFlag(f.key)"
              >
                <span class="text-warn" aria-hidden="true">⚑</span>
                <span class="flex-1"><span class="font-mono text-[11px] text-ink-low">{{ f.key }}</span> — <span class="text-ink-mid">{{ f.trigger }}</span></span>
                <span class="text-ink-low text-[11px]" aria-hidden="true">{{ openFlags.has(f.key) ? '▾' : '▸' }}</span>
              </button>
              <div v-if="openFlags.has(f.key)" class="ml-6 mb-2 rounded-lg border border-border-subtle bg-bg-elevated/50 p-3">
                <p class="text-[13px] font-medium text-ink-high mb-1">{{ REDFLAGS[loc][f.key].title }}</p>
                <p class="text-[13px] text-ink-mid leading-relaxed">{{ REDFLAGS[loc][f.key].body }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- D checklist -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ok mb-3">D · launch checklist — lifecycle, filtered by class + ratchets</p>
          <div class="flex flex-wrap items-center gap-2">
            <template v-for="(s, i) in stages" :key="s">
              <span class="rounded-md border border-border-subtle px-3 py-1.5 text-[13px] text-ink-high">{{ s }}</span>
              <span v-if="i < stages.length - 1" class="text-ink-low" aria-hidden="true">→</span>
            </template>
          </div>
          <p class="text-[12px] text-ink-low mt-3">Ratchets (points of no return): authorization-before-issuance · retail marketing · taking custody.</p>
        </div>
      </div>
    </section>

    <!-- ── 3. Build path (authority) tree ─────────────────────── -->
    <section class="mt-16">
      <p class="kicker mb-2">Engine map · Build</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Build an app — authority tree</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">For apps acting on users' assets: how much power you take → risk → custody. Click a level for its XRPL mapping, a red flag for why. Not legal advice.</p>

      <div class="flex flex-col items-stretch gap-3">
        <!-- B.1 authority scale -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-3">B.1 · authority scale (escalating)</p>
          <div class="flex flex-col gap-1.5">
            <div v-for="(l, i) in authLevels" :key="l.key">
              <button
                type="button"
                class="flex w-full items-center gap-3 text-left text-[14px] rounded-lg px-2 py-1.5 hover:bg-bg-elevated transition-colors"
                :aria-expanded="openLevels.has(l.key)"
                @click="toggleLevel(l.key)"
              >
                <span class="font-mono text-[11px] text-ink-low">{{ i + 1 }}</span>
                <span class="font-semibold w-28 shrink-0 text-ink-high">{{ authLevelName[l.key] }}</span>
                <span class="text-ink-mid flex-1">{{ l.cond }}</span>
                <span class="text-ink-low text-[11px]" aria-hidden="true">{{ openLevels.has(l.key) ? '▾' : '▸' }}</span>
              </button>
              <div v-if="openLevels.has(l.key)" class="ml-7 mt-1 mb-2 rounded-lg border border-border-subtle bg-bg-elevated/50 p-3">
                <p class="text-[13px] font-medium text-ink-high mb-1">{{ XRPL_MAP[loc][l.key].title }}</p>
                <p class="text-[13px] text-ink-mid leading-relaxed mb-2">{{ XRPL_MAP[loc][l.key].body }}</p>
                <ul class="flex flex-col gap-1">
                  <li v-for="(p, j) in XRPL_MAP[loc][l.key].primitives" :key="j" class="flex gap-2 text-[13px] text-ink-high">
                    <span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ p }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- B.2 dimensions -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-accent mb-3">B.2 · dimensions (cross the authority)</p>
          <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
            <div v-for="d in authDimensions" :key="d" class="flex gap-2 text-[13px] text-ink-mid">
              <span class="text-accent" aria-hidden="true">·</span><span>{{ d }}</span>
            </div>
          </div>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- B.3 risk band -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-warn mb-3">B.3 · risk band</p>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <template v-for="(b, i) in riskBands" :key="b.key">
              <span class="rounded-full border px-3 py-1 text-[12px] font-medium" :class="b.tone">{{ b.label }}</span>
              <span v-if="i < riskBands.length - 1" class="text-ink-low" aria-hidden="true">→</span>
            </template>
          </div>
          <p class="text-[12px] text-ink-low">Score = level base + escalators (custody +2 · shared +1 · blanket&amp;broad +1 · irrevocable +2 · issuer +1 · indefinite&amp;non-user +1).</p>
        </div>
        <div class="text-center text-ink-low" aria-hidden="true">↓</div>

        <!-- B.4 authority red flags -->
        <div class="card p-4">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-danger mb-3">B.4 · authority red flags → custody checklist</p>
          <div class="flex flex-col gap-1">
            <div v-for="f in authFlags" :key="f.key">
              <button
                type="button"
                class="flex w-full items-start gap-2 text-left text-[13px] rounded-lg px-2 py-1.5 hover:bg-bg-elevated transition-colors"
                :aria-expanded="openAuthFlags.has(f.key)"
                @click="toggleAuthFlag(f.key)"
              >
                <span class="text-danger" aria-hidden="true">!</span>
                <span class="flex-1"><span class="font-mono text-[11px] text-ink-low">{{ f.key }}</span> — <span class="text-ink-mid">{{ f.trigger }}</span></span>
                <span class="text-ink-low text-[11px]" aria-hidden="true">{{ openAuthFlags.has(f.key) ? '▾' : '▸' }}</span>
              </button>
              <div v-if="openAuthFlags.has(f.key)" class="ml-6 mb-2 rounded-lg border border-border-subtle bg-bg-elevated/50 p-3">
                <p class="text-[13px] font-medium text-ink-high mb-1">{{ AUTH_FLAGS[loc][f.key].title }}</p>
                <p class="text-[13px] text-ink-mid leading-relaxed">{{ AUTH_FLAGS[loc][f.key].body }}</p>
              </div>
            </div>
          </div>
          <p class="text-[12px] text-ink-low mt-3">Custody checklist: segregation · no rehypothecation · key mgmt · revocation UX · CASP status. XLS-75 Permission Delegation: <span class="text-warn">proposed, not yet live on mainnet</span>.</p>
        </div>
      </div>
    </section>
  </main>
</template>
