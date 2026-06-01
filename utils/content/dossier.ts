/**
 * Dossier display dictionaries — vector value labels (VMAP), function/right
 * labels (LABS) and axis labels, FR/EN. Ported from the prototype.
 */
import type { Locale } from './types'

export interface VectorMaps {
  fongibilite: Record<string, string>
  rapport: Record<string, string>
  couverture: Record<string, string>
  debiteur: Record<string, string>
  garant: Record<string, string>
  transfer: Record<string, string>
}

export const VMAP: Record<Locale, VectorMaps> = {
  fr: {
    fongibilite: {
      fongible: 'Fongible — unités interchangeables',
      semi: 'Semi-fongible — séries / éditions',
      'non-fongible': 'Non-fongible — chaque exemplaire unique'
    },
    rapport: {
      natif: 'Natif — ne représente que lui-même',
      adosse: 'Adossé à une réserve détenue',
      titre: 'Titre représentatif d\'un autre actif'
    },
    couverture: {
      na: '—',
      aucune: 'Créance générale (rien de cantonné)',
      mutualisee: 'Réserve mutualisée',
      dediee: 'Réserve dédiée par détenteur'
    },
    debiteur: {
      aucun: 'Personne ne doit rien',
      identifie: 'Une entité identifiée doit',
      diffus: 'Diffus / décentralisé'
    },
    garant: {
      aucun: 'Aucun attesteur',
      identifie: 'Attesteur identifié',
      diffus: 'Attestation diffuse'
    },
    transfer: {
      libre: 'Librement transférable',
      gelable: 'Transférable, gelable par l\'émetteur',
      permissionnee: 'Transférable vers comptes autorisés',
      'non-transferable': 'Non-transférable'
    }
  },
  en: {
    fongibilite: {
      fongible: 'Fungible — interchangeable units',
      semi: 'Semi-fungible — series / editions',
      'non-fongible': 'Non-fungible — each one unique'
    },
    rapport: {
      natif: 'Native — represents only itself',
      adosse: 'Backed by a held reserve',
      titre: 'Claim representing another asset'
    },
    couverture: {
      na: '—',
      aucune: 'General claim (nothing ring-fenced)',
      mutualisee: 'Pooled reserve',
      dediee: 'Reserve dedicated per holder'
    },
    debiteur: {
      aucun: 'Nobody owes anything',
      identifie: 'An identified entity owes',
      diffus: 'Diffuse / decentralized'
    },
    garant: {
      aucun: 'No attester',
      identifie: 'Identified attester',
      diffus: 'Diffuse attestation'
    },
    transfer: {
      libre: 'Freely transferable',
      gelable: 'Transferable, freezable by issuer',
      permissionnee: 'Transferable to authorized accounts',
      'non-transferable': 'Non-transferable'
    }
  }
}

export interface ValueLabels {
  fonctions: Record<string, string>
  droits: Record<string, string>
}

export const LABS: Record<Locale, ValueLabels> = {
  fr: {
    fonctions: {
      paiement: 'Payer',
      reserve: 'Réserve de valeur',
      placement: 'Placement / rendement',
      utility: 'Accès à un service',
      gouvernance: 'Gouvernance / vote',
      collection: 'Collection / statut',
      preuve: 'Preuve / attestation'
    },
    droits: {
      revenus: 'Revenus',
      votes: 'Votes',
      royalties: 'Royalties',
      expiration: 'Expiration',
      consommable: 'Consommable'
    }
  },
  en: {
    fonctions: {
      paiement: 'Pay',
      reserve: 'Store of value',
      placement: 'Investment / yield',
      utility: 'Service access',
      gouvernance: 'Governance / vote',
      collection: 'Collection / status',
      preuve: 'Proof / attestation'
    },
    droits: {
      revenus: 'Revenues',
      votes: 'Votes',
      royalties: 'Royalties',
      expiration: 'Expiration',
      consommable: 'Consumable'
    }
  }
}

/** Vector axis labels for the identity grid. */
export const AXIS_LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    fongibilite: 'Fongibilité',
    rapport: 'Rapport au sous-jacent',
    couverture: 'Couverture',
    debiteur: 'Qui doit (débiteur)',
    garant: 'Qui atteste (garant)',
    transfer: 'Transférabilité',
    fonctions: 'Fonctions',
    droits: 'Droits'
  },
  en: {
    fongibilite: 'Fungibility',
    rapport: 'Relation to underlying',
    couverture: 'Coverage',
    debiteur: 'Who owes (debtor)',
    garant: 'Who attests (guarantor)',
    transfer: 'Transferability',
    fonctions: 'Functions',
    droits: 'Rights'
  }
}
