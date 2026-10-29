import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, gameId } = body;

    const { data: gameStatus, error: gameStatusError } = await supabase
      .from("games")
      .update({
        status: status,
      })
      .eq("id", gameId);

    if (gameStatusError) {
      return NextResponse.json(
        { error: "Failed to update game status" },
        { status: 500 },
      );
    }

    return NextResponse.json(gameStatus, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update game status" },
      { status: 500 },
    );
  }
}
