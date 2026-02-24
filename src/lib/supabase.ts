import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
