import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest){
    const { email, password, username } = await req.json();

    //check if user already exists
    const {data: existingUser} = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

    if (existingUser){
        return NextResponse.json(
            {message: "Email already in use"},
            {status: 400}
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password,10);

    // Insert user into Supabase
    const {error} = await supabase
    .from("users")
    .insert({email, password: hashedPassword, username})
    .select()
    .single();

    if (error){
        console.error("Supabase insert error:", error)
        return NextResponse.json(
            {message: "Something went wrong.", detail: error.message},
            {status:500}
        );
    }

    return NextResponse.json({message: "User created."}, {status: 201});
}
