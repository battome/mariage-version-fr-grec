create table if not exists public.wedding_quiz_results (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null check (score >= 0 and score <= 100),
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.wedding_quiz_results enable row level security;

drop policy if exists "Anyone can insert quiz results" on public.wedding_quiz_results;
drop policy if exists "Anyone can read quiz leaderboard" on public.wedding_quiz_results;

create policy "Anyone can insert quiz results"
on public.wedding_quiz_results
for insert
to anon
with check (true);

create policy "Anyone can read quiz leaderboard"
on public.wedding_quiz_results
for select
to anon
using (true);
