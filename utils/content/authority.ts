/**
 * "Build an app" content (spec §2 layer B), bilingual. Questions for the
 * authority scale + dimensions, risk-band labels, authority red flags, the
 * custody checklist, and the XRPL primitive mapping per authority level.
 *
 * XRPL note: no ERC-20 blanket `approve`. Prefer native, ledger-enforced
 * objects (Escrow, Payment Channel, AMM) and scoped delegation. Permission
 * Delegation (XLS-75) — verify the amendment status at build time. NOT legal advice.
 */
import type { AuthorityLevel, RiskBand, AuthorityFlagKey, AuthorityCheckId, AuthorityState } from '~/utils/authority'
import type { Locale, OptionText } from './types'

export interface AuthQuestionText {
  label: string
  hint?: string
  options: Record<string, OptionText>
}
export interface AuthQuestionDef {
  key: keyof AuthorityState
  order: string[]
  /** Only shown once the level takes real power (authorize / deposit). */
  dimensioned?: boolean
  text: Record<Locale, AuthQuestionText>
}

export const AUTH_QUESTIONS: AuthQuestionDef[] = [
  {
    key: 'level',
    order: ['read', 'propose', 'authorize', 'deposit'],
    text: {
      fr: {
        label: 'Quel pouvoir prends-tu sur les actifs de l\'utilisateur ?',
        hint: 'échelle d\'autorité',
        options: {
          read: { title: 'Lire / observer', example: 'soldes, historique — aucune action' },
          propose: { title: 'Proposer', example: 'tu construis une transaction, l\'utilisateur signe chaque fois' },
          authorize: { title: 'Autoriser / agir', example: 'l\'utilisateur te délègue le droit d\'agir dans des limites' },
          deposit: { title: 'Détenir / déposer', example: 'les utilisateurs envoient leurs actifs sur un compte que tu contrôles' }
        }
      },
      en: {
        label: 'How much power do you take over the user\'s assets?',
        hint: 'authority scale',
        options: {
          read: { title: 'Read / observe', example: 'balances, history — no action' },
          propose: { title: 'Propose', example: 'you build a transaction, the user signs each time' },
          authorize: { title: 'Authorize / act', example: 'the user delegates the right to act within limits' },
          deposit: { title: 'Hold / deposit', example: 'users send assets to an account you control' }
        }
      }
    }
  },
  {
    key: 'scope',
    dimensioned: true,
    order: ['narrow', 'broad'],
    text: {
      fr: {
        label: 'Sur quel périmètre ?',
        hint: 'portée de l\'autorité',
        options: {
          narrow: { title: 'Une action / un actif précis', example: 'limité et défini' },
          broad: { title: 'N\'importe quel actif, n\'importe quelle action', example: 'large' }
        }
      },
      en: {
        label: 'Over what scope?',
        hint: 'breadth of the authority',
        options: {
          narrow: { title: 'A specific action / asset', example: 'bounded and defined' },
          broad: { title: 'Any asset, any action', example: 'broad' }
        }
      }
    }
  },
  {
    key: 'duration',
    dimensioned: true,
    order: ['oneshot', 'timeboxed', 'indefinite'],
    text: {
      fr: {
        label: 'Pour combien de temps ?',
        hint: 'durée',
        options: {
          oneshot: { title: 'Une seule transaction' },
          timeboxed: { title: 'Une période limitée' },
          indefinite: { title: 'Indéfiniment / jusqu\'à révocation' }
        }
      },
      en: {
        label: 'For how long?',
        hint: 'duration',
        options: {
          oneshot: { title: 'A single transaction' },
          timeboxed: { title: 'A limited period' },
          indefinite: { title: 'Indefinitely / until revoked' }
        }
      }
    }
  },
  {
    key: 'revocability',
    dimensioned: true,
    order: ['user', 'issuer', 'irrevocable'],
    text: {
      fr: {
        label: 'Qui peut révoquer l\'autorisation ?',
        hint: 'révocabilité',
        options: {
          user: { title: 'L\'utilisateur, à tout moment' },
          issuer: { title: 'Toi seulement' },
          irrevocable: { title: 'Personne — irrévocable' }
        }
      },
      en: {
        label: 'Who can revoke the authorization?',
        hint: 'revocability',
        options: {
          user: { title: 'The user, anytime' },
          issuer: { title: 'Only you' },
          irrevocable: { title: 'Nobody — irrevocable' }
        }
      }
    }
  },
  {
    key: 'consent',
    dimensioned: true,
    order: ['peraction', 'blanket'],
    text: {
      fr: {
        label: 'Comment l\'utilisateur consent-il ?',
        hint: 'consentement',
        options: {
          peraction: { title: 'À chaque action', example: 'confirmation à chaque fois' },
          blanket: { title: 'En bloc, une fois', example: 'une approbation globale en amont' }
        }
      },
      en: {
        label: 'How does the user consent?',
        hint: 'consent',
        options: {
          peraction: { title: 'Per action', example: 'confirms each time' },
          blanket: { title: 'Blanket, once', example: 'one upfront approval' }
        }
      }
    }
  },
  {
    key: 'keyholder',
    dimensioned: true,
    order: ['user', 'shared', 'custodian'],
    text: {
      fr: {
        label: 'Qui détient les clés / les fonds ?',
        hint: 'détenteur des clés',
        options: {
          user: { title: 'L\'utilisateur', example: 'il garde le contrôle' },
          shared: { title: 'Partagé / multisig', example: 'contrôle conjoint' },
          custodian: { title: 'Toi', example: 'tu détiens les clés ou les fonds' }
        }
      },
      en: {
        label: 'Who holds the keys / funds?',
        hint: 'key-holder',
        options: {
          user: { title: 'The user', example: 'they keep control' },
          shared: { title: 'Shared / multisig', example: 'joint control' },
          custodian: { title: 'You', example: 'you hold the keys or funds' }
        }
      }
    }
  }
]

export interface BandText { name: string; desc: string }
export const BANDS: Record<Locale, Record<RiskBand, BandText>> = {
  fr: {
    low: { name: 'Risque faible', desc: 'Tu ne touches pas aux actifs des utilisateurs.' },
    medium: { name: 'Risque moyen', desc: 'Tu agis sous délégation bornée — à cadrer.' },
    high: { name: 'Risque élevé', desc: 'Tu portes un vrai pouvoir sur les actifs — obligations sérieuses.' },
    critical: { name: 'Risque critique', desc: 'Custody pleine + pouvoir large : régime le plus lourd.' }
  },
  en: {
    low: { name: 'Low risk', desc: 'You don\'t touch users\' assets.' },
    medium: { name: 'Medium risk', desc: 'You act under bounded delegation — to frame carefully.' },
    high: { name: 'High risk', desc: 'You carry real power over assets — serious obligations.' },
    critical: { name: 'Critical risk', desc: 'Full custody + broad power: the heaviest regime.' }
  }
}

export interface AuthFlagText { title: string; body: string }
export const AUTH_FLAGS: Record<Locale, Record<AuthorityFlagKey, AuthFlagText>> = {
  fr: {
    deposit_custody: {
      title: 'Tu prends en custody',
      body: 'Les utilisateurs envoient leurs actifs sur un compte que tu contrôles — tu portes leurs fonds. C\'est l\'autorité la plus lourde : risque de contrepartie pour eux, obligations de conservation pour toi (régime custody / CASP probable sous MiCA).'
    },
    custodian_keys: {
      title: 'Tu détiens les clés',
      body: 'Détenir les clés des utilisateurs te permet de bouger leurs actifs unilatéralement. Minimise : préfère des clés côté utilisateur + des permissions cantonnées, appliquées par le registre.'
    },
    blanket_broad: {
      title: 'Sur-permissionné (en bloc + large)',
      body: 'Une approbation globale et unique sur n\'importe quel actif, c\'est l\'antipattern qui vide les wallets (cf. l\'« infinite approve » ERC-20). Cantonne la portée et préfère des autorisations natives, par objet.'
    },
    irrevocable: {
      title: 'Autorité irrévocable',
      body: 'Une autorité que l\'utilisateur ne peut pas révoquer le piège. Prévois toujours un chemin de révocation qu\'il contrôle.'
    },
    indefinite_lock: {
      title: 'Indéfinie et non révocable par l\'utilisateur',
      body: 'Un pouvoir permanent que l\'utilisateur ne peut pas révoquer cumule les risques. Ajoute une expiration ou une révocation côté utilisateur.'
    }
  },
  en: {
    deposit_custody: {
      title: 'You take custody',
      body: 'Users send assets to an account you control — you carry their funds. This is the heaviest authority: counterparty risk for them, safekeeping obligations for you (likely a custody / CASP regime under MiCA).'
    },
    custodian_keys: {
      title: 'You hold the keys',
      body: 'Holding users\' keys lets you move their assets unilaterally. Minimize it: prefer user-held keys + scoped, ledger-enforced permissions.'
    },
    blanket_broad: {
      title: 'Over-permissioned (blanket + broad)',
      body: 'A one-time blanket approval over any asset is the wallet-draining antipattern (cf. ERC-20 infinite approve). Scope it down and prefer native, per-object authorizations.'
    },
    irrevocable: {
      title: 'Irrevocable authority',
      body: 'Authority the user can\'t revoke traps them. Always provide a revocation path the user controls.'
    },
    indefinite_lock: {
      title: 'Indefinite, non-user-revocable',
      body: 'Power that lasts forever and that the user can\'t revoke compounds risk. Add an expiry or user-side revocation.'
    }
  }
}

export const AUTH_CHECKLIST: Record<Locale, Record<AuthorityCheckId, string>> = {
  fr: {
    c_readonly: 'Rester en lecture seule : indexer / rippled, ne jamais demander de clé de signature',
    c_scope_min: 'Minimiser la portée : demander le moins d\'autorité qui fonctionne',
    c_native: 'Préférer les objets XRPL natifs (Escrow, Payment Channel, AMM) aux approbations en bloc',
    c_revoke_ux: 'Offrir une révocation claire et self-service à l\'utilisateur',
    c_keys: 'Durcir la gestion des clés (HSM / signature à seuil, pas de clé en clair)',
    c_segregation: 'Ségréguer les actifs des utilisateurs des tiens',
    c_no_rehypo: 'Pas de réutilisation (rehypothecation) des actifs des utilisateurs',
    c_audit: 'Journaliser et auditer chaque action faite pour le compte d\'un utilisateur',
    c_incident: 'Avoir un plan d\'incident / de compromission de clés',
    c_legal_casp: 'Vérifier le statut custody / CASP avec un conseil (MiCA)',
    c_insurance: 'Envisager une assurance / une réserve contre la perte'
  },
  en: {
    c_readonly: 'Stay read-only: indexer / rippled, never request signing keys',
    c_scope_min: 'Minimize scope: request the least authority that works',
    c_native: 'Prefer native XRPL objects (Escrow, Payment Channel, AMM) over blanket approvals',
    c_revoke_ux: 'Give the user a clear, self-served revocation path',
    c_keys: 'Harden key management (HSM / threshold signing, no plaintext keys)',
    c_segregation: 'Segregate users\' assets from your own',
    c_no_rehypo: 'No rehypothecation — don\'t reuse users\' assets',
    c_audit: 'Log and audit every action taken on a user\'s behalf',
    c_incident: 'Have an incident & key-compromise response plan',
    c_legal_casp: 'Check the custody / CASP authorization status with counsel (MiCA)',
    c_insurance: 'Consider insurance / a reserve against loss'
  }
}

export interface XrplMap { title: string; body: string; primitives: string[] }
export const XRPL_MAP: Record<Locale, Record<AuthorityLevel, XrplMap>> = {
  fr: {
    read: {
      title: 'Lecture seule',
      body: 'Aucune autorité on-chain nécessaire.',
      primitives: ['API rippled / Clio publique', 'Indexer (sans clés)']
    },
    propose: {
      title: 'L\'utilisateur signe chaque action',
      body: 'Tu construis une transaction non signée ; l\'utilisateur la signe dans son wallet. Tu ne détiens jamais de clé.',
      primitives: ['Tx non signée → Xaman / Crossmark / GemWallet', 'Deep links / QR de signature']
    },
    authorize: {
      title: 'Autorité cantonnée, appliquée par le registre',
      body: 'XRPL n\'a pas d\'« allowance » globale type ERC-20. Délègue étroitement et laisse le registre faire respecter les limites.',
      primitives: ['Permission Delegation (XLS-75 — vérifier le statut de l\'amendement)', 'Regular key / SignerList (signature cantonnée)', 'Escrow, Payment Channel, AMM (natifs, bornés)']
    },
    deposit: {
      title: 'Custody — à éviter si possible',
      body: 'Détenir clés/fonds = custody pleine. Quand c\'est possible, remplace-la par des objets appliqués par le registre, pour que le réseau porte la contrainte, pas toi.',
      primitives: ['Escrow / Payment Channel natifs plutôt qu\'une custody mutualisée', 'Multisig (SignerList) pour retirer le contrôle mono-clé', 'Si vraiment custodial : ségrégation + agrément CASP']
    }
  },
  en: {
    read: {
      title: 'Read-only',
      body: 'No on-chain authority needed.',
      primitives: ['Public rippled / Clio API', 'Indexer (no keys)']
    },
    propose: {
      title: 'The user signs each action',
      body: 'You build an unsigned transaction; the user signs it in their wallet. You never hold a key.',
      primitives: ['Unsigned tx → Xaman / Crossmark / GemWallet', 'Deep links / QR sign requests']
    },
    authorize: {
      title: 'Scoped authority, enforced by the ledger',
      body: 'XRPL has no ERC-20 blanket allowance. Delegate narrowly and let the ledger enforce the limits.',
      primitives: ['Permission Delegation (XLS-75 — verify amendment status)', 'Regular key / SignerList (scoped signing)', 'Escrow, Payment Channel, AMM (native, bounded)']
    },
    deposit: {
      title: 'Custody — avoid if you can',
      body: 'Holding keys/funds = full custody. Where possible, replace it with ledger-enforced objects so the network holds the constraint, not you.',
      primitives: ['Native Escrow / Payment Channel instead of pooled custody', 'Multisig (SignerList) to remove single-key control', 'If truly custodial: segregation + CASP authorization']
    }
  }
}
