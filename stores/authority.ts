/**
 * Authority store — raw answers for the "Build an app" angle (local-first,
 * persisted). The authority engine derives the risk profile + custody
 * checklist + XRPL mapping. Separate from the Layer A project store.
 */
import { defineStore } from 'pinia'
import { emptyAuthority, assessAuthority, type AuthorityState } from '~/utils/authority'

export const useAuthorityStore = defineStore('authority', {
  state: (): AuthorityState => emptyAuthority(),

  getters: {
    assessment: (state) => assessAuthority(state as AuthorityState),
    hasLevel: (state) => state.level != null
  },

  actions: {
    setSingle(key: keyof AuthorityState, value: string) {
      ;(this as unknown as Record<string, string>)[key] = value
    },
    reset() {
      this.$patch(emptyAuthority())
    }
  },

  persist: true
})
