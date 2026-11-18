create policy "Enable update for users based on user_id"
on "public"."user_favorite_games"
as PERMISSIVE
for UPDATE
to public
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);