/**
 * useXrplWallet — reactive façade over the plugin-provided WalletManager.
 * Exposes connect()/disconnect() wired to the connector Web Component, plus
 * the reactive connection state. Used by the "Sign in with wallet" flow.
 */
import type { XrplWalletState } from '~/plugins/xrplWallet.client'

interface XrplWalletConnectorElement extends HTMLElement {
  open: () => void
  close: () => void
  setWalletManager: (manager: unknown) => void
}

const _connectorEl = ref<XrplWalletConnectorElement | null>(null)

export function useXrplWallet() {
  const nuxtApp = useNuxtApp()
  // Plugin is client-only → $xrplWallet is undefined on the server. Stub so
  // SSR doesn't crash; real state takes over on hydration.
  const state = (nuxtApp.$xrplWallet as XrplWalletState | undefined) ?? null

  const connected = computed(() => state?.connected ?? false)
  const account = computed(() => state?.account ?? null)
  const error = computed(() => state?.error ?? null)
  const connecting = computed(() => state?.connecting ?? false)

  function shorten(address: string | null | undefined): string {
    if (!address) return ''
    if (address.length <= 12) return address
    return `${address.slice(0, 6)}…${address.slice(-4)}`
  }

  /** Register the mounted connector element + attach the manager. */
  function registerConnector(el: XrplWalletConnectorElement | null) {
    _connectorEl.value = el
    if (el && state?.manager) el.setWalletManager(state.manager)
  }

  /** Open the wallet-selection modal. */
  function connect() {
    if (!state) return
    state.connecting = true
    state.error = null
    if (!_connectorEl.value || typeof _connectorEl.value.open !== 'function') {
      state.connecting = false
      console.warn('[useXrplWallet] connector not mounted yet')
      return
    }
    _connectorEl.value.open()
  }

  async function disconnect() {
    if (state?.manager) {
      try {
        await state.manager.disconnect()
      } catch (e) {
        console.error('[useXrplWallet] disconnect failed:', e)
      }
    }
  }

  return { connected, account, error, connecting, shorten, registerConnector, connect, disconnect }
}
