/**
 * Project store — holds the founder's raw intake answers (local-first,
 * persisted to localStorage). The deterministic engine derives the
 * qualification + dossier from this state; nothing leaves the browser.
 */
import { defineStore } from 'pinia'
import {
  emptyState,
  qualify,
  buildDossier,
  type ProjectState,
  type Fonction,
  type Droit,
  type Chemin
} from '~/utils/engine'

/** Single-choice axes (string value) — everything except the multi arrays. */
type SingleKey = Exclude<keyof ProjectState, 'chemin' | 'fonctions' | 'droits'>
type MultiKey = 'fonctions' | 'droits'

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => emptyState(),

  getters: {
    qualification: (state) => qualify(state as ProjectState),
    dossier: (state) => buildDossier(state as ProjectState),
    hasStarted: (state) => state.chemin.length > 0
  },

  actions: {
    toggleChemin(value: Chemin) {
      const i = this.chemin.indexOf(value)
      if (i >= 0) this.chemin.splice(i, 1)
      else this.chemin.push(value)
    },

    setSingle(key: SingleKey, value: string) {
      ;(this as unknown as Record<SingleKey, string>)[key] = value

      // Side effect (prototype onSingleChange): clear dependent answers when
      // the relation to the underlying changes.
      if (key === 'rapport') {
        if (value !== 'titre') this.titre_type = null
        if (value !== 'adosse' && value !== 'titre') this.couverture = null
      }
    },

    toggleMulti(key: MultiKey, value: Fonction | Droit) {
      const arr = this[key] as string[]
      const i = arr.indexOf(value)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(value)
    },

    reset() {
      this.$patch(emptyState())
    }
  },

  persist: true
})
