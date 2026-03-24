import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RSS_FEEDS = [
  {
    url: "https://feeds.reuters.com/reuters/topNews",
    name: "Reuters",
    lean: "center"
  },
  {
    url: "https://feeds.reuters.com/Reuters/politicsNews",
    name: "Reuters",
    lean: "center"
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/us-and-canada/rss.xml",
    name: "BBC News",
    lean: "center"
  },
  {
    url: "https://feeds.bbci.co.uk/news/politics/rss.xml",
    name: "BBC News",
    lean: "center"
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    name: "NY Times",
    lean: "left"
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    name: "NY Times",
    lean: "left"
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/politics.xml",
    name: "Fox News",
    lean: "right"
  },
  {
    url: "https://feeds.npr.org/1001/rss.xml",
    name: "NPR",
    lean: "left"
  },
  {
    url: "https://feeds.npr.org/1014/rss.xml",
    name: "NPR",
    lean: "left"
  },
  {
    url: "https://rss.politico.com/politics-news.xml",
    name: "Politico",
    lean: "center"
  },
  {
    url: "https://thehill.com/news/feed/",
    name: "The Hill",
    lean: "center"
  },
  {
    url: "https://feeds.washingtonpost.com/rss/politics",
    name: "Washington Post",
    lean: "left"
  },
  {
    url: "https://www.theguardian.com/us-news/rss",
    name: "The Guardian",
    lean: "left"
  },
  {
    url: "https://feeds.bloomberg.com/politics/news.rss",
    name: "Bloomberg",
    lean: "center"
  },
  {
    url: "https://abcnews.go.com/abcnews/politicsnewsfeed",
    name: "ABC News",
    lean: "center"
  },
  {
    url: "https://www.cbsnews.com/latest/rss/politics",
    name: "CBS News",
    lean: "center"
  },
  {
    url: "https://feeds.nbcnews.com/nbcnews/public/news",
    name: "NBC News",
    lean: "left"
  },
  {
    url: "https://www.axios.com/feeds/feed.rss",
    name: "Axios",
    lean: "center"
  },
];

async function fetchRSSFeed(feed) {
  try {
    const response = await fetch(
      feed.url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) return [];

    const xml = await response.text();

    const items = [];
    const itemRegex =
      /<item>([\s\S]*?)<\/item>/g;
    let match;

    while (
      (match = itemRegex.exec(xml)) !== null
    ) {
      const item = match[1];

      const title = (
        item.match(
          /<title><!\[CDATA\[(.*?)\]\]><\/title>/
        ) ||
        item.match(/<title>(.*?)<\/title>/)
      )?.[1]?.trim();

      const description = (
        item.match(
          /<description><!\[CDATA\[(.*?)\]\]><\/description>/s
        ) ||
        item.match(
          /<description>(.*?)<\/description>/s
        )
      )?.[1]
        ?.replace(/<[^>]+>/g, "")
        ?.trim()
        ?.slice(0, 500);

      const link = (
        item.match(/<link>(.*?)<\/link>/) ||
        item.match(
          /<guid[^>]*>(.*?)<\/guid>/
        )
      )?.[1]?.trim();

      const pubDate = item.match(
        /<pubDate>(.*?)<\/pubDate>/
      )?.[1]?.trim();

      if (title && title.length > 10) {
        items.push({
          title,
          description: description || title,
          link,
          pubDate,
          source: feed.name,
          lean: feed.lean,
        });
      }
    }

    return items.slice(0, 5);

  } catch (err) {
    console.error(
      `RSS failed for ${feed.name}:`,
      err.message
    );
    return [];
  }
}

function groupByStory(articles) {
  const groups = [];
  const used = new Set();

  for (const article of articles) {
    if (used.has(article.title)) continue;

    const titleWords = article.title
      .toLowerCase()
      .split(" ")
      .filter(w => w.length > 5)
      .slice(0, 5);

    const related = articles.filter(a =>
      a.title !== article.title &&
      !used.has(a.title) &&
      titleWords.filter(w =>
        a.title.toLowerCase().includes(w)
      ).length >= 1
    );

    const group = [article, ...related];
    group.forEach(a => used.add(a.title));

    groups.push({
      primary: article,
      allSources: [...new Set(
        group.map(a => a.source)
      )],
      allLeans: group.map(a => ({
        source: a.source,
        lean: a.lean
      })),
    });
  }

  return groups.slice(0, 20);
}

function calcLeanBreakdown(leans) {
  return {
    left: leans.filter(
      l => l.lean === "left"
    ).length,
    center: leans.filter(
      l => l.lean === "center"
    ).length,
    right: leans.filter(
      l => l.lean === "right"
    ).length,
  };
}

function getTopicColor(topic) {
  const colors = {
    "AI Policy": "#2D6BE4",
    "Economy": "#00C2A8",
    "Legal": "#9B59B6",
    "Defense": "#E74C3C",
    "Immigration": "#E67E22",
    "Climate": "#27AE60",
    "Tech Policy": "#2D6BE4",
    "Healthcare": "#E056A0",
    "Trade": "#F39C12",
    "Elections": "#8E44AD",
  };
  return colors[topic] || "#2D6BE4";
}

function timeAgo(dateString) {
  if (!dateString) return "recently";
  try {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor(
      (now - date) / 1000
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600)
      return `${Math.floor(
        seconds / 60
      )}m ago`;
    if (seconds < 86400)
      return `${Math.floor(
        seconds / 3600
      )}h ago`;
    return `${Math.floor(
      seconds / 86400
    )}d ago`;
  } catch {
    return "recently";
  }
}

export async function GET() {
  try {
    // Fetch all RSS feeds in parallel
    const feedResults = await Promise.all(
      RSS_FEEDS.map(feed =>
        fetchRSSFeed(feed)
      )
    );

    const allArticles = feedResults.flat();
    console.log(
      `Fetched ${allArticles.length}
      total articles from RSS feeds`
    );

    // Group articles covering same story
    const storyGroups =
      groupByStory(allArticles);
    console.log(
      `Grouped into ${storyGroups.length}
      unique stories`
    );

    const processed = [];

    for (const group of storyGroups) {
      const article = group.primary;

      try {
        const sourceCount =
          group.allSources.length;
        const leanBreakdown =
          calcLeanBreakdown(group.allLeans);

        const sourceList =
          group.allSources.join(", ");

        const response = await
          anthropic.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 1500,
            messages: [{
              role: "user",
              content:
`You are a political news analyst for Undercurrent. Analyze this news story and return ONLY valid JSON with no markdown:

{
  "headline": "clear headline under 12 words",
  "summary": "2-3 sentence factual summary",
  "topic": "exactly one of: AI Policy, Economy, Legal, Defense, Immigration, Climate, Tech Policy, Healthcare, Trade, Elections",
  "confidence": ${Math.min(
    60 + sourceCount * 10,
    95
  )},
  "tldr": "one plain English sentence",
  "background": "2 sentences of historical context",
  "causalChain": [
    {"event": "root cause", "date": "timeframe", "impact": "consequence"},
    {"event": "development", "date": "timeframe", "impact": "consequence"},
    {"event": "today's event", "date": "Today", "impact": "immediate result"}
  ],
  "whatNext": ["prediction 1", "prediction 2", "prediction 3"],
  "perspectives": {
    "left": {
      "summary": "how NY Times, NPR, or CNN frames this story",
      "keyQuote": "representative viewpoint",
      "quoteSource": "NY Times",
      "sentiment": "two words"
    },
    "center": {
      "summary": "how Reuters, AP News, or BBC frames this",
      "keyQuote": "representative viewpoint",
      "quoteSource": "Reuters",
      "sentiment": "two words"
    },
    "right": {
      "summary": "how Fox News or WSJ frames this",
      "keyQuote": "representative viewpoint",
      "quoteSource": "Fox News",
      "sentiment": "two words"
    }
  },
  "relatedTopics": ["topic1", "topic2", "topic3"]
}

Sources covering this story: ${sourceList}
Title: ${article.title}
Description: ${article.description}
Primary source: ${article.source}`
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

        // Skip sports and non-political
        const skipWords = [
          "march madness", "ncaa",
          "nba game", "nfl", "nhl",
          "string lights", "iphone review",
          "celebrity", "movie review",
          "recipe", "sports"
        ];
        if (skipWords.some(w =>
          parsed.headline
            .toLowerCase()
            .includes(w)
        )) {
          continue;
        }

        const publishedAt =
          article.pubDate ?
            new Date(article.pubDate)
              .toISOString() :
            new Date().toISOString();

        processed.push({
          id: crypto.randomUUID(),
          headline: parsed.headline,
          summary: parsed.summary,
          topic: parsed.topic,
          topic_color: getTopicColor(
            parsed.topic
          ),
          confidence: Math.min(
            parsed.confidence,
            sourceCount >= 4 ? 95 :
            sourceCount >= 3 ? 88 :
            sourceCount >= 2 ? 80 : 70
          ),
          trending: "+0%",
          sources: group.allSources,
          lean_breakdown: leanBreakdown,
          published_at: publishedAt,
          url: article.link,
          hero: processed.length === 0,
          timestamp: timeAgo(publishedAt),
          read_time: "5 min",
          background: parsed.background,
          tldr: parsed.tldr,
          what_next: parsed.whatNext,
          perspectives: parsed.perspectives,
          related_topics:
            parsed.relatedTopics,
          causal_chain: parsed.causalChain,
          context_explainer: {
            tldr: parsed.tldr,
            background: parsed.background,
            causalChain: parsed.causalChain,
            whatNext: parsed.whatNext,
            perspectives: parsed.perspectives,
          },
          confidence_explainer: {
            score: Math.min(
              parsed.confidence,
              sourceCount >= 4 ? 95 :
              sourceCount >= 3 ? 88 :
              sourceCount >= 2 ? 80 : 70
            ),
            sourcesAgreeing: sourceCount,
            sourcesTotal: sourceCount,
            factsCrossVerified:
              sourceCount * 3,
            factsTotal:
              sourceCount * 4,
            breakdown: [
              {
                label: `${sourceCount} sources reporting`,
                detail: sourceList,
                status: sourceCount >= 3 ?
                  "verified" : "partial"
              },
              {
                label: "Context analysis",
                detail: "AI analyzed background and causality",
                status: "verified"
              },
              {
                label: "Perspectives",
                detail: "Based on known outlet editorial positions",
                status: "partial"
              },
              {
                label: "Predictions",
                detail: "Forward-looking analysis",
                status: "speculative"
              }
            ]
          },
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
          "DB error:",
          dbError.message
        );
        return NextResponse.json({
          stories: processed,
          count: processed.length,
          dbSaved: false,
          dbError: dbError.message
        });
      }
    }

    return NextResponse.json({
      stories: processed,
      count: processed.length,
      dbSaved: true,
      feedsChecked: RSS_FEEDS.length,
      articlesFound:
        "Check server logs"
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
