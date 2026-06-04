<script setup lang="ts">
/**
 * /overview — "Work map": the macro picture of the project, ported from
 * carte-travail.html into the 7powers design system, bilingual.
 */
import {
  PILLARS, SPINE, JOURNEY, TRANSVERSE_NOTE, SUITE,
  LOOP_NODES, LOOP_CAPTION, LIFECYCLE, LIFECYCLE_CAPTION, type AppColor
} from '~/utils/content/overview'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
useHead({ title: () => `${t('overview.title')} — Token Design` })

const spineX = (i: number) => 18 + i * 38.4

const TAG: Record<AppColor, string> = {
  host: 'border-accent/50 text-accent',
  regul8: 'border-ok/50 text-ok',
  tokenlab: 'border-warn/50 text-warn',
  transverse: 'border-border-accent text-ink-low'
}
const NUM: Record<string, string> = {
  host: 'border-accent text-accent',
  regul8: 'border-ok text-ok',
  tokenlab: 'border-warn text-warn',
  gate: 'border-warn text-warn bg-warn/10 rounded-full',
  plain: 'border-border-accent text-ink-low'
}
const LEFT: Record<AppColor, string> = {
  host: 'border-l-accent', regul8: 'border-l-ok', tokenlab: 'border-l-warn', transverse: 'border-l-border-accent'
}
const DOT: Record<AppColor, string> = {
  host: 'bg-accent', regul8: 'bg-ok', tokenlab: 'bg-warn', transverse: 'bg-ink-low'
}

/** Numbered (non-gate) journey steps where a suite app intervenes. */
function stepsFor(appName: string): string[] {
  const ns: string[] = []
  for (const s of JOURNEY) {
    if (s.kind === 'gate') continue
    if (s.apps.some((a) => a.name === appName || a.name.startsWith(appName + ' '))) ns.push(s.n)
  }
  return ns
}

const toc = [
  { id: 's1', n: '01', key: 'tocMacro' },
  { id: 's2', n: '02', key: 'tocSuite' },
  { id: 's3', n: '03', key: 'tocLoop' },
  { id: 's4', n: '04', key: 'tocLifecycle' }
] as const
</script>

<template>
  <div class="wrap max-w-4xl py-8 sm:py-10 overview">
    <NuxtLink
      :to="localePath('/')"
      class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
    >{{ t('create.backHub') }}</NuxtLink>

    <header class="mt-4 mb-8">
      <p class="kicker">{{ t('overview.kicker') }}</p>
      <h1 class="font-display text-3xl sm:text-4xl font-semibold mt-2">{{ t('overview.title') }}</h1>
      <p class="text-ink-mid mt-3 max-w-2xl">{{ t('overview.intro') }}</p>
      <nav class="flex flex-wrap gap-2 mt-5">
        <a
          v-for="x in toc" :key="x.id" :href="`#${x.id}`"
          class="inline-flex items-baseline gap-1.5 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-1.5 font-mono text-[12px] text-ink-mid hover:border-accent hover:text-accent no-underline transition-colors"
        ><span class="text-accent text-[11px]">{{ x.n }}</span>{{ t(`overview.${x.key}`) }}</a>
      </nav>
    </header>

    <!-- ── 01 · Macro journey ── -->
    <section id="s1" class="border-t border-border-subtle py-8 scroll-mt-20">
      <div class="flex items-baseline gap-3 mb-1.5">
        <span class="font-mono text-accent text-sm">01</span>
        <h2 class="font-display text-xl sm:text-2xl font-semibold">{{ t('overview.s1Title') }}</h2>
      </div>
      <p class="text-ink-mid text-[15px] max-w-3xl mb-6">{{ t('overview.s1Lead') }}</p>

      <!-- pillars -->
      <div class="grid sm:grid-cols-2 gap-3 mb-6">
        <div
          v-for="p in PILLARS" :key="p.key"
          class="card p-4 border-l-[3px]" :class="LEFT[p.color]"
        >
          <h4 class="font-display text-[17px] font-semibold mb-1">{{ p.title[loc] }}</h4>
          <p class="text-[13.5px] text-ink-mid">{{ p.desc[loc] }}</p>
        </div>
      </div>

      <!-- spine svg -->
      <div class="card p-4 sm:p-5 mb-2">
        <svg viewBox="0 0 420 72" class="w-full h-auto block" role="img" :aria-label="t('overview.spineAria')">
          <line x1="18" y1="34" x2="402" y2="34" class="ln" />
          <template v-for="(node, i) in SPINE" :key="i">
            <path
              v-if="node.kind === 'gate'"
              :d="`M${spineX(i)} 25 L${spineX(i)+9} 34 L${spineX(i)} 43 L${spineX(i)-9} 34 Z`"
              class="nd s-gate"
            />
            <circle
              v-else :cx="spineX(i)" cy="34" r="9"
              class="nd" :class="`s-${node.kind}`"
              :stroke-dasharray="node.optional ? '3 2' : undefined"
            />
            <text :x="spineX(i)" y="37.5" text-anchor="middle" :class="node.kind === 'gate' ? 'tq' : 'tn'">{{ node.n }}</text>
            <text :x="spineX(i)" y="60" text-anchor="middle" class="tl">{{ node.label[loc] }}</text>
          </template>
        </svg>
        <p class="text-[12.5px] text-ink-mid mt-3 pt-3 border-t border-border-subtle">{{ t('overview.spineNote') }}</p>
      </div>

      <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-low mt-6 mb-3">{{ t('overview.s1Detail') }}</p>

      <!-- journey table -->
      <div class="overflow-x-auto -mx-1">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-border-accent">
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium w-10">{{ t('overview.colStep') }}</th>
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colName') }}</th>
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colDesc') }}</th>
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colApps') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in JOURNEY" :key="i" class="border-b border-border-subtle align-top">
              <td class="py-3 px-2">
                <span class="grid h-7 w-7 place-items-center rounded-lg border font-mono text-[12px]" :class="NUM[s.kind]">{{ s.n }}</span>
              </td>
              <td class="py-3 px-2">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-medium text-[14px]">{{ s.title[loc] }}</span>
                  <span
                    v-if="s.optional"
                    class="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-low border border-dashed border-border-accent rounded px-1 py-px"
                  >{{ t('overview.optional') }}</span>
                </div>
              </td>
              <td class="py-3 px-2 text-[13px] text-ink-mid min-w-[220px]">{{ s.desc[loc] }}</td>
              <td class="py-3 px-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="a in s.apps" :key="a.name"
                    class="font-mono text-[10px] rounded-md border px-1.5 py-0.5 whitespace-nowrap"
                    :class="TAG[a.color]"
                  >{{ a.name }}<template v-if="a.note"> · {{ a.note[loc] }}</template></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- legend -->
      <div class="flex flex-wrap gap-4 mt-5 font-mono text-[12px] text-ink-mid">
        <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm" :class="DOT.host" />Onchaindesign</span>
        <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm" :class="DOT.regul8" />regul8</span>
        <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm" :class="DOT.tokenlab" />tokenlab</span>
        <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm" :class="DOT.transverse" />{{ t('overview.legendTransverse') }}</span>
      </div>

      <div class="card p-4 mt-5 border-l-[3px] border-l-accent">
        <p class="text-[13px] text-ink-mid">{{ TRANSVERSE_NOTE[loc] }}</p>
      </div>
    </section>

    <!-- ── 02 · The suite ── -->
    <section id="s2" class="border-t border-border-subtle py-8 scroll-mt-20">
      <div class="flex items-baseline gap-3 mb-1.5">
        <span class="font-mono text-accent text-sm">02</span>
        <h2 class="font-display text-xl sm:text-2xl font-semibold">{{ t('overview.s2Title') }}</h2>
      </div>
      <p class="text-ink-mid text-[15px] max-w-3xl mb-6">{{ t('overview.s2Lead') }}</p>
      <div class="overflow-x-auto -mx-1">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-border-accent">
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colName') }}</th>
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colDesc') }}</th>
              <th class="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-low font-medium">{{ t('overview.colSteps') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in SUITE" :key="row.name" class="border-b border-border-subtle align-top">
              <td class="py-3 px-2 font-mono font-medium text-[13px] whitespace-nowrap" :class="TAG[row.color].split(' ')[1]">{{ row.name }}</td>
              <td class="py-3 px-2 text-[14px] text-ink-high min-w-[260px]">{{ row.desc[loc] }}</td>
              <td class="py-3 px-2 whitespace-nowrap">
                <span v-if="stepsFor(row.name).length" class="font-mono text-[12px] text-ink-mid">{{ stepsFor(row.name).join(', ') }}</span>
                <span v-else class="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-low">{{ t('overview.colTransverse') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── 03 · Token design loop ── -->
    <section id="s3" class="border-t border-border-subtle py-8 scroll-mt-20">
      <div class="flex items-baseline gap-3 mb-1.5">
        <span class="font-mono text-accent text-sm">03</span>
        <h2 class="font-display text-xl sm:text-2xl font-semibold">{{ t('overview.s3Title') }}</h2>
      </div>
      <p class="text-ink-mid text-[15px] max-w-3xl mb-6">{{ t('overview.s3Lead') }}</p>
      <div class="card p-4 sm:p-5">
        <svg viewBox="0 0 360 210" class="w-full h-auto block max-w-md mx-auto" role="img" :aria-label="t('overview.loopAria')">
          <defs>
            <marker id="ov-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </marker>
          </defs>
          <rect class="box s-host" x="108" y="14" width="144" height="50" rx="9" />
          <text class="bt" x="180" y="35" text-anchor="middle">{{ LOOP_NODES.driver.title[loc] }}</text>
          <text class="bs" x="180" y="51" text-anchor="middle">{{ LOOP_NODES.driver.sub[loc] }}</text>
          <rect class="box s-regul8" x="8" y="146" width="152" height="52" rx="9" />
          <text class="bt" x="84" y="166" text-anchor="middle">{{ LOOP_NODES.legal.title[loc] }}</text>
          <text class="bs" x="84" y="182" text-anchor="middle">{{ LOOP_NODES.legal.sub[loc] }}</text>
          <rect class="box s-tokenlab" x="200" y="146" width="152" height="52" rx="9" />
          <text class="bt" x="276" y="166" text-anchor="middle">{{ LOOP_NODES.impl.title[loc] }}</text>
          <text class="bs" x="276" y="182" text-anchor="middle">{{ LOOP_NODES.impl.sub[loc] }}</text>
          <path class="arr" d="M150 64 L98 144" marker-end="url(#ov-ar)" />
          <path class="arr fb" d="M64 146 C36 102 66 78 114 60" marker-end="url(#ov-ar)" />
          <path class="arr" d="M210 64 L262 144" marker-end="url(#ov-ar)" />
          <path class="arr fb" d="M296 146 C324 102 294 78 246 60" marker-end="url(#ov-ar)" />
          <text class="bs" x="104" y="108" text-anchor="end">{{ t('overview.loopDeduce') }}</text>
          <text class="bs" x="256" y="108" text-anchor="start">{{ t('overview.loopDeduce') }}</text>
          <text class="bs rev" x="44" y="104" text-anchor="end">{{ t('overview.loopRevise') }}</text>
          <text class="bs rev" x="316" y="104" text-anchor="start">{{ t('overview.loopRevise') }}</text>
        </svg>
      </div>
      <p class="text-[13.5px] text-ink-mid mt-4 max-w-3xl">{{ LOOP_CAPTION[loc] }}</p>
    </section>

    <!-- ── 04 · Lifecycle ── -->
    <section id="s4" class="border-t border-border-subtle py-8 scroll-mt-20">
      <div class="flex items-baseline gap-3 mb-1.5">
        <span class="font-mono text-accent text-sm">04</span>
        <h2 class="font-display text-xl sm:text-2xl font-semibold">{{ t('overview.s4Title') }}</h2>
      </div>
      <p class="text-ink-mid text-[15px] max-w-3xl mb-6">{{ t('overview.s4Lead') }}</p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(st, i) in LIFECYCLE" :key="i"
          class="card p-3.5 flex-1 min-w-[140px]"
        >
          <div class="font-mono text-[10.5px] text-accent tracking-[0.08em]">{{ st.ln[loc] }}</div>
          <div class="font-display text-[17px] font-semibold my-1">{{ st.title[loc] }}</div>
          <div class="text-[12.5px] text-ink-mid">{{ st.desc[loc] }}</div>
        </div>
      </div>
      <p class="text-[13.5px] text-ink-mid mt-4 max-w-3xl">{{ LIFECYCLE_CAPTION[loc] }}</p>
    </section>
  </div>
</template>

<style scoped>
.overview svg .ln { stroke: rgb(var(--border-accent)); stroke-width: 2; }
.overview svg .nd { fill: none; stroke-width: 1.5; }
.overview svg .box { fill: rgb(var(--bg-elevated)); stroke-width: 1; }
.overview svg .s-host { stroke: rgb(var(--accent)); }
.overview svg .s-regul8 { stroke: rgb(var(--ok)); }
.overview svg .s-tokenlab { stroke: rgb(var(--warn)); }
.overview svg .s-plain { stroke: rgb(var(--ink-low)); }
.overview svg .s-gate { stroke: rgb(var(--warn)); }
.overview svg .tn { fill: rgb(var(--ink-high)); font-family: var(--font-mono, monospace); font-size: 10px; font-weight: 500; }
.overview svg .tq { fill: rgb(var(--warn)); font-family: var(--font-mono, monospace); font-size: 10px; font-weight: 500; }
.overview svg .tl { fill: rgb(var(--ink-low)); font-size: 8px; }
.overview svg .bt { fill: rgb(var(--ink-high)); font-size: 13px; font-weight: 600; }
.overview svg .bs { fill: rgb(var(--ink-mid)); font-family: var(--font-mono, monospace); font-size: 10.5px; }
.overview svg .bs.rev { fill: rgb(var(--warn)); }
.overview svg .arr { stroke: rgb(var(--ink-low)); stroke-width: 1.4; fill: none; }
.overview svg .arr.fb { stroke: rgb(var(--warn)); stroke-dasharray: 4 3; }
</style>
