import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error. Upload is not available." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const email = formData.get("email") as string | null;

  if (!file || !email) {
    return NextResponse.json(
      { error: "Email and video file are required." },
      { status: 400 }
    );
  }

  const sanitizedEmail = email
    .replace("@", "_at_")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const sanitizedFilename = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const path = `${sanitizedEmail}/${timestamp}_${sanitizedFilename}`;

  // Convert File to ArrayBuffer for Node.js runtime compatibility
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("user-submissions")
    .upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "video/mp4",
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  // Store submission metadata
  await supabase.from("video_submissions").insert({
    email,
    filename: file.name,
    storage_path: path,
    file_size: file.size,
    content_type: file.type,
  });

  return NextResponse.json({ success: true });
}
