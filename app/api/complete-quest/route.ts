import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const extMap: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
};

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const questId = formData.get("questId") as string;
    const proofProvided = formData.get("proofProvided") === "true";
    const file = proofProvided ? (formData.get("file") as File | null) : null;

    if (!questId)
      return NextResponse.json({ error: "questId required" }, { status: 400 });
    if (proofProvided && !file)
      return NextResponse.json({ error: "File required" }, { status: 400 });
    if (file && file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    if (file && !file.type.startsWith("image/"))
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

    // Update quest status to "completed"
    const { data: updatedQuest, error: updateError } = await supabase
      .from("quests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", questId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError || !updatedQuest) {
      return NextResponse.json(
        { error: "Quest not found or not updatable" },
        { status: 404 },
      );
    }

    // Insert Proof of Completion into Bucket if Quest Completion update is a success
    if (proofProvided && file) {
      const ext = extMap[file.type];

      if (!ext) throw new Error("Unsupported file type");

      const path = `${user.id}/${questId}/${crypto.randomUUID()}.${ext}`;

       const { error: uploadError } = await supabase.storage
        .from("quest_poc")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        // Rollback the status change to avoid marking complete without proof
        await supabase
          .from("quests")
          .update({ status: "in_progress", completed_at: null })
          .eq("id", questId)
          .eq("user_id", user.id);

        console.error("Proof upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload proof" },
          { status: 500 },
        );
      }

      // Persist proof metadata
      const { error: proofInsertError } = await supabase.from("quest_proofs").insert({
        quest_id: questId,
        user_id: user.id,
        storage_path: path,
        mime_type: file.type,
        size: file.size,
      });

      if (proofInsertError) {
        // Cleanup uploaded file
        await supabase.storage.from("quest_poc").remove([path]);
        await supabase
          .from("quests")
          .update({ status: "in_progress", completed_at: null })
          .eq("id", questId)
          .eq("user_id", user.id);
        
        console.error("Proof metadata insert failed:", proofInsertError);
        return NextResponse.json({ error: "Failed to save proof" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json({
      success: false,
      error: "Failed to mark quest as completed",
    },
    {status: 500}
  );
  }
}
