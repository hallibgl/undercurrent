import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { error } = await supabaseAdmin
    .from("stories")
    .delete()
    .neq("id",
      "00000000-0000-0000-0000-000000000000"
    );

  if (error) {
    return NextResponse.json({
      error: error.message
    });
  }

  return NextResponse.json({
    success: true,
    message: "All stories cleared"
  });
}
