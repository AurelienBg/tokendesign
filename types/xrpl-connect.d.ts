/**
 * Ambient type declarations for `xrpl-connect` (ships without bundled .d.ts).
 * Only declares the surface we use. Ambient (no top-level import/export) so it
 * applies globally. Lifted from 7powers, extended with signMessage.
 */
declare module 'xrpl-connect' {
  export interface NetworkInfo {
    name: string
    chainId?: string
  }

  export interface AccountInfo {
    address: string
    network: NetworkInfo
    publicKey?: string
  }

  export type WalletErrorCode =
    | 'WALLET_NOT_FOUND'
    | 'CONNECTION_FAILED'
    | 'SIGN_FAILED'
    | 'NETWORK_MISMATCH'
    | 'UNKNOWN'
    | (string & {})

  export interface WalletError extends Error {
    code: WalletErrorCode
  }

  export interface WalletAdapter {
    readonly id: string
    readonly name: string
  }

  export class XamanAdapter implements WalletAdapter {
    readonly id: string
    readonly name: string
    constructor(options?: { apiKey?: string })
  }
  export class CrossmarkAdapter implements WalletAdapter {
    readonly id: string
    readonly name: string
    constructor()
  }
  export class GemWalletAdapter implements WalletAdapter {
    readonly id: string
    readonly name: string
    constructor()
  }
  export class WalletConnectAdapter implements WalletAdapter {
    readonly id: string
    readonly name: string
    constructor(options?: { projectId?: string })
  }

  export type WalletNetwork = 'mainnet' | 'testnet' | 'devnet'

  export interface WalletManagerOptions {
    adapters: WalletAdapter[]
    network?: WalletNetwork
    autoConnect?: boolean
  }

  export type WalletEvent = 'connect' | 'disconnect' | 'error' | 'accountChanged'

  export type WalletEventPayload<E extends WalletEvent> =
    E extends 'connect' ? AccountInfo :
    E extends 'disconnect' ? void :
    E extends 'error' ? WalletError :
    E extends 'accountChanged' ? AccountInfo :
    never

  export interface SignedMessage {
    message: string
    signature: string
    publicKey: string
  }

  export class WalletManager {
    constructor(options: WalletManagerOptions)
    readonly connected: boolean
    readonly account: AccountInfo | null
    on<E extends WalletEvent>(event: E, handler: (payload: WalletEventPayload<E>) => void): void
    off<E extends WalletEvent>(event: E, handler: (payload: WalletEventPayload<E>) => void): void
    disconnect(): Promise<void>
    signMessage(message: string): Promise<SignedMessage>
    sign(transaction: Record<string, unknown>): Promise<{ signed: string; hash?: string }>
    signAndSubmit(transaction: Record<string, unknown>): Promise<{ hash: string }>
  }
}

interface HTMLElementTagNameMap {
  'xrpl-wallet-connector': HTMLElement & {
    open: () => void
    close: () => void
    setWalletManager: (manager: unknown) => void
  }
}
