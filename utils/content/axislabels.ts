/**
 * Compact axis + value labels for the configurator and the reference library
 * (Module 2). Short forms, bilingual — distinct from the descriptive VMAP used
 * in the dossier. Functions/rights reuse LABS (utils/content/dossier.ts).
 */
import type { Locale } from './types'

/** Short axis names for the vector readout + matrix headers. */
export const AXIS_SHORT: Record<Locale, Record<string, string>> = {
  fr: { fongibilite: 'Fong', rapport: 'Rapport', couverture: 'Couv', debiteur: 'Débit', garant: 'Garant', transfer: 'Transf' },
  en: { fongibilite: 'Fung', rapport: 'Relation', couverture: 'Cover', debiteur: 'Debtor', garant: 'Guarantor', transfer: 'Transfer' }
}

/** Configurator group labels (A1–A6). */
export const AXIS_GROUP: Record<Locale, Record<string, string>> = {
  fr: {
    fongibilite: 'A1 · Fongibilité',
    rapport: 'A2 · Rapport',
    couverture: 'A3 · Couverture',
    debiteur: 'A4 · Débiteur',
    garant: 'A5 · Garant',
    transfer: 'A6 · Transférabilité'
  },
  en: {
    fongibilite: 'A1 · Fungibility',
    rapport: 'A2 · Relation',
    couverture: 'A3 · Coverage',
    debiteur: 'A4 · Debtor',
    garant: 'A5 · Guarantor',
    transfer: 'A6 · Transferability'
  }
}

export const AXIS_VALUE: Record<Locale, Record<string, Record<string, string>>> = {
  fr: {
    fongibilite: { fongible: 'fongible', semi: 'semi-fongible', 'non-fongible': 'non-fongible' },
    rapport: { natif: 'natif', adosse: 'adossé', titre: 'titre représentatif' },
    couverture: { na: 'n/a', aucune: 'aucune (créance générale)', mutualisee: 'mutualisée', dediee: 'dédiée-allouée' },
    debiteur: { aucun: 'aucun', diffus: 'diffus', identifie: 'identifié' },
    garant: { aucun: 'aucun', diffus: 'diffus', identifie: 'identifié' },
    transfer: { libre: 'libre', gelable: 'gelable', permissionnee: 'permissionnée', 'non-transferable': 'non-transférable' }
  },
  en: {
    fongibilite: { fongible: 'fungible', semi: 'semi-fungible', 'non-fongible': 'non-fungible' },
    rapport: { natif: 'native', adosse: 'backed', titre: 'claim' },
    couverture: { na: 'n/a', aucune: 'none (general claim)', mutualisee: 'pooled', dediee: 'dedicated/allocated' },
    debiteur: { aucun: 'none', diffus: 'diffuse', identifie: 'identified' },
    garant: { aucun: 'none', diffus: 'diffuse', identifie: 'identified' },
    transfer: { libre: 'free', gelable: 'freezable', permissionnee: 'permissioned', 'non-transferable': 'non-transferable' }
  }
}

/** Ordered values per categorical axis (for the configurator UI). */
export const AXIS_ORDER: Record<string, string[]> = {
  fongibilite: ['fongible', 'semi', 'non-fongible'],
  rapport: ['natif', 'adosse', 'titre'],
  couverture: ['na', 'aucune', 'mutualisee', 'dediee'],
  debiteur: ['aucun', 'diffus', 'identifie'],
  garant: ['aucun', 'diffus', 'identifie'],
  transfer: ['libre', 'gelable', 'permissionnee', 'non-transferable']
}

export const FONCTIONS_ORDER = ['paiement', 'reserve', 'placement', 'utility', 'gouvernance', 'collection', 'preuve'] as const
export const DROITS_ORDER = ['revenus', 'votes', 'royalties', 'expiration', 'consommable'] as const
