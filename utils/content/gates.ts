/**
 * Upstream "go / no-go" decision gates — the two switches the macro map (§1)
 * attributes to Grounds (the router): "Do I need a blockchain?" and "Do I need
 * a token?". These are NECESSITY gates (should you), not classification trees
 * (which type). Self-contained bilingual content so it can be lifted into the
 * Grounds app later. Pure data — rendered by <GateGuide>.
 */
import type { Locale } from './types'

type Bi = Record<Locale, string>

export type GateTone = 'no' | 'maybe' | 'private' | 'yes'

/** One decision step: a yes/no question that may exit early to a verdict. */
export interface GateStep {
  q: Bi
  /** The answer that exits the flow here (e.g. "No", "Yes — a TTP is fine"). */
  exitWhen: Bi
  /** The verdict reached on that exit. */
  exitLabel: Bi
  tone: GateTone
}

export interface GateCallout { tone: 'warn' | 'info'; text: Bi }

export interface Gate {
  id: string
  kicker: Bi
  title: Bi
  lead: Bi
  /** Label shown above the branching flow. */
  flowLabel: Bi
  /** Word shown on the "keep going" branch between steps. */
  elseLabel: Bi
  steps: GateStep[]
  /** Positive outcome reached if no early exit fired. */
  finalLabel: Bi
  finalNote: Bi
  callouts: GateCallout[]
  /** Optional CTA (internal route + label). */
  ctaTo?: string
  ctaLabel?: Bi
}

// ── Gate 1: do I need a BLOCKCHAIN? (Wüst–Gervais style + founder lens) ──
export const BLOCKCHAIN_GATE: Gate = {
  id: 'blockchain',
  kicker: { en: 'Switch · upstream', fr: 'Aiguillage · amont' },
  title: { en: 'Do you need a blockchain?', fr: 'Faut-il une blockchain ?' },
  lead: {
    en: 'A go / no-go, before anything else. A chain is rarely the default answer — most products are better off without one. Walk the questions top to bottom; the first “exit” that fires is your answer.',
    fr: "Un go / no-go, avant tout le reste. Une chaîne est rarement la réponse par défaut — la plupart des produits s'en passent mieux. Descends les questions ; la première « sortie » qui se déclenche est ta réponse."
  },
  flowLabel: { en: 'Decision flow', fr: 'Arbre de décision' },
  elseLabel: { en: 'otherwise', fr: 'sinon' },
  steps: [
    {
      q: { en: 'Do you need to store shared state at all (a database)?', fr: 'As-tu besoin de stocker un état partagé (une base de données) ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      exitLabel: { en: 'No blockchain — you don’t even need a shared database.', fr: 'Pas de blockchain — tu n’as même pas besoin d’une base partagée.' },
      tone: 'no'
    },
    {
      q: { en: 'Are there several parties writing / updating that data?', fr: 'Plusieurs parties écrivent / mettent à jour ces données ?' },
      exitWhen: { en: 'No — a single writer', fr: 'Non — un seul rédacteur' },
      exitLabel: { en: 'A classic centralized database. No blockchain.', fr: 'Une base centralisée classique. Pas de blockchain.' },
      tone: 'no'
    },
    {
      q: { en: 'Is an always-available, trusted third party acceptable to arbitrate?', fr: 'Un tiers de confiance toujours disponible est-il acceptable pour arbitrer ?' },
      exitWhen: { en: 'Yes', fr: 'Oui' },
      exitLabel: { en: 'Use that trusted intermediary (web2). No blockchain needed.', fr: 'Utilise cet intermédiaire de confiance (web2). Pas besoin de blockchain.' },
      tone: 'no'
    },
    {
      q: { en: 'Are all the writers known and mutually trusted?', fr: 'Tous les rédacteurs sont-ils connus et se font-ils mutuellement confiance ?' },
      exitWhen: { en: 'Yes', fr: 'Oui' },
      exitLabel: { en: 'A permissioned / private chain may suffice.', fr: 'Une chaîne permissionnée / privée peut suffire.' },
      tone: 'private'
    }
  ],
  finalLabel: { en: 'Public blockchain (web3)', fr: 'Blockchain publique (web3)' },
  finalNote: {
    en: 'Multiple non-trusting writers, no acceptable intermediary → a permissionless chain earns its place: disintermediation, user-owned assets, public verifiability.',
    fr: "Plusieurs rédacteurs sans confiance mutuelle, aucun intermédiaire acceptable → une chaîne permissionless mérite sa place : désintermédiation, actifs détenus par les users, vérifiabilité publique."
  },
  callouts: [
    {
      tone: 'info',
      text: {
        en: 'Founder lens: also lean on-chain if end-users must truly OWN their assets, or if composability / interop with other protocols is core to the product.',
        fr: "Regard fondateur : penche aussi pour l’on-chain si les utilisateurs doivent vraiment POSSÉDER leurs actifs, ou si la composabilité / interop avec d’autres protocoles est au cœur du produit."
      }
    },
    {
      tone: 'warn',
      text: {
        en: 'Beware “blockchain because hype”. If a database does the job, use a database — it’s cheaper, faster and simpler to operate.',
        fr: "Méfie-toi de la « blockchain par hype ». Si une base de données fait le travail, utilise une base — c’est moins cher, plus rapide et plus simple à opérer."
      }
    }
  ]
}

// ── Gate 2: do I need a TOKEN? (necessity, not classification) ──
export const TOKEN_GATE: Gate = {
  id: 'token',
  kicker: { en: 'Switch · upstream', fr: 'Aiguillage · amont' },
  title: { en: 'Do you need a token?', fr: 'Faut-il un token ?' },
  lead: {
    en: 'Assuming you’re on-chain — does the project genuinely need its OWN token? This decides whether tokenomics exists at all. (It does not say which class — that comes after, in Frame.)',
    fr: "En supposant que tu es on-chain — le projet a-t-il vraiment besoin de SON propre token ? Ceci décide si la tokenomics existe tout court. (Pas de quelle classe — ça vient après, dans Frame.)"
  },
  flowLabel: { en: 'Decision flow', fr: 'Arbre de décision' },
  elseLabel: { en: 'otherwise', fr: 'sinon' },
  steps: [
    {
      q: { en: 'Can an existing asset (fiat, a stablecoin like USDC, ETH, or off-chain points) do the job?', fr: 'Un actif existant (fiat, un stablecoin comme USDC, ETH, ou des points off-chain) peut-il faire le travail ?' },
      exitWhen: { en: 'Yes', fr: 'Oui' },
      exitLabel: { en: 'Use the existing asset. No new token.', fr: 'Utilise l’actif existant. Pas de nouveau token.' },
      tone: 'no'
    },
    {
      q: { en: 'Is the token essential to the core mechanism (access, settlement, governance, incentives)?', fr: 'Le token est-il essentiel au mécanisme central (accès, règlement, gouvernance, incitations) ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      exitLabel: { en: 'No token — it would be decoration or fundraising only. Skip tokenomics.', fr: 'Pas de token — il ne serait que décor ou levée de fonds. Pas de tokenomics.' },
      tone: 'no'
    },
    {
      q: { en: 'Does it capture or route real value / coordinate a network that can’t work off-chain?', fr: 'Capte-t-il ou route-t-il de la vraie valeur / coordonne-t-il un réseau qui ne peut pas fonctionner off-chain ?' },
      exitWhen: { en: 'No', fr: 'Non' },
      exitLabel: { en: 'Reconsider — likely no token (or off-chain credits suffice).', fr: 'À reconsidérer — probablement pas de token (ou des crédits off-chain suffisent).' },
      tone: 'maybe'
    }
  ],
  finalLabel: { en: 'A token is justified', fr: 'Un token est justifié' },
  finalNote: {
    en: 'It’s central to the mechanism, no existing asset fits, and it carries real value or coordination. Now go define its nature & regulatory class.',
    fr: "Il est central au mécanisme, aucun actif existant ne convient, et il porte de la vraie valeur ou coordination. Va maintenant définir sa nature & sa classe réglementaire."
  },
  callouts: [
    {
      tone: 'warn',
      text: {
        en: 'Red flag: a token whose only real purpose is to raise money or to pump. Regulators (and users) see through it.',
        fr: "Red flag : un token dont le seul vrai but est de lever des fonds ou de pumper. Les régulateurs (et les users) le voient."
      }
    },
    {
      tone: 'info',
      text: {
        en: 'Prefer existing assets or off-chain credits whenever they fit — fewer legal obligations, less complexity, faster to ship.',
        fr: "Préfère les actifs existants ou les crédits off-chain dès qu’ils conviennent — moins d’obligations légales, moins de complexité, plus rapide à livrer."
      }
    }
  ],
  ctaTo: '/create',
  ctaLabel: { en: 'Define its class → Frame', fr: 'Définir sa classe → Frame' }
}

export const GATES: Gate[] = [BLOCKCHAIN_GATE, TOKEN_GATE]
