/**
 * useConfigurator — local, ephemeral state for the live axis configurator
 * (Module 2). Runs the engine's coherence check and matches the current
 * vector against the reference library. No persistence: it's a design
 * exercise, not a saved project.
 */
import { coherence, emptyConfig, type ConfigState, type Fonction, type Droit } from '~/utils/engine'
import { REFCASES, CATEGORICAL_AXES, type ReferenceCase } from '~/utils/content/refcases'

// Module-level singleton so the config survives navigation within a session.
const config = reactive<ConfigState>(emptyConfig())

type CatAxis = (typeof CATEGORICAL_AXES)[number]

export function useConfigurator() {
  function toggleAxis(axis: CatAxis, value: string) {
    ;(config[axis] as string | null) = config[axis] === value ? null : value
  }

  function toggleFonction(value: Fonction) {
    const i = config.fonctions.indexOf(value)
    if (i >= 0) config.fonctions.splice(i, 1)
    else config.fonctions.push(value)
  }

  function toggleDroit(value: Droit) {
    const i = config.droits.indexOf(value)
    if (i >= 0) config.droits.splice(i, 1)
    else config.droits.push(value)
  }

  function reset() {
    Object.assign(config, emptyConfig())
  }

  const messages = computed(() => coherence(config))

  const status = computed<'idle' | 'ok' | 'warn' | 'err'>(() => {
    const anySet =
      CATEGORICAL_AXES.some((a) => config[a] != null) || config.fonctions.length > 0 || config.droits.length > 0
    if (!anySet) return 'idle'
    if (messages.value.some((m) => m.level === 'err')) return 'err'
    if (messages.value.some((m) => m.level === 'warn')) return 'warn'
    return 'ok'
  })

  const setAxes = computed(() => CATEGORICAL_AXES.filter((a) => config[a] != null))

  const matches = computed<ReferenceCase[]>(() => {
    const axes = setAxes.value
    if (axes.length === 0) return []
    return REFCASES.filter((c) => axes.every((a) => c.v[a] === config[a]))
  })

  return { config, toggleAxis, toggleFonction, toggleDroit, reset, messages, status, setAxes, matches }
}
