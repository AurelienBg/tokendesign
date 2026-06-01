/**
 * PKCE code exchange — runs once on initial client load.
 *
 * Supabase magic-links / OAuth use the PKCE flow, redirecting to
 * `<redirect_to>?code=<pkce_code>`. With `redirect: false` (opt-in auth) the
 * module's built-in callback is disabled, so we exchange the code wherever the
 * user lands (`/`, `/confirm`, `/en/`…). Lifted from 7powers.
 */
export default defineNuxtPlugin(async () => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (!code) return

  const supabase = useSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    // Don't throw — the link may be expired/already used. UI just shows
    // "not authenticated".
    console.error('[supabase-pkce] exchangeCodeForSession failed:', error.message)
    return
  }

  // Clean the URL so the code isn't left in the address bar / shared.
  url.searchParams.delete('code')
  url.searchParams.delete('error')
  url.searchParams.delete('error_description')
  window.history.replaceState({}, '', url.toString())
})
