/**
 * Shared content types. The methodology content (intake questions, class
 * descriptions, red-flag copy, checklist labels) lives in utils/content/ as
 * typed, bilingual modules — separate from the deterministic engine logic.
 */

export type Locale = 'en' | 'fr'

import type { ProjectState } from '~/utils/engine'

/** A single selectable option: a short title + an optional example/hint. */
export interface OptionText {
  title: string
  example?: string
}

export interface QuestionText {
  label: string
  hint?: string
  /** Keyed by the stable value key (e.g. 'fongible', 'semi', …). */
  options: Record<string, OptionText>
}

/** Intake question keys = the answerable axes of ProjectState. */
export type QuestionKey =
  | 'chemin'
  | 'fongibilite' | 'rapport' | 'titre_type' | 'couverture'
  | 'debiteur' | 'garant' | 'transfer' | 'fonctions' | 'droits'
  | 'rendement' | 'stabilite' | 'distribution' | 'juridiction' | 'custody'

export interface QuestionDef {
  key: QuestionKey
  type: 'single' | 'multi'
  /** Ordered list of value keys to render. */
  order: string[]
  /** Whether the question offers an "I don't know" option. */
  unsure?: boolean
  /** Conditional display predicate on the current raw state. */
  show?: (s: ProjectState) => boolean
  text: Record<Locale, QuestionText>
}
