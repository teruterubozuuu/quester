import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type IGDBReference = {
  id: string;
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
  description: string;
};

type EditGameRequest = {
  game: IGDBGame;
  favoriteId: string;
  description: string;
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
    const { game, description }: AddGameRequest = await req.json();

    // Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent adding duplicate games to the Favorite Games table
    const { data: existingGame, error: lookupError } = await supabase
      .from("user_favorite_games")
      .select("igdb_id")
      .eq("user_id", user.id)
      .eq("igdb_id", game.id)
      .maybeSingle();

    if (lookupError) {
      console.error("Duplicate check failed:", lookupError);
      return NextResponse.json(
        { error: "Failed to verify game uniqueness" },
        { status: 500 },
      );
    }

    if (existingGame) {
      return NextResponse.json(
        { error: "This game is already on your Quest Board" },
        { status: 409 },
      );
    }

    // Insert records to database
    const { data, error } = await supabase
      .from("user_favorite_games")
      .insert({
        user_id: user.id,
        igdb_id: game.id,
        title: game.name,
        cover: getCoverUrl(game.cover),
        genres: game.genres?.map((genre) => genre.name) ?? [],
        platforms: game.platforms?.map((platform) => platform.name) ?? [],
        summary: game.summary ?? null,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("Favorite game insert failed: ", error);
      return NextResponse.json(
        { error: "Failed to save Game" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save favorite game. An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { game, favoriteId, description } =
            await req.json() as EditGameRequest;

        // Authorize user
        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validate favorite ID
        if (!favoriteId) {
            return NextResponse.json(
                { error: "Favorite game ID is required" },
                { status: 400 }
            );
        }

        // Update favorite game
        const { data, error } = await supabase
            .from("user_favorite_games")
            .update({
                igdb_id: game.id,
                title: game.name,
                cover: getCoverUrl(game.cover),
                genres: game.genres?.map(genre => genre.name) ?? [],
                platforms: game.platforms?.map(platform => platform.name) ?? [],
                summary: game.summary ?? null,
                description,
            })
            .eq("user_id", user.id)
            .eq("id", favoriteId)
            .select()
            .maybeSingle();

        if (error) {
            console.error("Favorite game update failed:", error);

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: "Favorite game not found or not accessible" },
                { status: 404 }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Favorite game update failed:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { favoriteId } = await req.json();

    // Remove favorite game from database
    const { error: deleteError } = await supabase
      .from("user_favorite_games")
      .delete()
      .eq("user_id", user.id)
      .eq("id", favoriteId);

    if (deleteError) {
      return NextResponse.json(
        {
          error: "API Error: Failed to remove game as favorite",
          success: "false",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully removed game as favorite" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to remove game (API Error): ", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove game as favorite" },
      { status: 500 },
    );
  }
}
