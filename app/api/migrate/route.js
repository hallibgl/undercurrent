import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { error } = await supabaseAdmin
    .rpc("exec_sql", { 
      sql: `
        ALTER TABLE stories 
        ADD COLUMN IF NOT EXISTS 
          url text,
        ADD COLUMN IF NOT EXISTS 
          hero boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS 
          timestamp text 
          DEFAULT 'just now',
        ADD COLUMN IF NOT EXISTS 
          read_time text 
          DEFAULT '5 min',
        ADD COLUMN IF NOT EXISTS 
          trending text 
          DEFAULT '+0%';
      `
    });

  if (error) {
    return NextResponse.json({ 
      error: error.message 
    });
  }

  return NextResponse.json({ 
    success: true 
  });
}
