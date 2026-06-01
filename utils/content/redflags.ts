/**
 * Red-flag copy (RF) — title + body per overlay key, FR/EN. Ported from the
 * prototype. NOT legal advice.
 */
import type { RedFlagKey } from '~/utils/engine'
import type { Locale } from './types'

export interface RedFlagText {
  title: string
  body: string
}

export const REDFLAGS: Record<Locale, Record<RedFlagKey, RedFlagText>> = {
  fr: {
    limbo: {
      title: 'Limbo réglementaire',
      body: 'Ton token vise une valeur stable mais aucune entité identifiée ne le garantit (débiteur diffus ou absent). Les régimes EMT/ART supposent un émetteur que l\'on puisse agréer — sans lui, tu es en zone grise.'
    },
    security: {
      title: 'Risque de requalification en instrument financier',
      body: 'Tu présentes un token utility/collection mais promets un gain ou un rendement. Une promesse de profit peut suffire à le faire requalifier en instrument financier — un régime bien plus lourd.'
    },
    algo: {
      title: 'Stablecoin sans réserve réelle',
      body: 'Viser une valeur stable sans réserve d\'actifs en face = modèle algorithmique. MiCA encadre et restreint fortement ce cas.'
    },
    nftserie: {
      title: 'Sortie possible de l\'exemption NFT',
      body: 'Émis en série/éditions ou tourné vers le placement, ton « NFT » peut être requalifié en crypto-actif fongible et retomber sous MiCA.'
    },
    retail: {
      title: 'Distribution grand public = obligations maximales',
      body: 'Viser le retail déclenche le niveau d\'obligations le plus élevé pour ta classe — et c\'est un point de non-retour : une fois largement distribué, difficile de restreindre.'
    },
    custody: {
      title: 'Tu entres en custody',
      body: 'Détenir les fonds ou les clés de tes utilisateurs te fait porter leurs actifs : risque de contrepartie pour eux, obligations de ségrégation pour toi. C\'est la couche « autorité » — à traiter au sérieux (hors périmètre de ce MVP).'
    },
    juridiction: {
      title: 'Hors UE : qualification à refaire',
      body: 'Cette analyse suit le cadre européen (MiCA / MiFID II). Hors UE, la classe et les obligations changent — refais l\'analyse pour chaque juridiction visée.'
    },
    incoherence: {
      title: 'Réponses possiblement incohérentes',
      body: 'Un token « natif » qui aurait pourtant un débiteur ou une réserve est contradictoire. Le dossier retient l\'hypothèse la plus prudente — à reprendre.'
    }
  },
  en: {
    limbo: {
      title: 'Regulatory limbo',
      body: 'Your token aims for a stable value but no identified entity backs it (diffuse or absent debtor). The EMT/ART regimes assume an issuer that can be authorized — without one, you’re in a grey zone.'
    },
    security: {
      title: 'Risk of reclassification as a financial instrument',
      body: 'You present a utility/collectible token but promise a gain or yield. A promise of profit can be enough to get it reclassified as a financial instrument — a much heavier regime.'
    },
    algo: {
      title: 'Stablecoin with no real reserve',
      body: 'Aiming for a stable value with no asset reserve behind it = algorithmic model. MiCA heavily frames and restricts this case.'
    },
    nftserie: {
      title: 'Possible loss of the NFT exemption',
      body: 'Issued as a series/editions or geared toward investment, your “NFT” may be reclassified as a fungible crypto-asset and fall back under MiCA.'
    },
    retail: {
      title: 'Retail distribution = maximum obligations',
      body: 'Targeting retail triggers the highest level of obligations for your class — and it’s a point of no return: once widely distributed, hard to restrict.'
    },
    custody: {
      title: 'You enter custody',
      body: 'Holding your users’ funds or keys means you carry their assets: counterparty risk for them, segregation obligations for you. That’s the “authority” layer — to take seriously (outside this MVP’s scope).'
    },
    juridiction: {
      title: 'Outside the EU: re-do the qualification',
      body: 'This analysis follows the European framework (MiCA / MiFID II). Outside the EU, the class and obligations change — redo the analysis for each target jurisdiction.'
    },
    incoherence: {
      title: 'Possibly inconsistent answers',
      body: 'A “native” token that would nonetheless have a debtor or a reserve is contradictory. The dossier takes the most prudent assumption — to revisit.'
    }
  }
}
