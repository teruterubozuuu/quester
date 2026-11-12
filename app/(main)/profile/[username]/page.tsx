import ProfileActivities from "@/components/ProfileActivities";
import ProfileFavoriteGame from "@/components/ProfileFavoriteGame";
import ProfileHeader from "@/components/ProfileHeader";
import ProfilePosts from "@/components/ProfilePosts";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Unauthorized");
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, current_exp, level, bio")
    .eq("username", username)
    .single();

  if (error || !profile) {
    return <div className="p-4">Profile not found</div>
  }

  const { data: favoriteGame, error: gameError } = await supabase
    .from("user_favorite_games")
    .select("id, user_id, title, cover, description")
    .eq("user_id", user.id)
    .maybeSingle();

    if (gameError) {
      console.error("Game not found: ", gameError);
    }


  const currentExp = profile?.current_exp ?? 0;
  const level = profile?.level ?? 1;

  const thresholdForCurrentLevel = 100 * level ** 2;
  const progressPercent = ((currentExp / thresholdForCurrentLevel) * 100).toFixed(0);
  const isOwnProfile = user && profile ? user.id === profile.id : false;

  return (
    <div>
      <header>
        <ProfileHeader user={profile} progress={Number(progressPercent)} isOwnProfile={isOwnProfile} />
      </header>
      <div className="flex gap-3 py-3">
        <aside className="flex-1/15 md:block hidden">
          <ProfileFavoriteGame isOwnProfile={isOwnProfile} savedFavoriteGame={favoriteGame}/>
        </aside>
        <main className="flex-5"><ProfilePosts /></main>
        <aside className="flex-1/15 md:block hidden">
          <ProfileActivities />
        </aside>
      </div>
    </div>
  )
}
