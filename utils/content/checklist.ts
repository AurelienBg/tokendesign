/**
 * Checklist item labels (CK) — keyed by ChecklistItemId, FR/EN. Ported from
 * the prototype.
 */
import type { ChecklistItemId } from '~/utils/engine'
import type { Locale } from './types'

export const CHECKLIST: Record<Locale, Record<ChecklistItemId, string>> = {
  fr: {
    c_vector: 'Figer le vecteur d\'identité du token',
    c_legal: 'Faire confirmer la classe par un conseil juridique',
    c_value: 'Définir le modèle de valeur (captation, soutenabilité)',
    c_custody: 'Concevoir la custody / l\'autorité sur les actifs',
    e_agrement: 'Obtenir l\'agrément AVANT toute émission',
    e_mint: 'Mint / création on-chain',
    e_whitepaper: 'Publier le whitepaper crypto-actif',
    e_prospectus: 'Publier le prospectus',
    e_kyc: 'Mettre en place le KYC / LCB-FT à l\'entrée',
    d_venues: 'Choisir les lieux de mise sur le marché (DEX, plateformes, OTC)',
    d_marketing: 'Conformité marketing grand public',
    d_passport: 'Vérifier le passporting / les règles locales par juridiction',
    v_reserve: 'Gérer la réserve et le remboursement à vue',
    v_audit: 'Produire attestations / audits réguliers',
    v_reporting: 'Assurer le reporting prudentiel continu',
    v_nft: 'Animer le marché secondaire (royalties faiblement exécutables)',
    v_utility: 'Maintenir la transparence et le service rendu',
    v_instrument: 'Assurer l\'information continue du marché',
    v_custody: 'Opérer la custody : ségrégation des actifs des utilisateurs',
    f_winddown: 'Plan de wind-down / remboursement ordonné (obligatoire)',
    f_none: 'Pas de fin réglementée — définir le sort des détenteurs (sunset, burn, abandon)'
  },
  en: {
    c_vector: 'Lock the token’s identity vector',
    c_legal: 'Have the class confirmed by legal counsel',
    c_value: 'Define the value model (capture, sustainability)',
    c_custody: 'Design custody / authority over assets',
    e_agrement: 'Obtain authorization BEFORE any issuance',
    e_mint: 'Mint / on-chain creation',
    e_whitepaper: 'Publish the crypto-asset white paper',
    e_prospectus: 'Publish the prospectus',
    e_kyc: 'Set up KYC / AML at onboarding',
    d_venues: 'Choose go-to-market venues (DEX, platforms, OTC)',
    d_marketing: 'Retail marketing compliance',
    d_passport: 'Check passporting / local rules per jurisdiction',
    v_reserve: 'Manage the reserve and on-demand redemption',
    v_audit: 'Produce regular attestations / audits',
    v_reporting: 'Ensure ongoing prudential reporting',
    v_nft: 'Run the secondary market (weakly enforceable royalties)',
    v_utility: 'Maintain transparency and the service provided',
    v_instrument: 'Ensure continuous market disclosure',
    v_custody: 'Operate custody: segregate users’ assets',
    f_winddown: 'Wind-down / orderly redemption plan (mandatory)',
    f_none: 'No regulated end — define holders’ fate (sunset, burn, abandonment)'
  }
}
