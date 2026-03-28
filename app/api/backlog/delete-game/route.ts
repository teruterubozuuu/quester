import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){
    try{
        const {id} = await req.json();
        const {data, error} = await supabase
        .from("game_tracker")
        .delete()
        .eq("id", id)

        if (error) throw error;
        return NextResponse.json({data}, {status: 200});
    } catch(error){
        console.error(error);
        return NextResponse.json({error}, {status: 500});
    }
}