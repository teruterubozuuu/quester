CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    difficulty TEXT NOT NULL
        CHECK(difficulty IN ('easy', 'medium', 'hard', 'diabolical')),
    exp INTEGER NOT NULL
        CHECK(exp > 0),
    status TEXT NOT NULL DEFAULT 'todo'
        CHECK (status IN('todo', 'in_progress', 'completed')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()   
);

CREATE INDEX quests_game_id_idx ON public.quests(game_id);
CREATE INDEX quests_user_id_idx ON public.quests(user_id);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests"
ON public.quests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
ON public.quests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
ON public.quests
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quests"
ON public.quests
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);