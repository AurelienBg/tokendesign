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

// ── Layer D — launch checklist (lifecycle + ratchets) ────────────────────────

export type ChecklistItemId =
  | 'c_vector' | 'c_legal' | 'c_value' | 'c_custody'
  | 'e_agrement' | 'e_mint' | 'e_whitepaper' | 'e_prospectus' | 'e_kyc'
  | 'd_venues' | 'd_marketing' | 'd_passport'
  | 'v_reserve' | 'v_audit' | 'v_reporting' | 'v_nft' | 'v_utility' | 'v_instrument' | 'v_custody'
  | 'f_winddown' | 'f_none'

export type StageId = 'conception' | 'issuance' | 'distribution' | 'life' | 'end'
export type StageWeight = 'heavy' | 'light' | null

export interface ChecklistItem {
  id: ChecklistItemId
  /** A ratchet — a point of no return (must be locked upstream). */
  cliquet: boolean
}

export interface Stage {
  index: number
  id: StageId
  items: ChecklistItem[]
  weight: StageWeight
}

const STAGE_IDS: StageId[] = ['conception', 'issuance', 'distribution', 'life', 'end']

/**
 * Build the lifecycle checklist filtered by class + launch conditions
 * (spec §4 / §2 layer D). Ratchets: authorization-before-issuance,
 * retail-distribution, taking-custody. Mirrors the `stages` array of the
 * prototype's buildDossier().
 */
export function buildChecklist(v: Vector, cls: TokenClass): Stage[] {
  const retail = v.distribution === 'retail'
  const cust = v.custody === 'oui'
  const heavy = cls === 'emt' || cls === 'art'
  const mica = cls === 'emt' || cls === 'art' || cls === 'utility'

  const it = (id: ChecklistItemId, cliquet = false): ChecklistItem => ({ id, cliquet })

  const itemsByStage: ChecklistItem[][] = [
    // 0 — Conception
    [it('c_vector'), it('c_legal'), it('c_value'), it('c_custody')],
    // 1 — Issuance
    [
      ...(heavy || cls === 'instrument' ? [it('e_agrement', true)] : []),
      it('e_mint'),
      ...(mica ? [it('e_whitepaper')] : []),
      ...(cls === 'instrument' ? [it('e_prospectus')] : []),
      ...(retail || cust ? [it('e_kyc')] : [])
    ],
    // 2 — Distribution
    [
      it('d_venues'),
      ...(retail ? [it('d_marketing', true)] : []),
      ...(v.juridiction !== 'ue' ? [it('d_passport')] : [])
    ],
    // 3 — Life
    [
      ...(heavy ? [it('v_reserve'), it('v_audit'), it('v_reporting')] : []),
      ...(cls === 'nft' ? [it('v_nft')] : []),
      ...(cls === 'utility' ? [it('v_utility')] : []),
      ...(cls === 'instrument' ? [it('v_instrument')] : []),
      ...(cust ? [it('v_custody', true)] : [])
    ],
    // 4 — End
    [...(heavy ? [it('f_winddown')] : [it('f_none')])]
  ]

  return itemsByStage.map((items, index) => ({
    index,
    id: STAGE_IDS[index] as StageId,
    items,
    weight: index === 3 ? (heavy ? 'heavy' : cls === 'nft' ? 'light' : null) : null
  }))
}

// ── Top-level convenience ────────────────────────────────────────────────────

export interface Dossier extends Qualification {
  stages: Stage[]
}

/** Run the full Layer A qualification: defaults → class → red flags. */
export function qualify(state: ProjectState): Qualification {
  const { vector, confirm } = eff(state)
  const cls = classify(vector)
  const flags = redflags(vector, cls, state)
  return { vector, confirm, cls, flags }
}

/** Full dossier model: qualification + lifecycle checklist. */
export function buildDossier(state: ProjectState): Dossier {
  const q = qualify(state)
  return { ...q, stages: buildChecklist(q.vector, q.cls) }
}
