import QuestsPage from "@/components/QuestsPage";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { connection } from "next/server";


export const instant = false;

export default async function Quests() {
   await connection();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: gameData, error: gameError } = await supabase
    .from("games")
    .select(
      "id, user_id, title, cover, summary, release_date, category, genre, platforms, total_ratings, url, status, created_at",
    )
    .eq("user_id", user.id)
    .order("id", {ascending: false});

  if (gameError) {
    console.error("Failed to fetch games:", gameError);
    throw new Error("Failed to fetch games");
  }

  const {data: questData, error: questError} = await supabase
  .from("quests")
  .select("*")
  .eq("user_id", user.id)
  .order("id", {ascending: false});

  if (questError){
    console.error("Failed to fetch quests: ", questError);
    throw new Error("Failed to fetch quests");
  }

  return <QuestsPage gameData={gameData} questData={questData}/>;
}