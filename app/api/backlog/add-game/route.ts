import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { appid, name, status } = await req.json();

  // Duplicate check
  const {data: existing} = await supabase
  .from("game_tracker")
  .select("id")
  .eq("user_id", session.user.id)
  .eq("game_id", appid)
  .single();

  if (existing){
    return NextResponse.json({error: "Game already exists in your board."},{status: 409});
  }

  const { data: game, error } = await supabase.from("game_tracker").insert({
    user_id: session?.user.id,
    game_id: appid,
    game_title: name,
    status: status,
  })
  .select()
  .single();

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ game }, { status: 201 })
}
