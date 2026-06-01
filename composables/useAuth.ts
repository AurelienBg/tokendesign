/**
 * Thin auth helper over @nuxtjs/supabase (magic-link + Google for now; XRPL
 * wallet sign-in lands with the server routes). Centralizes auth so UI never
 * talks to Supabase directly. Local-first: the app works signed-out; auth only
 * unlocks cloud save/sync.
 */
import { useProjectStore, useAnalyzeStore } from '~/stores/project'
import { useAuthorityStore } from '~/stores/authority'

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

  return { user, isAuthenticated, sendMagicLink, signInWithGoogle, signOut }
}
