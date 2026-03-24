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
            ...data.articles.map((a) => ({
              title: a.title,
              description: a.description,
              content: a.content,
              url: a.url,
              publishedAt: a.publishedAt,
              source: {
                name: a.source.name,
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
    const unique = allArticles.filter((a) => {
      if (seen.has(a.title)) return false;
      seen.add(a.title);
      return true;
    });

    // Group articles by similar topic to find multiple sources per story
    function findRelatedSources(
      targetArticle,
      allUniqueArticles
    ) {
      const targetWords = targetArticle
        .title.toLowerCase()
        .split(" ")
        .filter((w) => w.length > 4);

      return allUniqueArticles
        .filter(
          (a) =>
            a.title !== targetArticle.title &&
            targetWords.some((word) =>
              a.title.toLowerCase().includes(word)
            )
        )
        .map((a) => a.source.name)
        .slice(0, 4);
    }

    console.log(
      `Fetched ${unique.length} unique articles`
    );

    const processed = [];
    const skipTopics = [
      "sports",
      "entertainment",
      "celebrity",
      "technology product",
      "consumer electronics",
    ];

    const skipKeywords = [
      "march madness",
      "ncaa",
      "nba",
      "nfl",
      "nhl",
      "mlb",
      "celebrity",
      "kardashian",
      "string lights",
      "iphone review",
      "product launch",
      "movie review",
    ];

    for (const article of unique) {
      try {
        const relatedSources = findRelatedSources(
          article,
          unique
        );
        const allSources = [
          article.source.name,
          ...relatedSources,
        ].filter((v, i, arr) => arr.indexOf(v) === i);

        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5",
          max_tokens: 1500,
          messages: [
            {
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
    "left": {
      "summary": "How left-leaning outlets like NY Times, NPR, CNN, Guardian, Washington Post would frame this",
      "keyQuote": "A representative viewpoint a reporter might express",
      "quoteSource": "NY Times or NPR or CNN — use a REAL outlet name",
      "sentiment": "two word label"
    },
    "center": {
      "summary": "How centrist outlets like Reuters, AP, BBC, Bloomberg would frame this",
      "keyQuote": "A representative viewpoint",
      "quoteSource": "Reuters or AP News or BBC — use a REAL outlet name",
      "sentiment": "two word label"
    },
    "right": {
      "summary": "How right-leaning outlets like Fox News, WSJ, NY Post would frame this",
      "keyQuote": "A representative viewpoint",
      "quoteSource": "Fox News or Wall St Journal — use a REAL outlet name",
      "sentiment": "two word label"
    }
  },
  "relatedTopics": ["topic1", "topic2"],
  "leanBreakdown": {"left": 2, "center": 3, "right": 1}
}

IMPORTANT: quoteSource must ALWAYS be one of these real outlet names:
Left: NY Times, NPR, CNN, Guardian, Washington Post, MSNBC
Center: Reuters, AP News, BBC, Bloomberg, PBS NewsHour, The Hill
Right: Fox News, Wall St Journal, NY Post, Washington Examiner, National Review
Never use generic terms like advocates, analysts, experts, commentators, or perspective.

Title: ${article.title}
Description: ${article.description}
Source: ${article.source.name}`,
            },
          ],
        });

        let text = response.content[0].text.trim();
        if (text.startsWith("```")) {
          text = text
            .replace(/^```json\n?/, "")
            .replace(/^```\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
        }

        const parsed = JSON.parse(text);

        const headlineLower =
          parsed.headline.toLowerCase();
        const isSports = skipKeywords.some((kw) =>
          headlineLower.includes(kw)
        );
        const isLowConfidence = parsed.confidence < 40;
        const isSkippedTopic = skipTopics.some((kw) =>
          String(parsed.topic || "")
            .toLowerCase()
            .includes(kw)
        );

        if (isSports || isSkippedTopic || isLowConfidence) {
          console.log(
            "Skipping non-political:",
            parsed.headline
          );
          continue;
        }

        const confidence = Math.min(
          parsed.confidence,
          allSources.length >= 3 ? 90 :
          allSources.length === 2 ? 80 : 70
        );

        processed.push({
          id: crypto.randomUUID(),
          headline: parsed.headline,
          summary: parsed.summary,
          topic: parsed.topic,
          confidence,
          tldr: parsed.tldr,
          background: parsed.background,
          causal_chain: parsed.causalChain,
          what_next: parsed.whatNext,
          perspectives: parsed.perspectives,
          related_topics: parsed.relatedTopics || [],
          lean_breakdown:
            parsed.leanBreakdown ||
            { left: 2, center: 3, right: 1 },
          published_at: article.publishedAt,
          url: article.url,
          sources: allSources,
          trending: "+0%",
          timestamp: "just now",
          read_time: "4 min",
          topic_color: getTopicColor(parsed.topic),
          context_explainer: {
            tldr: parsed.tldr,
            background: parsed.background,
            causalChain: parsed.causalChain,
            whatNext: parsed.whatNext,
            perspectives: parsed.perspectives,
          },
          confidence_explainer: {
            score: Math.min(parsed.confidence, 75),
            sourcesAgreeing: allSources.length,
            sourcesTotal: allSources.length,
            factsCrossVerified: Math.floor(
              parsed.confidence / 15
            ),
            factsTotal: 10,
            breakdown: [
              {
                label: "Source confirmed",
                detail: `Reported by ${article.source.name}`,
                status: "verified",
              },
              {
                label: "AI context analysis",
                detail: "Background and context generated by Claude",
                status: "partial",
              },
              {
                label: "Cross-source verification",
                detail: "Single source — awaiting cross-verification",
                status: "speculative",
              },
              {
                label: "Perspectives",
                detail: "AI-generated based on known outlet positions",
                status: "speculative",
              },
            ],
          },
          hero: processed.length === 0,
        });
      } catch (err) {
        console.error(
          "Failed:",
          article.title,
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
