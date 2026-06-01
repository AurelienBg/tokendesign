<script setup lang="ts">
import { useConfigurator } from '~/composables/useConfigurator'
import { CATEGORICAL_AXES } from '~/utils/content/refcases'
import { AXIS_GROUP, AXIS_VALUE, AXIS_ORDER, AXIS_SHORT, FONCTIONS_ORDER, DROITS_ORDER } from '~/utils/content/axislabels'
import { LABS } from '~/utils/content/dossier'
import type { Fonction, Droit } from '~/utils/engine'

const { config, toggleAxis, toggleFonction, toggleDroit, reset, messages, status, setAxes, matches } = useConfigurator()
const { t, locale } = useI18n()
const loc = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

const axes = CATEGORICAL_AXES
const errCount = computed(() => messages.value.filter((m) => m.level === 'err').length)

const statusClass = computed(() => ({
  idle: 'text-ink-low',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-danger'
}[status.value]))

const msgClass: Record<string, string> = {
  err: 'text-danger border-danger/40',
  warn: 'text-warn border-warn/40',
  ok: 'text-ok border-ok/40'
}

function val(axis: string, v: string): string {
  return AXIS_VALUE[loc.value][axis]?.[v] ?? v
}
</script>

<template>
  <div class="card p-5 sm:p-6">
    <!-- Categorical axes -->
    <div class="flex flex-col gap-4">
      <div v-for="axis in axes" :key="axis" class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 sm:items-center">
        <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-low">{{ AXIS_GROUP[loc][axis] }}</div>
        <div class="flex flex-wrap gap-1.5" role="radiogroup">
          <button
            v-for="v in AXIS_ORDER[axis]"
            :key="v"
            type="button"
            role="radio"
            :aria-checked="config[axis] === v"
            class="rounded-full border px-2.5 py-1.5 text-[13px] transition"
            :class="config[axis] === v ? 'border-accent bg-accent text-accent-on font-medium' : 'border-border-subtle text-ink-mid hover:border-border-accent'"
            @click="toggleAxis(axis, v)"
          >{{ val(axis, v) }}</button>
        </div>
      </div>

      <!-- Flags -->
      <div class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4">
        <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-low">{{ t('configurator.fonctionsLab') }}</div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="f in FONCTIONS_ORDER"
            :key="f"
            type="button"
            :aria-pressed="config.fonctions.includes(f as Fonction)"
            class="inline-flex items-center rounded-md border px-2.5 py-1.5 text-[13px] transition"
            :class="config.fonctions.includes(f as Fonction) ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-ink-mid hover:border-border-accent'"
            @click="toggleFonction(f as Fonction)"
          ><span class="font-mono text-[11px] mr-1.5 text-accent leading-none" aria-hidden="true">{{ config.fonctions.includes(f as Fonction) ? '✓' : '+' }}</span>{{ LABS[loc].fonctions[f] ?? f }}</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4">
        <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-low">{{ t('configurator.droitsLab') }}</div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="d in DROITS_ORDER"
            :key="d"
            type="button"
            :aria-pressed="config.droits.includes(d as Droit)"
            class="inline-flex items-center rounded-md border px-2.5 py-1.5 text-[13px] transition"
            :class="config.droits.includes(d as Droit) ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-ink-mid hover:border-border-accent'"
            @click="toggleDroit(d as Droit)"
          ><span class="font-mono text-[11px] mr-1.5 text-accent leading-none" aria-hidden="true">{{ config.droits.includes(d as Droit) ? '✓' : '+' }}</span>{{ LABS[loc].droits[d] ?? d }}</button>
        </div>
      </div>
    </div>

    <!-- Output -->
    <div class="mt-6 border-t border-border-subtle pt-5">
      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('configurator.vectorLab') }}</p>
      <p class="font-mono text-[13px] text-ink-high leading-relaxed">
        <span v-for="axis in axes" :key="axis" class="mr-3 inline-block">
          {{ AXIS_SHORT[loc][axis] }}·<span :class="config[axis] ? 'text-accent' : 'text-ink-low'">{{ config[axis] ? val(axis, config[axis] as string) : '—' }}</span>
        </span>
        <span v-if="config.fonctions.length || config.droits.length" class="text-accent">
          + {{ [...config.fonctions, ...config.droits].join(' · ') }}
        </span>
      </p>

      <p class="mt-3 text-sm font-medium" :class="statusClass">
        {{ status === 'idle' ? t('configurator.statusIdle')
          : status === 'ok' ? t('configurator.statusOk')
          : status === 'warn' ? t('configurator.statusWarn')
          : t('configurator.statusErr', { n: errCount }) }}
      </p>

      <div v-if="messages.length" class="mt-3 flex flex-col gap-1.5">
        <div
          v-for="m in messages"
          :key="m.key"
          class="flex items-start gap-2 rounded-md border px-3 py-2 text-[13px]"
          :class="msgClass[m.level]"
        >
          <span class="font-mono shrink-0" aria-hidden="true">{{ m.level === 'err' ? '✕' : m.level === 'warn' ? '≈' : '✓' }}</span>
          <span>{{ t(`configurator.coherence.${m.key}`) }}</span>
        </div>
      </div>

      <p v-if="setAxes.length" class="mt-3 text-[13px] text-ink-mid">
        <template v-if="matches.length">
          {{ t('configurator.resembles') }}
          <b class="text-ink-high">{{ matches.map((m) => m.name[loc]).join(', ') }}</b>
        </template>
        <template v-else>{{ t('configurator.noMatch') }}</template>
      </p>

      <button class="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-accent" @click="reset">
        {{ t('configurator.reset') }}
      </button>
    </div>
  </div>
</template>
