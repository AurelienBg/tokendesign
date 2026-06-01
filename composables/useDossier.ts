/**
 * useDossier — assembles the dossier view-model from the project store, the
 * deterministic engine, and the bilingual content dictionaries. Pure
 * presentation glue: no rules live here (they're in utils/engine.ts).
 */
import { storeToRefs } from 'pinia'
import { useProjectStore, type ProjectStore } from '~/stores/project'
import type { RedFlagLevel, RedFlagKey, StageId } from '~/utils/engine'
import { CLASSES, type ClassInfo } from '~/utils/content/classes'
import { REDFLAGS } from '~/utils/content/redflags'
import { CHECKLIST } from '~/utils/content/checklist'
import { VMAP, LABS, AXIS_LABELS } from '~/utils/content/dossier'
import type { Locale } from '~/utils/content/types'

export interface VectorRow {
  key: string
  label: string
  value: string
  confirm: boolean
}
export interface FlagView {
  level: RedFlagLevel
  key: RedFlagKey
  title: string
  body: string
}
export interface ChecklistItemView {
  id: string
  label: string
  cliquet: boolean
}
export interface StageView {
  index: number
  id: StageId
  weight: 'heavy' | 'light' | null
  items: ChecklistItemView[]
}

export function useDossier(store: ProjectStore = useProjectStore()) {
  const { dossier } = storeToRefs(store)
  const { locale } = useI18n()
  const loc = computed<Locale>(() => (locale.value === 'fr' ? 'fr' : 'en'))

  const classInfo = computed<ClassInfo>(() => CLASSES[loc.value][dossier.value.cls])

  /** Names of other plausible classes (boundary overlaps). */
  const secondaryNames = computed<string[]>(() =>
    dossier.value.secondary.map((c) => CLASSES[loc.value][c].name)
  )

  const vectorRows = computed<VectorRow[]>(() => {
    const { vector: v, confirm } = dossier.value
    const vm = VMAP[loc.value]
    const labs = LABS[loc.value]
    const axis = AXIS_LABELS[loc.value]
    const isConfirm = (k: string) => (confirm as string[]).includes(k)
    const row = (key: string, label: string | undefined, value: string): VectorRow => ({
      key,
      label: label ?? key,
      value,
      confirm: isConfirm(key)
    })

    return [
      row('fongibilite', axis.fongibilite, v.fongibilite ? vm.fongibilite[v.fongibilite] ?? '—' : '—'),
      row('rapport', axis.rapport, vm.rapport[v.rapport] ?? '—'),
      row('couverture', axis.couverture, vm.couverture[v.couverture] ?? '—'),
      row('debiteur', axis.debiteur, vm.debiteur[v.debiteur] ?? '—'),
      row('garant', axis.garant, vm.garant[v.garant] ?? '—'),
      row('transfer', axis.transfer, v.transfer ? vm.transfer[v.transfer] ?? '—' : '—'),
      row('fonctions', axis.fonctions, v.fonctions.length ? v.fonctions.map((f) => labs.fonctions[f] ?? f).join(', ') : '—'),
      row('droits', axis.droits, v.droits.length ? v.droits.map((d) => labs.droits[d] ?? d).join(', ') : '—')
    ]
  })

  const flags = computed<FlagView[]>(() =>
    dossier.value.flags.map((f) => {
      const txt = REDFLAGS[loc.value][f.key]
      return { level: f.level, key: f.key, title: txt.title, body: txt.body }
    })
  )

  const stages = computed<StageView[]>(() => {
    const ck = CHECKLIST[loc.value]
    return dossier.value.stages.map((st) => ({
      index: st.index,
      id: st.id,
      weight: st.weight,
      items: st.items.map((i) => ({ id: i.id, label: ck[i.id], cliquet: i.cliquet }))
    }))
  })

  return {
    dossier,
    classInfo,
    secondaryNames,
    vectorRows,
    flags,
    stages,
    flagsCount: computed(() => dossier.value.flags.length),
    confirmCount: computed(() => dossier.value.confirm.length)
  }
}
