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
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  // Plugin is client-only → $xrplWallet is undefined on the server. Stub so
  // SSR doesn't crash; real state takes over on hydration.
  const state = (nuxtApp.$xrplWallet as XrplWalletState | undefined) ?? null

  const connected = computed(() => state?.connected ?? false)
  const account = computed(() => state?.account ?? null)
  const error = computed(() => state?.error ?? null)
  const connecting = computed(() => state?.connecting ?? false)

  /** XRPL address persisted on the Supabase user (survives reloads). */
  const linkedAddress = computed<string | null>(() => {
    const md = supabaseUser.value?.user_metadata as { xrpl_address?: unknown } | undefined
    return typeof md?.xrpl_address === 'string' ? md.xrpl_address : null
  })

  function shorten(address: string | null | undefined): string {
    if (!address) return ''
    if (address.length <= 12) return address
    return `${address.slice(0, 6)}…${address.slice(-4)}`
  }

  /** Persist the connected address to the signed-in user's metadata. */
  async function linkToAccount(): Promise<void> {
    if (!supabaseUser.value) return
    const addr = account.value?.address
    if (!addr || linkedAddress.value === addr) return
    const { error: e } = await supabase.auth.updateUser({ data: { xrpl_address: addr } })
    if (e) console.error('[useXrplWallet] link failed:', e)
  }

  /** Clear the stored address on the signed-in user (best-effort). */
  async function unlinkFromAccount(): Promise<void> {
    if (!supabaseUser.value || !linkedAddress.value) return
    const { error: e } = await supabase.auth.updateUser({ data: { xrpl_address: null } })
    if (e) console.error('[useXrplWallet] unlink failed:', e)
  }

  // Auto-link once a connection lands AND the user is signed in (covers both
  // orders: connect-then-signed-in and signed-in-then-connect).
  if (typeof window !== 'undefined') {
    watchEffect(() => {
      if (supabaseUser.value && account.value?.address) void linkToAccount()
    })
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
    // Also unlink from the account so the header chip clears.
    await unlinkFromAccount()
  }

  return {
    connected,
    account,
    error,
    connecting,
    linkedAddress,
    shorten,
    registerConnector,
    connect,
    disconnect,
    linkToAccount,
    unlinkFromAccount
  }
}
