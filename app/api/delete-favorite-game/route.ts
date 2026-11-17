import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
