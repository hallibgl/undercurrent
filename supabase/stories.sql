-- Run in Supabase SQL editor. Adjust RLS policies for your app.

create table if not exists public.stories (
  id uuid primary key,
  headline text,
  summary text,
  topic text,
  confidence integer,
  tldr text,
  background text,
  causal_chain jsonb default '[]'::jsonb,
  what_next jsonb default '[]'::jsonb,
  perspectives jsonb default '{}'::jsonb,
  related_topics jsonb default '[]'::jsonb,
  published_at timestamptz,
  article_url text,
  sources jsonb default '[]'::jsonb,
  lean_breakdown jsonb default '{"left":2,"center":3,"right":1}'::jsonb,
  trending text default '+0%',
  timestamp text default 'just now',
  read_time text default '5 min',
  topic_color text default '#2D6BE4',
  created_at timestamptz default now()
);

create index if not exists stories_created_at_idx on public.stories (created_at desc);

alter table public.stories enable row level security;

-- Public read (anon) for the app — tighten if you use authenticated users only
create policy "Allow public read stories"
  on public.stories for select
  to anon
  using (true);

create policy "Allow insert/update for service role"
  on public.stories for all
  to service_role
  using (true)
  with check (true);

-- For anon upsert from API (server uses anon key): allow insert + update
create policy "Allow anon upsert stories"
  on public.stories for insert
  to anon
  with check (true);

create policy "Allow anon update stories"
  on public.stories for update
  to anon
  using (true)
  with check (true);
