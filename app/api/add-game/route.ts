import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type IGDBReference = {
  name: string;
};

type IGDBGame = {
  id: number;
  name: string;
  cover?: {
    url: string;
  } | null;
  game_type?: IGDBReference | null;
  genres?: IGDBReference[];
  platforms?: IGDBReference[];
  summary?: string | null;
  total_rating?: number | null;
  url?: string | null;
  first_release_date?: number | null;
};

type AddGameRequest = {
  game: IGDBGame;
  status: string;
};

function getCoverUrl(cover?: IGDBGame["cover"]): string | null {
 let url: string | null = null;

  if (typeof cover === "string") {
    url = cover;
  } else if (cover && typeof cover === "object" && "url" in cover) {
    url = (cover as { url?: string }).url ?? null;
  }

  if (!url) return null;

  const normalized = url.startsWith("//") ? `https:${url}` : url;
  return normalized.replace("/t_thumb/", "/t_cover_big/");
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { game, status }: AddGameRequest = await req.json();

    // Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent adding duplicate games to the Quest Board
    const {data: existingGame, error: lookupError}= await supabase
    .from("games")
    .select("igdb_id")
    .eq("user_id", user.id)
    .eq("igdb_id", game.id)
    .maybeSingle();;

    if (lookupError) {
      console.error("Duplicate check failed:", lookupError);
      return NextResponse.json(
        { error: "Failed to verify game uniqueness" },
        { status: 500 }
      );
    }

    if(existingGame) {
        return NextResponse.json(
    { error: "This game is already on your Quest Board" },
    { status: 409 }
  );
    }

    // Insert records to database
    const { data, error } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        igdb_id: game.id,
        title: game.name,
        cover:getCoverUrl(game.cover),
        category: game.game_type,
        genre: game.genres?.map((genre) => genre.name) ?? [],
        platforms: game.platforms?.map((platform) => platform.name) ?? [],
        summary: game.summary ?? null,
        total_ratings: game.total_rating ?? null,
        url: game.url ?? null,
        release_date: game.first_release_date
          ? new Date(game.first_release_date * 1000).toISOString()
          : null,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Game insert failed: ", error);
      return NextResponse.json(
        { error: "Failed to save Game" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save game. An unexpected error occurred" },
      { status: 500 },
    );
  }
}
