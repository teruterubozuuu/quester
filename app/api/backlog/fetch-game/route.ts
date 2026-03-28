import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return Response.json({error: "Unauthorized"}, {status: 401});
    }

    try{
        const {data, error} = await supabase
        .from("game_tracker")
        .select("id, game_id, game_title, status")
        .eq("user_id", session.user.id)
        .order("added_at", { ascending: false });


        if (error) throw error;
        return Response.json({games: data});
    } catch(error){
        console.error(error);
        return Response.json({error}, {status: 500});
    }
}