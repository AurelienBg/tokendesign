/**
 * XRPL sign-in — step 1/2: issue a challenge.
 * Input { address } → Output { message, nonce, expiresAt }.
 * The nonce (5-min TTL, stored in xrpl_auth_nonces) binds the signature to a
 * specific server-issued challenge (replay protection). Lifted from 7powers.
 */
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

interface ChallengeBody {
  address?: unknown
}

function looksLikeXrplAddress(s: unknown): s is string {
  return typeof s === 'string' && /^r[a-zA-Z0-9]{24,34}$/.test(s)
}

const NONCE_TTL_MS = 5 * 60 * 1000

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!supabaseUrl || !serviceKey) {
    setResponseStatus(event, 500)
    return { error: 'Supabase service credentials missing on this deployment.' }
  }

  const body = await readBody<ChallengeBody>(event).catch(() => null)
  if (!body || !looksLikeXrplAddress(body.address)) {
    setResponseStatus(event, 400)
    return { error: 'Invalid or missing XRPL address.' }
  }
  const address = body.address as string

  const nonce = randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + NONCE_TTL_MS)

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { error } = await admin
    .from('xrpl_auth_nonces')
    .upsert({ address, nonce, expires_at: expiresAt.toISOString() })

  if (error) {
    console.error('[xrpl-challenge] failed to store nonce:', error)
    setResponseStatus(event, 500)
    return { error: 'Could not issue challenge — try again.' }
  }

  const message =
    `Sign in to Token Design\n\n` +
    `Address: ${address}\n` +
    `Nonce: ${nonce}\n` +
    `Expires: ${expiresAt.toISOString()}`

  return { message, nonce, expiresAt: expiresAt.toISOString() }
})
