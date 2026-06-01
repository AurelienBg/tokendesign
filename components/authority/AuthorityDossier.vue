<script setup lang="ts">
import { useAuthorityDossier } from '~/composables/useAuthorityDossier'
import { useAuthorityStore } from '~/stores/authority'

defineEmits<{ (e: 'restart'): void }>()

const { t, tm, rt } = useI18n()
const authorityStore = useAuthorityStore()
const { assessment, band, flags, checklist, xrpl } = useAuthorityDossier()

const chips = computed(() =>
  (tm('build.chips') as unknown[]).map((m) => rt(m as Parameters<typeof rt>[0]))
)

const bandTone: Record<string, string> = {
  low: 'text-ok border-l-ok',
  medium: 'text-warn border-l-warn',
  high: 'text-danger border-l-danger',
  critical: 'text-danger border-l-danger'
}

// Local check state (UI only).
const checked = reactive<Set<string>>(new Set())
function toggle(id: string) {
  if (checked.has(id)) checked.delete(id)
  else checked.add(id)
}
function print() {
  if (typeof window !== 'undefined') window.print()
}
</script>

<template>
  <section class="wrap max-w-3xl py-10 sm:py-14">
    <!-- Head + actions -->
    <div class="flex items-center justify-between gap-4 mb-6 print:hidden">
      <p class="kicker">{{ t('build.dossierKicker') }}</p>
      <div class="flex items-center gap-2">
        <button class="btn-ghost text-sm px-3.5 py-2" @click="print">{{ t('create.btnPrint') }}</button>
        <button class="btn-ghost text-sm px-3.5 py-2" @click="$emit('restart')">{{ t('create.btnRestart') }}</button>
      </div>
    </div>

    <!-- Cloud save (opt-in) -->
    <CloudSaveBar angle="build" :state="authorityStore.$state" :suggested-name="band.name" class="mb-8" />

    <!-- Risk band -->
    <div class="card border-l-2 p-6 mb-8" :class="bandTone[assessment.band]">
      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('build.riskProfile') }}</p>
      <p class="font-display text-2xl font-semibold mb-1" :class="bandTone[assessment.band]">{{ band.name }}</p>
      <p class="text-ink-mid text-[15px]">{{ band.desc }}</p>
    </div>

    <!-- Authority watch points -->
    <section v-if="flags.length" class="mb-10">
      <h2 class="font-display text-xl font-semibold mb-4">{{ t('build.watchPoints') }}</h2>
      <div class="flex flex-col gap-3">
        <div v-for="f in flags" :key="f.key" class="card border-l-2 border-l-danger p-4">
          <h4 class="flex items-center gap-2 font-medium mb-1">
            <span class="glyph text-danger text-sm" aria-hidden="true">!</span>{{ f.title }}
          </h4>
          <p class="text-[14px] text-ink-mid leading-relaxed">{{ f.body }}</p>
        </div>
      </div>
    </section>

    <!-- XRPL mapping -->
    <section class="mb-10">
      <h2 class="font-display text-xl font-semibold mb-1">{{ t('build.xrplMapping') }}</h2>
      <div class="card p-5 mt-3">
        <p class="font-medium text-ink-high mb-1">{{ xrpl.title }}</p>
        <p class="text-[14px] text-ink-mid leading-relaxed mb-4">{{ xrpl.body }}</p>
        <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-low mb-2">{{ t('build.primitivesLab') }}</p>
        <ul class="flex flex-col gap-2">
          <li v-for="(p, i) in xrpl.primitives" :key="i" class="flex gap-2.5 text-[14px] text-ink-high">
            <span class="text-accent font-mono shrink-0" aria-hidden="true">›</span><span>{{ p }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Custody checklist -->
    <section class="mb-10">
      <h2 class="font-display text-xl font-semibold mb-4">{{ t('build.custodyChecklist') }}</h2>
      <ul class="rounded-xl border border-border-subtle divide-y divide-border-subtle overflow-hidden">
        <li v-for="item in checklist" :key="item.id">
          <button
            type="button"
            class="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-bg-elevated/60"
            :aria-pressed="checked.has(item.id)"
            @click="toggle(item.id)"
          >
            <span
              class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition"
              :class="checked.has(item.id) ? 'border-accent bg-accent text-accent-on' : 'border-border-accent'"
            >
              <span v-if="checked.has(item.id)" class="text-xs leading-none" aria-hidden="true">✓</span>
            </span>
            <span class="text-[15px] leading-snug" :class="checked.has(item.id) ? 'text-ink-low line-through' : 'text-ink-high'">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- Foot -->
    <footer class="border-t border-border-subtle pt-6">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-[13px] text-ink-low leading-relaxed mb-4" v-html="t('build.legal')" />
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
