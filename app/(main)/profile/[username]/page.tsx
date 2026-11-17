
import ProfileActivities from "@/components/ProfileActivities";
import ProfileFavoriteGame from "@/components/ProfileFavoriteGame";
import ProfileHeader from "@/components/ProfileHeader";
import ProfilePosts from "@/components/ProfilePosts";
import { ProfileTabs } from "@/components/ProfileTabs";
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
    <div className="flex justify-center gap-3">
      <div className="flex-1 flex flex-col gap-3 min-w-0 max-w-4xl">
        <header>
          <ProfileHeader user={profile} progress={Number(progressPercent)} isOwnProfile={isOwnProfile} />
        </header>
        <div className="py-2 md:hidden sticky">
          <ProfileTabs isOwnProfile={isOwnProfile} savedFavoriteGame={favoriteGame}/>
        </div>
        <main className="hidden md:block"><ProfilePosts /></main>
      </div>
      <aside className="hidden w-72 flex-col gap-3 md:flex">
          <ProfileFavoriteGame isOwnProfile={isOwnProfile} savedFavoriteGame={favoriteGame}/>
          <ProfileActivities />
      </aside>
    </div>
  )
}
