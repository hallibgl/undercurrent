"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// UNDERCURRENT — Complete App v1.1
// ─────────────────────────────────────────────────────────────

const T = {
  bg:"#0A0A0F", surface:"#111118", surfaceHover:"#16161F", surfaceElevated:"#1A1A24",
  border:"#1E1E2E", borderSubtle:"#16162A",
  primary:"#2D6BE4", primaryMuted:"rgba(45,107,228,0.12)", primaryStrong:"#4A85F0",
  accent:"#00C2A8", accentMuted:"rgba(0,194,168,0.10)",
  text:"#F0F0F5", textSecondary:"#8888A0", textTertiary:"#55556A",
  left:"#4A90D9", center:"#8888A0", right:"#D97B4A",
  leftBg:"rgba(74,144,217,0.10)", centerBg:"rgba(136,136,160,0.06)", rightBg:"rgba(217,123,74,0.10)",
  danger:"#E24A4A",
};

const SOURCES={reuters:{name:"Reuters",lean:"center",abbr:"R",trust:95,type:"Wire Service",url:"reuters.com"},ap:{name:"AP News",lean:"center",abbr:"AP",trust:94,type:"Wire Service",url:"apnews.com"},nyt:{name:"NY Times",lean:"left",abbr:"NYT",trust:88,type:"Newspaper",url:"nytimes.com"},wsj:{name:"Wall St Journal",lean:"right",abbr:"WSJ",trust:89,type:"Newspaper",url:"wsj.com"},bbc:{name:"BBC News",lean:"center",abbr:"BBC",trust:92,type:"Broadcaster",url:"bbc.com/news"},fox:{name:"Fox News",lean:"right",abbr:"FOX",trust:62,type:"Broadcaster",url:"foxnews.com"},pbs:{name:"PBS NewsHour",lean:"center",abbr:"PBS",trust:91,type:"Broadcaster",url:"pbs.org/newshour"},npr:{name:"NPR",lean:"left",abbr:"NPR",trust:87,type:"Broadcaster",url:"npr.org"},cnn:{name:"CNN",lean:"left",abbr:"CNN",trust:72,type:"Broadcaster",url:"cnn.com"},economist:{name:"The Economist",lean:"center",abbr:"ECN",trust:90,type:"Magazine",url:"economist.com"},politico:{name:"Politico",lean:"center",abbr:"POL",trust:83,type:"Digital",url:"politico.com"},hill:{name:"The Hill",lean:"center",abbr:"THL",trust:78,type:"Digital",url:"thehill.com"},bloomberg:{name:"Bloomberg",lean:"center",abbr:"BLM",trust:88,type:"Wire Service",url:"bloomberg.com"},guardian:{name:"The Guardian",lean:"left",abbr:"GDN",trust:82,type:"Newspaper",url:"theguardian.com"}};

const STORIES=[
  {id:"hero",headline:"Senate Passes Landmark AI Regulation Bill in Bipartisan 68-30 Vote",summary:"The most comprehensive AI legislation in U.S. history clears the Senate with unexpected bipartisan support. The bill establishes mandatory safety testing standards for frontier AI models and creates a new federal oversight body. It now heads to the House, where tech industry lobbying is expected to intensify.",topic:"AI Policy",topicColor:T.primary,timestamp:"2h ago",publishedAt:"March 21, 2026 · 10:42 AM ET",readTime:"8 min",confidence:94,trending:"+342%",sources:["reuters","ap","nyt","wsj","bbc","pbs","cnn","politico","bloomberg","guardian"],leanBreakdown:{left:4,center:4,right:2},whyItMatters:"This bill would require any AI model trained on more than 10²⁶ FLOPs to undergo government safety evaluation before deployment.",hero:true,
    contextExplainer:{tldr:"Congress is trying to regulate AI before it outpaces governance.",background:"Since ChatGPT in November 2022, over 120 AI bills were introduced but none passed both chambers. The EU AI Act created external pressure. AI incidents shifted public opinion — 72% now favor federal oversight.",causalChain:[{event:"EU AI Act takes effect",date:"Aug 2025",impact:"Compliance precedent for U.S. companies"},{event:"Senate AI Caucus formed",date:"Sep 2025",impact:"Cross-aisle appetite"},{event:"AI deepfake disrupts UK election",date:"Nov 2025",impact:"Catalyst for urgency"},{event:"Voluntary commitments fail",date:"Jan 2026",impact:"Only 3 of 15 met"},{event:"Senate vote: 68-30",date:"Today",impact:"Largest bipartisan tech margin since 1996"}],whatNext:["Bill moves to House.","$140M industry lobbying expected.","Federal AI Safety Board operational within 18 months if signed."],perspectives:{left:{summary:"Progressive outlets emphasize consumer protection but note gaps on algorithmic discrimination.",keyQuote:"A foundation to build on, not the finished architecture.",quoteSource:"NY Times Editorial",sentiment:"Cautiously supportive"},center:{summary:"Wire services focus on the historic vote margin.",keyQuote:"The vote margin surprised even the bill's sponsors.",quoteSource:"Reuters",sentiment:"Analytical"},right:{summary:"Conservative coverage splits between national security and innovation cost warnings.",keyQuote:"The question is whether this picks winners and losers.",quoteSource:"WSJ Editorial",sentiment:"Skeptical but engaged"}}},
    confidenceExplainer:{score:94,sourcesAgreeing:10,sourcesTotal:10,factsCrossVerified:14,factsTotal:16,breakdown:[{label:"Core facts",detail:"Vote count, provisions, sponsors confirmed",status:"verified"},{label:"Quotes attributed",detail:"6 quotes verified across 4+ sources",status:"verified"},{label:"Historical context",detail:"EU timeline, polling cross-checked",status:"verified"},{label:"Projected impact",detail:"Analysis varies by source",status:"partial"},{label:"House outlook",detail:"Speculative",status:"speculative"}]},relatedTopics:["AI Safety","Tech Regulation","Frontier Models"]},
  {id:"s1",headline:"Federal Reserve Signals Two Rate Cuts Before Year End Amid Cooling Inflation",summary:"Chair Powell's latest testimony suggests the Fed is ready to begin easing, citing sustained progress on the 2% inflation target. Markets rallied on the signal. Bond yields fell sharply as traders priced in a September start.",topic:"Economy",topicColor:T.accent,timestamp:"4h ago",publishedAt:"March 21, 2026 · 8:15 AM ET",readTime:"5 min",confidence:91,trending:"+189%",sources:["reuters","wsj","bloomberg","ap","economist"],leanBreakdown:{left:0,center:4,right:1},
    contextExplainer:{tldr:"The Fed is signaling rate cuts — rates have been at a 23-year high since July 2023.",background:"The Fed raised rates 11 times to 5.25-5.50%. Inflation declined to 2.4%. Housing and small business lending under pressure.",causalChain:[{event:"Inflation peaks 9.1%",date:"Jun 2022",impact:"Aggressive hike cycle"},{event:"Rates hit 5.25-5.50%",date:"Jul 2023",impact:"23-year high"},{event:"CPI drops to 2.4%",date:"Feb 2026",impact:"Near target"},{event:"Powell signals cuts",date:"Today",impact:"85% chance September cut"}],whatNext:["September FOMC likely start.","Mortgages could dip below 6%.","Typically boosts stocks and real estate."],perspectives:{left:{summary:"High rates hurt lower-income borrowers disproportionately.",keyQuote:"Relief coming, but equity gaps may take years.",quoteSource:"NPR",sentiment:"Urgent for equity"},center:{summary:"Data-driven pivot; Powell shifted from 'patient' to 'confident'.",keyQuote:"As close to an announcement as central bankers get.",quoteSource:"Bloomberg",sentiment:"Measured"},right:{summary:"Warn against cutting too soon.",keyQuote:"Declaring victory at 2.4% risks 1970s mistakes.",quoteSource:"WSJ",sentiment:"Cautious"}}},
    confidenceExplainer:{score:91,sourcesAgreeing:5,sourcesTotal:5,factsCrossVerified:11,factsTotal:13,breakdown:[{label:"Testimony quotes",detail:"Confirmed by transcript",status:"verified"},{label:"Market data",detail:"S&P, bonds verified",status:"verified"},{label:"September timing",detail:"Implied, not stated",status:"partial"}]},relatedTopics:["Federal Reserve","Inflation","Housing"]},
  {id:"s2",headline:"Supreme Court to Hear Challenge on Presidential Emergency Powers Scope",summary:"The case could redefine executive authority limits during national emergencies. Oral arguments scheduled for October. Scholars call it the most significant separation-of-powers case in a decade.",topic:"Legal",topicColor:"#9B59B6",timestamp:"5h ago",publishedAt:"March 21, 2026 · 7:30 AM ET",readTime:"6 min",confidence:88,trending:"+156%",sources:["ap","nyt","wsj","reuters","politico","hill"],leanBreakdown:{left:2,center:3,right:1},
    contextExplainer:{tldr:"SCOTUS will decide how far presidents can go under emergency declarations.",background:"79 emergencies declared since 1976, 42 still active. Circuit split on scope needs resolution.",causalChain:[{event:"National Emergencies Act",date:"1976",impact:"Framework created"},{event:"Border wall emergency",date:"2019",impact:"Scope debate"},{event:"Circuit split emerges",date:"2025",impact:"Conflicting rulings"},{event:"Cert granted",date:"Today",impact:"October 2026 term"}],whatNext:["Arguments Oct/Nov 2026.","Decision by June 2027.","Could affect 42 declarations."],perspectives:{left:{summary:"Check on executive overreach.",keyQuote:"A chance to rebalance unchecked power.",quoteSource:"NY Times",sentiment:"Hopeful"},center:{summary:"Focus on circuit split mechanics.",keyQuote:"Ideological lines may not predict outcome.",quoteSource:"Reuters",sentiment:"Cautious"},right:{summary:"Divided between executive advocates and originalists.",keyQuote:"Framework needs updating, but courts aren't the body.",quoteSource:"WSJ",sentiment:"Split"}}},
    confidenceExplainer:{score:88,sourcesAgreeing:6,sourcesTotal:6,factsCrossVerified:9,factsTotal:12,breakdown:[{label:"Cert grant",detail:"Docket verified",status:"verified"},{label:"Historical context",detail:"Cross-checked",status:"verified"},{label:"Legal analysis",detail:"Speculative by nature",status:"partial"}]},relatedTopics:["Supreme Court","Executive Power"]},
  {id:"s3",headline:"NATO Members Agree to 3.5% GDP Defense Spending Floor Starting 2027",summary:"The new target nearly doubles the previous 2% commitment. Marathon Brussels negotiations. Eastern Europe pushed hardest.",topic:"Defense",topicColor:"#E74C3C",timestamp:"6h ago",publishedAt:"March 21, 2026 · 6:00 AM ET",readTime:"7 min",confidence:86,trending:"+98%",sources:["bbc","reuters","guardian","economist","ap"],leanBreakdown:{left:2,center:3,right:0},
    contextExplainer:{tldr:"NATO doubles defense spending driven by Ukraine and U.S. commitment concerns.",background:"2% target from 2014 met by only 7/31 in 2023. By 2025, 23 met it. New 3.5% reflects threat shift.",causalChain:[{event:"2% target set",date:"2014",impact:"Underspent for years"},{event:"Russia invades Ukraine",date:"Feb 2022",impact:"Spending surges"},{event:"3.5% agreed",date:"Today",impact:"$300B+ projected"}],whatNext:["Parliaments must ratify.","Germany, Canada face largest gaps.","Defense stocks up 4-8%."],perspectives:{left:{summary:"Question opportunity cost — $300B vs climate/healthcare.",keyQuote:"Security matters, but so does what we're securing.",quoteSource:"Guardian",sentiment:"Concerned"},center:{summary:"Major geopolitical development.",keyQuote:"Biggest collective commitment in NATO history.",quoteSource:"Reuters",sentiment:"Factual"},right:{summary:"Support spending, skeptical of follow-through.",keyQuote:"Pledges are easy. Procurement is hard.",quoteSource:"Economist",sentiment:"Supportive but skeptical"}}},
    confidenceExplainer:{score:86,sourcesAgreeing:5,sourcesTotal:5,factsCrossVerified:8,factsTotal:11,breakdown:[{label:"Agreement confirmed",detail:"NATO communiqué + 5 sources",status:"verified"},{label:"$300B projection",detail:"Analyst estimates",status:"verified"},{label:"Ratification",detail:"Not scheduled",status:"partial"}]},relatedTopics:["NATO","European Security"]},
  {id:"s4",headline:"Bipartisan Immigration Deal Collapses After House Speaker Pulls Support",summary:"Months of negotiation unravel as political calculus shifts ahead of midterms. Speaker cited insufficient border security. Democrats accused purely electoral move.",topic:"Immigration",topicColor:"#E67E22",timestamp:"7h ago",publishedAt:"March 21, 2026 · 5:15 AM ET",readTime:"6 min",confidence:92,trending:"+267%",sources:["cnn","fox","ap","reuters","politico","hill","nyt","wsj"],leanBreakdown:{left:3,center:3,right:2},
    contextExplainer:{tldr:"Bipartisan deal collapsed — likely to preserve immigration as campaign issue.",background:"Last major reform was 1986. This deal: $14B border security, asylum reforms, DACA pathway.",causalChain:[{event:"Encounters peak 302K/mo",date:"Dec 2023",impact:"Top voter concern"},{event:"Senate framework",date:"Oct 2025",impact:"Bipartisan hope"},{event:"Midterm polls: immigration #1",date:"Mar 2026",impact:"Calculus shifts"},{event:"Speaker withdraws",date:"Today",impact:"Deal collapses"}],whatNext:["No legislation before midterms.","Both parties campaign on collapse.","Executive actions may increase."],perspectives:{left:{summary:"Blame GOP for sabotaging good-faith deal.",keyQuote:"They killed their own priorities for November.",quoteSource:"CNN",sentiment:"Frustrated"},center:{summary:"Familiar pattern of failures.",keyQuote:"Fifth comprehensive deal to collapse in two decades.",quoteSource:"AP",sentiment:"Factual"},right:{summary:"Bill's border provisions were weakened.",keyQuote:"A deal that doesn't secure the border isn't worth taking.",quoteSource:"Fox News",sentiment:"Supportive of withdrawal"}}},
    confidenceExplainer:{score:92,sourcesAgreeing:8,sourcesTotal:8,factsCrossVerified:12,factsTotal:14,breakdown:[{label:"Collapse confirmed",detail:"Speaker statement + 8 sources",status:"verified"},{label:"Bill provisions",detail:"$14B, DACA confirmed in text",status:"verified"},{label:"Motivations",detail:"Analysis, not stated",status:"partial"}]},relatedTopics:["Immigration","Border Security","Midterms"]},
  {id:"s5",headline:"EPA Finalizes Strictest-Ever Methane Emission Rules for Oil and Gas",summary:"95% methane capture required at all drilling sites. Industry vows legal challenge. Rules apply to new and existing facilities.",topic:"Climate",topicColor:"#27AE60",timestamp:"8h ago",publishedAt:"March 21, 2026 · 4:00 AM ET",readTime:"5 min",confidence:83,trending:"+74%",sources:["nyt","reuters","guardian","npr","bloomberg"],leanBreakdown:{left:3,center:2,right:0},
    contextExplainer:{tldr:"EPA cracking down on methane — 80x more potent than CO2 short-term.",background:"Methane = 30% of warming since pre-industrial. Oil/gas is largest U.S. industrial source. Rule covers 900,000 existing sites.",causalChain:[{event:"Paris methane pledge",date:"Nov 2021",impact:"150+ countries commit"},{event:"IRA passes",date:"Aug 2022",impact:"$900/ton methane fee"},{event:"Final rule",date:"Today",impact:"95% capture, new + existing"}],whatNext:["Legal challenge in 30 days.","Existing sites: 24-month compliance.","Could cut sector methane 40%."],perspectives:{left:{summary:"Most significant climate action since IRA.",keyQuote:"The invisible pollutant gets visible enforcement.",quoteSource:"Guardian",sentiment:"Strongly supportive"},center:{summary:"Regulatory details and legal challenges.",keyQuote:"Survival depends more on courts than chemistry.",quoteSource:"Reuters",sentiment:"Balanced"},right:{summary:"Limited coverage — notable gap.",keyQuote:"—",quoteSource:"Coverage gap",sentiment:"Limited"}}},
    confidenceExplainer:{score:83,sourcesAgreeing:5,sourcesTotal:5,factsCrossVerified:8,factsTotal:11,breakdown:[{label:"Rule finalized",detail:"Federal Register confirmed",status:"verified"},{label:"95% standard",detail:"In rule text",status:"verified"},{label:"Emissions estimate",detail:"Industry disputes methodology",status:"partial"}]},relatedTopics:["Climate","Methane","EPA"]},
  {id:"s6",headline:"TikTok Files Emergency Appeal After DC Circuit Upholds Divestiture Deadline",summary:"ByteDance has 90 days to divest or face nationwide ban. DC Circuit ruled 3-0. 170 million users affected.",topic:"Tech Policy",topicColor:"#2D6BE4",timestamp:"9h ago",publishedAt:"March 21, 2026 · 3:00 AM ET",readTime:"4 min",confidence:90,trending:"+421%",sources:["reuters","wsj","ap","nyt","politico","bbc","bloomberg"],leanBreakdown:{left:2,center:4,right:1},
    contextExplainer:{tldr:"TikTok may be banned unless ByteDance sells within 90 days.",background:"Bipartisan concern since 2020. Congress passed divestiture law April 2024. ByteDance challenges on First Amendment grounds.",causalChain:[{event:"Trump attempts ban",date:"Aug 2020",impact:"Courts blocked; raised framing"},{event:"Divestiture bill passes",date:"Apr 2024",impact:"270-day deadline"},{event:"DC Circuit upholds 3-0",date:"Today",impact:"90-day clock starts"}],whatNext:["Emergency SCOTUS appeal expected.","Microsoft-led consortium reported.","June deadline if declined."],perspectives:{left:{summary:"Free speech and 170M users.",keyQuote:"Banning an app used by half the country raises profound questions.",quoteSource:"NY Times",sentiment:"Concerned"},center:{summary:"Legal timeline and ruling.",keyQuote:"Unanimous decision narrows legal options.",quoteSource:"Reuters",sentiment:"Analytical"},right:{summary:"National security rationale.",keyQuote:"This isn't a ban — it's a demand to serve American interests.",quoteSource:"WSJ",sentiment:"Supportive"}}},
    confidenceExplainer:{score:90,sourcesAgreeing:7,sourcesTotal:7,factsCrossVerified:10,factsTotal:12,breakdown:[{label:"Ruling confirmed",detail:"3-0 in docket",status:"verified"},{label:"90-day timeline",detail:"In statute",status:"verified"},{label:"Potential buyers",detail:"Reported, not confirmed",status:"partial"}]},relatedTopics:["TikTok","ByteDance","First Amendment"]}
];

const TOPIC_META={"AI Policy":{icon:"⬡",color:T.primary},"Economy":{icon:"◈",color:T.accent},"Legal":{icon:"⬢",color:"#9B59B6"},"Defense":{icon:"◆",color:"#E74C3C"},"Immigration":{icon:"◇",color:"#E67E22"},"Climate":{icon:"●",color:"#27AE60"},"Tech Policy":{icon:"◎",color:"#2D6BE4"},"Healthcare":{icon:"✚",color:"#E056A0"},"Trade":{icon:"⇄",color:"#F39C12"},"Elections":{icon:"☆",color:"#8E44AD"}};

const DIGESTS={daily:{title:"Daily Briefing",subtitle:"Friday, March 21, 2026",readTime:"12 min read",storyCount:7,topicCount:6,editorNote:"Today's biggest story — the Senate AI bill — reshapes the regulatory landscape for every major tech company. But don't miss the immigration deal collapse: it signals the legislative season is effectively over as midterm positioning takes priority.",categories:[{topic:"AI Policy",priority:"critical",stories:[{headline:"Senate Passes Landmark AI Regulation Bill in Bipartisan 68-30 Vote",briefing:"The most significant tech regulation since 1996. Mandatory safety testing for frontier AI. Heads to House where $140M lobbying awaits.",confidence:94,sources:10,lean:{left:4,center:4,right:2},storyRef:"hero"}]},{topic:"Economy",priority:"high",stories:[{headline:"Federal Reserve Signals Two Rate Cuts Before Year End",briefing:"Powell shifts to 'confident' on inflation at 2.4%. Markets pricing 85% September cut. Mortgages could dip below 6%.",confidence:91,sources:5,lean:{left:0,center:4,right:1},storyRef:"s1"}]},{topic:"Legal",priority:"high",stories:[{headline:"Supreme Court Takes Emergency Powers Case",briefing:"Cert granted to resolve circuit split. Could affect 42 active declarations. October arguments, June 2027 decision.",confidence:88,sources:6,lean:{left:2,center:3,right:1},storyRef:"s2"}]},{topic:"Immigration",priority:"high",stories:[{headline:"Bipartisan Immigration Deal Collapses",briefing:"Speaker withdraws from $14B border deal. No legislation before midterms. Both parties positioning for blame.",confidence:92,sources:8,lean:{left:3,center:3,right:2},storyRef:"s4"}]},{topic:"Defense",priority:"medium",stories:[{headline:"NATO Agrees to 3.5% GDP Defense Floor",briefing:"Nearly doubles commitment. $300B+ new spending projected. Germany and Canada face largest gaps.",confidence:86,sources:5,lean:{left:2,center:3,right:0},storyRef:"s3"}]},{topic:"Tech Policy",priority:"medium",stories:[{headline:"TikTok's 90-Day Divestiture Clock Starts",briefing:"DC Circuit upholds ban 3-0. ByteDance filing emergency appeal. 170M users affected.",confidence:90,sources:7,lean:{left:2,center:4,right:1},storyRef:"s6"}]},{topic:"Climate",priority:"standard",stories:[{headline:"EPA Finalizes Methane Capture Rules",briefing:"95% capture for all oil and gas sites. Could cut sector emissions 40%. Legal challenge in 30 days.",confidence:83,sources:5,lean:{left:3,center:2,right:0},storyRef:"s5"}]}]},weekly:{title:"Weekly Intelligence Report",subtitle:"Week of March 16 – 22, 2026",readTime:"25 min read",storyCount:23,topicCount:8,editorNote:"This week marked a turning point in AI governance, monetary policy, and transatlantic defense. The Senate AI vote, Powell's rate signal, and NATO's spending pledge represent three structural shifts reshaping American economic and geopolitical life simultaneously.",categories:[{topic:"AI Policy",priority:"critical",stories:[{headline:"Senate Passes AI Regulation Bill 68-30",briefing:"Compute-threshold safety testing, new federal body. House fight begins.",confidence:94,sources:10,lean:{left:4,center:4,right:2},storyRef:"hero"},{headline:"OpenAI Announces Government Affairs Division",briefing:"40+ staffers in new DC office. Hired former FTC commissioner.",confidence:81,sources:4,lean:{left:2,center:2,right:0}}]},{topic:"Economy",priority:"high",stories:[{headline:"Fed Signals Two Rate Cuts by Year End",briefing:"Clearest easing signal yet. September start priced at 85%.",confidence:91,sources:5,lean:{left:0,center:4,right:1},storyRef:"s1"},{headline:"Retail Sales Jump 1.2% in February",briefing:"Consumer spending exceeds expectations. Online retail +3.4% YoY.",confidence:87,sources:4,lean:{left:1,center:3,right:0}}]},{topic:"Defense",priority:"high",stories:[{headline:"NATO 3.5% GDP Defense Floor",briefing:"Historic commitment. $300B in new spending projected.",confidence:86,sources:5,lean:{left:2,center:3,right:0},storyRef:"s3"}]},{topic:"Immigration",priority:"high",stories:[{headline:"Immigration Deal Collapses in House",briefing:"Fifth major failure in 20 years. Midterm politics override policy.",confidence:92,sources:8,lean:{left:3,center:3,right:2},storyRef:"s4"}]},{topic:"Legal",priority:"medium",stories:[{headline:"SCOTUS Takes Emergency Powers Case",briefing:"Circuit split resolution. Could constrain executive declarations.",confidence:88,sources:6,lean:{left:2,center:3,right:1},storyRef:"s2"}]},{topic:"Tech Policy",priority:"medium",stories:[{headline:"TikTok Emergency Appeal Filed",briefing:"DC Circuit unanimous. 90-day clock. First Amendment showdown.",confidence:90,sources:7,lean:{left:2,center:4,right:1},storyRef:"s6"}]},{topic:"Healthcare",priority:"medium",stories:[{headline:"Medicare Drug Negotiations Yield 38% Reduction",briefing:"First IRA-negotiated prices for 10 drugs. Pharma stocks dip 2-3%.",confidence:89,sources:5,lean:{left:2,center:2,right:1}}]},{topic:"Climate",priority:"standard",stories:[{headline:"EPA Finalizes Methane Rules",briefing:"95% capture standard. 900,000 existing sites. 40% reduction projected.",confidence:83,sources:5,lean:{left:3,center:2,right:0},storyRef:"s5"}]}]},monthly:{title:"Monthly Deep Dive",subtitle:"March 2026",readTime:"45 min read",storyCount:67,topicCount:10,editorNote:"March 2026 will be remembered as the month American AI policy crystallized, the Fed declared inflation beaten, and NATO redefined its ambitions. Three structural shifts — any one of which would define a normal month — landed simultaneously.",categories:[{topic:"AI Policy",priority:"critical",stories:[{headline:"Senate Passes AI Regulation Bill",briefing:"The defining legislative event of the month — and possibly the year.",confidence:94,sources:10,lean:{left:4,center:4,right:2},storyRef:"hero"},{headline:"OpenAI Restructures as Public Benefit Corp",briefing:"Dropped for-profit transition. New safety board mandated.",confidence:88,sources:7,lean:{left:3,center:3,right:1}}]},{topic:"Economy",priority:"high",stories:[{headline:"Fed Signals Rate-Cutting Cycle",briefing:"Most market-moving event. S&P rallied 4.2% on the month.",confidence:91,sources:5,lean:{left:0,center:4,right:1},storyRef:"s1"},{headline:"February Jobs: 287K Added",briefing:"Labor market robust. Wages moderating to 3.1%.",confidence:95,sources:6,lean:{left:1,center:4,right:1}}]},{topic:"Defense",priority:"high",stories:[{headline:"NATO 3.5% Reshapes Alliance",briefing:"Biggest shift in transatlantic defense since the Cold War.",confidence:86,sources:5,lean:{left:2,center:3,right:0},storyRef:"s3"}]},{topic:"Elections",priority:"high",stories:[{headline:"Midterm Primaries Begin",briefing:"Texas, California set tone. AI and immigration top issues.",confidence:90,sources:6,lean:{left:2,center:2,right:2}}]},{topic:"Immigration",priority:"high",stories:[{headline:"Immigration Deal Collapses — Again",briefing:"Fifth failure in two decades. No legislation before November.",confidence:92,sources:8,lean:{left:3,center:3,right:2},storyRef:"s4"}]},{topic:"Legal",priority:"medium",stories:[{headline:"SCOTUS Takes Emergency Powers",briefing:"Case of the term. Decision expected June 2027.",confidence:88,sources:6,lean:{left:2,center:3,right:1},storyRef:"s2"}]},{topic:"Tech Policy",priority:"medium",stories:[{headline:"TikTok Heads to Supreme Court",briefing:"90-day clock. Constitutional showdown looming.",confidence:90,sources:7,lean:{left:2,center:4,right:1},storyRef:"s6"}]},{topic:"Trade",priority:"medium",stories:[{headline:"U.S.-EU Steel Tariffs Snap Back",briefing:"25% tariffs return. EU retaliatory tariffs on bourbon, motorcycles expected.",confidence:85,sources:5,lean:{left:1,center:3,right:1}}]},{topic:"Healthcare",priority:"standard",stories:[{headline:"Medicare Drug Price Cuts Released",briefing:"38% average reduction. Insulin and cancer treatments included.",confidence:89,sources:5,lean:{left:2,center:2,right:1}}]},{topic:"Climate",priority:"standard",stories:[{headline:"EPA Methane Rules + Warmest Winter",briefing:"Regulatory action meets climate data: warmest winter on record.",confidence:83,sources:5,lean:{left:3,center:2,right:0},storyRef:"s5"}]}]}};

// ── useIsMobile hook ────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Utility ─────────────────────────────────────────────────
function confColor(s){if(s>=90)return{bg:"rgba(0,194,168,0.12)",text:"#00C2A8",ring:"rgba(0,194,168,0.25)"};if(s>=80)return{bg:"rgba(45,107,228,0.12)",text:"#5B8EE6",ring:"rgba(45,107,228,0.2)"};return{bg:"rgba(217,175,74,0.12)",text:"#D9AF4A",ring:"rgba(217,175,74,0.2)"};}
function leanC(l){return l==="left"?T.left:l==="right"?T.right:T.textTertiary;}
function slugify(text){return text.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}

// ── Micro Components ────────────────────────────────────────
function ConfBadge({score,size="sm"}){const c=confColor(score),lg=size==="lg";return<div style={{display:"inline-flex",alignItems:"center",gap:lg?6:4,padding:lg?"5px 10px":"3px 8px",borderRadius:6,background:c.bg,border:`1px solid ${c.ring}`,fontFamily:"var(--mono)",fontSize:lg?12:10,fontWeight:600,color:c.text,letterSpacing:"0.02em",lineHeight:1}}><svg width={lg?12:10} height={lg?12:10} viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={c.text} strokeWidth="1.5" opacity="0.3"/><circle cx="6" cy="6" r="5" stroke={c.text} strokeWidth="1.5" strokeDasharray={`${(score/100)*31.4} 31.4`} transform="rotate(-90 6 6)" strokeLinecap="round"/></svg>{score}%</div>;}
function TopicTag({label,color}){return<span style={{display:"inline-block",padding:"3px 8px",borderRadius:5,background:`${color}14`,border:`1px solid ${color}20`,fontSize:11,fontWeight:600,color,letterSpacing:"0.03em",lineHeight:1,fontFamily:"var(--body)",textTransform:"uppercase"}}>{label}</span>;}
// BUG FIX #2: TrendBadge renders {value} directly — no transformation, no appended "%"
function TrendBadge({value}){return<div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:5,background:"rgba(0,194,168,0.08)",fontFamily:"var(--mono)",fontSize:10,fontWeight:600,color:T.accent,lineHeight:1}}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 8L4 4.5L6.5 6L9 2" stroke="#00C2A8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2H9V4" stroke="#00C2A8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>{value}</div>;}

// ── Source Popover System ────────────────────────────────────
function SourcePopover({ src, anchorRect, onClose }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const isMobile = useIsMobile();
  const lColor = leanC(src.lean);
  const lLabel = src.lean === "left" ? "Left Lean" : src.lean === "right" ? "Right Lean" : "Center";
  const lBg = src.lean === "left" ? T.leftBg : src.lean === "right" ? T.rightBg : T.centerBg;
  const tc = confColor(src.trust);

  useEffect(() => {
    if (isMobile || !anchorRect) return;
    const popW = 260, popH = 220;
    let top = anchorRect.bottom + 8;
    let left = anchorRect.left + anchorRect.width / 2 - popW / 2;
    if (left < 8) left = 8;
    if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
    if (top + popH > window.innerHeight - 8) top = anchorRect.top - popH - 8;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPos({ top, left });
  }, [anchorRect, isMobile]);

  useEffect(() => {
    const handler = (e) => { if (popRef.current && !popRef.current.contains(e.target)) onClose(); };
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", esc); };
  }, [onClose]);

  const inner = (
    <div ref={popRef} style={{
      background: T.surfaceElevated,
      border: `1px solid ${T.border}`,
      borderRadius: isMobile ? "16px 16px 0 0" : 12,
      padding: isMobile ? "20px" : "16px",
      minHeight: isMobile ? 200 : undefined,
      boxShadow: `0 -4px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px ${T.border}`,
      animation: isMobile ? "slideUp 0.22s cubic-bezier(0.16,1,0.3,1)" : "popIn 0.18s cubic-bezier(0.16,1,0.3,1)",
      position: "fixed",
      ...(isMobile
        ? { bottom: 0, left: 0, right: 0, width: "100%", zIndex: 999999 }
        : { top: pos.top, left: pos.left, width: 260, zIndex: 999999 }),
    }}>
      {isMobile && (
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 14px", opacity: 0.5 }} />
      )}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:lBg, border:`1px solid ${lColor}25`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:lColor }}>{src.abbr}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--body)", fontSize:14, fontWeight:600, color:T.text }}>{src.name}</div>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:T.textTertiary, marginTop:1 }}>{src.type}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <div style={{ flex:1, padding:"8px 10px", borderRadius:7, background:lBg, border:`1px solid ${lColor}15` }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:T.textTertiary, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:3 }}>Lean</div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:lColor, opacity:src.lean==="center"?0.5:1 }} />
            <span style={{ fontFamily:"var(--body)", fontSize:12, fontWeight:600, color:lColor }}>{lLabel}</span>
          </div>
        </div>
        <div style={{ flex:1, padding:"8px 10px", borderRadius:7, background:tc.bg, border:`1px solid ${tc.ring}` }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:T.textTertiary, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:3 }}>Trust</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={tc.text} strokeWidth="1.5" opacity="0.3"/><circle cx="6" cy="6" r="5" stroke={tc.text} strokeWidth="1.5" strokeDasharray={`${(src.trust/100)*31.4} 31.4`} transform="rotate(-90 6 6)" strokeLinecap="round"/></svg>
            <span style={{ fontFamily:"var(--mono)", fontSize:13, fontWeight:700, color:tc.text }}>{src.trust}%</span>
          </div>
        </div>
      </div>
      <a
        href={`https://${src.url}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display:"block", padding:"12px", textAlign:"center", borderRadius:8, background:T.primaryMuted, border:`1px solid ${T.primary}20`, textDecoration:"none", cursor:"pointer", fontFamily:"var(--body)", fontSize:12, fontWeight:600, color:T.primary }}
      >
        Read original →
      </a>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          style={{ position:"fixed", inset:0, zIndex:999998, background:"rgba(0,0,0,0.5)" }}
        />
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, width: "100%",
          zIndex: 999999,
        }}>
          {inner}
        </div>
      </>
    );
  }

  return (
    <div style={{ position:"fixed", top:pos.top, left:pos.left, width:260, zIndex:999999 }}>
      {inner}
    </div>
  );
}

function SourceChip({ id, variant = "compact", activePopover, setActivePopover, sourceStripMobile = false, scrollSnapChip = false }) {
  const s = SOURCES[id];
  const isMobile = useIsMobile();
  // Hooks must be called before any early return
  const chipRef = useRef(null);
  const [rect, setRect] = useState(null);
  const isActive = activePopover === id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive) { setActivePopover(null); return; }
    if (chipRef.current) setActivePopover(id);
  };

  useEffect(() => {
    if (isActive && chipRef.current) setRect(chipRef.current.getBoundingClientRect());
  }, [isActive]);

  if (!s) return null;
  const lColor = leanC(s.lean);
  const isCompact = variant === "compact";

  if (isMobile && sourceStripMobile) {
    return (
      <a
        href={`https://${s.url}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          borderRadius: 7,
          background: T.surfaceHover,
          border: `1px solid ${T.borderSubtle}`,
          fontFamily: "var(--mono)",
          fontSize: 11,
          fontWeight: 500,
          color: T.textSecondary,
          textDecoration: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span style={{ fontWeight: 700 }}>{s.abbr}</span>
        <span style={{ fontSize: 11, color: T.textTertiary }}>{s.name}</span>
      </a>
    );
  }

  if (isMobile) {
    return (
      <a
        href={`https://${s.url}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isCompact ? 5 : 6,
          padding: isCompact ? "4px 10px" : "6px 12px",
          borderRadius: isCompact ? 6 : 7,
          background: T.surfaceHover,
          border: `1px solid ${T.borderSubtle}`,
          fontFamily: "var(--mono)",
          fontSize: isCompact ? 11 : 12,
          fontWeight: 500,
          color: T.textSecondary,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span style={{ width: isCompact ? 5 : 6, height: isCompact ? 5 : 6, borderRadius: "50%", background: lColor, opacity: s.lean === "center" ? 0.5 : 0.85, flexShrink: 0 }} />
        <span style={{ fontWeight: 700 }}>{s.abbr}</span>
        {!isCompact && <span style={{ fontSize: 11, color: T.textTertiary }}>{s.name}</span>}
        {!isCompact && <span style={{ fontSize: 10, color: T.primary, marginLeft: 2 }}>↗</span>}
      </a>
    );
  }

  return (
    <>
      <div ref={chipRef} onClick={handleClick} style={{
        display:"inline-flex", alignItems:"center", gap: isCompact ? 5 : 6,
        padding: isCompact ? "4px 10px" : "6px 12px",
        borderRadius: isCompact ? 6 : 7,
        background: isActive ? `${lColor}15` : T.surfaceHover,
        border: `1px solid ${isActive ? lColor + "40" : T.borderSubtle}`,
        fontSize: isCompact ? 11 : 12,
        fontFamily: "var(--mono)", fontWeight: 500, color: isActive ? lColor : T.textSecondary,
        lineHeight: 1, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
        userSelect: "none",
        ...(scrollSnapChip ? { scrollSnapAlign: "start" } : {}),
      }}>
        <span style={{ width: isCompact ? 5 : 6, height: isCompact ? 5 : 6, borderRadius:"50%", background: lColor, opacity: s.lean === "center" ? 0.5 : 0.85, flexShrink: 0 }} />
        <span style={{ fontWeight: 600 }}>{s.abbr}</span>
        {!isCompact && <span style={{ fontWeight: 400, color: T.textTertiary, fontSize: 11 }}>{s.name}</span>}
      </div>
      {isActive && rect && <SourcePopover src={s} anchorRect={rect} onClose={() => setActivePopover(null)} />}
    </>
  );
}

function SourcePills({ sourceIds, max = 4 }) {
  const [activePopover, setActivePopover] = useState(null);
  const v = sourceIds.slice(0, max), r = sourceIds.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      {v.map(id => <SourceChip key={id} id={id} variant="compact" activePopover={activePopover} setActivePopover={setActivePopover} />)}
      {r > 0 && <div style={{ padding: "4px 8px", borderRadius: 6, background: T.primaryMuted, fontSize: 11, fontFamily: "var(--mono)", fontWeight: 600, color: T.primary, lineHeight: 1 }}>+{r}</div>}
    </div>
  );
}

function SourceStrip({ sourceIds }) {
  const [activePopover, setActivePopover] = useState(null);
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    checkScroll();
  }, [checkScroll, isMobile, sourceIds.length]);

  return (
    <div style={{ position: "relative", marginBottom: 20, width: "100%", maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="7" r="3.5" stroke={T.textTertiary} strokeWidth="1.1"/><circle cx="9" cy="7" r="3.5" stroke={T.textTertiary} strokeWidth="1.1"/></svg>
        <span style={{ fontFamily: "var(--body)", fontSize: 12, fontWeight: 600, color: T.textTertiary, letterSpacing: "0.03em", textTransform: "uppercase" }}>{isMobile ? `${sourceIds.length} Sources · Tap to read original` : `${sourceIds.length} Sources Reporting`}</span>
      </div>
      {isMobile ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
          {sourceIds.map(id => (
            <SourceChip key={id} id={id} variant="full" sourceStripMobile activePopover={activePopover} setActivePopover={setActivePopover} />
          ))}
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", position: "relative" }}>
          <div style={{ position: "relative" }}>
            {canScrollLeft && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to right, ${T.bg}, transparent)`, pointerEvents: "none", zIndex: 2 }} />}
            {canScrollRight && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to right, transparent, ${T.bg})`, pointerEvents: "none", zIndex: 2 }} />}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="src-scroll"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                overflowX: "auto",
                overflowY: "visible",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                padding: "4px 0",
                width: "100%",
                boxSizing: "border-box",
                scrollSnapType: "x mandatory",
              }}
            >
              {sourceIds.map(id => (
                <SourceChip key={id} id={id} variant="full" scrollSnapChip activePopover={activePopover} setActivePopover={setActivePopover} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeanBar({breakdown,size="sm"}){const total=breakdown.left+breakdown.center+breakdown.right,lg=size==="lg";return<div style={{display:"flex",flexDirection:"column",gap:lg?6:4,minWidth:lg?140:100}}><div style={{display:"flex",height:lg?4:3,borderRadius:2,overflow:"hidden",gap:1}}>{breakdown.left>0&&<div style={{width:`${(breakdown.left/total)*100}%`,background:T.left,borderRadius:2}}/>}{breakdown.center>0&&<div style={{width:`${(breakdown.center/total)*100}%`,background:T.center,borderRadius:2,opacity:0.5}}/>}{breakdown.right>0&&<div style={{width:`${(breakdown.right/total)*100}%`,background:T.right,borderRadius:2}}/>}</div><div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:lg?10:9,color:T.textTertiary}}><span style={{color:breakdown.left>0?T.left:T.textTertiary,opacity:breakdown.left>0?1:0.3}}>L·{breakdown.left}</span><span style={{opacity:0.6}}>C·{breakdown.center}</span><span style={{color:breakdown.right>0?T.right:T.textTertiary,opacity:breakdown.right>0?1:0.3}}>R·{breakdown.right}</span></div></div>;}

const I={back:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,chevDown:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5L7 9L10.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,chevRight:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3.5L9 7L5.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,check:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,alert:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6" cy="8.5" r="0.6" fill="currentColor"/></svg>,question:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 4.5C4.5 3.67 5.17 3 6 3C6.83 3 7.5 3.67 7.5 4.5C7.5 5.17 7 5.5 6.5 5.75C6.22 5.89 6 6.1 6 6.4V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6" cy="8.5" r="0.6" fill="currentColor"/></svg>,bookmark:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.5H12V13.5L8 10.5L4 13.5V2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,share:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="11" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6.8 7L9.2 4.5M6.8 9L9.2 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,flame:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C7 1 3 5 3 8.5C3 10.71 4.79 12.5 7 12.5C9.21 12.5 11 10.71 11 8.5C11 5 7 1 7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,plus:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,clock:<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M6 3V6L8 7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,lock:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="6" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6V4.5C4.5 3.12 5.62 2 7 2C8.38 2 9.5 3.12 9.5 4.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,account:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 12C2 9.79 4.24 8 7 8C9.76 8 12 9.79 12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>};

// ── Expandable ───────────────────────────────────────────────
function Expandable({title,icon,defaultOpen=false,accentColor=T.primary,children}){const[open,setOpen]=useState(defaultOpen);const ref=useRef(null);const[h,setH]=useState(0);useEffect(()=>{if(ref.current)setH(ref.current.scrollHeight);},[open,children]);return<div style={{borderRadius:12,background:T.surface,border:`1px solid ${open?accentColor+"30":T.border}`,overflow:"hidden"}}><button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"16px 20px",background:"none",border:"none",cursor:"pointer",color:T.text,textAlign:"left"}}><span style={{color:accentColor,display:"flex",flexShrink:0}}>{icon}</span><span style={{fontFamily:"var(--body)",fontSize:14,fontWeight:600,flex:1}}>{title}</span><span style={{color:T.textTertiary,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s",display:"flex"}}>{I.chevDown}</span></button><div style={{maxHeight:open?h+40:0,overflow:"hidden",transition:"max-height 0.4s cubic-bezier(0.16,1,0.3,1)"}}><div ref={ref} style={{padding:"0 20px 20px"}}>{children}</div></div></div>;}
function CausalChain({events}){return<div style={{position:"relative",paddingLeft:24}}><div style={{position:"absolute",left:7,top:8,bottom:8,width:2,background:`linear-gradient(to bottom,${T.primary},${T.accent})`,opacity:0.3}}/>{events.map((e,i)=><div key={i} style={{position:"relative",paddingBottom:i<events.length-1?20:0}}><div style={{position:"absolute",left:-20,top:6,width:12,height:12,borderRadius:"50%",background:i===events.length-1?T.accent:T.surface,border:`2px solid ${i===events.length-1?T.accent:T.primary}`,zIndex:1}}/><div style={{fontFamily:"var(--mono)",fontSize:10,color:T.primary,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:4}}>{e.date}</div><div style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{e.event}</div><div style={{fontFamily:"var(--body)",fontSize:12,color:T.textSecondary,lineHeight:1.5}}>{e.impact}</div></div>)}</div>;}
function PerspectiveCard({lean,data}){const c={left:{label:"Left Lean",color:T.left,bg:T.leftBg},center:{label:"Center",color:T.center,bg:T.centerBg},right:{label:"Right Lean",color:T.right,bg:T.rightBg}}[lean];return<div style={{borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,overflow:"hidden",flex:1,minWidth:0}}><div style={{padding:"12px 16px",background:c.bg,borderBottom:`1px solid ${c.color}15`,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:c.color}}/><span style={{fontFamily:"var(--body)",fontSize:12,fontWeight:700,color:c.color,textTransform:"uppercase",letterSpacing:"0.03em"}}>{c.label}</span></div><span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 6px",borderRadius:4}}>{data.sentiment}</span></div><div style={{padding:16}}><p style={{fontFamily:"var(--body)",fontSize:13,color:T.textSecondary,lineHeight:1.6,margin:"0 0 14px"}}>{data.summary}</p>{data.keyQuote!=="—"&&<div style={{padding:"10px 14px",borderLeft:`3px solid ${c.color}40`,background:c.bg,borderRadius:"0 8px 8px 0"}}><p style={{fontFamily:"var(--serif)",fontSize:13,fontStyle:"italic",color:T.text,lineHeight:1.55,margin:"0 0 6px",opacity:0.9}}>{`"${data.keyQuote}"`}</p><span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>— {data.quoteSource}</span></div>}</div></div>;}
function ConfidenceExplainer({data}){const c=confColor(data.score);const si={verified:{icon:I.check,color:T.accent,label:"Verified"},partial:{icon:I.alert,color:"#D9AF4A",label:"Partial"},speculative:{icon:I.question,color:T.textTertiary,label:"Speculative"}};return<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",alignItems:"center",gap:20}}><div style={{position:"relative",width:72,height:72}}><svg width="72" height="72" viewBox="0 0 72 72" style={{transform:"rotate(-90deg)"}}><circle cx="36" cy="36" r="30" fill="none" stroke={T.border} strokeWidth="5"/><circle cx="36" cy="36" r="30" fill="none" stroke={c.text} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(data.score/100)*188.5} 188.5`}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:20,fontWeight:700,color:c.text}}>{data.score}</div></div><div><div style={{fontFamily:"var(--body)",fontSize:15,fontWeight:600,color:T.text,marginBottom:4}}>{data.score>=90?"High Confidence":"Moderate-High"}</div><div style={{fontFamily:"var(--body)",fontSize:12,color:T.textSecondary}}>{data.sourcesAgreeing}/{data.sourcesTotal} sources agree · {data.factsCrossVerified}/{data.factsTotal} verified</div></div></div><div style={{display:"flex",flexDirection:"column",gap:2}}>{data.breakdown.map((item,i)=>{const s=si[item.status];return<div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 14px",borderRadius:8,background:i%2===0?T.surfaceHover+"60":"transparent"}}><div style={{color:s.color,marginTop:1,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.text}}>{item.label}</span><span style={{fontFamily:"var(--mono)",fontSize:9,color:s.color,background:`${s.color}15`,padding:"1px 5px",borderRadius:3,fontWeight:600,textTransform:"uppercase"}}>{s.label}</span></div><span style={{fontFamily:"var(--body)",fontSize:12,color:T.textSecondary}}>{item.detail}</span></div></div>;})}</div></div>;}
function SourceBreakdown({sourceIds}){const g={left:[],center:[],right:[]};sourceIds.forEach(id=>{const s=SOURCES[id];if(s)g[s.lean].push({...s,id});});const secs=[{key:"left",label:"Left Lean",color:T.left,bg:T.leftBg,s:g.left},{key:"center",label:"Center",color:T.center,bg:T.centerBg,s:g.center},{key:"right",label:"Right Lean",color:T.right,bg:T.rightBg,s:g.right}];return<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",gap:2,marginBottom:6}}>{secs.map(s=>s.s.length>0&&<div key={s.key} style={{flex:s.s.length,background:s.color,borderRadius:3,opacity:s.key==="center"?0.5:1}}/>)}</div>{secs.map(s=>s.s.length>0&&<div key={s.key}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/><span style={{fontFamily:"var(--body)",fontSize:12,fontWeight:700,color:s.color,textTransform:"uppercase"}}>{s.label}</span><div style={{flex:1,height:1,background:T.border}}/></div>{s.s.map(src=><div key={src.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 12px",borderRadius:7,background:T.surfaceHover+"80",marginBottom:3}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:26,height:26,borderRadius:6,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:9,fontWeight:700,color:s.color}}>{src.abbr}</div><span style={{fontFamily:"var(--body)",fontSize:12,color:T.text}}>{src.name}</span></div><span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>Trust: {src.trust}%</span></div>)}</div>)}</div>;}

// ── Nav / Tab / Cards ────────────────────────────────────────

// BUG FIX #1: LogoMark wrapped in clickable div; NavHeader accepts onLogoClick + onAccountClick
function LogoMark({size=28}){return<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:size,height:size,borderRadius:size*.25,background:`linear-gradient(135deg,${T.primary},${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 12px -2px ${T.primary}50`}}><svg width={size*.54} height={size*.54} viewBox="0 0 18 18" fill="none"><path d="M9 2C5.5 6 4 8.5 4 11C4 13.76 6.24 16 9 16C11.76 16 14 13.76 14 11C14 8.5 12.5 6 9 2Z" fill="white" fillOpacity="0.95"/><path d="M9 8C7.5 10 7 11 7 12.2C7 13.2 7.9 14 9 14C10.1 14 11 13.2 11 12.2C11 11 10.5 10 9 8Z" fill={T.primary} fillOpacity="0.5"/></svg></div><span style={{fontFamily:"var(--body)",fontSize:size*.54,fontWeight:700,color:T.text,letterSpacing:"-0.02em"}}>Undercurrent</span></div>;}

function NavHeader({onBack, showBack, onLogoClick, onAccountClick}) {
  const isMobile = useIsMobile();
  return (
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0":"14px 0",height:isMobile?56:"auto",borderBottom:`1px solid ${T.border}50`,marginBottom:8,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:isMobile?6:10}}>
        {showBack && (
          <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"6px 8px":"6px 12px 6px 8px",borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer",color:T.textSecondary,fontFamily:"var(--body)",fontSize:12,fontWeight:500}}>
            {I.back}{!isMobile && <span> Back</span>}
          </button>
        )}
        <div onClick={onLogoClick} style={{cursor:"pointer"}} title="Return to home">
          <LogoMark size={isMobile?22:28}/>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {!isMobile && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer",minWidth:180}}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke={T.textTertiary} strokeWidth="1.3"/><path d="M9.5 9.5L12.5 12.5" stroke={T.textTertiary} strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span style={{fontFamily:"var(--body)",fontSize:12,color:T.textTertiary}}>Search...</span>
            <span style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:9,color:T.textTertiary,background:T.surfaceHover,padding:"1px 5px",borderRadius:3,border:`1px solid ${T.border}`}}>⌘K</span>
          </div>
        )}
        <div
          onClick={onAccountClick}
          title="Account"
          style={{width:isMobile?36:32,height:isMobile?36:32,borderRadius:8,background:`linear-gradient(135deg,${T.primary}40,${T.accent}30)`,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--body)",fontSize:12,fontWeight:700,color:T.text,cursor:"pointer"}}
        >
          G
        </div>
      </div>
    </header>
  );
}

// FEATURE #5: Account tab added to MainTabBar
function MainTabBar({active,onChange}){
  const isMobile = useIsMobile();
  const tabs=[
    {id:"trending",label:"Trending",icon:I.flame},
    {id:"digests",label:"Digests",icon:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4.5H9M5 7H9M5 9.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>},
    {id:"foryou",label:"For You",icon:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>},
    {id:"account",label:"Account",icon:I.account},
  ];
  return(
    <div style={{display:"flex",gap:2,padding:3,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,width:isMobile?"100%":undefined,overflowX:"auto"}}>
      {tabs.map(tab=>{const a=active===tab.id;return(
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{display:"flex",alignItems:"center",gap:isMobile?4:6,padding:isMobile?"8px 12px":"7px 14px",flex:isMobile?1:undefined,justifyContent:isMobile?"center":"flex-start",whiteSpace:"nowrap",borderRadius:8,border:"none",background:a?`${T.primary}18`:"transparent",cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:a?600:500,color:a?T.text:T.textTertiary,boxShadow:a?`0 0 0 1px ${T.primary}30`:"none",transition:"all 0.2s",flexShrink:0}}>
          <span style={{color:a?T.primary:T.textTertiary,display:"flex"}}>{tab.icon}</span>{tab.label}
        </button>
      );})}
    </div>
  );
}

function HeroCard({story,onClick}){
  const[h,setH]=useState(false);
  const m=useIsMobile();
  return<article onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{position:"relative",borderRadius:m?12:16,background:`linear-gradient(135deg,${T.surface},#0F0F1A)`,border:`1px solid ${h?T.primary+"40":T.border}`,overflow:"hidden",cursor:"pointer",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",boxShadow:h?"0 20px 60px -15px rgba(0,0,0,0.5)":"0 4px 24px -8px rgba(0,0,0,0.3)"}}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.primary},${T.accent})`,opacity:h?1:0.6}}/><div style={{padding:m?"16px 16px 14px":"28px 32px 24px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:m?12:16}}><div style={{display:"flex",alignItems:"center",gap:m?6:8,flexWrap:"wrap"}}><div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:5,background:`linear-gradient(135deg,${T.primary}18,${T.accent}10)`,border:`1px solid ${T.primary}25`}}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill={T.accent}/></svg><span style={{fontFamily:"var(--body)",fontSize:10,fontWeight:700,color:T.accent,letterSpacing:"0.06em",textTransform:"uppercase"}}>Top Story</span></div><TopicTag label={story.topic} color={story.topicColor}/>{!m&&<TrendBadge value={story.trending}/>}</div><ConfBadge score={story.confidence} size={m?"sm":"lg"}/></div><h1 style={{fontFamily:"var(--serif)",fontSize:m?20:30,fontWeight:700,lineHeight:1.22,color:h?"#FFF":T.text,margin:m?"0 0 10px":"0 0 12px",transition:"color 0.3s"}}>{story.headline}</h1>{!m&&<p style={{fontFamily:"var(--body)",fontSize:14,lineHeight:1.6,color:T.textSecondary,margin:"0 0 18px",maxWidth:660}}>{story.summary.split(". ").slice(0,2).join(". ")}.</p>}<div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",paddingTop:m?10:14,borderTop:`1px solid ${T.border}`}}><div style={{display:"flex",flexDirection:"column",gap:8}}><SourcePills sourceIds={story.sources} max={m?3:6}/><div style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,display:"flex",gap:8}}><span>{story.timestamp}</span><span style={{opacity:0.3}}>·</span><span>{story.readTime}</span></div></div><LeanBar breakdown={story.leanBreakdown} size={m?"sm":"lg"}/></div></div></article>;
}

function StoryCard({story,onClick}){
  const[h,setH]=useState(false);
  const m=useIsMobile();
  return<article onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{borderRadius:14,background:h?`linear-gradient(165deg,${T.surfaceHover},${T.surface})`:T.surface,border:`1px solid ${h?T.border+"cc":T.border}60`,padding:m?"14px 16px 12px":"20px 22px 18px",cursor:"pointer",transition:"all 0.35s",display:"flex",flexDirection:"column",boxShadow:h?"0 8px 32px -8px rgba(0,0,0,0.35)":"none",transform:h?"translateY(-2px)":"none"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><TopicTag label={story.topic} color={story.topicColor}/>{!m&&<TrendBadge value={story.trending}/>}</div><ConfBadge score={story.confidence}/></div><h2 style={{fontFamily:"var(--serif)",fontSize:m?15:18,fontWeight:600,lineHeight:1.3,color:h?"#FFF":T.text,margin:"0 0 8px",flex:1}}>{story.headline}</h2><p style={{fontFamily:"var(--body)",fontSize:m?12:12,lineHeight:1.5,color:T.textSecondary,margin:"0 0 12px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{story.summary}</p><SourcePills sourceIds={story.sources} max={m?3:4}/><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${T.border}50`,marginTop:12}}><div style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,display:"flex",gap:6}}><span>{story.timestamp}</span><span style={{opacity:0.3}}>·</span><span>{story.readTime}</span></div><LeanBar breakdown={story.leanBreakdown}/></div></article>;
}

// ── Pages ────────────────────────────────────────────────────

function TrendingPage({stories, dataSource, onStoryClick, topicFilter, onClearFilter}) {
  const m = useIsMobile();
  const allStories = topicFilter
    ? stories.filter(s => s.topic === topicFilter || (s.relatedTopics && s.relatedTopics.includes(topicFilter)))
    : stories;
  const hero = allStories[0];
  const grid = allStories.slice(1);
  const statsAll = [{l:"Sources Active",v:"21",i:"◉"},{l:"Stories Today",v:"147",i:"◈"},{l:"Avg Confidence",v:"87%",i:"◎"},{l:"Updated",v:"2m ago",i:"◷"}];
  const statsMobile = [{l:"Sources Active",v:"21",i:"◉"},{l:"Avg Confidence",v:"87%",i:"◎"}];
  const stats = m ? statsMobile : statsAll;
  return (
    <div className="fade-up">
      {topicFilter && (
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,padding:"10px 16px",borderRadius:9,background:T.primaryMuted,border:`1px solid ${T.primary}30`}}>
          <span style={{fontFamily:"var(--body)",fontSize:12,color:T.textSecondary}}>Filtering by topic:</span>
          <span style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.primary}}>{topicFilter}</span>
          <button onClick={onClearFilter} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:6,background:"transparent",border:`1px solid ${T.primary}30`,cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,color:T.primary}}>✕ Clear</button>
        </div>
      )}
      {!topicFilter && (
        <div style={{display:"flex",gap:1,padding:1,borderRadius:10,background:T.border+"40",marginBottom:24}}>
          {stats.map((s,i,a)=>(
            <div key={i} style={{flex:1,display:"flex",alignItems:"center",gap:m?8:10,padding:m?"9px 12px":"9px 14px",background:T.surface,borderRadius:i===0?"9px 0 0 9px":i===a.length-1?"0 9px 9px 0":0}}>
              <span style={{fontSize:13,opacity:0.4}}>{s.i}</span>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"var(--mono)",fontSize:m?12:13,fontWeight:700,color:T.text,lineHeight:1}}>{s.v}</div>
                <div style={{fontFamily:"var(--body)",fontSize:9,color:T.textTertiary,marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                  {i === 0 && (
                    <span
                      title={dataSource === "live" ? "Live data" : "Demo data"}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: dataSource === "live" ? "#00C2A8" : "#D9AF4A",
                        boxShadow: dataSource === "live" ? "0 0 8px rgba(0,194,168,0.55)" : "none",
                        animation: dataSource === "live" ? "ucLivePulse 1.8s ease-in-out infinite" : "none",
                      }}
                    />
                  )}
                  <span>{s.l}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {hero && <div style={{marginBottom:m?20:32}}><HeroCard story={hero} onClick={()=>onStoryClick(hero)}/></div>}
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:m?12:16}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:m?18:20,fontWeight:600,color:T.text,margin:0}}>{topicFilter ? `${topicFilter} Stories` : "Today's Intelligence"}</h2>
          <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 7px",borderRadius:4}}>{grid.length}</span>
        </div>
      </div>
      {grid.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:m?"1fr":"repeat(auto-fill,minmax(330px,1fr))",gap:m?10:14,paddingBottom:60}}>
          {grid.map(s=><StoryCard key={s.id} story={s} onClick={()=>onStoryClick(s)}/>)}
        </div>
      ) : (
        <div style={{padding:m?"32px 16px":"48px 32px",textAlign:"center",borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,marginBottom:60}}>
          <p style={{fontFamily:"var(--body)",fontSize:14,color:T.textTertiary}}>No stories found for <strong style={{color:T.textSecondary}}>{topicFilter}</strong>. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

// BUG FIX #4 + FEATURE improvements: Share button, wired save/follow, clickable related topics
function DeepDivePage({story, onBack, savedStories, onToggleSave, followedTopics, onToggleFollow, onTopicClick}) {
  const [copied, setCopied] = useState(false);
  const m = useIsMobile();
  const isFollowed = followedTopics.includes(story.topic);
  const isSaved = savedStories.includes(story.id);
  const ctx = story.contextExplainer;
  const conf = story.confidenceExplainer;

  const handleShare = () => {
    const url = `${window.location.origin}?story=${slugify(story.headline)}`;
    const doFallback = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(doFallback);
    } else {
      doFallback();
    }
  };

  return (
    <div style={{maxWidth:800,margin:"0 auto",width:"100%",overflowX:"hidden",padding:m?"0":"0"}} className="fade-up">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:m?16:24,fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>
        <span style={{cursor:"pointer",color:T.primary}} onClick={onBack}>Back</span>
        <span>{I.chevRight}</span>
        <span>{story.topic}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <TopicTag label={story.topic} color={story.topicColor}/>
        <TrendBadge value={story.trending}/>
        <ConfBadge score={story.confidence} size="lg"/>
      </div>
      <SourceStrip sourceIds={story.sources}/>
      <h1 style={{fontFamily:"var(--serif)",fontSize:m?22:38,fontWeight:700,lineHeight:1.2,color:T.text,margin:m?"12px 0 12px":"0 0 16px",letterSpacing:"-0.015em"}}>{story.headline}</h1>
      <div style={{display:"flex",alignItems:"center",gap:m?8:14,marginBottom:m?16:24,fontFamily:"var(--mono)",fontSize:m?10:11,color:T.textTertiary,flexWrap:"wrap"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock} {m ? (story.publishedAt && story.publishedAt.includes("·") ? story.publishedAt.split("·")[0].trim() : story.publishedAt) : story.publishedAt}</span>
        <span style={{opacity:0.3}}>·</span>
        <span>{story.readTime} read</span>
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:8,marginBottom:m?20:32,paddingBottom:m?16:24,borderBottom:`1px solid ${T.border}`,flexDirection:m?"column":"row",flexWrap:m?"nowrap":"wrap"}}>
        <button
          onClick={() => onToggleFollow(story.topic)}
          style={{display:"flex",alignItems:"center",justifyContent:m?"center":"flex-start",gap:6,padding:m?"10px 16px":"8px 16px",borderRadius:8,border:`1px solid ${isFollowed?T.accent:T.primary}`,background:isFollowed?T.accentMuted:T.primaryMuted,cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:600,color:isFollowed?T.accent:T.primary,flex:m?"1":"none"}}
        >
          {isFollowed ? I.check : I.plus}
          {isFollowed ? `Following ${story.topic}` : `Follow ${story.topic}`}
        </button>
        <div style={{display:"flex",gap:8,flex:m?1:"none"}}>
          <button
            onClick={() => onToggleSave(story.id)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:m?"10px 14px":"8px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:isSaved?T.surfaceElevated:T.surface,cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:500,color:isSaved?T.accent:T.textSecondary,flex:1}}
          >
            {I.bookmark}
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleShare}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:m?"10px 14px":"8px 14px",borderRadius:8,border:`1px solid ${copied?T.accent+"60":T.border}`,background:copied?T.accentMuted:T.surface,cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:500,color:copied?T.accent:T.textSecondary,transition:"all 0.2s",flex:1}}
          >
            {copied ? "✓ Copied!" : "↗ Share"}
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{width:20,height:20,borderRadius:6,background:`linear-gradient(135deg,${T.primary},${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4L11 4.5L8.5 7L9 10.5L6 9L3 10.5L3.5 7L1 4.5L4.5 4L6 1Z" fill="white" fillOpacity="0.9"/></svg>
          </div>
          <span style={{fontFamily:"var(--body)",fontSize:13,fontWeight:700,color:T.text}}>AI Summary</span>
          <span style={{fontFamily:"var(--mono)",fontSize:9,color:T.textTertiary,background:T.surfaceHover,padding:"2px 6px",borderRadius:3}}>Claude</span>
        </div>
        <div style={{padding:"18px 22px",borderRadius:12,background:`linear-gradient(135deg,${T.primary}08,${T.accent}05)`,border:`1px solid ${T.primary}18`}}>
          <p style={{fontFamily:"var(--body)",fontSize:15,lineHeight:1.7,color:"#C8C8E0",margin:0}}>{story.summary}</p>
        </div>
      </div>

      {ctx.tldr && (
        <div style={{padding:"14px 18px",borderRadius:10,background:T.accentMuted,border:`1px solid ${T.accent}18`,marginBottom:28}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:700,color:T.accent,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>TL;DR</div>
          <p style={{fontFamily:"var(--body)",fontSize:14,lineHeight:1.6,color:T.textSecondary,margin:0}}>{ctx.tldr}</p>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
        <Expandable title="Context & Background" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5H11M5 8H11M5 11H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} defaultOpen>
          <p style={{fontFamily:"var(--body)",fontSize:14,lineHeight:1.7,color:T.textSecondary,marginBottom:20}}>{ctx.background}</p>
          {ctx.causalChain && (
            <>
              <div style={{fontFamily:"var(--body)",fontSize:12,fontWeight:700,color:T.primary,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:14}}>How We Got Here</div>
              <CausalChain events={ctx.causalChain}/>
            </>
          )}
        </Expandable>
        <Expandable title="What Happens Next" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>} accentColor={T.accent}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(ctx.whatNext || []).map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:8,background:T.surfaceHover+"60"}}>
                <span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:T.accent,marginTop:1}}>{String(i+1).padStart(2,"0")}</span>
                <p style={{fontFamily:"var(--body)",fontSize:13,lineHeight:1.6,color:T.textSecondary,margin:0}}>{item}</p>
              </div>
            ))}
          </div>
        </Expandable>
        <Expandable title={`Confidence — ${story.confidence}%`} icon={I.check} accentColor={confColor(story.confidence).text}>
          <ConfidenceExplainer data={conf}/>
        </Expandable>
        <Expandable title={`Sources — ${story.sources.length}`} icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/></svg>}>
          <SourceBreakdown sourceIds={story.sources}/>
        </Expandable>
      </div>

      <div style={{marginBottom:36}}>
        <div style={{fontFamily:"var(--serif)",fontSize:m?18:20,fontWeight:600,color:T.text,marginBottom:16}}>Left / Center / Right Lens</div>
        <div style={{display:"flex",gap:12,flexDirection:m?"column":"row",flexWrap:m?"nowrap":"wrap"}}>
          <PerspectiveCard lean="left" data={ctx.perspectives.left}/>
          <PerspectiveCard lean="center" data={ctx.perspectives.center}/>
          <PerspectiveCard lean="right" data={ctx.perspectives.right}/>
        </div>
      </div>

      {/* FEATURE #6: Related Topics are now clickable */}
      {story.relatedTopics && (
        <div style={{marginBottom:40,paddingTop:24,borderTop:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"var(--body)",fontSize:12,fontWeight:600,color:T.textTertiary,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.03em"}}>Related Topics</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {story.relatedTopics.map((t,i)=>(
              <button
                key={i}
                onClick={() => onTopicClick(t)}
                style={{padding:"6px 14px",borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer",fontFamily:"var(--body)",fontSize:12,color:T.textSecondary,transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;e.currentTarget.style.color=T.text;e.currentTarget.style.borderColor=T.primary+"40";}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.textSecondary;e.currentTarget.style.borderColor=T.border;}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// FEATURE #7: DigestsPage — fixed hooks violation, premium lock overlay on categories >= 5
function DigestStoryItem({stories, st, onStoryClick}) {
  const [h, setH] = useState(false);
  const handleClick = () => {
    if (st.storyRef) {
      const f = stories.find(s => s.id === st.storyRef) || STORIES.find(s => s.id === st.storyRef);
      if (f) onStoryClick(f);
    }
  };
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={handleClick}
      style={{padding:"16px 18px",borderRadius:10,background:h?T.surfaceHover:"transparent",cursor:st.storyRef?"pointer":"default",borderLeft:`3px solid ${h&&st.storyRef?T.primary+"60":"transparent"}`,transition:"all 0.2s"}}
    >
      <h3 style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:600,lineHeight:1.3,color:h?"#FFF":T.text,margin:"0 0 8px"}}>{st.headline}</h3>
      <p style={{fontFamily:"var(--body)",fontSize:13,lineHeight:1.6,color:T.textSecondary,margin:"0 0 12px"}}>{st.briefing}</p>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <ConfBadge score={st.confidence}/>
        <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>{st.sources} src</span>
        <LeanBar breakdown={st.lean}/>
      </div>
    </div>
  );
}

const PRIORITY_INFO = {
  critical: "Breaking story with immediate impact on millions of people",
  high: "Major story with significant policy or political implications",
  medium: "Important ongoing story worth following closely",
  standard: "Background story providing useful context"
};

function DigestsPage({stories, onStoryClick}) {
  const [period, setPeriod] = useState("daily");
  const m = useIsMobile();
  const d = DIGESTS[period];
  const periodOpts = [{id:"daily",label:"Daily",sub:"Today"},{id:"weekly",label:"Weekly",sub:"This Week"},{id:"monthly",label:"Monthly",sub:"March"}];
  const statsItems = [{l:"Stories",v:d.storyCount},{l:"Topics",v:d.topicCount},{l:"Read Time",v:d.readTime.replace(" read","")},{l:"Sources",v:"21"}];
  return (
    <div className="fade-up" style={{padding:"16px 0"}}>
      <div style={{display:"flex",alignItems:m?"stretch":"center",flexDirection:m?"column":"row",justifyContent:"space-between",gap:m?10:0,marginBottom:24}}>
        <div style={{display:"flex",gap:2,padding:3,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,width:m?"100%":undefined}}>
          {periodOpts.map(o=>{const a=period===o.id;return(
            <button key={o.id} onClick={()=>setPeriod(o.id)} style={{display:"flex",alignItems:"center",justifyContent:m?"center":"flex-start",gap:6,padding:m?"10px 8px":"8px 18px",flex:m?1:"none",borderRadius:8,border:"none",background:a?`${T.accent}15`:"transparent",cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:a?600:500,color:a?T.accent:T.textTertiary,boxShadow:a?`0 0 0 1px ${T.accent}30`:"none"}}>
              {o.label}{!m&&<span style={{fontFamily:"var(--mono)",fontSize:9,opacity:a?0.7:0.4}}>{o.sub}</span>}
            </button>
          );})}
        </div>
        {!m&&<span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>Updated 2m ago</span>}
      </div>

      <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:m?22:28,fontWeight:700,color:T.text,margin:"0 0 6px"}}>{d.title}</h1>
        <p style={{fontFamily:"var(--body)",fontSize:14,color:T.textSecondary,margin:"0 0 20px"}}>{d.subtitle}</p>
        {m ? (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,padding:1,borderRadius:10,background:T.border+"40",marginBottom:20}}>
            {statsItems.map((s,i)=>(
              <div key={i} style={{padding:"10px 12px",background:T.surface,borderRadius:i===0?"9px 0 0 0":i===1?"0 9px 0 0":i===2?"0 0 0 9px":"0 0 9px 0"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:T.text,lineHeight:1}}>{s.v}</div>
                <div style={{fontFamily:"var(--body)",fontSize:9,color:T.textTertiary,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        ) : (
        <div style={{display:"flex",gap:1,padding:1,borderRadius:10,background:T.border+"40",marginBottom:20}}>
          {statsItems.map((s,i,a)=>(
            <div key={i} style={{flex:1,padding:"10px 14px",background:T.surface,borderRadius:i===0?"9px 0 0 9px":i===a.length-1?"0 9px 9px 0":0}}>
              <div style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:T.text,lineHeight:1}}>{s.v}</div>
              <div style={{fontFamily:"var(--body)",fontSize:9,color:T.textTertiary,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        )}
        <div style={{padding:"16px 20px",borderRadius:12,background:`linear-gradient(135deg,${T.primary}08,${T.accent}05)`,border:`1px solid ${T.primary}15`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <div style={{width:18,height:18,borderRadius:5,background:`linear-gradient(135deg,${T.primary},${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4L11 4.5L8.5 7L9 10.5L6 9L3 10.5L3.5 7L1 4.5L4.5 4L6 1Z" fill="white" fillOpacity="0.9"/></svg>
            </div>
            <span style={{fontFamily:"var(--body)",fontSize:11,fontWeight:700,color:T.primary,letterSpacing:"0.04em",textTransform:"uppercase"}}>{"AI Editor's Note"}</span>
          </div>
          <p style={{fontFamily:"var(--body)",fontSize:14,lineHeight:1.65,color:"#B0B0C8",margin:0}}>{d.editorNote}</p>
        </div>
      </div>

      {d.categories.map((cat, ci) => {
        const meta = TOPIC_META[cat.topic] || {icon:"◈",color:T.textTertiary};
        const pBadge = {critical:{l:"Critical",c:T.danger},high:{l:"High",c:T.accent},medium:{l:"Medium",c:T.primary},standard:{l:"Standard",c:T.textTertiary}}[cat.priority];
        const isLocked = ci >= 5;
        return (
          <div key={`${period}-${cat.topic}-${ci}`} style={{borderRadius:14,background:T.surface,border:`1px solid ${T.border}60`,overflow:"hidden",marginBottom:16,position:"relative"}}>
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}40`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:`${meta.color}12`,border:`1px solid ${meta.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:meta.color}}>{meta.icon}</div>
                <div>
                  <div style={{fontFamily:"var(--body)",fontSize:15,fontWeight:700,color:T.text}}>{cat.topic}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>{cat.stories.length} {cat.stories.length===1?"story":"stories"}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center"}}>
                <span style={{padding:"3px 9px",borderRadius:5,background:`${pBadge.c}12`,border:`1px solid ${pBadge.c}20`,fontFamily:"var(--mono)",fontSize:10,fontWeight:600,color:pBadge.c,textTransform:"uppercase"}}>{pBadge.l}</span>
                <span
                  title={PRIORITY_INFO[cat.priority]}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: T.surfaceHover,
                    border: `1px solid ${T.border}`,
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    color: T.textTertiary,
                    cursor: "help",
                    marginLeft: 4,
                  }}
                >
                  i
                </span>
              </div>
            </div>
            <div style={{padding:"8px 4px"}}>
              {cat.stories.map((st,si) => (
                <DigestStoryItem key={si} stories={stories} st={st} onStoryClick={onStoryClick}/>
              ))}
            </div>
            {isLocked && (
              <div style={{position:"absolute",inset:0,borderRadius:14,background:"rgba(10,10,15,0.82)",backdropFilter:"blur(6px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,zIndex:10}}>
                <div style={{color:T.textTertiary,opacity:0.6}}>{I.lock}</div>
                <div style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.textSecondary}}>Premium content</div>
                <button style={{padding:"7px 20px",borderRadius:8,background:`linear-gradient(135deg,${T.primary},${T.primaryStrong})`,border:"none",cursor:"pointer",fontFamily:"var(--body)",fontSize:12,fontWeight:600,color:"#FFF",boxShadow:`0 4px 16px -4px ${T.primary}60`}}>Upgrade to unlock</button>
              </div>
            )}
          </div>
        );
      })}

      <div style={{padding:"24px 28px",borderRadius:14,background:`linear-gradient(135deg,${T.primary}10,${T.accent}08)`,border:`1px solid ${T.primary}20`,textAlign:"center",marginBottom:40}}>
        <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:600,color:T.text,marginBottom:8}}>Unlock the Full Intelligence Layer</div>
        <p style={{fontFamily:"var(--body)",fontSize:13,color:T.textSecondary,lineHeight:1.6,maxWidth:480,margin:"0 auto 16px"}}>Premium members get complete digests with deep-dive explainers and personalized topic tracking.</p>
        <button style={{padding:"10px 28px",borderRadius:9,background:`linear-gradient(135deg,${T.primary},${T.primaryStrong})`,border:"none",cursor:"pointer",fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:"#FFF",boxShadow:`0 4px 16px -4px ${T.primary}60`}}>Upgrade to Premium</button>
      </div>
    </div>
  );
}

// FEATURE #8: For You page — full implementation
function ForYouPage({stories, followedTopics, onStoryClick, onBrowseTrending}) {
  if (followedTopics.length === 0) {
    return (
      <div className="fade-up" style={{padding:"60px 0",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16,opacity:0.2,color:T.primary}}>◎</div>
        <div style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:600,color:T.text,marginBottom:10}}>Your feed is waiting</div>
        <p style={{fontFamily:"var(--body)",fontSize:14,color:T.textTertiary,maxWidth:400,margin:"0 auto 28px",lineHeight:1.6}}>Follow topics from any story to get a personalized feed of the news that matters most to you.</p>
        <button onClick={onBrowseTrending} style={{padding:"11px 28px",borderRadius:9,background:`linear-gradient(135deg,${T.primary},${T.primaryStrong})`,border:"none",cursor:"pointer",fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:"#FFF",boxShadow:`0 4px 16px -4px ${T.primary}60`}}>Browse Trending Stories</button>
      </div>
    );
  }
  const filtered = stories.filter(s =>
    followedTopics.includes(s.topic) ||
    (s.relatedTopics && s.relatedTopics.some(t => followedTopics.includes(t)))
  ).sort((a,b) => b.confidence - a.confidence);

  return (
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,padding:"12px 18px",borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
        <span style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.text}}>Following {followedTopics.length} topic{followedTopics.length !== 1?"s":""}</span>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
          {followedTopics.map(t => <TopicTag key={t} label={t} color={TOPIC_META[t]?.color || T.primary}/>)}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{padding:"48px 32px",textAlign:"center",borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,marginBottom:60}}>
          <p style={{fontFamily:"var(--body)",fontSize:14,color:T.textTertiary}}>No stories yet for your followed topics. Check back soon.</p>
        </div>
      ) : (
        <>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:16}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:600,color:T.text,margin:0}}>Your Stories</h2>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 7px",borderRadius:4}}>{filtered.length}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(330px,1fr))",gap:14,paddingBottom:60}}>
            {filtered.map(s => <StoryCard key={s.id} story={s} onClick={() => onStoryClick(s)}/>)}
          </div>
        </>
      )}
    </div>
  );
}

// FEATURE #5: Account page — saved stories + followed topics
function AccountPage({stories, savedStories, followedTopics, onStoryClick, onTopicFilter, onToggleFollow}) {
  const savedStoryObjects = savedStories
    .map((id) => stories.find((s) => s.id === id) || STORIES.find((s) => s.id === id))
    .filter(Boolean);
  return (
    <div className="fade-up" style={{paddingBottom:60}}>
      <h1 style={{fontFamily:"var(--serif)",fontSize:28,fontWeight:700,color:T.text,margin:"16px 0 28px"}}>Account</h1>

      {/* Saved Stories */}
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:600,color:T.text,margin:0}}>Saved Stories</h2>
          {savedStoryObjects.length > 0 && (
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 7px",borderRadius:4}}>{savedStoryObjects.length}</span>
          )}
        </div>
        {savedStoryObjects.length === 0 ? (
          <div style={{padding:"32px",textAlign:"center",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:28,marginBottom:10,opacity:0.2}}>{I.bookmark}</div>
            <p style={{fontFamily:"var(--body)",fontSize:13,color:T.textTertiary,margin:0}}>No saved stories yet. Bookmark any story to save it here.</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {savedStoryObjects.map(s => (
              <SavedStoryRow key={s.id} story={s} onClick={() => onStoryClick(s)}/>
            ))}
          </div>
        )}
      </div>

      {/* Followed Topics */}
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:600,color:T.text,margin:0}}>Followed Topics</h2>
          {followedTopics.length > 0 && (
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 7px",borderRadius:4}}>{followedTopics.length}</span>
          )}
        </div>
        {followedTopics.length === 0 ? (
          <div style={{padding:"32px",textAlign:"center",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`}}>
            <p style={{fontFamily:"var(--body)",fontSize:13,color:T.textTertiary,margin:0}}>Follow topics from any story to get updates here.</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {followedTopics.map(t => {
              const meta = TOPIC_META[t] || {icon:"◈", color:T.textTertiary};
              return (
                <div key={t} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${meta.color}12`,border:`1px solid ${meta.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:meta.color,flexShrink:0}}>{meta.icon}</div>
                  <div style={{flex:1,cursor:"pointer",minWidth:0}} onClick={() => onTopicFilter(t)}>
                    <div style={{fontFamily:"var(--body)",fontSize:14,fontWeight:600,color:T.text}}>{t}</div>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,marginTop:2}}>Click to browse stories →</div>
                  </div>
                  <button onClick={() => onToggleFollow(t)} style={{padding:"5px 12px",borderRadius:6,background:"transparent",border:`1px solid ${T.border}`,cursor:"pointer",fontFamily:"var(--body)",fontSize:11,fontWeight:500,color:T.textSecondary,flexShrink:0}}>Unfollow</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SavedStoryRow({story, onClick}) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:10,background:h?T.surfaceHover:T.surface,border:`1px solid ${h?T.border+"cc":T.border}`,cursor:"pointer",transition:"all 0.2s"}}
    >
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
          <TopicTag label={story.topic} color={story.topicColor}/>
          <ConfBadge score={story.confidence}/>
        </div>
        <h3 style={{fontFamily:"var(--serif)",fontSize:15,fontWeight:600,color:h?"#FFF":T.text,margin:"0 0 4px",lineHeight:1.3}}>{story.headline}</h3>
        <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>{story.timestamp}</span>
      </div>
      <span style={{color:T.textTertiary,display:"flex",flexShrink:0}}>{I.chevRight}</span>
    </div>
  );
}

// FEATURE #6: Topic Feed view
function TopicFeedPage({stories, topic, onBack, onStoryClick}) {
  const m = useIsMobile();
  const filtered = stories.filter(s =>
    s.topic === topic ||
    (s.relatedTopics && s.relatedTopics.includes(topic))
  );
  return (
    <div className="fade-up" style={{paddingBottom:60}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:m?20:28}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px 6px 8px",borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer",color:T.textSecondary,fontFamily:"var(--body)",fontSize:12,fontWeight:500,flexShrink:0}}>
          {I.back} Back
        </button>
        <div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:m?20:24,fontWeight:700,color:T.text,margin:0}}>{topic}</h1>
          <p style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,margin:"4px 0 0"}}>{filtered.length} {filtered.length===1?"story":"stories"} found</p>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{padding:m?"32px 16px":"60px 32px",textAlign:"center",borderRadius:14,background:T.surface,border:`1px solid ${T.border}`}}>
          <p style={{fontFamily:"var(--body)",fontSize:14,color:T.textTertiary}}>No stories found for <strong style={{color:T.textSecondary}}>{topic}</strong>. Check back soon.</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:m?"1fr":"repeat(auto-fill,minmax(330px,1fr))",gap:m?10:14}}>
          {filtered.map(s => <StoryCard key={s.id} story={s} onClick={() => onStoryClick(s)}/>)}
        </div>
      )}
    </div>
  );
}

// FEATURE #9: Inner views — About, Methodology, Sources, Premium

function BackBtn({onClick}) {
  return (
    <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px 6px 8px",borderRadius:8,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer",color:T.textSecondary,fontFamily:"var(--body)",fontSize:12,fontWeight:500,marginBottom:28}}>
      {I.back} Back
    </button>
  );
}

function AboutPage({onBack}) {
  return (
    <div className="fade-up" style={{maxWidth:760,margin:"0 auto",paddingBottom:60,paddingTop:8}}>
      <BackBtn onClick={onBack}/>
      <h1 style={{fontFamily:"var(--serif)",fontSize:34,fontWeight:700,color:T.text,margin:"0 0 20px",letterSpacing:"-0.015em"}}>About Undercurrent</h1>
      <div style={{padding:"24px 28px",borderRadius:14,background:`linear-gradient(135deg,${T.primary}08,${T.accent}05)`,border:`1px solid ${T.primary}18`,marginBottom:36}}>
        <p style={{fontFamily:"var(--serif)",fontSize:17,lineHeight:1.7,color:T.textSecondary,margin:0,fontStyle:"italic"}}>{'"Political news that explains itself. We believe an informed public requires not just access to news, but access to context, causality, and source transparency."'}</p>
      </div>
      <h2 style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:600,color:T.text,margin:"0 0 20px"}}>How It Works</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:36}}>
        {[
          {step:"01",title:"Trending surfaces what matters",desc:"Social signals from X, Reddit, and Google Trends surface the stories people are actually talking about — not what algorithms want you to click.",icon:"◉"},
          {step:"02",title:"AI explains why it happened",desc:"Claude reads every source, builds a causal chain, and writes a context explainer scaled to the story's complexity. Background, causes, and consequences — all verified.",icon:"◈"},
          {step:"03",title:"You understand, not just know",desc:"Confidence scores, source breakdowns, and the left/center/right lens give you the full picture to form your own informed view.",icon:"◆"},
        ].map((s,i) => (
          <div key={i} style={{padding:"24px 20px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:12,color:T.textTertiary,opacity:0.4}}>{s.icon}</div>
            <div style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:700,color:T.accent,letterSpacing:"0.06em",marginBottom:8}}>Step {s.step}</div>
            <h3 style={{fontFamily:"var(--serif)",fontSize:15,fontWeight:600,color:T.text,margin:"0 0 8px"}}>{s.title}</h3>
            <p style={{fontFamily:"var(--body)",fontSize:12,lineHeight:1.6,color:T.textSecondary,margin:0}}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"flex-start",gap:16,padding:"20px 24px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`}}>
        <div style={{width:44,height:44,borderRadius:12,background:`${T.accent}12`,border:`1px solid ${T.accent}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 4.5L12 5L9.5 7.5L10 11L7 9.5L4 11L4.5 7.5L2 5L5.5 4.5L7 1Z" fill={T.accent} fillOpacity="0.8"/></svg>
        </div>
        <div>
          <div style={{fontFamily:"var(--body)",fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>Powered by Claude</div>
          <p style={{fontFamily:"var(--body)",fontSize:13,lineHeight:1.6,color:T.textSecondary,margin:0}}>{"Undercurrent uses Anthropic's Claude to synthesize reporting from 21+ trusted sources, build causal context chains, and generate confidence-scored summaries. All AI output is grounded in verified source material and labeled transparently — Claude explains, not opines."}</p>
        </div>
      </div>
    </div>
  );
}

function MethodologyPage({onBack}) {
  const sourceRows = Object.entries(SOURCES).sort(([,a],[,b]) => b.trust - a.trust);
  return (
    <div className="fade-up" style={{maxWidth:760,margin:"0 auto",paddingBottom:60,paddingTop:8}}>
      <BackBtn onClick={onBack}/>
      <h1 style={{fontFamily:"var(--serif)",fontSize:34,fontWeight:700,color:T.text,margin:"0 0 8px",letterSpacing:"-0.015em"}}>Methodology</h1>
      <p style={{fontFamily:"var(--body)",fontSize:15,lineHeight:1.65,color:T.textSecondary,marginBottom:32}}>How Undercurrent collects, scores, and presents political news.</p>
      {[
        {title:"Confidence Scores",content:"Each story receives a confidence score (0–100) based on: how many sources report the same core facts, what percentage of factual claims are independently cross-verified, and the trust scores of the reporting sources. Claims labeled 'Verified' appear in 3+ trusted sources. 'Partial' claims are reported with minor discrepancies. 'Speculative' claims are analysis or projections from any source."},
        {title:"Source Trust Ratings",content:"Sources are rated 0–100 based on public media bias research, correction rates, editorial transparency policies, and fact-checker citations. Wire services (Reuters, AP) score highest due to strict editorial standards. Opinion-heavy broadcasters score lower. Ratings are reviewed quarterly and adjusted based on new data."},
        {title:"Left / Center / Right Classification",content:"Political lean is determined by averaging ratings from AllSides Media Bias Chart, Ad Fontes Media Bias Chart, and MediaBiasFactCheck. A source must appear in all three to receive a classification. 'Center' sources score within ±15 points of the median on all three scales. We do not editorialize — we aggregate existing research."},
        {title:"AI Context Engine",content:"When a story crosses the trending threshold, Claude analyzes all available source material to write a neutral factual summary, construct a causal chain showing how the story developed, identify what experts predict happens next, and summarize how left, center, and right outlets frame the story. All AI output is constrained to verified source material — Claude does not add external analysis or opinion."},
      ].map((s,i) => (
        <div key={i} style={{marginBottom:16,padding:"24px 28px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:600,color:T.text,margin:"0 0 12px"}}>{s.title}</h2>
          <p style={{fontFamily:"var(--body)",fontSize:13,lineHeight:1.7,color:T.textSecondary,margin:0}}>{s.content}</p>
        </div>
      ))}
      <h2 style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:600,color:T.text,margin:"32px 0 16px"}}>All Sources</h2>
      <div style={{borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 100px 90px 70px",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.surfaceHover}}>
          {["Source","Type","Lean","Trust"].map((h,i) => <div key={i} style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:700,color:T.textTertiary,textTransform:"uppercase"}}>{h}</div>)}
        </div>
        {sourceRows.map(([id,src],i) => (
          <div key={id} style={{display:"grid",gridTemplateColumns:"1fr 100px 90px 70px",padding:"12px 16px",borderBottom:i<sourceRows.length-1?`1px solid ${T.border}40`:"none",background:i%2===0?"transparent":`${T.surfaceHover}40`}}>
            <div style={{fontFamily:"var(--body)",fontSize:13,color:T.text,fontWeight:500}}>{src.name}</div>
            <div style={{fontFamily:"var(--mono)",fontSize:11,color:T.textTertiary}}>{src.type}</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:leanC(src.lean)}}/><span style={{fontFamily:"var(--mono)",fontSize:11,color:leanC(src.lean),textTransform:"capitalize"}}>{src.lean}</span></div>
            <div style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:confColor(src.trust).text}}>{src.trust}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesPage({onBack}) {
  const grouped = {center:[],left:[],right:[]};
  Object.entries(SOURCES).forEach(([id,src]) => { grouped[src.lean].push({...src,id}); });
  return (
    <div className="fade-up" style={{maxWidth:760,margin:"0 auto",paddingBottom:60,paddingTop:8}}>
      <BackBtn onClick={onBack}/>
      <h1 style={{fontFamily:"var(--serif)",fontSize:34,fontWeight:700,color:T.text,margin:"0 0 8px",letterSpacing:"-0.015em"}}>Sources</h1>
      <p style={{fontFamily:"var(--body)",fontSize:15,lineHeight:1.65,color:T.textSecondary,marginBottom:32}}>All {Object.keys(SOURCES).length} news sources tracked by Undercurrent, grouped by editorial lean.</p>
      {[{key:"center",label:"Center",color:T.center},{key:"left",label:"Left Lean",color:T.left},{key:"right",label:"Right Lean",color:T.right}].map(({key,label,color}) => (
        <div key={key} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:color}}/>
            <h2 style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:600,color,margin:0}}>{label}</h2>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary,background:T.surfaceHover,padding:"2px 7px",borderRadius:4}}>{grouped[key].length}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {grouped[key].map(src => (
              <div key={src.id} style={{padding:"16px 18px",borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:8,background:`${color}12`,border:`1px solid ${color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color,flexShrink:0}}>{src.abbr}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"var(--body)",fontSize:13,fontWeight:600,color:T.text}}>{src.name}</div>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:T.textTertiary}}>{src.type}</div>
                  </div>
                  <div style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:confColor(src.trust).text,flexShrink:0}}>{src.trust}%</div>
                </div>
                <a href={`https://${src.url}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,fontFamily:"var(--mono)",fontSize:11,color:T.primary,textDecoration:"none"}}>
                  {src.url}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4.5 2H10V7.5M10 2L5 7" stroke={T.primary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PremiumPage({onBack, onStartFree}) {
  return (
    <div className="fade-up" style={{maxWidth:760,margin:"0 auto",paddingBottom:60,paddingTop:8}}>
      <BackBtn onClick={onBack}/>
      <div style={{textAlign:"center",marginBottom:40}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:34,fontWeight:700,color:T.text,margin:"0 0 10px",letterSpacing:"-0.015em"}}>{"Start free. Go deep when you're ready."}</h1>
        <p style={{fontFamily:"var(--body)",fontSize:15,color:T.textSecondary}}>No credit card required. No ads, ever.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{padding:"32px 28px",borderRadius:16,background:T.surface,border:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Free</div>
          <div style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:700,color:T.text,marginBottom:4}}>$0</div>
          <div style={{fontFamily:"var(--body)",fontSize:13,color:T.textTertiary,marginBottom:24}}>forever</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
            {["Trending tab with social signals","Basic AI summaries","Confidence scores on all stories","Up to 10 stories per day","Left/Center/Right source labels"].map((f,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--body)",fontSize:13,color:T.textSecondary}}>
                <span style={{color:T.accent,display:"flex",flexShrink:0}}>{I.check}</span>{f}
              </div>
            ))}
          </div>
          <button onClick={onStartFree} style={{width:"100%",padding:"12px",borderRadius:9,background:T.surfaceHover,border:`1px solid ${T.border}`,cursor:"pointer",fontFamily:"var(--body)",fontSize:14,fontWeight:600,color:T.text}}>Get Started</button>
        </div>
        <div style={{padding:"32px 28px",borderRadius:16,background:`linear-gradient(165deg,${T.surface} 0%,#0F1020 100%)`,border:`1px solid ${T.primary}30`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.primary},${T.accent})`}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:600,color:T.primary,letterSpacing:"0.06em",textTransform:"uppercase"}}>Premium</div>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:T.accent,background:T.accentMuted,padding:"2px 8px",borderRadius:4,fontWeight:600}}>Popular</span>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:700,color:T.text}}>$9</span>
            <span style={{fontFamily:"var(--body)",fontSize:14,color:T.textTertiary}}>/month</span>
          </div>
          <div style={{fontFamily:"var(--body)",fontSize:13,color:T.textTertiary,marginBottom:24}}>billed annually, or $12/month</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
            {["Everything in Free, plus:","Unlimited stories and digests","Deep-dive context explainers","Full Left/Center/Right lens analysis","Causal chain timelines","Saved topics and custom digests","Daily, weekly, and monthly briefings","Priority source alerts"].map((f,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--body)",fontSize:13,color:i===0?T.text:T.textSecondary,fontWeight:i===0?600:400}}>
                <span style={{color:T.accent,display:"flex",flexShrink:0}}>{I.check}</span>{f}
              </div>
            ))}
          </div>
          <button style={{width:"100%",padding:"12px",borderRadius:9,background:`linear-gradient(135deg,${T.primary},${T.primaryStrong})`,border:"none",cursor:"pointer",fontFamily:"var(--body)",fontSize:14,fontWeight:600,color:"#FFF",boxShadow:`0 4px 20px -6px ${T.primary}60`}}>Start Free Trial</button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LandingPage({ onEnterApp }) {
  const [vis, setVis] = useState({});
  const m = useIsMobile();
  const observe = useCallback((id) => (el) => {
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(p => ({ ...p, [id]: true })); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
  }, []);

  const sectionStyle = (id, delay = 0) => ({
    opacity: vis[id] ? 1 : 0,
    transform: vis[id] ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const previewStories = [STORIES[0], STORIES[1], STORIES[6]];
  const px = m ? "16px" : "28px";

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", overflowX: "hidden" }}>

      <nav style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `16px ${px}` : `20px ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <LogoMark size={m ? 22 : 26} />
        <div style={{ display: "flex", alignItems: "center", gap: m ? 8 : 20 }}>
          {!m && ["Features", "Pricing", "About"].map(l => (
            <span key={l} style={{ fontFamily: "var(--body)", fontSize: 13, color: T.textSecondary, cursor: "pointer", fontWeight: 500 }}>{l}</span>
          ))}
          <button onClick={onEnterApp} style={{ padding: m ? "8px 16px" : "8px 20px", borderRadius: 8, background: T.primary, border: "none", cursor: "pointer", fontFamily: "var(--body)", fontSize: m ? 13 : 13, fontWeight: 600, color: "#FFF" }}>Open App</button>
        </div>
      </nav>

      <section ref={observe("hero")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `48px ${px} 40px` : `80px ${px} 60px`, textAlign: "center", position: "relative" }}>
        {!m && <>
          <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.primary}0C 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 400, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.accent}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        </>}

        <div style={{ ...sectionStyle("hero", 0), display: "inline-flex", width: m ? 56 : 72, height: m ? 56 : 72, borderRadius: m ? 16 : 20, background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`, alignItems: "center", justifyContent: "center", marginBottom: m ? 20 : 28, boxShadow: `0 8px 40px -8px ${T.primary}40` }}>
          <svg width={m ? 30 : 40} height={m ? 30 : 40} viewBox="0 0 18 18" fill="none"><path d="M9 2C5.5 6 4 8.5 4 11C4 13.76 6.24 16 9 16C11.76 16 14 13.76 14 11C14 8.5 12.5 6 9 2Z" fill="white" fillOpacity="0.95" /><path d="M9 8C7.5 10 7 11 7 12.2C7 13.2 7.9 14 9 14C10.1 14 11 13.2 11 12.2C11 11 10.5 10 9 8Z" fill={T.primary} fillOpacity="0.5" /></svg>
        </div>

        <div style={{ ...sectionStyle("hero", 100) }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: m ? 11 : 12, fontWeight: 600, color: T.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Know the Current</div>
        </div>

        <h1 style={{ ...sectionStyle("hero", 200), fontFamily: "var(--serif)", fontSize: m ? 32 : 56, fontWeight: 700, lineHeight: 1.15, color: T.text, margin: "0 auto 16px", maxWidth: m ? "100%" : 700, letterSpacing: "-0.02em" }}>
          Political news that<br /><span style={{ background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>explains itself</span>
        </h1>

        <p style={{ ...sectionStyle("hero", 300), fontFamily: "var(--body)", fontSize: m ? 15 : 18, lineHeight: 1.65, color: T.textSecondary, maxWidth: m ? "100%" : 540, margin: m ? "0 auto 28px" : "0 auto 36px", fontWeight: 400 }}>
          AI-powered intelligence that tells you not just what happened, but why — with confidence scores, source transparency, and left/center/right perspective on every story.
        </p>

        <div style={{ ...sectionStyle("hero", 400), display: "flex", alignItems: "center", justifyContent: "center", gap: m ? 10 : 12, flexDirection: m ? "column" : "row" }}>
          <button onClick={onEnterApp} style={{ padding: m ? "14px 0" : "14px 32px", width: m ? "100%" : "auto", borderRadius: 10, background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, border: "none", cursor: "pointer", fontFamily: "var(--body)", fontSize: 15, fontWeight: 600, color: "#FFF", boxShadow: `0 4px 24px -6px ${T.primary}60` }}>
            Get Started Free
          </button>
          <button style={{ padding: m ? "12px 0" : "14px 32px", width: m ? "100%" : "auto", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: "var(--body)", fontSize: m ? 14 : 15, fontWeight: 500, color: T.textSecondary }}>
            See How It Works ↓
          </button>
        </div>

        <div style={{ ...sectionStyle("hero", 550), display: "flex", alignItems: "center", justifyContent: "center", gap: m ? 12 : 20, marginTop: m ? 24 : 40, fontFamily: "var(--mono)", fontSize: m ? 10 : 11, color: T.textTertiary, flexWrap: "wrap" }}>
          <span>21 trusted sources</span><span style={{ opacity: 0.3 }}>·</span><span>Updated in real-time</span><span style={{ opacity: 0.3 }}>·</span><span>No ads, no agenda</span>
        </div>
      </section>

      <section ref={observe("preview")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `32px ${px} 48px` : `40px ${px} 60px` }}>
        <div style={{ ...sectionStyle("preview"), textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live from the Feed</span>
        </div>
        <div style={{ ...sectionStyle("preview", 150), display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 10 : 14 }}>
          {previewStories.slice(0, m ? 2 : 3).map((s, i) => (
            <div key={s.id} style={{ ...sectionStyle("preview", 200 + i * 100), borderRadius: 14, background: T.surface, border: `1px solid ${T.border}60`, padding: m ? "14px 16px 12px" : "20px 22px 18px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <TopicTag label={s.topic} color={s.topicColor} />
                <ConfBadge score={s.confidence} />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: m ? 15 : 16, fontWeight: 600, lineHeight: 1.3, color: T.text, margin: "0 0 10px", flex: 1 }}>{s.headline}</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${T.border}50`, marginTop: 8 }}>
                <SourcePills sourceIds={s.sources} max={3} />
                <LeanBar breakdown={s.leanBreakdown} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={observe("features")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `40px ${px} 48px` : `60px ${px} 80px` }}>
        <div style={{ ...sectionStyle("features"), textAlign: "center", marginBottom: m ? 28 : 48 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: m ? 26 : 36, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.015em" }}>Intelligence, not information</h2>
          <p style={{ fontFamily: "var(--body)", fontSize: m ? 14 : 16, color: T.textSecondary, maxWidth: 500, margin: "0 auto" }}>Three systems working together to cut through noise and give you understanding.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 12 : 16 }}>
          {[
            { title: "AI Context Engine", desc: "Every story gets a causal chain explaining how we got here and what happens next. Claude analyzes 21 sources to build context that scales with topic complexity.", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="5" stroke={T.primary} strokeWidth="1.5"/><path d="M9 9H19M9 14H19M9 19H14" stroke={T.primary} strokeWidth="1.3" strokeLinecap="round"/><circle cx="21" cy="19" r="3" fill={T.primary} fillOpacity="0.2" stroke={T.primary} strokeWidth="1.2"/></svg>, color: T.primary, label: "Core Feature" },
            { title: "Confidence Scoring", desc: "Not all reporting is equal. Every story shows how many sources agree on core facts, which claims are verified, and which are analysis or speculation.", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke={T.accent} strokeWidth="1.5"/><circle cx="14" cy="14" r="10" stroke={T.accent} strokeWidth="1.5" strokeDasharray="47 63" transform="rotate(-90 14 14)" strokeLinecap="round"/><path d="M10 14L13 17L18 11" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, color: T.accent, label: "Trust Layer" },
            { title: "Left / Center / Right Lens", desc: "See how the same story looks through different editorial lenses. Actual summaries of what each perspective argues, with key quotes and sentiment analysis.", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="10" width="6" height="10" rx="2" fill={T.left} fillOpacity="0.2" stroke={T.left} strokeWidth="1.2"/><rect x="11" y="7" width="6" height="13" rx="2" fill={T.center} fillOpacity="0.1" stroke={T.center} strokeWidth="1.2" opacity="0.5"/><rect x="19" y="10" width="6" height="10" rx="2" fill={T.right} fillOpacity="0.2" stroke={T.right} strokeWidth="1.2"/></svg>, color: T.textSecondary, label: "Perspective" },
          ].map((f, i) => (
            <div key={i} style={{ ...sectionStyle("features", 100 + i * 120), padding: m ? "20px 18px" : "32px 28px", borderRadius: 16, background: T.surface, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: f.color, opacity: 0.4 }} />
              <div style={{ marginBottom: m ? 12 : 20 }}>{f.icon}</div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: f.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: m ? 6 : 10, display: "block" }}>{f.label}</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: m ? 18 : 22, fontWeight: 600, color: T.text, margin: m ? "0 0 8px" : "0 0 12px" }}>{f.title}</h3>
              <p style={{ fontFamily: "var(--body)", fontSize: m ? 13 : 14, lineHeight: 1.65, color: T.textSecondary, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={observe("how")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `40px ${px} 48px` : `60px ${px} 80px` }}>
        <div style={{ ...sectionStyle("how"), textAlign: "center", marginBottom: m ? 28 : 48 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: m ? 24 : 36, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>From noise to understanding in seconds</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 12 : 24 }}>
          {[
            { step: "01", title: "Trending surfaces what matters", desc: "Social signals from X, Reddit, and Google Trends surface the stories people are actually talking about — not what algorithms want you to click.", icon: "◉" },
            { step: "02", title: "AI explains why it happened", desc: "Claude reads every source, builds a causal chain, and writes a context explainer scaled to the story's complexity. Background, causes, and consequences — all verified.", icon: "◈" },
            { step: "03", title: "You understand, not just know", desc: "Confidence scores, source breakdowns, and the left/center/right lens give you the full picture. Form your own view from a position of genuine understanding.", icon: "◆" },
          ].map((s, i) => (
            <div key={i} style={{ ...sectionStyle("how", 100 + i * 150), textAlign: m ? "left" : "center", padding: m ? "16px 20px" : "32px 24px", borderRadius: m ? 12 : 0, background: m ? T.surface : "transparent", border: m ? `1px solid ${T.border}` : "none", display: m ? "flex" : "block", alignItems: m ? "flex-start" : undefined, gap: m ? 14 : 0 }}>
              <div style={{ display: "inline-flex", width: m ? 44 : 56, height: m ? 44 : 56, flexShrink: 0, borderRadius: m ? 12 : 16, background: i === 1 ? `linear-gradient(135deg, ${T.primary}15, ${T.accent}10)` : T.surfaceHover, border: `1px solid ${i === 1 ? T.primary + "30" : T.border}`, alignItems: "center", justifyContent: "center", marginBottom: m ? 0 : 20, fontSize: m ? 18 : 22, color: i === 1 ? T.primary : T.textTertiary }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.06em", marginBottom: m ? 4 : 10 }}>Step {s.step}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: m ? 16 : 20, fontWeight: 600, color: T.text, margin: m ? "0 0 6px" : "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--body)", fontSize: m ? 13 : 14, lineHeight: 1.6, color: T.textSecondary, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={observe("pricing")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `40px ${px} 48px` : `60px ${px} 80px` }}>
        <div style={{ ...sectionStyle("pricing"), textAlign: "center", marginBottom: m ? 28 : 48 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: m ? 24 : 36, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>{"Start free. Go deep when you're ready."}</h2>
          <p style={{ fontFamily: "var(--body)", fontSize: m ? 14 : 16, color: T.textSecondary }}>No credit card required. No ads, ever.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16, maxWidth: m ? "100%" : 760, margin: "0 auto" }}>
          <div style={{ ...sectionStyle("pricing", 100), padding: m ? "24px 20px" : "32px 28px", borderRadius: 16, background: T.surface, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: T.textTertiary, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Free</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700, color: T.text, marginBottom: 4 }}>$0</div>
            <div style={{ fontFamily: "var(--body)", fontSize: 13, color: T.textTertiary, marginBottom: 24 }}>forever</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Trending tab with social signals", "Basic AI summaries", "Confidence scores on all stories", "Up to 10 stories per day", "Left/Center/Right source labels"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--body)", fontSize: 13, color: T.textSecondary }}>
                  <span style={{ color: T.accent, display: "flex", flexShrink: 0 }}>{I.check}</span>{f}
                </div>
              ))}
            </div>
            <button onClick={onEnterApp} style={{ width: "100%", padding: "12px", borderRadius: 9, background: T.surfaceHover, border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: "var(--body)", fontSize: 14, fontWeight: 600, color: T.text }}>Get Started</button>
          </div>
          <div style={{ ...sectionStyle("pricing", m ? 0 : 200), padding: m ? "24px 20px" : "32px 28px", borderRadius: 16, background: `linear-gradient(165deg, ${T.surface} 0%, #0F1020 100%)`, border: `1px solid ${T.primary}30`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.primary}, ${T.accent})` }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: T.primary, letterSpacing: "0.06em", textTransform: "uppercase" }}>Premium</div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: T.accent, background: T.accentMuted, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>Popular</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700, color: T.text }}>$9</span>
              <span style={{ fontFamily: "var(--body)", fontSize: 14, color: T.textTertiary }}>/month</span>
            </div>
            <div style={{ fontFamily: "var(--body)", fontSize: 13, color: T.textTertiary, marginBottom: 24 }}>billed annually, or $12/month</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Everything in Free, plus:", "Unlimited stories and digests", "Deep-dive context explainers", "Full Left/Center/Right lens analysis", "Causal chain timelines", "Saved topics and custom digests", "Daily, weekly, and monthly briefings", "Priority source alerts"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--body)", fontSize: 13, color: i === 0 ? T.text : T.textSecondary, fontWeight: i === 0 ? 600 : 400 }}>
                  <span style={{ color: T.accent, display: "flex", flexShrink: 0 }}>{I.check}</span>{f}
                </div>
              ))}
            </div>
            <button onClick={onEnterApp} style={{ width: "100%", padding: "12px", borderRadius: 9, background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, border: "none", cursor: "pointer", fontFamily: "var(--body)", fontSize: 14, fontWeight: 600, color: "#FFF", boxShadow: `0 4px 20px -6px ${T.primary}60` }}>Start Free Trial</button>
          </div>
        </div>
      </section>

      <footer ref={observe("footer")} style={{ maxWidth: 1100, margin: "0 auto", padding: m ? `32px ${px} 40px` : `40px ${px} 48px`, borderTop: `1px solid ${T.border}40` }}>
        <div style={{ ...sectionStyle("footer"), display: "flex", alignItems: m ? "center" : "flex-start", flexDirection: m ? "column" : "row", justifyContent: m ? "center" : "space-between", gap: m ? 28 : 0, textAlign: m ? "center" : "left" }}>
          <div>
            <div style={{ display: m ? "flex" : "block", justifyContent: m ? "center" : undefined }}>
              <LogoMark size={22} />
            </div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: T.textTertiary, marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Intelligence, not opinion</p>
          </div>
          {!m && <div style={{ display: "flex", gap: 40 }}>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "API"] },
              { title: "Company", links: ["About", "Methodology", "Sources", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--body)", fontSize: 11, fontWeight: 700, color: T.textTertiary, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>{col.title}</div>
                {col.links.map((l, j) => (
                  <div key={j} style={{ fontFamily: "var(--body)", fontSize: 13, color: T.textSecondary, marginBottom: 8, cursor: "pointer" }}>{l}</div>
                ))}
              </div>
            ))}
          </div>}
          <div style={{ textAlign: m ? "center" : "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}` }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 4.5L12 5L9.5 7.5L10 11L7 9.5L4 11L4.5 7.5L2 5L5.5 4.5L7 1Z" fill={T.accent} fillOpacity="0.8"/></svg>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: T.textTertiary, letterSpacing: "0.03em" }}>Powered by Claude</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: T.textTertiary, marginTop: 8 }}>© 2026 Undercurrent</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  APP ROOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function mapStory(s) {
  return {
    ...s,
    leanBreakdown:
      s.lean_breakdown ||
      s.leanBreakdown ||
      { left: 2, center: 3, right: 1 },
    readTime:
      s.read_time ||
      s.readTime ||
      "5 min",
    contextExplainer:
      s.context_explainer ||
      s.contextExplainer || {
        tldr: s.summary,
        background: "",
        causalChain: [],
        whatNext: [],
        perspectives: {
          left: {
            summary: "",
            keyQuote: "",
            quoteSource: "",
            sentiment: ""
          },
          center: {
            summary: "",
            keyQuote: "",
            quoteSource: "",
            sentiment: ""
          },
          right: {
            summary: "",
            keyQuote: "",
            quoteSource: "",
            sentiment: ""
          },
        },
      },
    confidenceExplainer:
      s.confidence_explainer ||
      s.confidenceExplainer || {
        score: s.confidence || 80,
        sourcesAgreeing: 3,
        sourcesTotal: 5,
        factsCrossVerified: 8,
        factsTotal: 10,
        breakdown: [],
      },
    relatedTopics:
      s.related_topics ||
      s.relatedTopics || [],
    topicColor:
      s.topic_color ||
      s.topicColor ||
      "#2D6BE4",
    publishedAt:
      s.published_at ?
        new Date(s.published_at)
          .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
          }) : "",
    trending:
      s.trending || "+0%",
    timestamp:
      timeAgo(
        s.published_at || s.publishedAt
      ),
    sources:
      s.sources || [],
    hero:
      s.hero || false,
  };
}

function timeAgo(dateString) {
  if (!dateString) return "recently";
  try {
    const now = new Date();
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
      return "recently";
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
    if (seconds < 604800)
      return `${Math.floor(
        seconds / 86400
      )}d ago`;
    return date.toLocaleDateString(
      "en-US", {
        month: "short",
        day: "numeric"
      }
    );
  } catch {
    return "recently";
  }
}

export default function App() {
  const [mode, setMode] = useState("landing");
  const [mainTab, setMainTab] = useState("trending");
  const [view, setView] = useState("feed");       // "feed" | "deepdive" | "topicfeed"
  const [selectedStory, setSelectedStory] = useState(null);
  const [topicFilter, setTopicFilter] = useState(null);
  const [innerView, setInnerView] = useState(null); // "about" | "methodology" | "sources" | "premium"

  const [stories, setStories] = useState(STORIES);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("static");

  // Persisted state — lazy localStorage initialization (avoids setState-in-effect lint)
  const [savedStories, setSavedStories] = useState(() => {
    if (typeof window === "undefined") return [];
    try { const v = localStorage.getItem("uc_saved"); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [followedTopics, setFollowedTopics] = useState(() => {
    if (typeof window === "undefined") return [];
    try { const v = localStorage.getItem("uc_followed"); return v ? JSON.parse(v) : []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("uc_saved", JSON.stringify(savedStories)); } catch {}
  }, [savedStories]);

  useEffect(() => {
    try { localStorage.setItem("uc_followed", JSON.stringify(followedTopics)); } catch {}
  }, [followedTopics]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("story")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("app");
    }
  }, []);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch(
          "/api/stories"
        );
        const data = await res.json();

        if (data.stories?.length > 0) {
          setStories(
            data.stories.map(mapStory)
          );
          setDataSource("live");
        } else {
          setDataSource("static");
        }
      } catch (err) {
        console.error(err);
        setDataSource("static");
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const storySlug = params.get("story");
    if (!storySlug) return;
    const found =
      stories.find((s) => slugify(s.headline) === storySlug) ||
      STORIES.find((s) => slugify(s.headline) === storySlug);
    if (found) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedStory(found);
      setView("deepdive");
    }
  }, [loading, stories]);

  const toggleSave = useCallback((id) => {
    setSavedStories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleFollow = useCallback((topic) => {
    setFollowedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  }, []);

  const openStory = useCallback((story) => {
    setSelectedStory(story);
    setView("deepdive");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    if (innerView) { setInnerView(null); return; }
    if (view === "topicfeed") {
      if (selectedStory) { setView("deepdive"); }
      else { setView("feed"); setTopicFilter(null); }
      return;
    }
    setView("feed");
    setSelectedStory(null);
  }, [view, innerView, selectedStory]);

  const handleTabChange = useCallback((tab) => {
    setMainTab(tab);
    setView("feed");
    setSelectedStory(null);
    setTopicFilter(null);
    setInnerView(null);
  }, []);

  const enterApp = useCallback(() => { setMode("app"); window.scrollTo({ top: 0 }); }, []);

  // BUG FIX #1: Logo always returns to landing
  const goToLanding = useCallback(() => { setMode("landing"); }, []);

  const openTopicFeed = useCallback((topic) => {
    setTopicFilter(topic);
    setView("topicfeed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openInnerView = useCallback((v) => {
    setInnerView(v);
    window.scrollTo({ top: 0 });
  }, []);

  // From account page: filter trending tab by topic
  const handleTopicFilterFromAccount = useCallback((topic) => {
    setMainTab("trending");
    setTopicFilter(topic);
    setView("feed");
    setInnerView(null);
  }, []);

  const showBack = view === "deepdive" || view === "topicfeed" || !!innerView;

  // Resolve which content to show
  const renderInner = () => {
    if (innerView === "about") return <AboutPage onBack={() => setInnerView(null)} />;
    if (innerView === "methodology") return <MethodologyPage onBack={() => setInnerView(null)} />;
    if (innerView === "sources") return <SourcesPage onBack={() => setInnerView(null)} />;
    if (innerView === "premium") return <PremiumPage onBack={() => setInnerView(null)} onStartFree={enterApp} />;
    if (view === "topicfeed") return <TopicFeedPage stories={stories} topic={topicFilter} onBack={goBack} onStoryClick={openStory} />;
    if (view === "deepdive" && selectedStory) return (
      <div style={{ padding: "20px 0" }}>
        <DeepDivePage
          story={selectedStory}
          onBack={goBack}
          savedStories={savedStories}
          onToggleSave={toggleSave}
          followedTopics={followedTopics}
          onToggleFollow={toggleFollow}
          onTopicClick={openTopicFeed}
        />
      </div>
    );
    return null;
  };

  const inner = renderInner();

  if (mode === "app" && loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap');
          :root{--serif:'Fraunces','Georgia',serif;--body:'Inter',-apple-system,sans-serif;--mono:'SF Mono','Fira Code','JetBrains Mono','Consolas',monospace;}
          *{margin:0;padding:0;box-sizing:border-box;}
          html,body{background:#0A0A0F;overflow-x:hidden;max-width:100vw;}
          @keyframes ucLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(0.92)}}
        `}</style>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0A0A0F",
          gap: 16,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #2D6BE4, #00C2A8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}>
            〜
          </div>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            color: "#55556A",
            letterSpacing: "0.06em",
          }}>
            Pulling the current...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap');
        :root{--serif:'Fraunces','Georgia',serif;--body:'Inter',-apple-system,sans-serif;--mono:'SF Mono','Fira Code','JetBrains Mono','Consolas',monospace;}
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{background:${T.bg};overflow-x:hidden;max-width:100vw;}
        .src-scroll::-webkit-scrollbar{display:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
        @keyframes popIn{from{opacity:0;transform:translateY(4px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ucLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(0.92)}}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
        ::selection{background:${T.primary}30;color:${T.text};}button:hover{filter:brightness(1.08);}
        @media(max-width:767px){
          body{overflow-x:hidden;}
          *{max-width:100vw;}
        }
      `}</style>

      {mode === "landing" && <LandingPage onEnterApp={enterApp} />}

      {mode === "app" && (
        <AppShell
          mainTab={mainTab}
          view={view}
          inner={inner}
          showBack={showBack}
          goBack={goBack}
          goToLanding={goToLanding}
          handleTabChange={handleTabChange}
          openStory={openStory}
          topicFilter={topicFilter}
          setTopicFilter={setTopicFilter}
          savedStories={savedStories}
          followedTopics={followedTopics}
          toggleFollow={toggleFollow}
          handleTopicFilterFromAccount={handleTopicFilterFromAccount}
          openInnerView={openInnerView}
          stories={stories}
          dataSource={dataSource}
        />
      )}
    </>
  );
}

function AppShell({ mainTab, view, inner, showBack, goBack, goToLanding, handleTabChange, openStory, topicFilter, setTopicFilter, savedStories, followedTopics, toggleFollow, handleTopicFilterFromAccount, openInnerView, stories, dataSource }) {
  const m = useIsMobile();
  return (
        <div style={{ minHeight: "100vh", background: T.bg, color: T.text, overflowX: "hidden", width: "100%", maxWidth: "100vw", position: "relative" }}>
          {!m && <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${T.primary}06 0%, transparent 70%)`, pointerEvents: "none" }} />}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: m ? "0 16px" : "0 28px", width: "100%", overflowX: "hidden", position: "relative", zIndex: 1 }}>
            <NavHeader
              onBack={goBack}
              showBack={showBack}
              onLogoClick={goToLanding}
              onAccountClick={() => handleTabChange("account")}
            />

            {/* Tab bar row — only show when viewing the feed (not deep dive / topic feed / inner view) */}
            {!inner && view === "feed" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: m ? "12px 0" : "16px 0", gap: 8 }}>
                <MainTabBar active={mainTab} onChange={handleTabChange} />
                {!m && <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: T.textTertiary }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                  <button onClick={goToLanding} style={{ padding: "4px 10px", borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, color: T.textTertiary }}>Landing ↗</button>
                </div>}
              </div>
            )}

            {/* Main content */}
            {inner || (
              view === "feed" && (
                <>
                  {mainTab === "trending" && (
                    <TrendingPage
                      stories={stories}
                      dataSource={dataSource}
                      onStoryClick={openStory}
                      topicFilter={topicFilter}
                      onClearFilter={() => setTopicFilter(null)}
                    />
                  )}
                  {mainTab === "digests" && <DigestsPage stories={stories} onStoryClick={openStory} />}
                  {mainTab === "foryou" && (
                    <ForYouPage
                      stories={stories}
                      followedTopics={followedTopics}
                      onStoryClick={openStory}
                      onBrowseTrending={() => handleTabChange("trending")}
                    />
                  )}
                  {mainTab === "account" && (
                    <AccountPage
                      stories={stories}
                      savedStories={savedStories}
                      followedTopics={followedTopics}
                      onStoryClick={openStory}
                      onTopicFilter={handleTopicFilterFromAccount}
                      onToggleFollow={toggleFollow}
                    />
                  )}
                </>
              )
            )}

            {/* FEATURE #9: Footer with functional links */}
            <div style={{ borderTop: `1px solid ${T.border}40`, padding: m ? "16px 0 28px" : "20px 0 36px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontFamily: "var(--body)", fontSize: 10, color: T.textTertiary }}>Undercurrent v1.1</span>
              <div style={{ display: "flex", gap: m ? 12 : 14, fontFamily: "var(--mono)", fontSize: 9, color: T.textTertiary }}>
                <span style={{ cursor: "pointer" }} onClick={() => openInnerView("about")}>About</span>
                <span style={{ cursor: "pointer" }} onClick={() => openInnerView("methodology")}>Methodology</span>
                <span style={{ cursor: "pointer" }} onClick={() => openInnerView("sources")}>Sources</span>
                <span style={{ cursor: "pointer" }} onClick={() => openInnerView("premium")}>Premium</span>
              </div>
            </div>
          </div>
        </div>
  );
}
