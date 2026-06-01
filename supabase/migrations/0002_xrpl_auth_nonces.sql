-- XRPL "Sign in with wallet" nonce store (lifted from 7powers).
-- Short-lived challenge nonces per address while the sign-in dance is in flight.
-- Touched ONLY by server endpoints with the service-role key; clients denied.

create table public.xrpl_auth_nonces (
  address     text primary key,         -- lowercased XRPL classic address
  nonce       text not null,            -- random hex baked into the signed message
  expires_at  timestamptz not null,     -- 5-min window
  created_at  timestamptz not null default now()
);

create index xrpl_auth_nonces_expires_at_idx on public.xrpl_auth_nonces(expires_at);

alter table public.xrpl_auth_nonces enable row level security;

create policy "xrpl_auth_nonces: deny all client access"
  on public.xrpl_auth_nonces for all
  to authenticated, anon
  using (false) with check (false);
