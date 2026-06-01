/**
 * useActiveProjectStore — lets the shared intake/dossier components target
 * either the Create store or the Analyze store. A wizard provides its store
 * via provideProjectStore(); descendants inject it. Defaults to the Create
 * store when no provider is present.
 */
import type { InjectionKey } from 'vue'
import { useProjectStore, type ProjectStore } from '~/stores/project'

export const ProjectStoreKey: InjectionKey<ProjectStore> = Symbol('active-project-store')

export function provideProjectStore(store: ProjectStore) {
  provide(ProjectStoreKey, store)
}

export function useActiveProjectStore(): ProjectStore {
  return inject(ProjectStoreKey, undefined) ?? useProjectStore()
}
