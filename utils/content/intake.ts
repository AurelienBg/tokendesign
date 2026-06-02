/**
 * Intake questions (QDEF) — ported verbatim (FR/EN) from the index.html
 * prototype. Founder-language wording, examples, and "I don't know" options.
 * Substance over form: never asks for the technical standard (MPT/IOU/NFT).
 */
import type { QuestionDef, QuestionKey, Locale } from './types'

export const INTAKE: Record<QuestionKey, QuestionDef> = {
  chemin: {
    key: 'chemin',
    type: 'multi',
    order: ['creer', 'autres'],
    text: {
      fr: {
        label: 'Tu veux… (coche ce qui s\'applique)',
        hint: 'un projet peut faire les deux',
        options: {
          creer: { title: 'Créer ton propre token / actif', example: 'tu émets quelque chose de nouveau' },
          autres: { title: 'Construire une app qui agit sur les actifs des autres', example: 'tu manipules les tokens des utilisateurs' }
        }
      },
      en: {
        label: 'You want to… (check all that apply)',
        hint: 'a project can do both',
        options: {
          creer: { title: 'Create your own token / asset', example: 'you issue something new' },
          autres: { title: 'Build an app that acts on others’ assets', example: 'you handle users’ tokens' }
        }
      }
    }
  },

  fongibilite: {
    key: 'fongibilite',
    type: 'single',
    order: ['fongible', 'semi', 'non-fongible'],
    text: {
      fr: {
        label: 'Chaque unité est-elle interchangeable ?',
        hint: 'fongibilité',
        options: {
          fongible: { title: 'Oui, interchangeable', example: 'comme une pièce de monnaie' },
          semi: { title: 'Par séries / éditions', example: 'identiques au sein d\'une série' },
          'non-fongible': { title: 'Non, chaque exemplaire est unique', example: 'comme une œuvre ou un objet de collection' }
        }
      },
      en: {
        label: 'Is each unit interchangeable?',
        hint: 'fungibility',
        options: {
          fongible: { title: 'Yes, interchangeable', example: 'like a coin' },
          semi: { title: 'By series / editions', example: 'identical within a series' },
          'non-fongible': { title: 'No, each one is unique', example: 'like an artwork or a collectible' }
        }
      }
    }
  },

  rapport: {
    key: 'rapport',
    type: 'single',
    unsure: true,
    order: ['natif', 'adosse', 'titre'],
    text: {
      fr: {
        label: 'Ton token, c\'est plutôt…',
        hint: 'rapport au sous-jacent',
        options: {
          natif: { title: 'Une unité native', example: 'ne représente rien d\'autre que lui-même' },
          adosse: { title: 'Adossé à une réserve que tu détiens', example: 'ex. des euros en banque, de l\'or' },
          titre: { title: 'Un titre représentatif d\'un autre actif', example: 'une action, une obligation, une part, un bien existant' }
        }
      },
      en: {
        label: 'Your token is rather…',
        hint: 'relation to the underlying',
        options: {
          natif: { title: 'A native unit', example: 'represents nothing but itself' },
          adosse: { title: 'Backed by a reserve you hold', example: 'e.g. euros in a bank, gold' },
          titre: { title: 'A claim representing another asset', example: 'a share, a bond, a unit, an existing asset' }
        }
      }
    }
  },

  titre_type: {
    key: 'titre_type',
    type: 'single',
    show: (s) => s.rapport === 'titre',
    order: ['financier', 'reel', 'autre'],
    text: {
      fr: {
        label: 'Il représente quoi ?',
        hint: 'nature du sous-jacent',
        options: {
          financier: { title: 'Un actif financier', example: 'action, obligation, part de fonds' },
          reel: { title: 'Un bien réel', example: 'immobilier, or, objet physique' },
          autre: { title: 'Un autre droit', example: 'crédit carbone, droit d\'usage…' }
        }
      },
      en: {
        label: 'What does it represent?',
        hint: 'nature of the underlying',
        options: {
          financier: { title: 'A financial asset', example: 'share, bond, fund unit' },
          reel: { title: 'A real asset', example: 'real estate, gold, physical object' },
          autre: { title: 'Another right', example: 'carbon credit, usage right…' }
        }
      }
    }
  },

  couverture: {
    key: 'couverture',
    type: 'single',
    unsure: true,
    show: (s) => s.rapport === 'adosse' || s.rapport === 'titre',
    order: ['aucune', 'mutualisee', 'dediee'],
    text: {
      fr: {
        label: 'Qu\'est-ce qui garantit la valeur ?',
        hint: 'couverture',
        options: {
          aucune: { title: 'Une simple promesse de l\'émetteur', example: 'créance générale, rien de cantonné' },
          mutualisee: { title: 'Une réserve commune mutualisée', example: 'partagée entre tous les détenteurs' },
          dediee: { title: 'Une réserve dédiée à chaque détenteur', example: 'allouée unité par unité' }
        }
      },
      en: {
        label: 'What backs the value?',
        hint: 'coverage',
        options: {
          aucune: { title: 'Just the issuer’s promise', example: 'general claim, nothing ring-fenced' },
          mutualisee: { title: 'A shared, pooled reserve', example: 'shared across all holders' },
          dediee: { title: 'A reserve dedicated to each holder', example: 'allocated unit by unit' }
        }
      }
    }
  },

  debiteur: {
    key: 'debiteur',
    type: 'single',
    unsure: true,
    order: ['aucun', 'identifie', 'diffus'],
    text: {
      fr: {
        label: 'Qui doit quelque chose au détenteur ?',
        hint: 'débiteur — la question clé',
        options: {
          aucun: { title: 'Personne', example: 'le token ne donne droit à rien auprès de qui que ce soit' },
          identifie: { title: 'Une entité identifiée', example: 'toi, ta société, un émetteur précis — qui doit rembourser ou livrer' },
          diffus: { title: 'C\'est diffus / décentralisé', example: 'un protocole, sans entité claire' }
        }
      },
      en: {
        label: 'Who owes something to the holder?',
        hint: 'debtor — the key question',
        options: {
          aucun: { title: 'Nobody', example: 'the token grants no claim against anyone' },
          identifie: { title: 'An identified entity', example: 'you, your company, a specific issuer — who must redeem or deliver' },
          diffus: { title: 'It’s diffuse / decentralized', example: 'a protocol, no clear entity' }
        }
      }
    }
  },

  garant: {
    key: 'garant',
    type: 'single',
    unsure: true,
    order: ['aucun', 'identifie', 'diffus'],
    text: {
      fr: {
        label: 'Qui atteste de l\'authenticité ou de la réserve ?',
        hint: 'garant / attesteur',
        options: {
          aucun: { title: 'Personne', example: 'aucune attestation' },
          identifie: { title: 'Une entité identifiée', example: 'un émetteur, un auditeur, une autorité' },
          diffus: { title: 'C\'est diffus', example: 'attestation décentralisée / collective' }
        }
      },
      en: {
        label: 'Who attests to authenticity or the reserve?',
        hint: 'guarantor / attester',
        options: {
          aucun: { title: 'Nobody', example: 'no attestation' },
          identifie: { title: 'An identified entity', example: 'an issuer, an auditor, an authority' },
          diffus: { title: 'It’s diffuse', example: 'decentralized / collective attestation' }
        }
      }
    }
  },

  transfer: {
    key: 'transfer',
    type: 'single',
    order: ['libre', 'gelable', 'permissionnee', 'non-transferable'],
    text: {
      fr: {
        label: 'Les détenteurs peuvent-ils le transférer ?',
        hint: 'transférabilité',
        options: {
          libre: { title: 'Librement, à qui ils veulent' },
          gelable: { title: 'Oui, mais tu peux geler / bloquer' },
          permissionnee: { title: 'Seulement vers des comptes autorisés', example: 'whitelist' },
          'non-transferable': { title: 'Pas du tout', example: 'lié au détenteur' }
        }
      },
      en: {
        label: 'Can holders transfer it?',
        hint: 'transferability',
        options: {
          libre: { title: 'Freely, to anyone' },
          gelable: { title: 'Yes, but you can freeze / block' },
          permissionnee: { title: 'Only to authorized accounts', example: 'whitelist' },
          'non-transferable': { title: 'Not at all', example: 'bound to the holder' }
        }
      }
    }
  },

  fonctions: {
    key: 'fonctions',
    type: 'multi',
    order: ['paiement', 'reserve', 'placement', 'utility', 'gouvernance', 'collection', 'preuve'],
    text: {
      fr: {
        label: 'À quoi sert ton token ?',
        hint: 'coche tout ce qui s\'applique',
        options: {
          paiement: { title: 'Payer' },
          reserve: { title: 'Réserve de valeur' },
          placement: { title: 'Placement / rendement' },
          utility: { title: 'Accès à un service (utility)' },
          gouvernance: { title: 'Gouvernance / vote' },
          collection: { title: 'Collection / statut' },
          preuve: { title: 'Preuve / attestation' }
        }
      },
      en: {
        label: 'What is your token for?',
        hint: 'check all that apply',
        options: {
          paiement: { title: 'Pay' },
          reserve: { title: 'Store of value' },
          placement: { title: 'Investment / yield' },
          utility: { title: 'Service access (utility)' },
          gouvernance: { title: 'Governance / vote' },
          collection: { title: 'Collection / status' },
          preuve: { title: 'Proof / attestation' }
        }
      }
    }
  },

  droits: {
    key: 'droits',
    type: 'multi',
    order: ['revenus', 'votes', 'royalties', 'expiration', 'consommable'],
    text: {
      fr: {
        label: 'Quels droits donne-t-il ?',
        hint: 'coche tout ce qui s\'applique',
        options: {
          revenus: { title: 'Revenus (intérêts, dividendes, part de revenus)' },
          votes: { title: 'Votes' },
          royalties: { title: 'Royalties' },
          expiration: { title: 'Expiration' },
          consommable: { title: 'Se consomme à l\'usage' }
        }
      },
      en: {
        label: 'What rights does it grant?',
        hint: 'check all that apply',
        options: {
          revenus: { title: 'Revenues (interest, dividends, revenue share)' },
          votes: { title: 'Votes' },
          royalties: { title: 'Royalties' },
          expiration: { title: 'Expiration' },
          consommable: { title: 'Consumed on use' }
        }
      }
    }
  },

  rendement: {
    key: 'rendement',
    type: 'single',
    order: ['oui', 'non'],
    text: {
      fr: {
        label: 'Promets-tu un gain ou un rendement aux acheteurs ?',
        hint: 'y compris via le marketing',
        options: {
          oui: { title: 'Oui', example: 'gain financier, rendement, plus-value attendue' },
          non: { title: 'Non', example: 'aucune promesse de profit' }
        }
      },
      en: {
        label: 'Do you promise a gain or yield to buyers?',
        hint: 'including via marketing',
        options: {
          oui: { title: 'Yes', example: 'financial gain, yield, expected upside' },
          non: { title: 'No', example: 'no promise of profit' }
        }
      }
    }
  },

  stabilite: {
    key: 'stabilite',
    type: 'single',
    unsure: true,
    order: ['monnaie', 'panier', 'aucune'],
    text: {
      fr: {
        label: 'Vise-t-il une valeur stable ?',
        hint: 'indexation',
        options: {
          monnaie: { title: 'Oui, sur une seule monnaie officielle', example: '€, $…' },
          panier: { title: 'Oui, sur un panier ou une crypto', example: 'plusieurs actifs, matière première, autre crypto' },
          aucune: { title: 'Non, pas de visée de stabilité' }
        }
      },
      en: {
        label: 'Does it aim for a stable value?',
        hint: 'peg',
        options: {
          monnaie: { title: 'Yes, to a single official currency', example: '€, $…' },
          panier: { title: 'Yes, to a basket or a crypto', example: 'several assets, commodity, another crypto' },
          aucune: { title: 'No, no stability target' }
        }
      }
    }
  },

  distribution: {
    key: 'distribution',
    type: 'single',
    unsure: true,
    order: ['retail', 'pro', 'interne'],
    text: {
      fr: {
        label: 'À qui le distribues-tu ?',
        hint: 'cible',
        options: {
          retail: { title: 'Au grand public (retail)' },
          pro: { title: 'À des investisseurs professionnels / qualifiés seulement' },
          interne: { title: 'Usage interne / cercle fermé' }
        }
      },
      en: {
        label: 'Who do you distribute it to?',
        hint: 'audience',
        options: {
          retail: { title: 'To the general public (retail)' },
          pro: { title: 'To professional / qualified investors only' },
          interne: { title: 'Internal use / closed circle' }
        }
      }
    }
  },

  juridiction: {
    key: 'juridiction',
    type: 'single',
    order: ['ue', 'hors-ue', 'mondial'],
    text: {
      fr: {
        label: 'Dans quelles juridictions ?',
        hint: 'marché visé',
        options: {
          ue: { title: 'Union européenne' },
          'hors-ue': { title: 'Hors UE' },
          mondial: { title: 'Mondial' }
        }
      },
      en: {
        label: 'Which jurisdictions?',
        hint: 'target market',
        options: {
          ue: { title: 'European Union' },
          'hors-ue': { title: 'Outside the EU' },
          mondial: { title: 'Worldwide' }
        }
      }
    }
  },

  custody: {
    key: 'custody',
    type: 'single',
    order: ['oui', 'non'],
    text: {
      fr: {
        label: 'Comptes-tu détenir les fonds ou les clés des utilisateurs ?',
        hint: 'custody',
        options: {
          oui: { title: 'Oui, à un moment' },
          non: { title: 'Non, ils gardent le contrôle' }
        }
      },
      en: {
        label: 'Will you hold users’ funds or keys?',
        hint: 'custody',
        options: {
          oui: { title: 'Yes, at some point' },
          non: { title: 'No, they keep control' }
        }
      }
    }
  }
}

/** Block 1 — "What it is" (identity). */
export const BLOCK_B1: QuestionKey[] = [
  'fongibilite', 'rapport', 'titre_type', 'couverture', 'debiteur', 'garant', 'transfer', 'fonctions', 'droits'
]

/** Block 2 — "How you launch it". */
export const BLOCK_B2: QuestionKey[] = ['rendement', 'stabilite', 'distribution', 'juridiction', 'custody']

/** Required single-choice keys for each block's validation. */
export const REQUIRED_B1: QuestionKey[] = ['fongibilite', 'rapport', 'debiteur', 'garant', 'transfer']
export const REQUIRED_B2: QuestionKey[] = ['rendement', 'stabilite', 'distribution', 'juridiction', 'custody']

/**
 * Short category labels for the table-style intake (configurator look): shown
 * as the row label, with the full question in a tooltip. Distinct from
 * `hint` (which is sometimes an instruction, e.g. "check all that apply").
 */
export const QUESTION_LABEL: Record<Locale, Record<QuestionKey, string>> = {
  fr: {
    chemin: 'Projet',
    fongibilite: 'Fongibilité',
    rapport: 'Rapport au sous-jacent',
    titre_type: 'Type de sous-jacent',
    couverture: 'Couverture',
    debiteur: 'Débiteur',
    garant: 'Garant',
    transfer: 'Transférabilité',
    fonctions: 'Fonctions',
    droits: 'Droits',
    rendement: 'Promesse de gain',
    stabilite: 'Visée de stabilité',
    distribution: 'Cible',
    juridiction: 'Juridiction',
    custody: 'Custody'
  },
  en: {
    chemin: 'Project',
    fongibilite: 'Fungibility',
    rapport: 'Relation to underlying',
    titre_type: 'Underlying type',
    couverture: 'Coverage',
    debiteur: 'Debtor',
    garant: 'Guarantor',
    transfer: 'Transferability',
    fonctions: 'Functions',
    droits: 'Rights',
    rendement: 'Promised gain',
    stabilite: 'Stability target',
    distribution: 'Audience',
    juridiction: 'Jurisdiction',
    custody: 'Custody'
  }
}
