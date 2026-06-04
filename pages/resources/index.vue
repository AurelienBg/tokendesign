<script setup lang="ts">
/**
 * /resources — INTERNAL design sandbox (not linked from the hub).
 *  1. Intake mockup in "configurator style" (label + pills), local-only state.
 *  2. Two learn-guide-style decision trees: Frame (token) and Build (app).
 */
import { INTAKE, BLOCK_B1, BLOCK_B2 } from '~/utils/content/intake'
import type { QuestionKey } from '~/utils/content/types'
import { GATES } from '~/utils/content/gates'

const { t } = useI18n()
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
</script>

<template>
  <main class="wrap max-w-4xl py-10 sm:py-14">
    <NuxtLink :to="localePath('/')" class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline">
      {{ t('create.backHub') }}
    </NuxtLink>

    <div class="card border-l-2 border-l-warn p-3.5 mt-4 mb-12">
      <p class="text-[13px] text-ink-mid"><span class="glyph text-warn mr-1.5" aria-hidden="true">⚑</span>Internal design sandbox — UI mockup only. The path guides now live at <NuxtLink :to="localePath('/learn/frame')" class="text-accent">/learn/frame</NuxtLink> &amp; <NuxtLink :to="localePath('/learn/build')" class="text-accent">/learn/build</NuxtLink>.</p>
    </div>

    <!-- Upstream go/no-go gates (draft — to export to Grounds) -->
    <section class="mb-14">
      <p class="kicker mb-2">Draft · to export to Grounds</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Upstream gates — blockchain? / token?</h2>
      <p class="text-ink-mid text-sm mb-6 max-w-2xl">The two necessity switches the macro map attributes to Grounds (the router). Go/no-go, not classification. Bilingual &amp; self-contained — lift into Grounds when ready.</p>
      <div class="grid lg:grid-cols-2 gap-5 items-start">
        <GateGuide v-for="g in GATES" :key="g.id" :gate="g" />
      </div>
    </section>

    <!-- Intake mockup (configurator style) -->
    <section>
      <p class="kicker mb-2">Mockup · configurator style</p>
      <h2 class="font-display text-2xl font-semibold mb-1">Intake — label + pills</h2>
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
  </main>
</template>
