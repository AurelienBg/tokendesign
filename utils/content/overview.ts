/**
 * /overview — "Work map": the macro picture of the project (founder journey,
 * the suite & who owns what, the token-design loop, the token lifecycle).
 * Ported from carte-travail.html into the 7powers design system, bilingual.
 * Pure content — no engine logic. Host app is referenced neutrally as the
 * current product name; rename here if the on-chain module is renamed.
 */
import type { Locale } from './types'

type Bi = Record<Locale, string>

/** Colour buckets → mapped to design tokens in the page. */
export type AppColor = 'host' | 'regul8' | 'tokenlab' | 'transverse'

export interface AppTag { name: string; color: AppColor }

// ── Section 1: the two pillars ──
export const PILLARS: { key: 'operator' | 'instrument'; color: AppColor; title: Bi; desc: Bi }[] = [
  {
    key: 'operator',
    color: 'regul8',
    title: { en: 'The operator (the app)', fr: "L'opérateur (l'app)" },
    desc: {
      en: 'The product / app: features, connection, whether it touches users’ assets (custody/authority), interop. → drives the regulation of the activity.',
      fr: "Le produit / l'app : features, connexion, est-ce qu'il touche les actifs des users (custody/autorité), interop. → pilote la régulation de l'activité."
    }
  },
  {
    key: 'instrument',
    color: 'host',
    title: { en: 'The instrument (the token)', fr: "L'instrument (le token)" },
    desc: {
      en: 'The token, if there is one: its nature, its class, its economy. → drives classification and tokenomics.',
      fr: "Le token, s'il y en a un : sa nature, sa classe, son économie. → pilote la classification et la tokenomics."
    }
  }
]

// ── Section 1: horizontal spine (0→8 + 2 gates) ──
export type SpineKind = 'plain' | 'host' | 'regul8' | 'tokenlab' | 'gate'
export interface SpineNode { kind: SpineKind; n: string; label: Bi; optional?: boolean }
export const SPINE: SpineNode[] = [
  { kind: 'plain', n: '0', label: { en: 'Vision', fr: 'Vision' } },
  { kind: 'plain', n: '1', label: { en: 'Product', fr: 'Produit' } },
  { kind: 'gate', n: '?', label: { en: 'Chain?', fr: 'BC ?' } },
  { kind: 'host', n: '2', label: { en: 'On-chain', fr: 'Onchain' } },
  { kind: 'gate', n: '?', label: { en: 'Token?', fr: 'Token ?' } },
  { kind: 'host', n: '3', label: { en: 'Nature', fr: 'Nature' }, optional: true },
  { kind: 'regul8', n: '4', label: { en: 'Regul.', fr: 'Régul.' } },
  { kind: 'tokenlab', n: '5', label: { en: 'Econ.', fr: 'Éco' }, optional: true },
  { kind: 'host', n: '6', label: { en: 'Sec.', fr: 'Sécu.' } },
  { kind: 'plain', n: '7', label: { en: 'GTM', fr: 'GTM' } },
  { kind: 'plain', n: '8', label: { en: 'Run', fr: 'Exploit.' } }
]

// ── Section 1: detailed journey ──
export interface JourneyStep {
  n: string
  kind: 'plain' | 'host' | 'regul8' | 'tokenlab' | 'gate'
  optional?: boolean
  title: Bi
  desc: Bi
  apps: AppTag[]
}
export const JOURNEY: JourneyStep[] = [
  {
    n: '0', kind: 'plain',
    title: { en: 'Vision', fr: 'Vision' },
    desc: {
      en: 'The problem, for whom, why. Light framing (Grounds): golden why/how/what, vision/mission, tagline — captured, not rebuilt.',
      fr: 'Le problème, pour qui, pourquoi. Cadrage léger (Grounds) : golden why/how/what, vision/mission, tagline — capturé, pas reconstruit.'
    },
    apps: [{ name: 'grounds', color: 'transverse' }]
  },
  {
    n: '1', kind: 'plain',
    title: { en: 'Product & services', fr: 'Produit & services' },
    desc: {
      en: 'Features, user journeys, services rendered — the "what". Inputs: ICP/persona, value prop, customer journey. A direct consequence of the vision.',
      fr: "Les features, les parcours users, les services rendus — le « quoi ». Inputs : ICP/persona, value prop, customer journey. Conséquence directe de la vision."
    },
    apps: [{ name: 'grounds', color: 'transverse' }, { name: 'gameframe', color: 'transverse' }]
  },
  {
    n: '?', kind: 'gate',
    title: { en: 'Need a blockchain?', fr: 'Faut-il une blockchain ?' },
    desc: {
      en: 'Given the product, does a chain add anything? If not → classic web2 product, you leave the suite.',
      fr: 'Au vu du produit, une chaîne apporte-t-elle quelque chose ? Si non → produit web2 classique, on sort de la suite.'
    },
    apps: [{ name: 'grounds · switch', color: 'transverse' }]
  },
  {
    n: '2', kind: 'host',
    title: { en: 'On-chain architecture', fr: 'Architecture on-chain' },
    desc: {
      en: 'Connection/wallet · authority & custody over users’ assets · interop. Exists even without a token (DeFi with no token).',
      fr: "Connexion/wallet · autorité & custody sur les actifs des users · interop. Existe même sans token (DeFi sans jeton)."
    },
    apps: [{ name: 'Onchaindesign', color: 'host' }]
  },
  {
    n: '?', kind: 'gate',
    title: { en: 'Need a token?', fr: 'Faut-il un token ?' },
    desc: {
      en: 'The switch toward the instrument pillar. If not → skip steps 3 and 5.',
      fr: "L'aiguillage vers le pilier instrument. Si non → on saute les étapes 3 et 5."
    },
    apps: [{ name: 'grounds · switch', color: 'transverse' }]
  },
  {
    n: '3', kind: 'host', optional: true,
    title: { en: 'Token nature', fr: 'Nature du token' },
    desc: {
      en: 'Characteristics → legal class deduced → implementation. The design loop (§3).',
      fr: 'Caractéristiques → classe juridique déduite → implémentation. La boucle de design (§3).'
    },
    apps: [{ name: 'Onchaindesign · create / analyze', color: 'host' }]
  },
  {
    n: '4', kind: 'regul8',
    title: { en: 'Regulation of the activity', fr: "Régulation de l'activité" },
    desc: {
      en: 'Operator: licences/CASP, AML/KYC, jurisdictions, white paper. Consumes product + on-chain arch + token nature.',
      fr: 'Opérateur : licences/CASP, AML/KYC, juridictions, white paper. Consomme produit + archi on-chain + nature du token.'
    },
    apps: [{ name: 'regul8', color: 'regul8' }]
  },
  {
    n: '5', kind: 'tokenlab', optional: true,
    title: { en: 'Token economy', fr: 'Économie du token' },
    desc: {
      en: 'Supply, issuance, value flow, distribution, vesting. Under the constraints of the class (step 3).',
      fr: "Supply, émission, value flow, distribution, vesting. Sous les contraintes de la classe (étape 3)."
    },
    apps: [{ name: 'tokenlab', color: 'tokenlab' }]
  },
  {
    n: '6', kind: 'host',
    title: { en: 'Security & audit', fr: 'Sécurité & audit' },
    desc: {
      en: 'If on-chain: contract audit, key management, risk surface. A launch prerequisite — audits run by third parties.',
      fr: 'Si on-chain : audit des contrats, gestion des clés, surface de risque. Pré-requis au lancement — audit réalisé par des tiers.'
    },
    apps: [{ name: 'Onchaindesign', color: 'host' }, { name: 'external audit', color: 'transverse' }]
  },
  {
    n: '7', kind: 'plain',
    title: { en: 'Launch / Go-to-market', fr: 'Lancement / Go-to-market' },
    desc: {
      en: 'Putting the product on the market. The TGE is its token sub-event (if token). Within the step-4 gates.',
      fr: "Mise sur le marché du produit. La TGE en est le sous-événement token (si token). Dans les gates de l'étape 4."
    },
    apps: [{ name: 'Onchaindesign · cycle', color: 'host' }, { name: 'tokenlab · TGE', color: 'tokenlab' }, { name: 'regul8', color: 'regul8' }]
  },
  {
    n: '8', kind: 'plain',
    title: { en: 'Operations & iteration', fr: 'Exploitation & itération' },
    desc: {
      en: 'Post-launch: ongoing reporting & compliance, monitoring, governance — and the product/market loop (BML).',
      fr: 'Post-lancement : reporting & conformité continue, monitoring, gouvernance — et la boucle produit/marché (BML).'
    },
    apps: [{ name: 'grounds', color: 'transverse' }, { name: 'regul8', color: 'regul8' }, { name: 'tokenlab', color: 'tokenlab' }]
  }
]

export const TRANSVERSE_NOTE: Bi = {
  en: 'Cross-cutting concerns — not steps, they run in parallel. Defensibility / moat (7powers): set from the vision, re-checked before launch. Pitch / raise (pitchcraft): often upstream (raise to build) and downstream. Build-Measure-Learn: the product/market loop runs continuously — not to be confused with the deductive token-design loop (§3).',
  fr: "Concerns transverses — pas des étapes, ils tournent en parallèle. Défendabilité / moat (7powers) : posée dès la vision, revérifiée avant le lancement. Pitch / levée (pitchcraft) : souvent en amont (lever pour construire) et en aval. Build-Measure-Learn : la boucle produit/marché continue — à ne pas confondre avec la boucle déductive du design de token (§3)."
}

// ── Section 2: the suite ──
export interface SuiteRow { name: string; color: AppColor; desc: Bi }
export const SUITE: SuiteRow[] = [
  {
    name: 'grounds', color: 'transverse',
    desc: {
      en: 'The macro vision / orchestration: the overall journey (this very map) and the upstream switches (blockchain? token?).',
      fr: "La vision macro / l'orchestration : le parcours d'ensemble (recouvre cette carte) et les aiguillages amont (blockchain ? token ?)."
    }
  },
  {
    name: 'Onchaindesign', color: 'host',
    desc: {
      en: 'The on-chain structure: authority & custody — the power taken over users’ assets (read → propose → authorize → deposit) and over the token (freeze/clawback); and — if token — its nature, class, lifecycle.',
      fr: "La structure on-chain : l'autorité & custody — le pouvoir pris sur les actifs des users (lire → proposer → autoriser → déposer) et sur le token (gel/clawback) ; et — si token — sa nature, sa classe, son cycle."
    }
  },
  {
    name: 'regul8', color: 'regul8',
    desc: {
      en: 'Regulation of the activity (operator): licences, CASP/VASP, AML, jurisdictions.',
      fr: "La régulation de l'activité (opérateur) : licences, CASP/VASP, AML, juridictions."
    }
  },
  {
    name: 'tokenlab', color: 'tokenlab',
    desc: {
      en: 'The token economy: tokenomics, value flow, supply, vesting, TGE. (Its compliance module points back to regul8 + Onchaindesign.)',
      fr: "L'économie du token : tokenomics, value flow, supply, vesting, TGE. (Son module compliance renvoie à regul8 + Onchaindesign.)"
    }
  },
  {
    name: 'gameframe', color: 'transverse',
    desc: {
      en: 'Gamification: improving features and stakeholder incentives.',
      fr: 'La gamification : améliorer les features et les incitations des parties prenantes.'
    }
  },
  {
    name: '7powers', color: 'transverse',
    desc: { en: 'Defensibility / the moat.', fr: 'La défendabilité / le moat.' }
  },
  {
    name: 'pitchcraft', color: 'transverse',
    desc: { en: 'The pitch / the raise.', fr: 'Le pitch / la levée.' }
  }
]

// ── Section 3: design loop nodes + caption ──
export const LOOP_NODES = {
  driver: {
    color: 'host' as AppColor,
    title: { en: 'Characteristics', fr: 'Caractéristiques' } as Bi,
    sub: { en: 'the driver — what you want', fr: 'le moteur — ce que tu veux' } as Bi
  },
  legal: {
    color: 'regul8' as AppColor,
    title: { en: 'Legal class', fr: 'Classe juridique' } as Bi,
    sub: { en: 'consequence · obligations', fr: 'conséquence · obligations' } as Bi
  },
  impl: {
    color: 'tokenlab' as AppColor,
    title: { en: 'Implementation', fr: 'Implémentation' } as Bi,
    sub: { en: 'consequence · tech, cost', fr: 'conséquence · tech, coût' } as Bi
  }
}
export const LOOP_CAPTION: Bi = {
  en: 'Why it is not a Build-Measure-Learn: feedback comes from the rules, not the market — you learn by deducing, not by shipping. Substance over form: the characteristics determine the class and the tech, never the other way round; one standard (MPT, NFT…) can carry several classes.',
  fr: "Pourquoi ce n'est pas un Build-Measure-Learn : le feedback vient des règles, pas du marché — tu apprends en déduisant, pas en expédiant. Substance over form : les caractéristiques déterminent la classe et la tech, jamais l'inverse ; un même standard (MPT, NFT…) peut porter plusieurs classes."
}

// ── Section 4: token lifecycle ──
export interface LifeStage { ln: Bi; title: Bi; desc: Bi }
export const LIFECYCLE: LifeStage[] = [
  {
    ln: { en: '0 · off-chain', fr: '0 · off-chain' },
    title: { en: 'Conception', fr: 'Conception' },
    desc: { en: 'Design: characteristics → class → tech (§3).', fr: 'Design : caractéristiques → classe → tech (§3).' }
  },
  {
    ln: { en: '1 · on-chain', fr: '1 · on-chain' },
    title: { en: 'Creation', fr: 'Création' },
    desc: {
      en: 'Instantiate the token technically. The type exists (e.g. XRPL issuance).',
      fr: 'Instancier le token techniquement. Le type existe (ex. issuance XRPL).'
    }
  },
  {
    ln: { en: '2', fr: '2' },
    title: { en: 'Issuance', fr: 'Émission' },
    desc: { en: 'Mint the units, put supply into circulation.', fr: 'Minter les unités, mettre la supply en circulation.' }
  },
  {
    ln: { en: '3', fr: '3' },
    title: { en: 'Distribution / sale', fr: 'Distribution / vente' },
    desc: { en: 'Allocate, sell (TGE, airdrops). Retail ratchet.', fr: 'Allouer, vendre (TGE, airdrops). Cliquet retail.' }
  },
  {
    ln: { en: '4', fr: '4' },
    title: { en: 'Life', fr: 'Vie' },
    desc: {
      en: 'Secondary, reserve, governance, freeze/clawback, upgrades, reporting.',
      fr: 'Secondaire, réserve, gouvernance, gel/clawback, upgrades, reporting.'
    }
  },
  {
    ln: { en: '5', fr: '5' },
    title: { en: 'End / burn', fr: 'Fin / burn' },
    desc: { en: 'Destroy units, wind-down, expiration.', fr: 'Destruction d’unités, wind-down, expiration.' }
  }
]
export const LIFECYCLE_CAPTION: Bi = {
  en: 'The skeleton holds. "Life" is the catch-all for admin actions (freeze, clawback, upgrade, governance); vesting/unlocks live in tokenlab; and a testnet → mainnet step slots between creation and issuance depending on the chain.',
  fr: "Le squelette tient. « Vie » est le fourre-tout des actions admin (gel, clawback, upgrade, gouvernance) ; le vesting/déblocage vit côté tokenlab ; et un passage testnet → mainnet s'intercale entre création et émission selon la chaîne."
}
