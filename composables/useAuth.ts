/**
 * Thin auth helper over @nuxtjs/supabase (magic-link + Google for now; XRPL
 * wallet sign-in lands with the server routes). Centralizes auth so UI never
 * talks to Supabase directly. Local-first: the app works signed-out; auth only
 * unlocks cloud save/sync.
 */
import { useProjectStore, useAnalyzeStore } from '~/stores/project'
import { useAuthorityStore } from '~/stores/authority'
import type { XrplWalletState } from '~/plugins/xrplWallet.client'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  /** Where Supabase sends the user back after clicking the link / OAuth. */
  function landing(redirectTo?: string): string | undefined {
    if (redirectTo) return redirectTo
    return typeof window !== 'undefined' ? window.location.origin : undefined
  }

  async function sendMagicLink(email: string, redirectTo?: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: landing(redirectTo) }
    })
    if (error) throw error
  }

  async function signInWithGoogle(redirectTo?: string) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: landing(redirectTo) }
    })
    if (error) throw error
  }

  /**
   * "Sign in with wallet": connect a wallet → sign a server-issued challenge →
   * verify server-side → redeem the returned OTP for a real Supabase session.
   * The user is identified by a pseudo-email `<address>@wallet.tokendesign.app`
   * (no inbox — losing the wallet means losing the account).
   */
  async function signInWithXrplWallet(): Promise<void> {
    const wallet = useXrplWallet()

    // (a) Ensure connected (open the picker + wait up to 90s).
    if (!wallet.connected.value) {
      wallet.connect()
      const start = Date.now()
      while (!wallet.connected.value) {
        if (Date.now() - start > 90_000) throw new Error('Wallet connection timed out.')
        if (wallet.error.value) throw new Error(wallet.error.value.message)
        await new Promise((r) => setTimeout(r, 250))
      }
    }
    const address = wallet.account.value?.address
    if (!address) throw new Error('Wallet connected but no address available.')

    // (b) Challenge.
    const challenge = await $fetch<{ message: string; nonce: string; expiresAt: string }>(
      '/api/auth/xrpl-challenge',
      { method: 'POST', body: { address } }
    )

    // (c) Sign the message with the connected wallet.
    const state = useNuxtApp().$xrplWallet as XrplWalletState | undefined
    const manager = state?.manager
    if (!manager) throw new Error('Wallet manager not ready.')
    const signed = await manager.signMessage(challenge.message)
    if (!signed.signature) {
      throw new Error("This wallet didn't return a signature. Try Crossmark, or use magic-link / Google.")
    }

    // (d) Verify server-side → receive an OTP.
    const verifyRes = await $fetch<{ email: string; otp: string }>('/api/auth/xrpl-verify', {
      method: 'POST',
      body: { address, signature: signed.signature, publicKey: signed.publicKey, message: challenge.message }
    })

    // (e) Redeem the OTP → real session.
    const { error } = await supabase.auth.verifyOtp({
      email: verifyRes.email,
      token: verifyRes.otp,
      type: 'email'
    })
    if (error) throw error
  }

  async function signOut() {
    // Wipe per-user local state so the next account on this browser doesn't
    // inherit the previous user's projects via localStorage.
    if (typeof window !== 'undefined') {
      useProjectStore().reset()
      useAnalyzeStore().reset()
      useAuthorityStore().reset()
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, isAuthenticated, sendMagicLink, signInWithGoogle, signInWithXrplWallet, signOut }
}
