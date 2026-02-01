-- =============================================================================
-- Namazing initial schema
-- =============================================================================

-- Profiles (auto-created on auth.users insert)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Runs
create table public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  brief jsonb not null,
  mode text not null default 'serial',
  status text not null default 'pending',
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

alter table public.runs enable row level security;

create policy "Users can view own runs"
  on public.runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own runs"
  on public.runs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own runs"
  on public.runs for delete
  using (auth.uid() = user_id);

create index idx_runs_user_id on public.runs (user_id);

-- Run results
create table public.run_results (
  run_id uuid primary key references public.runs on delete cascade,
  result jsonb not null,
  report_markdown text,
  created_at timestamptz default now() not null
);

alter table public.run_results enable row level security;

create policy "Users can view own results"
  on public.run_results for select
  using (
    exists (
      select 1 from public.runs
      where runs.id = run_results.run_id
      and runs.user_id = auth.uid()
    )
  );
