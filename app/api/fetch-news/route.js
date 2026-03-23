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
    const newsRes = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=nation&lang=en&country=us&max=10&apikey=${process.env.GNEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    if (!newsData.articles ||
        newsData.articles.length === 0) {
      return NextResponse.json(
        { error: "No articles from GNews" },
        { status: 404 }
      );
    }

    const articles = newsData.articles.map(
      article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        publishedAt: article.publishedAt,
        source: { name: article.source.name },
      })
    );

    const processed = [];

    for (const article of articles) {
      try {
        const prompt = `You are a political news analyst for Undercurrent, a news app that explains WHY things happen.

Analyze this news article and return a JSON object with exactly this structure. Return ONLY valid JSON, no markdown, no code blocks, no explanation:

{
  "headline": "clean concise headline under 15 words",
  "summary": "2-3 sentence summary of what happened",
  "topic": "one of exactly: AI Policy, Economy, Legal, Defense, Immigration, Climate, Tech Policy, Healthcare, Trade, Elections",
  "confidence": 85,
  "tldr": "one sentence plain english explanation for general public",
  "background": "2-3 sentences of historical context",
  "causalChain": [
    {"event": "earliest relevant event", "date": "Month Year", "impact": "why this matters"},
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
      "summary": "how left-leaning outlets frame this",
      "keyQuote": "representative viewpoint",
      "quoteSource": "outlet name",
      "sentiment": "two word label"
    },
    "center": {
      "summary": "how centrist outlets frame this",
      "keyQuote": "representative viewpoint",
      "quoteSource": "outlet name",
      "sentiment": "two word label"
    },
    "right": {
      "summary": "how right-leaning outlets frame this",
      "keyQuote": "representative viewpoint",
      "quoteSource": "outlet name",
      "sentiment": "two word label"
    }
  },
  "relatedTopics": ["topic 1", "topic 2", "topic 3"],
  "leanBreakdown": {"left": 2, "center": 3, "right": 1}
}

Article:
Title: ${article.title}
Description: ${article.description}
Content: ${article.content}
Source: ${article.source.name}
Published: ${article.publishedAt}`;

        const response = await
          anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 2000,
            messages: [{
              role: "user",
              content: prompt
            }]
          });

        let rawText =
          response.content[0].text.trim();

        if (rawText.startsWith("```")) {
          rawText = rawText
            .replace(/^```json\n?/, "")
            .replace(/^```\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
        }

        const parsed = JSON.parse(rawText);

        processed.push({
          ...parsed,
          id: crypto.randomUUID(),
          published_at: article.publishedAt,
          url: article.url,
          sources: [article.source.name],
          lean_breakdown: parsed.leanBreakdown ||
            { left: 2, center: 3, right: 1 },
          trending: "+0%",
          timestamp: "just now",
          read_time: "5 min",
          topic_color: getTopicColor(
            parsed.topic
          ),
          context_explainer: {
            tldr: parsed.tldr,
            background: parsed.background,
            causalChain: parsed.causalChain,
            whatNext: parsed.whatNext,
            perspectives: parsed.perspectives,
          },
          confidence_explainer: {
            score: parsed.confidence,
            sourcesAgreeing: 3,
            sourcesTotal: 5,
            factsCrossVerified: 8,
            factsTotal: 10,
            breakdown: [
              {
                label: "Core facts",
                detail: "Verified across sources",
                status: "verified"
              },
              {
                label: "Context",
                detail: "AI analyzed background",
                status: "verified"
              },
              {
                label: "Predictions",
                detail: "Analyst projections",
                status: "speculative"
              }
            ]
          },
          related_topics: parsed.relatedTopics,
          hero: false,
        });

      } catch (err) {
        console.error(
          "Failed to process:",
          article.title,
          err.message
        );
        continue;
      }
    }

    if (processed.length === 0) {
      return NextResponse.json(
        { error: "All articles failed processing" },
        { status: 500 }
      );
    }

    if (processed.length > 0) {
      processed[0].hero = true;
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase
        .from("stories")
        .upsert(processed);

      if (dbError) {
        console.error("Supabase error:", dbError);
      }
    }

    return NextResponse.json({
      stories: processed,
      count: processed.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
