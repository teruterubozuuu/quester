CREATE TABLE public.user_favorite_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    igdb_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    cover TEXT,
    summary TEXT,
    platforms TEXT[],
    genres TEXT[],
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, igdb_id)
);

CREATE INDEX user_favorite_games_user_id_idx ON public.user_favorite_games(user_id);

ALTER TABLE public.user_favorite_games ENABLE ROW LEVEL SECURITY;

create policy "Enable read access for all users"
on "public"."user_favorite_games"
as PERMISSIVE
for SELECT
to public
using (
    true
);

create policy "Enable insert for authenticated users only"
on "public"."user_favorite_games"
as PERMISSIVE
for INSERT
to authenticated
with check (
    true
);

create policy "Enable insert for users based on user_id"
on "public"."user_favorite_games"
as PERMISSIVE
for INSERT
to public
with check (
  (select auth.uid()) = user_id
);

create policy "Enable delete for users based on user_id"
on "public"."user_favorite_games"
as PERMISSIVE
for DELETE
to public
using (
  (select auth.uid()) = user_id
);
