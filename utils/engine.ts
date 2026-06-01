/**
 * Token Design — deterministic engine (spec §4).
 *
 * Pure TypeScript, no Nuxt/Vue imports, fully unit-tested. This is the single
 * source of qualification logic shared by the 3 angles (Create / Analyze /
 * Build an app): the logic is coded ONCE here.
 *
 * Ported from the `eff` / `classify` / `redflags` functions of the index.html
 * prototype. Substance over form: we never ask for the technical standard
 * (MPT / IOU / NFT) — it does not enter qualification.
 *
 * NOT legal advice. The output flags an EU framing (MiCA / MiFID II) and
 * always defers to professional counsel.
 */

// ── Axis value unions (MECE, stable keys) ──────────────────────────────────

export type Fongibilite = 'fongible' | 'semi' | 'non-fongible'
export type Rapport = 'natif' | 'adosse' | 'titre'
export type TitreType = 'financier' | 'reel' | 'autre'
export type Couverture = 'aucune' | 'mutualisee' | 'dediee' | 'na'
export type Debiteur = 'aucun' | 'identifie' | 'diffus'
export type Garant = 'aucun' | 'identifie' | 'diffus'
export type Transfer = 'libre' | 'gelable' | 'permissionnee' | 'non-transferable'
export type Fonction =
  | 'paiement' | 'reserve' | 'placement' | 'utility'
  | 'gouvernance' | 'collection' | 'preuve'
export type Droit = 'revenus' | 'votes' | 'royalties' | 'expiration' | 'consommable'
export type Rendement = 'oui' | 'non'
export type Stabilite = 'monnaie' | 'panier' | 'aucune'
export type Distribution = 'retail' | 'pro' | 'interne'
export type Juridiction = 'ue' | 'hors-ue' | 'mondial'
export type Custody = 'oui' | 'non'
export type Chemin = 'creer' | 'autres'

/** Sentinel for "I don't know" answers → triggers a prudent default + flag. */
export const UNSURE = '?' as const
export type Unsure = typeof UNSURE

// ── Outputs ────────────────────────────────────────────────────────────────

export type TokenClass = 'instrument' | 'nft' | 'emt' | 'art' | 'utility'
export type RedFlagLevel = 'danger' | 'warn' | 'info'
export type RedFlagKey =
  | 'limbo' | 'security' | 'algo' | 'nftserie'
  | 'retail' | 'custody' | 'juridiction' | 'incoherence'

export interface RedFlag {
  level: RedFlagLevel
  key: RedFlagKey
}

// ── Raw intake answers ──────────────────────────────────────────────────────

/**
 * The founder's raw answers. Axes flagged `unsure: true` in the intake may
 * hold the `?` sentinel; required single-choice axes may still be `null`
 * before the wizard validates them.
 */
export interface ProjectState {
  chemin: Chemin[]
  fongibilite: Fongibilite | null
  rapport: Rapport | Unsure | null
  titre_type: TitreType | null
  couverture: Couverture | Unsure | null
  debiteur: Debiteur | Unsure | null
  garant: Garant | Unsure | null
  transfer: Transfer | null
  fonctions: Fonction[]
  droits: Droit[]
  rendement: Rendement | null
  stabilite: Stabilite | Unsure | null
  distribution: Distribution | Unsure | null
  juridiction: Juridiction | null
  custody: Custody | null
}

/** Keys that carry a prudent default when the answer is `?`. */
export type ConfirmableKey =
  | 'rapport' | 'couverture' | 'debiteur' | 'garant' | 'stabilite' | 'distribution'

/**
 * The effective morphological vector, after prudent defaults have been
 * applied to `?` answers. This is what the 4 layers operate on.
 */
export interface Vector {
  fongibilite: Fongibilite | null
  rapport: Rapport
  titre_type: TitreType | null
  couverture: Couverture
  debiteur: Debiteur
  garant: Garant
  transfer: Transfer | null
  fonctions: Fonction[]
  droits: Droit[]
  rendement: Rendement | null
  stabilite: Stabilite
  distribution: Distribution
  juridiction: Juridiction | null
  custody: Custody | null
}

export interface EffectiveResult {
  /** Vector with prudent defaults applied. */
  vector: Vector
  /** Axes whose value was inferred from a `?` answer → mark "to confirm". */
  confirm: ConfirmableKey[]
}

export interface Qualification extends EffectiveResult {
  cls: TokenClass
  flags: RedFlag[]
}

// ── Layer A.1 — prudent defaults (`eff`) ─────────────────────────────────────

/** Build a fresh, empty intake state. */
export function emptyState(): ProjectState {
  return {
    chemin: [],
    fongibilite: null,
    rapport: null,
    titre_type: null,
    couverture: null,
    debiteur: null,
    garant: null,
    transfer: null,
    fonctions: [],
    droits: [],
    rendement: null,
    stabilite: null,
    distribution: null,
    juridiction: null,
    custody: null
  }
}

/**
 * Apply prudent defaults to `?` answers and record which axes were inferred.
 * Mirrors `eff()` in the prototype.
 */
export function eff(state: ProjectState): EffectiveResult {
  const confirm: ConfirmableKey[] = []

  // Resolve a confirmable axis: `?` → prudent default (flagged), else as-is.
  function g<T extends string>(key: ConfirmableKey, value: T | Unsure | null, fallback: T): T {
    if (value === UNSURE) {
      confirm.push(key)
      return fallback
    }
    return (value ?? fallback) as T
  }

  const stabiliteDefault: Stabilite =
    state.fonctions.includes('reserve') || state.fonctions.includes('paiement')
      ? 'monnaie'
      : 'aucune'

  const rapport = g<Rapport>('rapport', state.rapport, 'adosse')
  const couverture: Couverture =
    rapport === 'natif' ? 'na' : g<Couverture>('couverture', state.couverture, 'aucune')

  const vector: Vector = {
    fongibilite: state.fongibilite,
    rapport,
    titre_type: state.titre_type,
    couverture,
    debiteur: g<Debiteur>('debiteur', state.debiteur, 'identifie'),
    garant: g<Garant>('garant', state.garant, 'identifie'),
    transfer: state.transfer,
    fonctions: state.fonctions,
    droits: state.droits,
    rendement: state.rendement,
    stabilite: g<Stabilite>('stabilite', state.stabilite, stabiliteDefault),
    distribution: g<Distribution>('distribution', state.distribution, 'retail'),
    juridiction: state.juridiction,
    custody: state.custody
  }

  return { vector, confirm }
}

// ── Layer A.2 — classification (ordered rules, first match) ──────────────────

/**
 * Classify the token from its vector. Ordered rules, first match wins
 * (spec §4). Governance votes alone do NOT make an instrument.
 */
export function classify(v: Vector): TokenClass {
  if (v.droits.includes('revenus') || (v.rapport === 'titre' && v.titre_type === 'financier')) {
    return 'instrument'
  }
  if (v.fongibilite === 'non-fongible' || v.fongibilite === 'semi') return 'nft'
  if (v.stabilite === 'monnaie') return 'emt'
  if (v.stabilite === 'panier') return 'art'
  return 'utility'
}

// ── Layer A.3 — red flags (cumulative overlays) ──────────────────────────────

/**
 * Compute cumulative red-flag overlays (spec §4). `state` is needed for the
 * incoherence check, which inspects the RAW answers (not the defaulted vector).
 */
export function redflags(v: Vector, cls: TokenClass, state: ProjectState): RedFlag[] {
  const out: RedFlag[] = []

  if (v.stabilite !== 'aucune' && (v.debiteur === 'diffus' || v.debiteur === 'aucun')) {
    out.push({ level: 'danger', key: 'limbo' })
  }
  if (v.rendement === 'oui' && (cls === 'utility' || cls === 'nft')) {
    out.push({ level: 'danger', key: 'security' })
  }
  if (v.stabilite !== 'aucune' && v.rapport === 'natif') {
    out.push({ level: 'danger', key: 'algo' })
  }
  if (cls === 'nft' && (v.fongibilite === 'semi' || v.fonctions.includes('placement'))) {
    out.push({ level: 'warn', key: 'nftserie' })
  }
  if (v.distribution === 'retail' && (cls === 'emt' || cls === 'art' || cls === 'instrument')) {
    out.push({ level: 'warn', key: 'retail' })
  }
  if (v.custody === 'oui') {
    out.push({ level: 'warn', key: 'custody' })
  }
  if (v.juridiction !== null && v.juridiction !== 'ue') {
    out.push({ level: 'info', key: 'juridiction' })
  }

  // Incoherence — inspect raw answers: a "native" token cannot have a debtor
  // or a reserve. The dossier keeps the prudent assumption; flag for review.
  const incoherent =
    (state.rapport === 'natif' && (state.debiteur === 'identifie' || state.debiteur === 'diffus')) ||
    (state.rapport === 'natif' && (state.couverture === 'mutualisee' || state.couverture === 'dediee'))
  if (incoherent) {
    out.push({ level: 'warn', key: 'incoherence' })
  }

  return out
}

// ── Top-level convenience ────────────────────────────────────────────────────

/** Run the full Layer A qualification: defaults → class → red flags. */
export function qualify(state: ProjectState): Qualification {
  const { vector, confirm } = eff(state)
  const cls = classify(vector)
  const flags = redflags(vector, cls, state)
  return { vector, confirm, cls, flags }
}
