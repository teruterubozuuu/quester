import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status } = await req.json();
    const { data, error } = await supabase
      .from("game_tracker")
      .update({status})
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 })
  }
}
