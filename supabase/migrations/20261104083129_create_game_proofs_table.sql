create table game_proofs (
    id uuid primary key default gen_random_uuid (),
    quest_id uuid not null references quests (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete cascade,
    storage_path text not null,
    mime_type text not null,
    size integer not null,
    uploaded_at timestamptz not null default now(),
);

create policy "Enable read access for all users"
on "public"."game_proofs"
as PERMISSIVE
for SELECT
to public
using (
    true
);

create policy "Enable insert for authenticated users only"
on "public"."game_proofs"
as PERMISSIVE
for INSERT
to authenticated
with check (
    true
);

create policy "Enable insert for users based on user_id"
on "public"."game_proofs"
as PERMISSIVE
for INSERT
to public
with check (
  (select auth.uid()) = user_id
);

create policy "Enable delete for users based on user_id"
on "public"."game_proofs"
as PERMISSIVE
for DELETE
to public
using (
  (select auth.uid()) = user_id
);
