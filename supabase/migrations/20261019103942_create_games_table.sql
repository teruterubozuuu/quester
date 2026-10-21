CREATE TABLE games(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL references auth.users(id) ON DELETE CASCADE,
    
    igdb_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    cover TEXT,
    summary TEXT,
    dlcs TEXT[],
    release_date TIMESTAMPTZ,
    category TEXT,
    genre TEXT[],
    platforms TEXT[],
    total_ratings NUMERIC,
    url TEXT,

    status TEXT NOT NULL DEFAULT 'backlog'
        CHECK (status IN ('backlog', 'playing', 'completed', 'dropped')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, igdb_id)
);

CREATE INDEX games_user_id_idx ON public.games(user_id);
CREATE INDEX games_status_idx ON public.games(status);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own games"
ON public.games
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
ON public.games
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
ON public.games
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games"
ON public.games
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);