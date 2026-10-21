import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest){
    try{
        
    } catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Failed to update game status"},
            {status: 500}
        )
    }
}