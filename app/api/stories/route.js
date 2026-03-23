import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToClientStory } from "@/lib/story-map";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ stories: [], empty: true });
    }

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({
        stories: [],
        empty: true,
      });
    }

    const stories = data.map(mapDbRowToClientStory);

    return NextResponse.json({
      stories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
