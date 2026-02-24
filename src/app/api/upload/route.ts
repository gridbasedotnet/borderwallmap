import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Allow large video uploads (up to 5 GB)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error. Upload is not available." },
      { status: 500 }
    );
  }

  let supabase;
  try {
    supabase = createClient(supabaseUrl, serviceRoleKey);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Supabase client creation failed:", msg);
    return NextResponse.json(
      { error: `Configuration error: ${msg}` },
      { status: 500 }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("FormData parsing failed:", msg);
    return NextResponse.json(
      { error: `Failed to parse upload: ${msg}` },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const email = formData.get("email") as string | null;

  if (!file || !email) {
    return NextResponse.json(
      { error: "Email and video file are required." },
      { status: 400 }
    );
  }

  // Sanitize path components for Supabase Storage
  const sanitizedEmail = email
    .replace("@", "_at_")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const path = `${sanitizedEmail}/${timestamp}_${sanitizedFilename}`;

  console.log("Upload attempt:", {
    path,
    fileSize: file.size,
    fileType: file.type,
    fileName: file.name,
  });

  // Convert File to Buffer for reliable Node.js compatibility
  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("File read failed:", msg);
    return NextResponse.json(
      { error: `Failed to read file: ${msg}` },
      { status: 400 }
    );
  }

  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from("user-submissions")
    .upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType,
      duplex: "half",
    });

  if (uploadError) {
    console.error("Supabase upload error:", JSON.stringify(uploadError));
    return NextResponse.json(
      {
        error: uploadError.message,
        details: {
          statusCode: (uploadError as unknown as Record<string, unknown>).statusCode,
          path,
          contentType,
          fileSize: file.size,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
