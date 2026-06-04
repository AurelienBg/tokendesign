/**
 * Upstream "go / no-go" decision gates — the two switches the macro map (§1)
 * attributes to Grounds (the router): "Do I need a blockchain?" and "Do I need
 * a token?". NECESSITY gates (should you), not classification trees (which type).
 *
 * Modelled as a real decision TREE: a spine of yes/no decision nodes, each
 * branching off to a LEAF (verdict); the spine ends in a terminal SPLIT (two
 * leaves). Self-contained bilingual content so it can be lifted into Grounds.
 * Rendered by <GateGuide>.
 *
 * Blockchain tree adapted from Wüst & Gervais, "Do you need a Blockchain?"
 * (ETH Zurich, 2018) + the WEF Blockchain decision tool.
 */
import type { Locale } from './types'

type Bi = Record<Locale, string>

export type GateTone = 'no' | 'warn' | 'private' | 'yes'

export interface GateLeaf { label: Bi; tone: GateTone; note?: Bi }

/** A decision node that branches off to a leaf; the spine continues otherwise. */
export interface GateStep { q: Bi; exitWhen: Bi; leaf: GateLeaf }

/** Terminal node: a question whose two answers each end in a leaf. */
export interface GateSplit {
  q: Bi
  yesWhen: Bi; yes: GateLeaf
  noWhen: Bi; no: GateLeaf
}

export interface GateCallout { tone: 'warn' | 'info'; text: Bi }
export interface GateResource { label: Bi; href: string }

export interface Gate {
  id: string
  kicker: Bi
  title: Bi
  lead: Bi
  flowLabel: Bi
  elseLabel: Bi
  steps: GateStep[]
  /** Either a terminal split (two leaves) or a single positive leaf. */
  final: GateSplit | GateLeaf
  callouts: GateCallout[]
  sources?: Bi
  resources?: GateResource[]
  ctaTo?: string
  ctaLabel?: Bi
}

export function isSplit(f: GateSplit | GateLeaf): f is GateSplit {
  return 'q' in f
}

// ── Gate 1: do I need a BLOCKCHAIN? (Wüst–Gervais) ──
export const BLOCKCHAIN_GATE: Gate = {
  id: 'blockchain',
  kicker: { en: 'Switch · upstream', fr: 'Aiguillage · amont' },
  title: { en: 'Do you need a blockchain?', fr: 'Faut-il une blockchain ?' },
  lead: {
    en: 'A go / no-go, before anything else. A chain is rarely the default — most products are better off without one. Walk the spine top to bottom; the first branch that fires is your answer.',
    fr: "Un go / no-go, avant tout le reste. Une chaîne est rarement la réponse par défaut — la plupart des produits s’en passent mieux. Descends l’épine ; la première branche qui se déclenche est ta réponse."
  },
  flowLabel: { en: 'Decision tree', fr: 'Arbre de décision' },
  elseLabel: { en: 'otherwise', fr: 'sinon' },
  steps: [
    {
      q: { en: 'Do you need to store shared state at all (a database)?', fr: 'As-tu besoin de stocker un état partagé (une base de données) ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      leaf: { tone: 'no', label: { en: 'No blockchain', fr: 'Pas de blockchain' }, note: { en: 'You don’t even need a shared database.', fr: 'Tu n’as même pas besoin d’une base partagée.' } }
    },
    {
      q: { en: 'Are there several parties writing / updating that data?', fr: 'Plusieurs parties écrivent / mettent à jour ces données ?' },
      exitWhen: { en: 'No — single writer', fr: 'Non — un seul rédacteur' },
      leaf: { tone: 'no', label: { en: 'Centralized database', fr: 'Base de données centralisée' }, note: { en: 'A classic DB does the job. No chain.', fr: 'Une base classique suffit. Pas de chaîne.' } }
    },
    {
      q: { en: 'Is an always-available, trusted third party acceptable to arbitrate?', fr: 'Un tiers de confiance toujours disponible est-il acceptable pour arbitrer ?' },
      exitWhen: { en: 'Yes', fr: 'Oui' },
      leaf: { tone: 'no', label: { en: 'Use that intermediary (web2)', fr: 'Utilise cet intermédiaire (web2)' }, note: { en: 'A trusted TTP removes the need for a chain.', fr: 'Un tiers de confiance enlève le besoin de chaîne.' } }
    },
    {
      q: { en: 'Are all the writers known in advance?', fr: 'Tous les rédacteurs sont-ils connus à l’avance ?' },
      exitWhen: { en: 'No — open set', fr: 'Non — ensemble ouvert' },
      leaf: { tone: 'yes', label: { en: 'Permissionless (public) blockchain', fr: 'Blockchain publique (permissionless)' }, note: { en: 'Anyone can write → disintermediation, user-owned assets, public verifiability.', fr: 'N’importe qui peut écrire → désintermédiation, actifs détenus par les users, vérifiabilité publique.' } }
    }
  ],
  final: {
    q: { en: 'Is public verifiability of the ledger required?', fr: 'La vérifiabilité publique du registre est-elle requise ?' },
    yesWhen: { en: 'Yes', fr: 'Oui' },
    yes: { tone: 'private', label: { en: 'Public permissioned blockchain', fr: 'Blockchain permissionnée publique' }, note: { en: 'Known validators, but anyone can audit.', fr: 'Validateurs connus, mais tout le monde peut auditer.' } },
    noWhen: { en: 'No', fr: 'Non' },
    no: { tone: 'private', label: { en: 'Private / consortium blockchain', fr: 'Blockchain privée / consortium' }, note: { en: 'Known validators, restricted visibility — often a shared DB in disguise; re-check you truly need a chain.', fr: 'Validateurs connus, visibilité restreinte — souvent une base partagée déguisée ; revérifie que tu as vraiment besoin d’une chaîne.' } }
  },
  callouts: [
    { tone: 'info', text: { en: 'Founder lens: also lean on-chain if end-users must truly OWN their assets, or if composability / interop with other protocols is core.', fr: 'Regard fondateur : penche aussi pour l’on-chain si les utilisateurs doivent vraiment POSSÉDER leurs actifs, ou si la composabilité / interop est au cœur du produit.' } },
    { tone: 'warn', text: { en: 'Beware “blockchain because hype”. If a database does the job, use a database — cheaper, faster, simpler.', fr: 'Méfie-toi de la « blockchain par hype ». Si une base fait le travail, utilise une base — moins cher, plus rapide, plus simple.' } }
  ],
  sources: {
    en: 'Adapted from Wüst & Gervais, “Do you need a Blockchain?” (ETH Zurich, 2018) and the WEF Blockchain decision tool.',
    fr: 'Adapté de Wüst & Gervais, « Do you need a Blockchain? » (ETH Zurich, 2018) et de l’outil de décision blockchain du WEF.'
  },
  resources: [
    { label: { en: 'xrpl-builder · decision tree map', fr: 'xrpl-builder · carte des arbres' }, href: 'https://xrpl-builder.vercel.app/decision-tree-map' }
  ]
}

// ── Gate 2: do I need a TOKEN? (necessity, not classification) ──
export const TOKEN_GATE: Gate = {
  id: 'token',
  kicker: { en: 'Switch · upstream', fr: 'Aiguillage · amont' },
  title: { en: 'Do you need a token?', fr: 'Faut-il un token ?' },
  lead: {
    en: 'Assuming you’re on-chain — does the project genuinely need its OWN token? This decides whether tokenomics exists at all. It does not say which class — that comes after, in Frame.',
    fr: "En supposant que tu es on-chain — le projet a-t-il vraiment besoin de SON propre token ? Ceci décide si la tokenomics existe tout court. Pas de quelle classe — ça vient après, dans Frame."
  },
  flowLabel: { en: 'Decision tree', fr: 'Arbre de décision' },
  elseLabel: { en: 'otherwise', fr: 'sinon' },
  steps: [
    {
      q: { en: 'Does the asset need to be transferable between users?', fr: 'L’actif a-t-il besoin d’être transférable entre utilisateurs ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      leaf: { tone: 'no', label: { en: 'No token', fr: 'Pas de token' }, note: { en: 'A database entry suffices.', fr: 'Une entrée en base suffit.' } }
    },
    {
      q: { en: 'Can an existing asset (fiat, a stablecoin, ETH, off-chain points) do the job?', fr: 'Un actif existant (fiat, un stablecoin, ETH, des points off-chain) peut-il faire le travail ?' },
      exitWhen: { en: 'Yes', fr: 'Oui' },
      leaf: { tone: 'no', label: { en: 'Use the existing asset', fr: 'Utilise l’actif existant' }, note: { en: 'No new token — fewer obligations.', fr: 'Pas de nouveau token — moins d’obligations.' } }
    },
    {
      q: { en: 'Is the token necessary to the protocol’s mechanism / incentives?', fr: 'Le token est-il nécessaire au mécanisme / aux incitations du protocole ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      leaf: { tone: 'warn', label: { en: '“Token washing”', fr: '« Token washing »' }, note: { en: 'Decorative or fundraising-only → no token.', fr: 'Décoratif ou seulement pour lever → pas de token.' } }
    },
    {
      q: { en: 'Do users need sovereignty / true ownership over it?', fr: 'Les utilisateurs ont-ils besoin de souveraineté / vraie propriété dessus ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      leaf: { tone: 'no', label: { en: 'A centralized DB suffices', fr: 'Une base centralisée suffit' }, note: { en: 'No need for a token.', fr: 'Pas besoin de token.' } }
    }
  ],
  final: {
    q: { en: 'Will it carry real value, or is a secondary market planned?', fr: 'Va-t-il porter de la vraie valeur, ou un marché secondaire est-il prévu ?' },
    yesWhen: { en: 'Yes', fr: 'Oui' },
    yes: { tone: 'warn', label: { en: 'Token justified — but heavily regulated', fr: 'Token justifié — mais très régulé' }, note: { en: 'Real value / secondary market → likely a security (Howey) and within MiCA. Verify before issuing.', fr: 'Valeur réelle / marché secondaire → probablement un security (Howey) et dans MiCA. Vérifie avant d’émettre.' } },
    noWhen: { en: 'No', fr: 'Non' },
    no: { tone: 'yes', label: { en: 'Token justified — lighter utility', fr: 'Token justifié — utility plus léger' }, note: { en: 'Still classify it precisely — some utilities are regulated too.', fr: 'Classe-le quand même précisément — certains utilities sont régulés aussi.' } }
  },
  callouts: [
    { tone: 'warn', text: { en: 'Red flag: a token whose only real purpose is to raise money or to pump. Regulators (and users) see through it.', fr: 'Red flag : un token dont le seul vrai but est de lever des fonds ou de pumper. Les régulateurs (et les users) le voient.' } },
    { tone: 'info', text: { en: 'Prefer existing assets or off-chain credits whenever they fit — fewer legal obligations, less complexity.', fr: 'Préfère les actifs existants ou les crédits off-chain dès qu’ils conviennent — moins d’obligations légales, moins de complexité.' } }
  ],
  sources: {
    en: 'Regulatory branch follows the Howey test (US securities) and MiCA (EU).',
    fr: 'La branche réglementaire suit le test de Howey (securities US) et MiCA (UE).'
  },
  resources: [
    { label: { en: 'regul8 · Howey quick test', fr: 'regul8 · test de Howey rapide' }, href: 'https://regul8app.vercel.app/en/assess/quick/howey' },
    { label: { en: 'tokenlab · token type (module 0)', fr: 'tokenlab · type de token (module 0)' }, href: 'https://tokenlabapp.vercel.app' },
    { label: { en: 'xrpl-builder · decision tree map', fr: 'xrpl-builder · carte des arbres' }, href: 'https://xrpl-builder.vercel.app/decision-tree-map' }
  ],
  ctaTo: '/create',
  ctaLabel: { en: 'Define its class → Frame', fr: 'Définir sa classe → Frame' }
}

export const GATES: Gate[] = [BLOCKCHAIN_GATE, TOKEN_GATE]
