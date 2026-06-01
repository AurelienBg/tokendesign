/**
 * XRPL sign-in — step 2/2: verify the signed challenge + provision a session.
 * Input { address, signature, publicKey, message } → Output { email, otp }.
 * The client redeems the OTP via supabase.auth.verifyOtp() to get a session.
 *
 * Checks: nonce exists + not expired + present in the message; signature
 * verifies (ripple-keypairs); deriveAddress(publicKey) === claimed address;
 * nonce burned after use. Lifted from 7powers.
 */
import { createClient } from '@supabase/supabase-js'
import { verify, deriveAddress } from 'ripple-keypairs'

interface VerifyBody {
  address?: unknown
  signature?: unknown
  publicKey?: unknown
  message?: unknown
}

function isHexString(s: unknown): s is string {
  return typeof s === 'string' && /^[0-9a-fA-F]+$/.test(s) && s.length > 0
}
function isNonEmptyString(s: unknown): s is string {
  return typeof s === 'string' && s.length > 0
}
function utf8ToHex(s: string): string {
  return Buffer.from(s, 'utf8').toString('hex').toUpperCase()
}

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!supabaseUrl || !serviceKey) {
    setResponseStatus(event, 500)
    return { error: 'Supabase service credentials missing on this deployment.' }
  }

  const body = await readBody<VerifyBody>(event).catch(() => null)
  if (
    !body ||
    !isNonEmptyString(body.address) ||
    !isHexString(body.signature) ||
    !isHexString(body.publicKey) ||
    !isNonEmptyString(body.message)
  ) {
    setResponseStatus(event, 400)
    return { error: 'Missing address / signature / publicKey / message.' }
  }
  const { address, signature, publicKey, message } = body

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 1. Nonce lookup + freshness.
  const { data: nonceRow, error: nonceErr } = await admin
    .from('xrpl_auth_nonces')
    .select('nonce, expires_at')
    .eq('address', address)
    .maybeSingle()
  if (nonceErr) {
    console.error('[xrpl-verify] nonce lookup failed:', nonceErr)
    setResponseStatus(event, 500)
    return { error: 'Could not verify challenge.' }
  }
  if (!nonceRow) {
    setResponseStatus(event, 400)
    return { error: 'No challenge issued for this address. Request a new one.' }
  }
  if (new Date(nonceRow.expires_at as string).getTime() < Date.now()) {
    setResponseStatus(event, 400)
    return { error: 'Challenge expired. Request a new one.' }
  }
  if (!message.includes(nonceRow.nonce as string)) {
    setResponseStatus(event, 400)
    return { error: 'Signed message does not contain the issued nonce.' }
  }

  // 2. Signature verification.
  let sigOk = false
  try {
    sigOk = verify(utf8ToHex(message), signature, publicKey)
  } catch (e) {
    console.warn('[xrpl-verify] verify() threw:', e)
  }
  if (!sigOk) {
    setResponseStatus(event, 401)
    return { error: 'Signature did not verify.' }
  }

  // 3. address ↔ publicKey binding.
  let derivedAddress: string
  try {
    derivedAddress = deriveAddress(publicKey)
  } catch {
    setResponseStatus(event, 401)
    return { error: 'Public key is malformed.' }
  }
  if (derivedAddress !== address) {
    setResponseStatus(event, 401)
    return { error: 'Public key does not match the claimed address.' }
  }

  // 4. Burn the nonce (single-use).
  await admin.from('xrpl_auth_nonces').delete().eq('address', address)

  // 5. Provision the user + issue an OTP.
  const pseudoEmail = `${address.toLowerCase()}@wallet.tokendesign.app`
  const { error: createErr } = await admin.auth.admin.createUser({
    email: pseudoEmail,
    email_confirm: true,
    user_metadata: { xrpl_address: address, xrpl_only: true }
  })
  if (createErr && !/already.*registered/i.test(createErr.message)) {
    console.error('[xrpl-verify] createUser failed:', createErr)
    setResponseStatus(event, 500)
    return { error: 'Could not provision wallet user.' }
  }

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: pseudoEmail
  })
  if (linkErr || !linkData) {
    console.error('[xrpl-verify] generateLink failed:', linkErr)
    setResponseStatus(event, 500)
    return { error: 'Could not issue session token.' }
  }
  const otp = linkData.properties?.email_otp
  if (!otp) {
    setResponseStatus(event, 500)
    return { error: 'Empty session token from auth provider.' }
  }

  return { email: pseudoEmail, otp }
})
