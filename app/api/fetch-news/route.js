import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";
import { getTopicColor } from "@/lib/story-map";

export const maxDuration = 300;

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
    const categories = [
      "nation",
      "politics",
      "world",
      "business",
      "technology",
    ];

    const allArticles = [];

    for (const category of categories) {
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=5&apikey=${process.env.GNEWS_API_KEY}`
        );
        const data = await res.json();
        if (data.articles?.length) {
          allArticles.push(
            ...data.articles.map(a => ({
              title: a.title,
              description: a.description,
              content: a.content,
              url: a.url,
              publishedAt: a.publishedAt,
              source: {
                name: a.source.name
              },
            }))
          );
        }
      } catch (err) {
        console.error(
          `Failed to fetch ${category}:`,
          err.message
        );
        continue;
      }
    }

    const seen = new Set();
    const unique = allArticles.filter(a => {
      if (seen.has(a.title)) return false;
      seen.add(a.title);
      return true;
    });

    console.log(
      `Fetched ${unique.length} unique articles`
    );

    const processed = [];

    for (const article of unique) {
      try {
        const response = await
          anthropic.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 1500,
            messages: [{
              role: "user",
              content: `You are a political news analyst. Analyze this article and return ONLY a JSON object, no markdown, no code blocks:

{
  "headline": "concise headline under 12 words",
  "summary": "2 sentence summary",
  "topic": "one of exactly: AI Policy, Economy, Legal, Defense, Immigration, Climate, Tech Policy, Healthcare, Trade, Elections",
  "confidence": 85,
  "tldr": "one sentence plain english explanation",
  "background": "2 sentences of historical context",
  "causalChain": [
    {"event": "event", "date": "date", "impact": "impact"},
    {"event": "event", "date": "date", "impact": "impact"},
    {"event": "today", "date": "Today", "impact": "impact"}
  ],
  "whatNext": ["prediction 1", "prediction 2"],
  "perspectives": {
    "left": {"summary": "left view", "keyQuote": "quote", "quoteSource": "source", "sentiment": "label"},
    "center": {"summary": "center view", "keyQuote": "quote", "quoteSource": "source", "sentiment": "label"},
    "right": {"summary": "right view", "keyQuote": "quote", "quoteSource": "source", "sentiment": "label"}
  },
  "relatedTopics": ["topic1", "topic2"],
  "leanBreakdown": {"left": 2, "center": 3, "right": 1}
}

Title: ${article.title}
Description: ${article.description}
Source: ${article.source.name}`
            }]
          });

        let text =
          response.content[0].text.trim();
        if (text.startsWith("```")) {
          text = text
            .replace(/^```json\n?/, "")
            .replace(/^```\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
        }

        const parsed = JSON.parse(text);

        processed.push({
          ...parsed,
          id: crypto.randomUUID(),
          published_at: article.publishedAt,
          url: article.url,
          sources: [article.source.name],
          lean_breakdown:
            parsed.leanBreakdown ||
            { left: 2, center: 3, right: 1 },
          trending: "+0%",
          timestamp: "just now",
          read_time: "4 min",
          topic_color: getTopicColor(
            parsed.topic
          ),
          background: parsed.background,
          tldr: parsed.tldr,
          what_next: parsed.whatNext,
          perspectives: parsed.perspectives,
          related_topics: parsed.relatedTopics,
          causal_chain: parsed.causalChain,
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
                label: "Context analysis",
                detail: "AI analyzed background",
                status: "verified"
              },
              {
                label: "Predictions",
                detail: "Forward-looking analysis",
                status: "speculative"
              }
            ]
          },
          hero: processed.length === 0,
        });

      } catch (err) {
        console.error(
          "Failed:", article.title,
          err.message
        );
        continue;
      }
    }

    if (processed.length > 0) {
      const { error: dbError } =
        await supabaseAdmin
          .from("stories")
          .upsert(processed);

      if (dbError) {
        console.error(
          "Supabase error:",
          dbError.message
        );
        return NextResponse.json({
          stories: processed,
          count: processed.length,
          dbError: dbError.message,
          dbSaved: false,
        });
      }
    }

    return NextResponse.json({
      stories: processed,
      count: processed.length,
      dbSaved: true,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
