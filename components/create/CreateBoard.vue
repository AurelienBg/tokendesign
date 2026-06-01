<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { provideProjectStore } from '~/composables/useActiveProjectStore'
import { INTAKE, BLOCK_B1, BLOCK_B2 } from '~/utils/content/intake'

const store = useProjectStore()
provideProjectStore(store)
const { t } = useI18n()
const localePath = useLocalePath()

const view = ref<'board' | 'dossier'>('board')
const blockB2 = BLOCK_B2

// Conditional questions (titre_type, couverture) appear inline when relevant.
const visibleB1 = computed(() =>
  BLOCK_B1.filter((k) => {
    const show = INTAKE[k].show
    return !show || show(store.$state)
  })
)

function scrollTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
function openDossier() {
  view.value = 'dossier'
  scrollTop()
}
function backToBoard() {
  view.value = 'board'
  scrollTop()
}
function restart() {
  if (typeof window !== 'undefined' && !window.confirm(t('create.resetConfirm'))) return
  store.reset()
  view.value = 'board'
  scrollTop()
}
</script>

<template>
  <div>
    <!-- ── Design board ───────────────────────────────────────── -->
    <div v-if="view === 'board'" class="wrap max-w-5xl py-8 sm:py-10">
      <NuxtLink
        :to="localePath('/')"
        class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent no-underline"
      >{{ t('create.backHub') }}</NuxtLink>

      <div class="flex items-start justify-between gap-4 mt-4 mb-9">
        <div>
          <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ t('angles.create.title') }}</h1>
          <p class="text-ink-mid mt-1.5 max-w-xl">{{ t('create.b1Sub') }}</p>
        </div>
        <button
          class="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-low hover:text-danger transition-colors"
          @click="restart"
        >{{ t('create.btnRestart') }}</button>
      </div>

      <div class="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
        <!-- inputs -->
        <div class="space-y-10 min-w-0">
          <section class="space-y-6">
            <p class="kicker">{{ t('create.identityGroup') }}</p>
            <BoardField v-for="k in visibleB1" :key="k" :question-key="k" />
          </section>
          <section class="space-y-6">
            <p class="kicker">{{ t('create.launchGroup') }}</p>
            <BoardField v-for="k in blockB2" :key="k" :question-key="k" />
          </section>
          <label class="flex items-center gap-2.5 text-[13px] text-ink-mid cursor-pointer pt-3 border-t border-border-subtle">
            <input
              type="checkbox"
              class="accent-accent h-4 w-4"
              :checked="store.chemin.includes('autres')"
              @change="store.toggleChemin('autres')"
            >
            <span>{{ t('create.alsoBuild') }}</span>
          </label>
        </div>

        <!-- live dossier -->
        <DossierLivePanel @open="openDossier" />
      </div>
    </div>

    <!-- ── Full dossier ───────────────────────────────────────── -->
    <div v-else>
      <div class="wrap max-w-3xl pt-6 print:hidden">
        <button
          class="font-mono text-xs uppercase tracking-[0.14em] text-ink-low hover:text-accent transition-colors"
          @click="backToBoard"
        >{{ t('create.backBoard') }}</button>
      </div>
      <DossierView mode="create" @restart="restart" />
    </div>
  </div>
</template>
