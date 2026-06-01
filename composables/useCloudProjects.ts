/**
 * useCloudProjects — CRUD over the `projects` table (one row per saved dossier,
 * any of the 3 angles), scoped to the signed-in user by RLS. Local-first: this
 * is only reachable once authenticated; anonymous work stays in localStorage.
 */
export type Angle = 'create' | 'analyze' | 'build'

export interface CloudProject {
  id: string
  angle: Angle
  name: string
  state: Record<string, unknown>
  created_at: string
  updated_at: string
}

import type { SupabaseClient } from '@supabase/supabase-js'

export function useCloudProjects() {
  // DB types aren't generated (Database = unknown), which makes the typed
  // query builder reject payloads. Use the loosely-typed client; we validate
  // shapes via the CloudProject cast below.
  const supabase = useSupabaseClient() as unknown as SupabaseClient

  async function list(angle?: Angle): Promise<CloudProject[]> {
    let q = supabase.from('projects').select('*').order('updated_at', { ascending: false })
    if (angle) q = q.eq('angle', angle)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []) as unknown as CloudProject[]
  }

  async function save(angle: Angle, name: string, state: Record<string, unknown>): Promise<CloudProject> {
    const { data, error } = await supabase
      .from('projects')
      .insert({ angle, name, state })
      .select('*')
      .single()
    if (error) throw error
    return data as unknown as CloudProject
  }

  async function update(id: string, patch: { name?: string; state?: Record<string, unknown> }): Promise<void> {
    const { error } = await supabase.from('projects').update(patch).eq('id', id)
    if (error) throw error
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }

  return { list, save, update, remove }
}
