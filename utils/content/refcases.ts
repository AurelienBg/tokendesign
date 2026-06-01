/**
 * Reference library — 17 real-world cases (spec §2 / Module 2), ported from
 * grille-conception-token.html and expressed in the engine's stable value keys
 * (so the library, the configurator and Create all share one vocabulary).
 */
import type {
  Fongibilite, Rapport, Couverture, Debiteur, Garant, Transfer, Fonction, Droit
} from '~/utils/engine'
import type { Locale } from './types'

export interface ReferenceVector {
  fongibilite: Fongibilite
  rapport: Rapport
  couverture: Couverture
  debiteur: Debiteur
  garant: Garant
  transfer: Transfer
  fonctions: Fonction[]
  droits: Droit[]
}

export interface ReferenceCase {
  id: string
  name: Record<Locale, string>
  note: Record<Locale, string>
  v: ReferenceVector
}

export const REFCASES: ReferenceCase[] = [
  {
    id: 'bitcoin',
    name: { fr: 'Bitcoin', en: 'Bitcoin' },
    note: {
      fr: 'Actif natif pur — aucune contrepartie, aucune couverture.',
      en: 'Pure native asset — no counterparty, no coverage.'
    },
    v: { fongibilite: 'fongible', rapport: 'natif', couverture: 'na', debiteur: 'aucun', garant: 'aucun', transfer: 'libre', fonctions: ['paiement', 'reserve', 'placement'], droits: [] }
  },
  {
    id: 'cbdc',
    name: { fr: 'CBDC', en: 'CBDC' },
    note: {
      fr: 'Monnaie de base ; débiteur = banque centrale, sans risque de crédit.',
      en: 'Base money; debtor = central bank, no credit risk.'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'aucune', debiteur: 'identifie', garant: 'identifie', transfer: 'gelable', fonctions: ['paiement', 'reserve'], droits: [] }
  },
  {
    id: 'bank-deposit',
    name: { fr: 'Dépôt bancaire tokenisé', en: 'Tokenized bank deposit' },
    note: {
      fr: 'Monnaie interne ; créance sur une banque commerciale (risque de crédit).',
      en: 'Internal money; claim on a commercial bank (credit risk).'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'aucune', debiteur: 'identifie', garant: 'identifie', transfer: 'gelable', fonctions: ['paiement', 'reserve'], droits: [] }
  },
  {
    id: 'usdc',
    name: { fr: 'USDC', en: 'USDC' },
    note: {
      fr: 'EMT ; réserve mutualisée + droit au remboursement ; gel/blacklist possible.',
      en: 'EMT; pooled reserve + redemption right; freeze/blacklist possible.'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'mutualisee', debiteur: 'identifie', garant: 'identifie', transfer: 'gelable', fonctions: ['paiement', 'reserve'], droits: [] }
  },
  {
    id: 'dai',
    name: { fr: 'DAI', en: 'DAI' },
    note: {
      fr: 'Stablecoin crypto-collatéralisé ; « émetteur » = protocole gouverné (smart contracts).',
      en: 'Crypto-collateralized stablecoin; the “issuer” = a governed protocol (smart contracts).'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'mutualisee', debiteur: 'diffus', garant: 'diffus', transfer: 'libre', fonctions: ['paiement', 'reserve'], droits: ['revenus'] }
  },
  {
    id: 'bond',
    name: { fr: 'Obligation tokenisée', en: 'Tokenized bond' },
    note: {
      fr: 'Security token de dette ; coupon + maturité.',
      en: 'Debt security token; coupon + maturity.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'permissionnee', fonctions: ['placement'], droits: ['revenus', 'expiration'] }
  },
  {
    id: 'share',
    name: { fr: 'Action tokenisée', en: 'Tokenized share' },
    note: {
      fr: 'Security token de capital ; dividende + droit de vote.',
      en: 'Equity security token; dividend + voting right.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'permissionnee', fonctions: ['placement', 'gouvernance'], droits: ['revenus', 'votes'] }
  },
  {
    id: 'real-estate',
    name: { fr: 'Part immobilière tokenisée', en: 'Tokenized real-estate unit' },
    note: {
      fr: 'Sous-jacent unique ; A1 = fongibilité DU token, pas du bien.',
      en: 'Single underlying; A1 = fungibility OF the token, not of the asset.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'permissionnee', fonctions: ['placement'], droits: ['revenus', 'votes'] }
  },
  {
    id: 'gold',
    name: { fr: 'Or tokenisé (PAXG)', en: 'Tokenized gold (PAXG)' },
    note: {
      fr: 'Titre sur or physique alloué.',
      en: 'Claim on allocated physical gold.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'libre', fonctions: ['reserve', 'placement'], droits: [] }
  },
  {
    id: 'wbtc',
    name: { fr: 'WBTC (wrapped)', en: 'WBTC (wrapped)' },
    note: {
      fr: 'Wrapped ; le sous-jacent est un autre token (BTC 1:1).',
      en: 'Wrapped; the underlying is another token (BTC 1:1).'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'libre', fonctions: ['reserve', 'utility'], droits: [] }
  },
  {
    id: 'lp',
    name: { fr: 'LP token', en: 'LP token' },
    note: {
      fr: 'Position dynamique ; reçu de dépôt dans un pool de liquidité.',
      en: 'Dynamic position; deposit receipt in a liquidity pool.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'diffus', garant: 'diffus', transfer: 'libre', fonctions: ['placement'], droits: ['revenus'] }
  },
  {
    id: 'art-nft',
    name: { fr: 'NFT d\'art (1/1)', en: 'Art NFT (1/1)' },
    note: {
      fr: 'Garant ≠ débiteur : l\'artiste atteste l\'authenticité mais ne doit rien.',
      en: 'Guarantor ≠ debtor: the artist attests authenticity but owes nothing.'
    },
    v: { fongibilite: 'non-fongible', rapport: 'natif', couverture: 'na', debiteur: 'aucun', garant: 'identifie', transfer: 'libre', fonctions: ['placement', 'collection', 'preuve'], droits: ['royalties'] }
  },
  {
    id: 'carbon',
    name: { fr: 'Crédit carbone tokenisé', en: 'Tokenized carbon credit' },
    note: {
      fr: 'Titre + garant (registre) sans débiteur ; consommable au retrait — cellule valide hors diagonale.',
      en: 'Claim + guarantor (registry) with no debtor; consumed on retirement — a valid off-diagonal cell.'
    },
    v: { fongibilite: 'fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'aucun', garant: 'identifie', transfer: 'libre', fonctions: ['utility', 'preuve'], droits: ['expiration', 'consommable'] }
  },
  {
    id: 'voucher',
    name: { fr: 'Billet / voucher', en: 'Ticket / voucher' },
    note: {
      fr: 'Consommable (validé une fois) + expiration.',
      en: 'Consumable (validated once) + expiration.'
    },
    v: { fongibilite: 'non-fongible', rapport: 'titre', couverture: 'dediee', debiteur: 'identifie', garant: 'identifie', transfer: 'permissionnee', fonctions: ['utility'], droits: ['expiration', 'consommable'] }
  },
  {
    id: 'loyalty',
    name: { fr: 'Points de fidélité', en: 'Loyalty points' },
    note: {
      fr: 'Créance sur le programme ; souvent non cessible ; brûlé à l\'échange.',
      en: 'Claim on the program; often non-transferable; burned on redemption.'
    },
    v: { fongibilite: 'fongible', rapport: 'adosse', couverture: 'aucune', debiteur: 'identifie', garant: 'identifie', transfer: 'non-transferable', fonctions: ['paiement', 'utility'], droits: ['expiration', 'consommable'] }
  },
  {
    id: 'diploma',
    name: { fr: 'Diplôme / credential', en: 'Diploma / credential' },
    note: {
      fr: 'Le cas qui justifie A5 : garant identifié (université) / débiteur aucun ; soulbound.',
      en: 'The case that justifies A5: identified guarantor (university) / no debtor; soulbound.'
    },
    v: { fongibilite: 'non-fongible', rapport: 'natif', couverture: 'na', debiteur: 'aucun', garant: 'identifie', transfer: 'non-transferable', fonctions: ['preuve'], droits: [] }
  },
  {
    id: 'uni',
    name: { fr: 'UNI (gouvernance)', en: 'UNI (governance)' },
    note: {
      fr: 'Token de protocole ; aucune contrepartie ; droit de vote.',
      en: 'Protocol token; no counterparty; voting right.'
    },
    v: { fongibilite: 'fongible', rapport: 'natif', couverture: 'na', debiteur: 'aucun', garant: 'aucun', transfer: 'libre', fonctions: ['placement', 'gouvernance'], droits: ['votes'] }
  }
]

/** Categorical axes used for filtering + configurator matching. */
export const CATEGORICAL_AXES = ['fongibilite', 'rapport', 'couverture', 'debiteur', 'garant', 'transfer'] as const
export type CategoricalAxis = (typeof CATEGORICAL_AXES)[number]
