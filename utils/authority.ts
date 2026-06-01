/**
 * Authority engine (spec §2 layer B — "Build an app").
 *
 * For apps that act on users' assets, the question isn't the token's class but
 * how much POWER you take over the user's wallet, with what reversibility, and
 * who holds the keys. Pure, typed, tested — separate from the Layer A engine.
 *
 * Authority scale (escalating): read → propose → authorize → deposit,
 * crossed by scope × duration × revocability × consent × key-holder.
 * Mapped to XRPL primitives in utils/content/authority.ts (no ERC-20 blanket
 * `approve`; prefer native Escrow / Payment Channel / AMM, scoped delegation).
 *
 * NOT legal advice.
 */

export type AuthorityLevel = 'read' | 'propose' | 'authorize' | 'deposit'
export type Scope = 'narrow' | 'broad'
export type Duration = 'oneshot' | 'timeboxed' | 'indefinite'
export type Revocability = 'user' | 'issuer' | 'irrevocable'
export type Consent = 'peraction' | 'blanket'
export type Keyholder = 'user' | 'shared' | 'custodian'

export interface AuthorityState {
  level: AuthorityLevel | null
  scope: Scope | null
  duration: Duration | null
  revocability: Revocability | null
  consent: Consent | null
  keyholder: Keyholder | null
}

export type RiskBand = 'low' | 'medium' | 'high' | 'critical'

export type AuthorityFlagKey =
  | 'custodian_keys' | 'blanket_broad' | 'irrevocable' | 'indefinite_lock' | 'deposit_custody'

export type AuthorityCheckId =
  | 'c_readonly' | 'c_scope_min' | 'c_native' | 'c_revoke_ux' | 'c_keys'
  | 'c_segregation' | 'c_no_rehypo' | 'c_audit' | 'c_incident' | 'c_legal_casp' | 'c_insurance'

export interface AuthorityAssessment {
  level: AuthorityLevel
  band: RiskBand
  score: number
  flags: AuthorityFlagKey[]
  checklist: AuthorityCheckId[]
}

/** Only levels that take real power need the crossing dimensions. */
export const DIMENSIONED_LEVELS: AuthorityLevel[] = ['authorize', 'deposit']

export function emptyAuthority(): AuthorityState {
  return { level: null, scope: null, duration: null, revocability: null, consent: null, keyholder: null }
}

const LEVEL_BASE: Record<AuthorityLevel, number> = { read: 0, propose: 1, authorize: 2, deposit: 3 }

/** Escalating risk score from level + dimensions. */
function score(s: AuthorityState, level: AuthorityLevel): number {
  let n = LEVEL_BASE[level]
  if (s.keyholder === 'custodian') n += 2
  else if (s.keyholder === 'shared') n += 1
  if (s.consent === 'blanket' && s.scope === 'broad') n += 1
  if (s.revocability === 'irrevocable') n += 2
  else if (s.revocability === 'issuer') n += 1
  if (s.duration === 'indefinite' && s.revocability !== null && s.revocability !== 'user') n += 1
  return n
}

function band(n: number): RiskBand {
  if (n <= 1) return 'low'
  if (n === 2) return 'medium'
  if (n <= 4) return 'high'
  return 'critical'
}

function flags(s: AuthorityState, level: AuthorityLevel): AuthorityFlagKey[] {
  const out: AuthorityFlagKey[] = []
  if (level === 'deposit') out.push('deposit_custody')
  if (s.keyholder === 'custodian') out.push('custodian_keys')
  if (s.consent === 'blanket' && s.scope === 'broad') out.push('blanket_broad')
  if (s.revocability === 'irrevocable') out.push('irrevocable')
  if (s.duration === 'indefinite' && s.revocability != null && s.revocability !== 'user') out.push('indefinite_lock')
  return out
}

function checklist(s: AuthorityState, level: AuthorityLevel): AuthorityCheckId[] {
  const out: AuthorityCheckId[] = []
  const holdsKeys = s.keyholder === 'custodian'
  const dimensioned = level === 'authorize' || level === 'deposit'

  if (level === 'read') out.push('c_readonly')
  if (dimensioned) {
    out.push('c_scope_min', 'c_native', 'c_revoke_ux', 'c_audit')
  }
  if (s.keyholder === 'shared' || holdsKeys) out.push('c_keys')
  if (holdsKeys || level === 'deposit') out.push('c_segregation', 'c_no_rehypo', 'c_legal_casp')
  if (holdsKeys || level === 'deposit' || s.keyholder === 'shared') out.push('c_incident')
  if (holdsKeys) out.push('c_insurance')

  // Stable de-dup preserving order.
  return out.filter((id, i) => out.indexOf(id) === i)
}

export function assessAuthority(s: AuthorityState): AuthorityAssessment {
  const level: AuthorityLevel = s.level ?? 'read'
  const n = score(s, level)
  return { level, band: band(n), score: n, flags: flags(s, level), checklist: checklist(s, level) }
}
