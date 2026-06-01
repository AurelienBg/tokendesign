/**
 * Optional auth guard. Apply per-page with:
 *   definePageMeta({ middleware: 'auth' })
 * Local-first routes (Create / Analyze / Build) do NOT use it — anonymous
 * users keep their data in localStorage.
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    const localePath = useLocalePath()
    return navigateTo({ path: localePath('/login'), query: { next: to.fullPath } })
  }
})
