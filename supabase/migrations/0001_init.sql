-- Token Design — initial schema
-- One table for all three angles (create / analyze / build). The angle's raw
-- intake state is stored as JSONB (the deterministic engine derives the rest
-- client-side). RLS: every row is scoped to its owner.

create type angle as enum ('create', 'analyze', 'build');

create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  angle       angle not null,
  name        text not null check (char_length(name) between 1 and 120),
  -- Raw intake answers (ProjectState / AuthorityState shape, per angle).
  state       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index projects_user_id_idx on public.projects(user_id);
create index projects_updated_at_idx on public.projects(updated_at desc);

-- updated_at touch trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- Row-Level Security — owner-only.
alter table public.projects enable row level security;

create policy "projects: owner can select"
  on public.projects for select using (user_id = auth.uid());

create policy "projects: owner can insert"
  on public.projects for insert with check (user_id = auth.uid());

create policy "projects: owner can update"
  on public.projects for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "projects: owner can delete"
  on public.projects for delete using (user_id = auth.uid());
