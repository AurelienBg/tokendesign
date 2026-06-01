/**
 * useAuthorityDossier — view-model for the "Build an app" result: risk band,
 * authority red flags, custody checklist, and the XRPL primitive mapping,
 * assembled from the authority store + bilingual content.
 */
import { storeToRefs } from 'pinia'
import { useAuthorityStore } from '~/stores/authority'
import type { AuthorityFlagKey } from '~/utils/authority'
import { BANDS, AUTH_FLAGS, AUTH_CHECKLIST, XRPL_MAP, type BandText, type XrplMap } from '~/utils/content/authority'
import type { Locale } from '~/utils/content/types'

export interface AuthFlagView { key: AuthorityFlagKey; title: string; body: string }
export interface AuthCheckView { id: string; label: string }

export function useAuthorityDossier() {
  const store = useAuthorityStore()
  const { assessment } = storeToRefs(store)
  const { locale } = useI18n()
  const loc = computed<Locale>(() => (locale.value === 'fr' ? 'fr' : 'en'))

  const band = computed<BandText>(() => BANDS[loc.value][assessment.value.band])

  const flags = computed<AuthFlagView[]>(() =>
    assessment.value.flags.map((k) => {
      const txt = AUTH_FLAGS[loc.value][k]
      return { key: k, title: txt.title, body: txt.body }
    })
  )

  const checklist = computed<AuthCheckView[]>(() =>
    assessment.value.checklist.map((id) => ({ id, label: AUTH_CHECKLIST[loc.value][id] }))
  )

  const xrpl = computed<XrplMap>(() => XRPL_MAP[loc.value][assessment.value.level])

  return { assessment, band, flags, checklist, xrpl }
}
