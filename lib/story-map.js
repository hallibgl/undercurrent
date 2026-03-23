/** Map Supabase row (snake_case) → client story shape used by app/page.jsx */

const TOPIC_COLORS = {
  "AI Policy": "#2D6BE4",
  Economy: "#00C2A8",
  Legal: "#9B59B6",
  Defense: "#E74C3C",
  Immigration: "#E67E22",
  Climate: "#27AE60",
  "Tech Policy": "#2D6BE4",
  Healthcare: "#E056A0",
  Trade: "#F39C12",
  Elections: "#8E44AD",
};

const SOURCE_ENTRIES = [
  ["reuters", /reuters/i],
  ["ap", /^ap\b|associated press/i],
  ["nyt", /new york times|ny times|nyt/i],
  ["wsj", /wall street journal|wsj/i],
  ["bbc", /bbc/i],
  ["fox", /fox news/i],
  ["pbs", /pbs/i],
  ["npr", /npr/i],
  ["cnn", /cnn/i],
  ["economist", /economist/i],
  ["politico", /politico/i],
  ["hill", /the hill/i],
  ["bloomberg", /bloomberg/i],
  ["guardian", /guardian/i],
];

export function mapSourceNamesToIds(names) {
  if (!Array.isArray(names) || names.length === 0) return ["reuters"];
  const out = [];
  for (const raw of names) {
    const n = String(raw || "");
    for (const [id, re] of SOURCE_ENTRIES) {
      if (re.test(n) && !out.includes(id)) {
        out.push(id);
        break;
      }
    }
  }
  return out.length ? out : ["reuters"];
}

function defaultPerspectives() {
  return {
    left: { summary: "—", keyQuote: "—", quoteSource: "—", sentiment: "—" },
    center: { summary: "—", keyQuote: "—", quoteSource: "—", sentiment: "—" },
    right: { summary: "—", keyQuote: "—", quoteSource: "—", sentiment: "—" },
  };
}

function defaultConfidenceExplainer(score) {
  const s = typeof score === "number" ? score : 80;
  return {
    score: s,
    sourcesAgreeing: 1,
    sourcesTotal: 1,
    factsCrossVerified: Math.min(s, 16),
    factsTotal: 16,
    breakdown: [
      { label: "AI analysis", detail: "Summary generated from available article text.", status: "partial" },
    ],
  };
}

function formatPublishedAt(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "";
  }
}

export function mapDbRowToClientStory(row) {
  const perspectives = row.perspectives && typeof row.perspectives === "object"
    ? row.perspectives
    : defaultPerspectives();
  const left = perspectives.left || defaultPerspectives().left;
  const center = perspectives.center || defaultPerspectives().center;
  const right = perspectives.right || defaultPerspectives().right;

  const topic = row.topic || "Elections";
  const topicColor = row.topic_color || TOPIC_COLORS[topic] || "#2D6BE4";

  return {
    id: row.id,
    headline: row.headline || "",
    summary: row.summary || "",
    topic,
    topicColor,
    timestamp: row.timestamp || "recently",
    publishedAt: formatPublishedAt(row.published_at) || row.published_at || "",
    readTime: row.read_time || "5 min",
    confidence: row.confidence ?? 80,
    trending: row.trending || "+0%",
    sources: mapSourceNamesToIds(row.sources),
    leanBreakdown: row.lean_breakdown || { left: 2, center: 3, right: 1 },
    contextExplainer: {
      tldr: row.tldr || row.summary || "",
      background: row.background || "",
      causalChain: Array.isArray(row.causal_chain) ? row.causal_chain : [],
      whatNext: Array.isArray(row.what_next) ? row.what_next : [],
      perspectives: { left, center, right },
    },
    confidenceExplainer: defaultConfidenceExplainer(row.confidence),
    relatedTopics: Array.isArray(row.related_topics) ? row.related_topics : [],
    hero: false,
    articleUrl: row.article_url || null,
  };
}

export function getTopicColor(topic) {
  return TOPIC_COLORS[topic] || "#2D6BE4";
}
