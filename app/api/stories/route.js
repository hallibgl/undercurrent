import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({
        error: error.message,
        stories: [],
      });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        stories: [],
        empty: true,
      });
    }

    return NextResponse.json({
      stories: data,
      count: data.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
