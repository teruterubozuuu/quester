import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const difficultyExp = {
  easy: 10,
  medium: 25,
  hard: 60,
  diabolical: 150,
} as const;

type Difficulty = keyof typeof difficultyExp;

const questStatuses = ["todo", "in_progress", "completed"] as const;

type QuestStatus = (typeof questStatuses)[number];

type AddQuestRequest = {
  gameId: string;
  title: string;
  difficulty: Difficulty;
  status: QuestStatus;
};

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: AddQuestRequest = await req.json();
    const title = body.title.trim();

    if (
      !title ||
      !body.gameId ||
      !(body.difficulty in difficultyExp) ||
      !questStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Invalid quest data" },
        { status: 400 },
      );
    }

    // Confirm that this game belongs to the authenticated user.
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("id", body.gameId)
      .eq("user_id", user.id)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("quests")
      .insert({
        game_id: body.gameId,
        user_id: user.id,
        title,
        difficulty: body.difficulty,
        exp: difficultyExp[body.difficulty],
        status: body.status,
      })
      .select()
      .single();

    if (error) {
      console.error("Quest insert failed:", error);
      return NextResponse.json(
        { error: "Failed to create quest" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Add quest request failed:", error);
    return NextResponse.json(
      { error: "Failed to create quest" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Authorize User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { questId, title, difficulty, status } = await req.json();

    const { data: updatedQuest, error: updateError } = await supabase
      .from("quests")
      .update({ title, difficulty, status })
      .eq("user_id", user.id)
      .eq("id", questId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to edit quest" },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedQuest, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to Edit Quest" },
      { status: 500 },
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
        { error: "Unauthorized", success: "false" },
        { status: 401 },
      );
    }

    const { questId } = await req.json();

    const { error: questError } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId)
      .eq("user_id", user.id);

    if (questError) {
      return NextResponse.json(
        { error: "API Error: Failed to delete quest", success: "false" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Quest successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete quest: ", error);
    return NextResponse.json(
      { error: "API Error: Failed to delete quest", success: false },
      { status: 500 },
    );
  }
}
