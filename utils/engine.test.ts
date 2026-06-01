import { describe, it, expect } from 'vitest'
import {
  emptyState,
  eff,
  classify,
  redflags,
  qualify,
  UNSURE,
  type ProjectState,
  type Vector
} from './engine'

/** Build a state from the empty baseline with overrides. */
function state(overrides: Partial<ProjectState> = {}): ProjectState {
  return { ...emptyState(), ...overrides }
}

/** Shortcut: full qualification vector from a partial state. */
function vec(overrides: Partial<ProjectState> = {}): Vector {
  return eff(state(overrides)).vector
}

describe('eff — prudent defaults', () => {
  it('keeps explicit answers untouched', () => {
    const { vector, confirm } = eff(
      state({ rapport: 'adosse', debiteur: 'identifie', couverture: 'dediee', stabilite: 'aucune', distribution: 'pro' })
    )
    expect(confirm).toEqual([])
    expect(vector.rapport).toBe('adosse')
    expect(vector.couverture).toBe('dediee')
    expect(vector.distribution).toBe('pro')
  })

  it('applies prudent defaults to `?` answers and flags them', () => {
    const { vector, confirm } = eff(
      state({ rapport: UNSURE, debiteur: UNSURE, garant: UNSURE, couverture: UNSURE, stabilite: UNSURE, distribution: UNSURE })
    )
    expect(vector.rapport).toBe('adosse')
    expect(vector.debiteur).toBe('identifie')
    expect(vector.garant).toBe('identifie')
    expect(vector.couverture).toBe('aucune')
    expect(vector.distribution).toBe('retail')
    // every `?` axis is recorded for "to confirm"
    expect(confirm).toEqual(
      expect.arrayContaining(['rapport', 'debiteur', 'garant', 'couverture', 'stabilite', 'distribution'])
    )
  })

  it('forces couverture = "na" when rapport is native (and does not flag it)', () => {
    const { vector, confirm } = eff(state({ rapport: 'natif', couverture: UNSURE }))
    expect(vector.couverture).toBe('na')
    expect(confirm).not.toContain('couverture')
  })

  it('defaults stabilite to "monnaie" when payment/reserve function is present', () => {
    expect(eff(state({ stabilite: UNSURE, fonctions: ['paiement'] })).vector.stabilite).toBe('monnaie')
    expect(eff(state({ stabilite: UNSURE, fonctions: ['reserve'] })).vector.stabilite).toBe('monnaie')
    expect(eff(state({ stabilite: UNSURE, fonctions: ['utility'] })).vector.stabilite).toBe('aucune')
  })
})

describe('classify — ordered rules, first match', () => {
  it('instrument when rights include revenues', () => {
    expect(classify(vec({ droits: ['revenus'] }))).toBe('instrument')
  })

  it('instrument when claim on a financial asset', () => {
    expect(classify(vec({ rapport: 'titre', titre_type: 'financier' }))).toBe('instrument')
  })

  it('governance votes alone are NOT an instrument', () => {
    expect(classify(vec({ droits: ['votes'], fonctions: ['gouvernance'], fongibilite: 'fongible', stabilite: 'aucune' })))
      .toBe('utility')
  })

  it('nft when non-fungible or semi-fungible', () => {
    expect(classify(vec({ fongibilite: 'non-fongible' }))).toBe('nft')
    expect(classify(vec({ fongibilite: 'semi' }))).toBe('nft')
  })

  it('emt when pegged to a single currency', () => {
    expect(classify(vec({ fongibilite: 'fongible', stabilite: 'monnaie' }))).toBe('emt')
  })

  it('art when pegged to a basket', () => {
    expect(classify(vec({ fongibilite: 'fongible', stabilite: 'panier' }))).toBe('art')
  })

  it('utility as the fallback', () => {
    expect(classify(vec({ fongibilite: 'fongible', stabilite: 'aucune' }))).toBe('utility')
  })

  it('revenues rule beats the nft rule (order matters)', () => {
    expect(classify(vec({ fongibilite: 'non-fongible', droits: ['revenus'] }))).toBe('instrument')
  })
})

describe('redflags — cumulative overlays', () => {
  function keys(s: ProjectState) {
    const { vector, cls, flags } = qualify(s)
    void vector
    return { cls, keys: flags.map((f) => f.key) }
  }

  it('limbo: stable target with diffuse/absent debtor', () => {
    expect(keys(state({ stabilite: 'monnaie', debiteur: 'diffus', fongibilite: 'fongible' })).keys).toContain('limbo')
  })

  it('security: yield promised on a utility/nft', () => {
    const r = keys(state({ fongibilite: 'fongible', stabilite: 'aucune', rendement: 'oui' }))
    expect(r.cls).toBe('utility')
    expect(r.keys).toContain('security')
  })

  it('algo: stable target on a native token (no reserve)', () => {
    expect(keys(state({ rapport: 'natif', stabilite: 'monnaie', fongibilite: 'fongible' })).keys).toContain('algo')
  })

  it('nftserie: nft sold by series or geared to investment', () => {
    expect(keys(state({ fongibilite: 'semi' })).keys).toContain('nftserie')
    expect(keys(state({ fongibilite: 'non-fongible', fonctions: ['placement'] })).keys).toContain('nftserie')
  })

  it('retail: public distribution on a heavy class', () => {
    expect(keys(state({ fongibilite: 'fongible', stabilite: 'monnaie', distribution: 'retail' })).keys).toContain('retail')
  })

  it('custody: holding users funds/keys', () => {
    expect(keys(state({ fongibilite: 'fongible', stabilite: 'aucune', custody: 'oui' })).keys).toContain('custody')
  })

  it('juridiction: info flag when outside the EU (and none when EU or unset)', () => {
    expect(keys(state({ fongibilite: 'fongible', stabilite: 'aucune', juridiction: 'hors-ue' })).keys).toContain('juridiction')
    expect(keys(state({ fongibilite: 'fongible', stabilite: 'aucune', juridiction: 'ue' })).keys).not.toContain('juridiction')
    expect(keys(state({ fongibilite: 'fongible', stabilite: 'aucune' })).keys).not.toContain('juridiction')
  })

  it('incoherence: native token that nonetheless has a debtor or a reserve', () => {
    expect(keys(state({ rapport: 'natif', debiteur: 'identifie', fongibilite: 'fongible', stabilite: 'aucune' })).keys).toContain('incoherence')
    expect(keys(state({ rapport: 'natif', couverture: 'mutualisee', fongibilite: 'fongible', stabilite: 'aucune' })).keys).toContain('incoherence')
  })

  it('a clean utility token raises no flags', () => {
    const r = keys(state({ fongibilite: 'fongible', stabilite: 'aucune', rendement: 'non', juridiction: 'ue', custody: 'non', distribution: 'pro' }))
    expect(r.cls).toBe('utility')
    expect(r.keys).toEqual([])
  })
})

describe('qualify — end to end', () => {
  it('classic USDC-style stablecoin → emt + retail flag', () => {
    const q = qualify(state({
      fongibilite: 'fongible',
      rapport: 'adosse',
      couverture: 'dediee',
      debiteur: 'identifie',
      stabilite: 'monnaie',
      distribution: 'retail',
      juridiction: 'ue',
      custody: 'non'
    }))
    expect(q.cls).toBe('emt')
    expect(q.flags.map((f) => f.key)).toContain('retail')
    expect(q.confirm).toEqual([])
  })
})
