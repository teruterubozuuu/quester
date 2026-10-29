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
                {error: "Unauthorized", success: "false"},
                {status: 401}
            );
        }

        const {questId} = await req.json();

        const {error: questError} = await supabase
        .from("quests")
        .delete()
        .eq("id", questId)
        .eq("user_id", user.id);

        if (questError) {
            return NextResponse.json(
                {error: "API Error: Failed to delete quest", success: "false"},
                {status: 500}
            );
        }

        return NextResponse.json({success: true, message: "Quest successfully deleted"}, {status: 200});
    } catch(error){
        console.error("Failed to delete quest: ", error);
        return NextResponse.json(
            {error: "API Error: Failed to delete quest", success:false},
            {status: 500}
        );
    }
}