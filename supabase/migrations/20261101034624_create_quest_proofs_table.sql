create table quest_proofs (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references quests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  size integer not null,
  uploaded_at timestamptz not null default now()
);

alter table quests
add column completed_at timestamptz;