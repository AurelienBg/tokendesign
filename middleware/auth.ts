/**
 * Optional auth guard. Apply per-page with:
 *   definePageMeta({ middleware: 'auth' })
 * Local-first routes (Create / Analyze / Build) do NOT use it — anonymous
 * users keep their data in localStorage.
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (user.value) return

  // Strategy 'prefix' → every route is /en/* or /fr/*. Derive the locale from
  // the current path so we always redirect to a *prefixed* /login (avoids the
  // "No match for /login" router warning that localePath can produce inside
  // middleware before i18n is fully resolved).
  const seg = to.path.split('/')[1]
  const locale = seg === 'fr' ? 'fr' : 'en'
  return navigateTo({ path: `/${locale}/login`, query: { next: to.fullPath } })
})
