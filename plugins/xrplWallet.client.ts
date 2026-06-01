/**
 * XRPL wallet plugin — one WalletManager for the app, provided as $xrplWallet.
 * Client-only (xrpl-connect ships a Web Component + touches DOM APIs).
 *
 * Adapters: Crossmark + GemWallet (browser extensions, no config) and
 * WalletConnect (Xaman / mobile) when a Project ID is set. The wallet is used
 * for "Sign in with wallet" (see composables/useAuth.signInWithXrplWallet).
 */
import {
  WalletManager,
  CrossmarkAdapter,
  GemWalletAdapter,
  WalletConnectAdapter
} from 'xrpl-connect'
import type { AccountInfo, WalletError, WalletAdapter } from 'xrpl-connect'

export interface XrplWalletState {
  manager: WalletManager | null
  account: AccountInfo | null
  connected: boolean
  error: WalletError | null
  connecting: boolean
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const walletConnectProjectId = (config.public.walletconnectProjectId as string) || ''

  const state = reactive<XrplWalletState>({
    manager: null,
    account: null,
    connected: false,
    error: null,
    connecting: false
  })

  const adapters: WalletAdapter[] = [new CrossmarkAdapter(), new GemWalletAdapter()]
  // WalletConnect (covers Xaman / mobile) only if a Project ID is configured —
  // otherwise it would show a broken option in the picker.
  if (walletConnectProjectId) {
    adapters.push(new WalletConnectAdapter({ projectId: walletConnectProjectId }))
  }

  const manager = new WalletManager({ adapters, network: 'mainnet', autoConnect: true })

  manager.on('connect', (account: AccountInfo) => {
    state.account = account
    state.connected = true
    state.connecting = false
    state.error = null
  })
  manager.on('disconnect', () => {
    state.account = null
    state.connected = false
    state.connecting = false
  })
  manager.on('error', (error: WalletError) => {
    state.error = error
    state.connecting = false
    console.error('[xrplWallet] error:', error.code, error.message)
  })

  state.manager = manager

  return { provide: { xrplWallet: state } }
})
