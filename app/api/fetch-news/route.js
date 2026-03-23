import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase";
import { getTopicColor } from "@/lib/story-map";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

function parseJsonFromClaude(text) {
  let t = String(text || "").trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return JSON.parse(t);
}

export async function GET() {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=nation&lang=en&country=us&max=10&apikey=${process.env.GNEWS_API_KEY}`;

    const newsRes = await fetch(url);
    const newsData = await newsRes.json();

    return NextResponse.json({
      debug: true,
      status: newsRes.status,
      hasArticles: !!newsData.articles,
      articleCount: newsData.articles?.length || 0,
      rawResponse: newsData,
      urlUsed: url.replace(
        process.env.GNEWS_API_KEY,
        "KEY_HIDDEN"
      ),
    });

  } catch (error) {
    return NextResponse.json({
      debug: true,
      error: error.message,
    });
  }
}
