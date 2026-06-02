/**
 * Authority store — raw answers for the "Build an app" angle (local-first,
 * persisted). The authority engine derives the risk profile + custody
 * checklist + XRPL mapping. Separate from the Layer A project store.
 */
import { defineStore } from 'pinia'
import { emptyAuthority, assessAuthority, type AuthorityState, type AuthorityLevel } from '~/utils/authority'

/** Single-choice dimension axes (everything except the `actions` multi list). */
type DimensionKey = Exclude<keyof AuthorityState, 'actions'>

export const useAuthorityStore = defineStore('authority', {
  state: (): AuthorityState => emptyAuthority(),

  getters: {
    assessment: (state) => assessAuthority(state as AuthorityState),
    hasActions: (state) => state.actions.length > 0
  },

  actions: {
    toggleAction(value: AuthorityLevel) {
      const i = this.actions.indexOf(value)
      if (i >= 0) this.actions.splice(i, 1)
      else this.actions.push(value)
    },
    setSingle(key: DimensionKey, value: string) {
      ;(this as unknown as Record<string, string>)[key] = value
    },
    reset() {
      this.$patch(emptyAuthority())
    }
  },

  persist: true
})
