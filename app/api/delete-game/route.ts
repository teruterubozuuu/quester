import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    try{
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        // Authorize user
        const {data: {user}} = await supabase.auth.getUser();

        if (!user){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const { gameId } = await req.json();

        const {error: deleteError} = await supabase
        .from("games")
        .delete()
        .eq("id", gameId);

        if (deleteError) {
            return NextResponse.json(
                {error: "Failed to delete game"},
                {status: 500}
            );
        }
        
        return NextResponse.json({success: true, message: "Game successfully deleted"}, {status: 200});
     } catch (error){
        console.error("API Error: ", error);
        return NextResponse.json(
            {success:false, error: "Failed to delete game"},
            {status: 500}
        );
    }
}