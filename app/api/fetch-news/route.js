import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";
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
    if (!process.env.NEWS_API_KEY) {
      return NextResponse.json(
        { error: "NEWS_API_KEY is not configured" },
        { status: 500 }
      );
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=politics&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();
    const articles = newsData.articles;

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: "No articles found" },
        { status: 404 }
      );
    }

    const model =
      process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

    const processed = await Promise.all(
      articles.map(async (article) => {
        try {
          const contentSnippet =
            (article.content && article.content.replace(/\s+/g, " ").slice(0, 4000)) ||
            article.description ||
            "";
          const prompt = `You are a political news analyst for Undercurrent, a news app that explains WHY things happen.

Analyze this news article and return a JSON object with exactly this structure. Return ONLY the JSON, no markdown, no code blocks, no explanation:

{
  "headline": "clean concise headline",
  "summary": "2-3 sentence summary of what happened",
  "topic": "one of exactly these options: AI Policy, Economy, Legal, Defense, Immigration, Climate, Tech Policy, Healthcare, Trade, Elections",
  "confidence": 85,
  "tldr": "one sentence plain english explanation for general public",
  "background": "2-3 sentences of historical context explaining why this matters",
  "causalChain": [
    {"event": "earliest relevant event", "date": "Month Year", "impact": "why this led to today"},
    {"event": "second event", "date": "Month Year", "impact": "consequence"},
    {"event": "third event", "date": "Month Year", "impact": "consequence"},
    {"event": "fourth event", "date": "Month Year", "impact": "consequence"},
    {"event": "what happened today", "date": "Today", "impact": "immediate result"}
  ],
  "whatNext": [
    "specific prediction 1",
    "specific prediction 2", 
    "specific prediction 3"
  ],
  "perspectives": {
    "left": {
      "summary": "how left-leaning outlets like NYT, NPR, CNN frame this story",
      "keyQuote": "representative viewpoint in quotes",
      "quoteSource": "outlet name",
      "sentiment": "two word sentiment label"
    },
    "center": {
      "summary": "how centrist outlets like Reuters, AP, BBC frame this story",
      "keyQuote": "representative viewpoint in quotes",
      "quoteSource": "outlet name",
      "sentiment": "two word sentiment label"
    },
    "right": {
      "summary": "how right-leaning outlets like WSJ, Fox News frame this story",
      "keyQuote": "representative viewpoint in quotes",
      "quoteSource": "outlet name",
      "sentiment": "two word sentiment label"
    }
  },
  "relatedTopics": ["topic 1", "topic 2", "topic 3"]
}

Article to analyze:
Title: ${article.title}
Description: ${article.description}
Content: ${contentSnippet}
Source: ${article.source?.name || "Unknown"}
Published: ${article.publishedAt}`;

          const response = await anthropic.messages.create({
            model,
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt }],
          });

          const textBlock = response.content?.find((b) => b.type === "text");
          const rawText = (textBlock?.text || "").trim();
          const parsed = parseJsonFromClaude(rawText);

          const id =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

          return {
            id,
            headline: parsed.headline,
            summary: parsed.summary,
            topic: parsed.topic,
            confidence: parsed.confidence,
            tldr: parsed.tldr,
            background: parsed.background,
            causal_chain: parsed.causalChain,
            what_next: parsed.whatNext,
            perspectives: parsed.perspectives,
            related_topics: parsed.relatedTopics,
            published_at: article.publishedAt,
            article_url: article.url,
            sources: [article.source?.name || "News"],
            lean_breakdown: { left: 2, center: 3, right: 1 },
            trending: "+0%",
            timestamp: "just now",
            read_time: "5 min",
            topic_color: getTopicColor(parsed.topic),
          };
        } catch (err) {
          console.error("Failed to process article:", err);
          return null;
        }
      })
    );

    const validStories = processed.filter(Boolean);

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      validStories.length > 0
    ) {
      const { error } = await supabase.from("stories").upsert(validStories, {
        onConflict: "id",
      });
      if (error) {
        console.error("Supabase upsert:", error.message);
      }
    }

    return NextResponse.json({
      stories: validStories,
      count: validStories.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
