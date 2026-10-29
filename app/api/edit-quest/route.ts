import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
