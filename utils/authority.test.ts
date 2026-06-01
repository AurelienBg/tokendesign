import { describe, it, expect } from 'vitest'
import { assessAuthority, emptyAuthority, type AuthorityState } from './authority'

function st(overrides: Partial<AuthorityState> = {}): AuthorityState {
  return { ...emptyAuthority(), ...overrides }
}

describe('assessAuthority — authority scale → risk', () => {
  it('read is low risk with a read-only checklist and no custody flags', () => {
    const a = assessAuthority(st({ level: 'read' }))
    expect(a.band).toBe('low')
    expect(a.checklist).toContain('c_readonly')
    expect(a.flags).toEqual([])
  })

  it('propose (user signs each action) is low risk', () => {
    expect(assessAuthority(st({ level: 'propose' })).band).toBe('low')
  })

  it('authorize (minimal) is medium and asks to minimize scope + prefer native objects', () => {
    const a = assessAuthority(st({ level: 'authorize', scope: 'narrow', duration: 'oneshot', revocability: 'user', consent: 'peraction', keyholder: 'user' }))
    expect(a.band).toBe('medium')
    expect(a.checklist).toEqual(expect.arrayContaining(['c_scope_min', 'c_native', 'c_revoke_ux', 'c_audit']))
  })

  it('broad + blanket consent raises the over-permission flag', () => {
    const a = assessAuthority(st({ level: 'authorize', scope: 'broad', consent: 'blanket', revocability: 'user', keyholder: 'user' }))
    expect(a.flags).toContain('blanket_broad')
    expect(a.band).toBe('high')
  })

  it('deposit (minimal) is at least high', () => {
    const a = assessAuthority(st({ level: 'deposit', keyholder: 'user', revocability: 'user' }))
    expect(['high', 'critical']).toContain(a.band)
    expect(a.flags).toContain('deposit_custody')
  })

  it('deposit + custodian keys + indefinite + irrevocable is critical with full custody checklist', () => {
    const a = assessAuthority(st({ level: 'deposit', scope: 'broad', duration: 'indefinite', revocability: 'irrevocable', consent: 'blanket', keyholder: 'custodian' }))
    expect(a.band).toBe('critical')
    expect(a.flags).toEqual(expect.arrayContaining(['deposit_custody', 'custodian_keys', 'irrevocable', 'indefinite_lock', 'blanket_broad']))
    expect(a.checklist).toEqual(expect.arrayContaining(['c_segregation', 'c_no_rehypo', 'c_legal_casp', 'c_insurance', 'c_keys']))
  })

  it('an unanswered level defaults to read (prudent)', () => {
    expect(assessAuthority(emptyAuthority()).level).toBe('read')
  })
})
