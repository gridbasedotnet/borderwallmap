import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export interface ImpactVideo {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  altitude_m: number | null;
  video_url: string;
  recorded_at: string | null;
  created_at: string;
}

export function getFullVideoUrl(videoUrl: string): string {
  if (videoUrl.startsWith("http")) return videoUrl;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${baseUrl}${videoUrl}`;
}
