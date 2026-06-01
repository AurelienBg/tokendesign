/**
 * Server-side WebSocket polyfill.
 *
 * @supabase/supabase-js (via realtime-js) expects a global WebSocket, which
 * only exists natively on Node 22+. On Node 20 the SSR-side Supabase client
 * throws "Node.js 20 detected without native WebSocket support". We inject the
 * `ws` implementation as globalThis.WebSocket at server startup so it works on
 * Node 20 and 22 alike. No-op in the browser (native WebSocket already there).
 */
import ws from 'ws'

export default defineNitroPlugin(() => {
  const g = globalThis as unknown as { WebSocket?: unknown }
  if (!g.WebSocket) {
    g.WebSocket = ws
  }
})
