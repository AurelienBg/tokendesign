/**
 * Class descriptions (CLS) per regulatory class — ported FR/EN from the
 * prototype. NOT legal advice; EU framing (MiCA / MiFID II).
 */
import type { TokenClass } from '~/utils/engine'
import type { Locale } from './types'

export interface ClassInfo {
  name: string
  arch: string
  reg: string
  obl: string[]
}

export const CLASSES: Record<Locale, Record<TokenClass, ClassInfo>> = {
  fr: {
    instrument: {
      name: 'Instrument financier',
      arch: 'une action ou une obligation tokenisée',
      reg: 'Hors MiCA — relève de MiFID II (prospectus, agréments de marché).',
      obl: [
        'Prospectus conforme au Règlement Prospectus',
        'Régime MiFID II pour les services d\'investissement',
        'Agrément des plateformes de négociation / règlement',
        'Éventuel recours au régime pilote DLT'
      ]
    },
    nft: {
      name: 'NFT (hors MiCA)',
      arch: 'un NFT d\'art ou de collection',
      reg: 'Largement hors MiCA tant que vraiment unique (sauf série / fractionnement).',
      obl: [
        'Pas d\'obligation MiCA tant que l\'unicité tient',
        'Droit de la consommation / propriété intellectuelle selon l\'usage',
        'LCB-FT selon les montants et la plateforme'
      ]
    },
    emt: {
      name: 'EMT — jeton de monnaie électronique',
      arch: 'un stablecoin type USDC, calé sur une seule monnaie',
      reg: 'MiCA Titre IV — exige un émetteur agréé (EMI ou établissement de crédit).',
      obl: [
        'Émetteur = établissement de monnaie électronique ou de crédit agréé',
        'Whitepaper crypto-actif publié',
        'Réserve liquide 1:1, ségréguée',
        'Droit au remboursement au pair, à tout moment',
        'Pas d\'intérêts versés aux détenteurs',
        'Reporting prudentiel continu'
      ]
    },
    art: {
      name: 'ART — jeton se référant à des actifs',
      arch: 'un stablecoin adossé à un panier ou à une crypto',
      reg: 'MiCA Titre III — agrément « asset-referenced token ».',
      obl: [
        'Agrément ART auprès du régulateur',
        'Réserve d\'actifs adéquate et ségréguée',
        'Dispositif de gouvernance et de gestion des risques',
        'Whitepaper approuvé',
        'Obligations renforcées si jugé « significant »'
      ]
    },
    utility: {
      name: 'Autre crypto-actif / utility',
      arch: 'un token utility ou de gouvernance',
      reg: 'MiCA Titre II — crypto-actif, whitepaper notifié au régulateur.',
      obl: [
        'Whitepaper crypto-actif notifié au régulateur',
        'Communications marketing loyales et non trompeuses',
        'Recours à un prestataire (CASP) agréé pour les services',
        'Transparence sur les risques'
      ]
    }
  },
  en: {
    instrument: {
      name: 'Financial instrument',
      arch: 'a tokenized share or bond',
      reg: 'Outside MiCA — falls under MiFID II (prospectus, market approvals).',
      obl: [
        'Prospectus compliant with the Prospectus Regulation',
        'MiFID II regime for investment services',
        'Authorization of trading / settlement venues',
        'Possible use of the DLT pilot regime'
      ]
    },
    nft: {
      name: 'NFT (outside MiCA)',
      arch: 'an art or collectible NFT',
      reg: 'Largely outside MiCA as long as truly unique (except series / fractionalization).',
      obl: [
        'No MiCA obligation as long as uniqueness holds',
        'Consumer / IP law depending on use',
        'AML depending on amounts and platform'
      ]
    },
    emt: {
      name: 'EMT — e-money token',
      arch: 'a USDC-style stablecoin, pegged to a single currency',
      reg: 'MiCA Title IV — requires an authorized issuer (EMI or credit institution).',
      obl: [
        'Issuer = authorized e-money or credit institution',
        'Published crypto-asset white paper',
        'Liquid 1:1 reserve, segregated',
        'Right to redemption at par, at any time',
        'No interest paid to holders',
        'Ongoing prudential reporting'
      ]
    },
    art: {
      name: 'ART — asset-referenced token',
      arch: 'a stablecoin backed by a basket or a crypto',
      reg: 'MiCA Title III — asset-referenced token authorization.',
      obl: [
        'ART authorization from the regulator',
        'Adequate, segregated asset reserve',
        'Governance and risk-management framework',
        'Approved white paper',
        'Stricter obligations if deemed significant'
      ]
    },
    utility: {
      name: 'Other crypto-asset / utility',
      arch: 'a utility or governance token',
      reg: 'MiCA Title II — crypto-asset, white paper notified to the regulator.',
      obl: [
        'Crypto-asset white paper notified to the regulator',
        'Fair, non-misleading marketing communications',
        'Use of an authorized provider (CASP) for services',
        'Transparency about risks'
      ]
    }
  }
}
