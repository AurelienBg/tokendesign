<script setup lang="ts">
import { useActiveProjectStore } from '~/composables/useActiveProjectStore'
import { useDossier } from '~/composables/useDossier'

const props = withDefaults(defineProps<{ mode?: 'create' | 'analyze' }>(), { mode: 'create' })
defineEmits<{ (e: 'restart'): void }>()

const store = useActiveProjectStore()
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { classInfo, secondaryNames, vectorRows, flags, stages, flagsCount } = useDossier(store)

const kicker = computed(() => (props.mode === 'analyze' ? t('analyze.diagnosisKicker') : t('create.dossierKicker')))

const chips = computed(() =>
  (tm('create.chips') as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
)

const vigText = computed(() => {
  const n = flagsCount.value
  if (n === 0) return t('create.vigNone')
  if (n === 1) return t('create.vigSingular')
  return t('create.vigPlural', { n })
})

const flagTone: Record<string, string> = {
  danger: 'border-l-danger',
  warn: 'border-l-warn',
  info: 'border-l-info'
}

function print() {
  if (typeof window !== 'undefined') window.print()
}
</script>

<template>
  <section class="wrap max-w-4xl py-10 sm:py-14">
    <!-- Diagnostic-mode banner -->
    <div v-if="props.mode === 'analyze'" class="card border-l-2 border-l-info p-3.5 mb-6 print:hidden">
      <p class="text-[13px] text-ink-mid"><span class="glyph text-info mr-1.5" aria-hidden="true">ⓘ</span>{{ t('analyze.banner') }}</p>
    </div>

    <!-- Head + actions -->
    <div class="flex items-center justify-between gap-4 mb-6 print:hidden">
      <p class="kicker">{{ kicker }}</p>
      <div class="flex items-center gap-2">
        <button class="btn-ghost text-sm px-3.5 py-2" @click="print">{{ t('create.btnPrint') }}</button>
        <button class="btn-ghost text-sm px-3.5 py-2" @click="$emit('restart')">{{ t('create.btnRestart') }}</button>
      </div>
    </div>

    <!-- Cloud save (opt-in) -->
    <CloudSaveBar :angle="props.mode" :state="store.$state" :suggested-name="classInfo.name" class="mb-8" />

    <!-- Synthesis -->
    <div class="card p-6 mb-8">
      <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
        <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low">{{ t('create.synLab') }}</p>
        <span class="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {{ classInfo.name }}
        </span>
      </div>
      <p class="font-display text-2xl font-semibold mb-2">{{ t('create.synTpl', { arch: classInfo.arch }) }}</p>
      <p class="text-ink-mid text-[15px]">{{ classInfo.reg }}</p>
      <p
        v-if="secondaryNames.length"
        class="mt-3 text-[13px] text-warn border border-warn/30 rounded-md px-3 py-2"
      >
        <span class="glyph mr-1" aria-hidden="true">⚑</span>{{ t('create.alsoPlausible', { classes: secondaryNames.join(' · ') }) }}
      </p>
      <p class="mt-3 text-sm" :class="flagsCount === 0 ? 'text-ok' : 'text-warn'">{{ vigText }}</p>
    </div>

    <!-- 01 — Identity -->
    <section class="mb-10">
      <header class="flex items-baseline gap-3 mb-4">
        <span class="font-mono text-xs text-ink-low">01</span>
        <h2 class="font-display text-xl font-semibold">{{ t('create.sec1') }}</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">{{ t('create.sec1src') }}</span>
      </header>
      <div class="rounded-xl border border-border-subtle overflow-hidden">
        <div
          v-for="(r, i) in vectorRows"
          :key="r.key"
          class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-4 py-3"
          :class="i % 2 ? 'bg-bg-card' : 'bg-bg-elevated/40'"
        >
          <div class="text-[13px] text-ink-low font-mono uppercase tracking-[0.08em]">{{ r.label }}</div>
          <div class="text-[15px] text-ink-high">
            {{ r.value }}
            <span
              v-if="r.confirm"
              class="ml-1.5 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-warn border border-warn/40 rounded-full px-1.5 py-0.5"
            >{{ t('create.toConfirm') }}</span>
          </div>
        </div>
      </div>
      <p class="mt-3 text-[15px] text-ink-mid">
        {{ t('create.classRetenue') }} <b class="text-ink-high">{{ classInfo.name }}</b>.
      </p>
    </section>

    <!-- 02 — Class & framework -->
    <section class="mb-10">
      <header class="flex items-baseline gap-3 mb-4">
        <span class="font-mono text-xs text-ink-low">02</span>
        <h2 class="font-display text-xl font-semibold">{{ t('create.sec2') }}</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">{{ t('create.sec2src') }}</span>
      </header>
      <p class="text-[15px] text-ink-mid mb-4">{{ classInfo.reg }}</p>

      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('create.oblLab') }}</p>
      <ul class="flex flex-col gap-2 mb-6">
        <li v-for="(o, i) in classInfo.obl" :key="i" class="flex gap-2.5 text-[15px] text-ink-high">
          <span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ o }}</span>
        </li>
      </ul>

      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('create.vigLab') }}</p>
      <div v-if="flags.length" class="flex flex-col gap-3">
        <div
          v-for="f in flags"
          :key="f.key"
          class="card border-l-2 p-4"
          :class="flagTone[f.level]"
        >
          <h4 class="flex items-center gap-2 font-medium mb-1">
            <span class="glyph text-sm" :class="f.level === 'info' ? 'text-info' : f.level === 'warn' ? 'text-warn' : 'text-danger'" aria-hidden="true">
              {{ f.level === 'info' ? 'ⓘ' : '!' }}
            </span>
            <span
              class="font-mono text-[9px] uppercase tracking-[0.14em] border rounded-full px-1.5 py-0.5 shrink-0"
              :class="f.level === 'info' ? 'text-info border-info/40' : f.level === 'warn' ? 'text-warn border-warn/40' : 'text-danger border-danger/40'"
            >{{ t(`create.sev.${f.level}`) }}</span>
            {{ f.title }}
          </h4>
          <p class="text-[14px] text-ink-mid leading-relaxed">{{ f.body }}</p>
        </div>
      </div>
      <p v-else class="text-ok text-[15px]">{{ t('create.rfNone') }}</p>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mt-5 text-[13px] text-ink-low border-t border-border-subtle pt-4" v-html="t('create.legal')" />
    </section>

    <!-- 03 — Checklist -->
    <section class="mb-10">
      <header class="flex items-baseline gap-3 mb-3">
        <span class="font-mono text-xs text-ink-low">03</span>
        <h2 class="font-display text-xl font-semibold">{{ t('create.sec3') }}</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">{{ t('create.sec3src') }}</span>
      </header>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-[14px] text-ink-mid mb-4" v-html="t('create.sec3sub')" />
      <LaunchChecklist :stages="stages" />
    </section>

    <!-- Foot -->
    <footer class="border-t border-border-subtle pt-6">
      <div v-if="store.chemin.includes('autres')" class="card border-l-2 border-l-info p-4 mb-5">
        <h4 class="flex items-center gap-2 font-medium mb-1">
          <span class="glyph text-info text-sm" aria-hidden="true">ⓘ</span>{{ t('create.alsoAppT') }}
        </h4>
        <p class="text-[14px] text-ink-mid leading-relaxed">{{ t('create.alsoAppP') }}</p>
        <NuxtLink
          :to="localePath('/build')"
          class="inline-block mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent hover:underline"
        >{{ t('angles.build.title') }} →</NuxtLink>
      </div>

      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-1">{{ t('create.scope') }}</p>
      <p class="text-[14px] text-ink-mid mb-4">{{ t('create.scopeP') }}</p>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="(c, i) in chips"
          :key="i"
          class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low border border-border-subtle rounded-full px-2.5 py-1"
        >{{ c }}</span>
      </div>
    </footer>
  </section>
</template>
