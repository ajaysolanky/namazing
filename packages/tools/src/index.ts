import fetch, { Response } from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

const DEFAULT_TOPK = 5;

const serpApiEndpoint = "https://serpapi.com/search";

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON from provider: ${text}`);
  }
}

export async function searchWeb(
  q: string,
  opts: { region?: string; topK?: number } = {}
): Promise<SearchResult[]> {
  const provider = process.env.SEARCH_PROVIDER;
  const topK = opts.topK ?? DEFAULT_TOPK;

  if (provider === "serpapi") {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      console.warn("SERPAPI_KEY missing; falling back to stub search results");
    } else {
      const params = new URLSearchParams({
        engine: "google",
        q,
        num: String(Math.min(topK, 10)),
        hl: opts.region ?? "en",
        api_key: apiKey,
      });
      const res = await fetch(`${serpApiEndpoint}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`SerpAPI error: ${res.status} ${await res.text()}`);
      }
      const data = await safeJson(res);
      const organic = Array.isArray(data.organic_results)
        ? data.organic_results
        : [];
      return organic.slice(0, topK).map((item: any) => ({
        title: item.title ?? "Untitled",
        url: item.link ?? item.url ?? "",
        snippet: item.snippet ?? item.snippet_highlighted_words?.join(" ") ?? "",
      }));
    }
  }

  // Default stubbed response when provider unavailable.
  return [
    {
      title: `Stubbed result for ${q}`,
      url: "https://example.com",
      snippet: "Search provider not configured; returning placeholder result.",
    },
  ];
}

export async function fetchAndExtract(url: string): Promise<{ text: string; meta: Record<string, string> }>{
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    const meta: Record<string, string> = {};
    $("meta").each((_, el) => {
      const name = $(el).attr("name") ?? $(el).attr("property");
      const content = $(el).attr("content");
      if (name && content) {
        meta[name] = content;
      }
    });
    return { text, meta };
  } catch (error) {
    return {
      text: "",
      meta: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

type PopularityData = {
  [name: string]: {
    [year: number]: {
      rank: number;
      count: number;
    };
  };
};

let popularityData: PopularityData | null = null;

async function loadPopularityData(): Promise<PopularityData> {
  if (popularityData) {
    return popularityData;
  }

  const csvPath = path.resolve(
    process.env.GEMINI_TMPDIR || "",
    "baby-names.csv"
  );
  const data = await fs.readFile(csvPath, "utf-8");
  const lines = data.split("\n");
  const result: PopularityData = {};

  for (let i = 1; i < lines.length; i++) {
    const [year, name, percent, sex] = lines[i].split(",");
    if (year && name && percent && sex) {
      const trimmedName = name.trim().replace(/"/g, "");
      if (!result[trimmedName]) {
        result[trimmedName] = {};
      }
      result[trimmedName][parseInt(year)] = {
        rank: 0, // The data doesn't have rank, so we'll have to calculate it.
        count: Math.round(parseFloat(percent) * 100000), // This is an approximation
      };
    }
  }

  // Calculate ranks
  for (const year in Array.from(new Set(lines.slice(1).map(l => l.split(",")[0])))) {
    const yearData = Object.entries(result).map(([name, data]) => ({ name, ...data[parseInt(year)] })).filter(d => d.count);
    yearData.sort((a, b) => b.count - a.count);
    for (let i = 0; i < yearData.length; i++) {
      result[yearData[i].name][parseInt(year)].rank = i + 1;
    }
  }


  popularityData = result;
  return popularityData;
}


export async function getPopularity(
  name: string,
  region = "US"
): Promise<{ timeseries?: Array<{ year: number; rank?: number; count?: number }>; notes: string }> {
  if (region !== "US") {
    return {
      notes: "Popularity data is only available for the US.",
    };
  }

  const data = await loadPopularityData();
  const nameData = data[name];

  if (!nameData) {
    return {
      notes: "No popularity data found for this name.",
    };
  }

  const timeseries = Object.entries(nameData).map(([year, data]) => ({
    year: parseInt(year),
    ...data,
  }));

  return {
    timeseries,
    notes: "Popularity data is based on the top 1000 names from 1880 to 2009.",
  };
}

const VOWEL_GROUPS = ["a", "e", "i", "o", "u", "y"];

export function roughIPA(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith("ia")) return `/${name.replace(/ia$/i, "-ee-a")}/`;
  if (lower.endsWith("ie") || lower.endsWith("ee")) return `/${name.replace(/ie$/i, "-ee").replace(/ee$/i, "-ee")}/`;
  if (lower.endsWith("y")) return `/${name.replace(/y$/i, "-ee")}/`;
  return `/${name}/`;
}

export function countSyllables(name: string): number {
  const lower = name.toLowerCase();
  let syllables = 0;
  let prevWasVowel = false;
  for (const char of lower) {
    const isVowel = VOWEL_GROUPS.includes(char);
    if (isVowel && !prevWasVowel) {
      syllables += 1;
    }
    prevWasVowel = isVowel;
  }
  if (lower.endsWith("e")) {
    syllables = Math.max(1, syllables - 1);
  }
  return Math.max(1, syllables);
}

export async function scanNegAssociations(
  name: string
): Promise<{ items: Array<{ label: string; url?: string }>; notes: string }>{
  const patterns = ["scandal", "controversy", "notorious"];
  const queries = patterns.map((pattern) => `${name} ${pattern}`);
  const items: Array<{ label: string; url?: string }> = [];

  for (const query of queries) {
    try {
      const results = await searchWeb(query, { topK: 3 });
      for (const result of results) {
        items.push({ label: result.title, url: result.url });
      }
    } catch (error) {
      return {
        items,
        notes: error instanceof Error ? error.message : "search failed",
      };
    }
  }

  if (items.length === 0) {
    return {
      items,
      notes: "No concerning associations surfaced in stub search.",
    };
  }

  return {
    items,
    notes: "Review items manually to confirm relevance; automated search may include tangential matches.",
  };
}

export type { SearchResult };
