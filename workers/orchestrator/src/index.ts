import { EventEmitter } from "eventemitter3";
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { z } from "zod";
import fetch from "node-fetch";

import {
  ActivityEvent,
  ActivityEventSchema,
  ExpertSelection,
  ExpertSelectionSchema,
  NameCard,
  NameCardSchema,
  RunMode,
  RunResult,
  RunResultSchema,
  SessionProfile,
  SessionProfileSchema,
} from "@namazing/schemas";
import {
  countSyllables,
  roughIPA,
  scanNegAssociations,
  getPopularity,
  searchWeb,
} from "@namazing/tools";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPTS_DIR = path.resolve(__dirname, "../../../packages/prompts");

const DEFAULT_MODELS = {
  briefParser:
    process.env.BRIEF_PARSER_MODEL ??
    process.env.LLM_MODEL ??
    "z-ai/glm-4.5-air:free",
  nameGenerator:
    process.env.NAME_GENERATOR_MODEL ??
    process.env.LLM_MODEL ??
    "z-ai/glm-4.5-air:free",
  nameResearcher:
    process.env.NAME_RESEARCHER_MODEL ??
    process.env.LLM_MODEL ??
    "z-ai/glm-4.5-air:free",
  expertSelector:
    process.env.EXPERT_SELECTOR_MODEL ??
    process.env.LLM_MODEL ??
    "z-ai/glm-4.5-air:free",
  reportComposer:
    process.env.REPORT_COMPOSER_MODEL ??
    process.env.LLM_MODEL ??
    "z-ai/glm-4.5-air:free",
};

const USE_STUBS = !process.env.OPENROUTER_API_KEY;
const DEFAULT_REGION = "US";
const MAX_SERIAL_NAMES = 24;
const CONCURRENCY = Number(process.env.AGENT_CONCURRENCY ?? "8");

type Candidate = {
  name: string;
  theme: string;
  rationale: string;
  theme_links: string[];
};

const CandidateInputSchema = z.object({
  name: z.string(),
  theme: z.string(),
  rationale: z.string(),
  theme_links: z.union([z.array(z.string()), z.string()]).optional(),
});

const CandidateArraySchema = z
  .array(CandidateInputSchema)
  .min(8)
  .max(80)
  .transform((items): Candidate[] =>
    items.map((item) => ({
      name: item.name,
      theme: item.theme,
      rationale: item.rationale,
      theme_links: Array.isArray(item.theme_links)
        ? item.theme_links
        : item.theme_links
        ? [item.theme_links]
        : [],
    }))
  );

type PromptSegments = { system: string; instruction: string };

const promptCache = new Map<string, PromptSegments>();

async function loadPromptSegments(slug: string): Promise<PromptSegments> {
  if (promptCache.has(slug)) return promptCache.get(slug)!;
  const filePath = path.join(PROMPTS_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const systemMatch = raw.match(/System:\s*([\s\S]*?)\n\nInstruction:/i);
  const instructionMatch = raw.match(/Instruction:\s*([\s\S]*)$/i);
  const system = systemMatch ? systemMatch[1].trim() : "";
  const instruction = instructionMatch ? instructionMatch[1].trim() : "";
  const segments: PromptSegments = { system, instruction };
  promptCache.set(slug, segments);
  return segments;
}

interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

type Message =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

interface CallLLMArgs {
  model: string;
  system?: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  json?: boolean;
  temperature?: number;
  tools?: ToolDefinition[];
  toolExecutor?: (name: string, args: Record<string, unknown>) => Promise<string>;
  maxToolRounds?: number;
}

const BROWSER_TOOL: ToolDefinition = {
  type: "function",
  function: {
    name: "browser.run",
    description: "Search the web for information. Use this to find name meanings, origins, popularity data, and cultural context.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        topn: {
          type: "number",
          description: "Number of results to return (default 5)",
        },
      },
      required: ["query"],
    },
  },
};

async function executeDefaultTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "browser.run") {
    const query = args.query as string;
    const topn = (args.topn as number) ?? 5;
    try {
      const results = await searchWeb(query, { topK: topn });
      return JSON.stringify(results, null, 2);
    } catch (error) {
      return JSON.stringify({ error: error instanceof Error ? error.message : "Search failed" });
    }
  }
  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

async function callLLM({
  model,
  system,
  messages,
  json = false,
  temperature = 0.2,
  tools,
  toolExecutor = executeDefaultTool,
  maxToolRounds = 5,
}: CallLLMArgs): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY missing. Set it to enable live agent runs.");
  }

  const conversationMessages: Message[] = [
    ...(system ? [{ role: "system" as const, content: system }] : []),
    ...messages,
  ];

  const provider = process.env.LLM_PROVIDER;
  const providerBody = provider
    ? { provider: { order: [provider], allow_fallbacks: false } }
    : {};

  for (let round = 0; round < maxToolRounds; round++) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: conversationMessages,
        temperature,
        response_format: json ? { type: "json_object" } : undefined,
        ...(tools && tools.length > 0 ? { tools } : {}),
        ...providerBody,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter error: ${res.status} ${text}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: ToolCall[];
        };
        finish_reason?: string;
      }>;
    };

    const choice = data.choices?.[0];
    const assistantMessage = choice?.message;

    if (!assistantMessage) {
      return "";
    }

    // If there are tool calls, execute them and continue
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Filter out malformed tool calls
      const validToolCalls = assistantMessage.tool_calls.filter(
        (tc) => tc.function && tc.function.name
      );

      if (assistantMessage.tool_calls.length !== validToolCalls.length) {
        console.warn(
          `[callLLM] Dropped ${
            assistantMessage.tool_calls.length - validToolCalls.length
          } invalid tool calls`
        );
      }

      if (validToolCalls.length === 0) {
        // If we have content, we can treat this as a final response instead of a tool call
        if (assistantMessage.content) {
          return assistantMessage.content;
        }
        throw new Error("Received tool_calls but all were invalid (missing function names)");
      }

      // Add assistant message with tool calls to conversation
      conversationMessages.push({
        role: "assistant",
        content: assistantMessage.content ?? null,
        tool_calls: validToolCalls,
      });

      // Execute each tool call and add results
      for (const toolCall of validToolCalls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch {
          args = {};
        }

        const result = await toolExecutor(toolCall.function.name, args);
        conversationMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Continue the loop to get the next response
      continue;
    }

    // No tool calls, return the content
    return assistantMessage.content ?? "";
  }

  // Max rounds reached
  throw new Error(`Max tool rounds (${maxToolRounds}) exceeded`);
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch (innerError) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

type JsonAgentOptions<T> = {
  promptSlug: string;
  model: string;
  userInput: string;
  schema: z.ZodTypeAny;
  jsonMode?: boolean;
  temperature?: number;
  enableTools?: boolean;
};

async function runJsonAgent<T>({
  promptSlug,
  model,
  userInput,
  schema,
  jsonMode = true,
  temperature = 0.3,
  enableTools = false,
}: JsonAgentOptions<T>): Promise<T> {
  const { system, instruction } = await loadPromptSegments(promptSlug);
  const content = `${instruction}\n\n${userInput}`.trim();
  const raw = await callLLM({
    model,
    system,
    messages: [{ role: "user", content }],
    json: jsonMode,
    temperature,
    tools: enableTools ? [BROWSER_TOOL] : undefined,
  });
  const parsed = extractJson(raw);
  return schema.parse(parsed) as T;
}

interface RunEmitterEvents {
  event: (payload: ActivityEvent) => void;
}

export type RunStatus = "pending" | "running" | "completed" | "failed";

export interface RunRecord {
  id: string;
  brief: string;
  mode: RunMode;
  status: RunStatus;
  events: ActivityEvent[];
  result?: RunResult;
  error?: string;
  emitter: EventEmitter<RunEmitterEvents>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldLimitCandidates(mode: RunMode) {
  return mode === "serial";
}

const SAMPLE_THEMES_GIRL: Record<string, string[]> = {
  "traditional feminine": ["Eleanor", "Margot", "Vivienne", "Helena", "Clara"],
  literary: ["Isolde", "Beatrice", "Ophelia", "Rowena", "Celeste"],
  nature: ["Iris", "Willow", "Juniper", "Wren", "Marigold"],
  "modern-classic": ["Avery", "Emery", "Sloane", "Quinn", "Maren"],
  heritage: ["Liora", "Mireille", "Annelise", "Sabine", "Selene"],
};

const SAMPLE_THEMES_BOY: Record<string, string[]> = {
  "classic masculine": ["James", "William", "Thomas", "Henry", "Arthur"],
  literary: ["Atticus", "Holden", "Sawyer", "Finn", "Sebastian"],
  nature: ["River", "Rowan", "Jasper", "August", "Silas"],
  "modern-classic": ["Hudson", "Asher", "Milo", "Ezra", "Julian"],
  heritage: ["Killian", "Otto", "Maddox", "Merrick", "Malcolm"],
};

const SAMPLE_THEMES = SAMPLE_THEMES_GIRL; // Default for backwards compat if needed

type ResearchToolsSnapshot = {
  heuristics: {
    ipaSeed: string;
    syllables: number;
  };
  popularity: Awaited<ReturnType<typeof getPopularity>>;
  associations: Awaited<ReturnType<typeof scanNegAssociations>>;
};

async function gatherResearchTools(name: string, region: string | undefined): Promise<ResearchToolsSnapshot> {
  return {
    heuristics: {
      ipaSeed: roughIPA(name),
      syllables: countSyllables(name),
    },
    popularity: await getPopularity(name, region ?? DEFAULT_REGION),
    associations: await scanNegAssociations(name),
  };
}

function stubProfile(brief: string): SessionProfile {
  const surnameMatch = brief.match(/surname\s*:?\s*([A-Za-z'-]+)/i);
  const siblingsMatch = brief.match(/siblings?\s*:?\s*([A-Za-z ,]+)/i);
  
  // Refined honor/middle detection
  // 1. Explicit label "Honor names: ..."
  const explicitHonor = brief.match(/honou?r\s*names?\s*:?\s*([A-Za-z ,]+)/i);
  // 2. Sentence extraction "middle name would be Thomas"
  const middleSentence = brief.match(/middle\s*names?\s*(?:would|should|could|is|to)\s*be\s*([A-Z][a-z]+)/);
  
  const initialsMatch = brief.match(/initials?\s*:?\s*([A-Z ,]+)/i);
  
  // Parse vetoes
  const vetoMatch = brief.match(/vetoed.*?(?:include|are|:)\s*([A-Za-z ,]+)/i);
  const myVetoMatch = brief.match(/I've\s*vetoed\s*([A-Za-z]+)/i);
  
  const vetoes: string[] = [];
  if (vetoMatch) {
    const raw = vetoMatch[1].replace(/\band\b/g, ",");
    vetoes.push(...raw.split(/[,]+/).map(s => s.trim()).filter(Boolean));
  }
  if (myVetoMatch) {
    vetoes.push(myVetoMatch[1]);
  }

  // Simple heuristic for gender
  const isBoy = /\b(boy|son|brother|male)\b/i.test(brief);
  const isGirl = /\b(girl|daughter|sister|female)\b/i.test(brief) && !isBoy;

  const siblings = siblingsMatch
    ? siblingsMatch[1]
        .split(/[,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;

  const honorNames: string[] = [];
  if (explicitHonor) {
     honorNames.push(...explicitHonor[1].split(/[,]/).map(s => s.trim()).filter(Boolean));
  }
  if (middleSentence) {
     honorNames.push(middleSentence[1]);
  }

  const initials = initialsMatch
    ? initialsMatch[1]
        .split(/[,\s]+/)
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;

  return SessionProfileSchema.parse({
    raw_brief: brief,
    gender: isBoy ? "boy" : isGirl ? "girl" : "unknown",
    family: {
      surname: surnameMatch ? surnameMatch[1].trim() : undefined,
      siblings,
      honor_names: honorNames.length ? honorNames : undefined,
      special_initials_include: initials,
    },
    preferences: {
      naming_themes: isBoy ? Object.keys(SAMPLE_THEMES_BOY) : Object.keys(SAMPLE_THEMES_GIRL),
      length_pref: "short-to-medium",
      nickname_tolerance: "medium",
    },
    vetoes: { hard: vetoes },
    region: [DEFAULT_REGION],
    comments: `Stubbed profile derived heuristically. Detected gender: ${isBoy ? "boy" : "girl"}.`,
  });
}

function stubCandidates(profile?: SessionProfile): Candidate[] {
  const entries: Candidate[] = [];
  // Use the explicit gender field from the profile
  const isBoy = profile?.gender === "boy";
  const source = isBoy ? SAMPLE_THEMES_BOY : SAMPLE_THEMES_GIRL;

  // Extract user favorites from brief
  // Matches "So far we have A, B, C..."
  const likedMatch = profile?.raw_brief.match(/(?:so\s*far\s*we\s*have)\s*:?\s*([A-Za-z ,]+)/i);
  const likedNames = new Set<string>();
  
  if (likedMatch) {
    const raw = likedMatch[1].replace(/\band\b/g, ",");
    raw.split(/[,]+/).forEach(s => {
      const clean = s.trim();
      // Ensure it looks like a name (starts with Capital, at least 2 chars)
      if (clean && /^[A-Z][a-z]+$/.test(clean)) {
        likedNames.add(clean);
      }
    });
  }

  // Add favorites first
  likedNames.forEach(name => {
      entries.push({
        name,
        theme: "user-favorite",
        rationale: "Explicitly mentioned as a contender in the brief.",
        theme_links: [],
      });
  });

  Object.entries(source).forEach(([theme, names]) => {
    names.forEach((name) => {
      if (!likedNames.has(name)) {
        entries.push({
          name,
          theme,
          rationale: `${name} carries a ${theme} energy that suits the brief.`,
          theme_links: [],
        });
      }
    });
  });
  
  const hardVetoes = profile?.vetoes?.hard ?? [];
  return entries.filter(e => !hardVetoes.includes(e.name));
}

function stubCard(name: string, theme: string, profile: SessionProfile): NameCard {
  const syllables = countSyllables(name);
  const ipa = roughIPA(name);
  const honorNames = profile.family?.honor_names ?? [];
  const middleNames = profile.family?.middle_names;
  const comboSuggestions = honourCombos(name, honorNames, profile.gender, middleNames);

  return NameCardSchema.parse({
    name,
    theme,
    ipa,
    syllables,
    meaning: `${theme} inspired meaning placeholder for ${name}.`,
    origins: ["Stub"],
    variants: [`${name}a`, `${name}e`].filter((variant) => variant !== name),
    nicknames: {
      intended: [name.slice(0, 3)],
      likely: [name.slice(0, 4)],
      avoid: [],
    },
    popularity: {
      latest_rank: null,
      peak_rank: null,
      trend_notes: "classic and steady (assumed)",
    },
    notable_bearers: {
      positive: [
        `${name} Example, pioneering artist`,
        `${name} Fictional, beloved literary heroine`,
      ],
      fictional: [`${name} from a sample novel`],
    },
    cultural_notes: [
      "Cultural context requires verification; replace with Cultural Guard agent output.",
    ],
    surname_fit: {
      surname: profile.family?.surname ?? "family surname",
      notes: `${name} shares a ${syllables}-syllable cadence with the surname, offering smooth flow.`,
    },
    sibset_fit: {
      siblings: profile.family?.siblings,
      notes:
        profile.family?.siblings?.length
          ? `${name} complements ${profile.family.siblings.join(", ")} without repeating initials.`
          : "No siblings listed; assuming flexible fit.",
    },
    honor_mapping: honorNames.map((h) => `${h} → ${name}`),
    combo_suggestions: comboSuggestions,
    eliminations: [],
    research_log: [
      "Stubbed: generated via static data.",
      "Replace with live research once agents are enabled.",
    ],
  });
}

function stubSelection(cards: NameCard[]): ExpertSelection {
  return ExpertSelectionSchema.parse({
    finalists: cards.slice(0, 8).map((card) => ({
      name: card.name,
      why: `${card.name} balances the brief with its ${card.meaning ?? "thoughtful"} tone and easy cadence with the surname.`,
      combo: card.combo_suggestions?.[0],
    })),
    near_misses: cards.slice(8, 12).map((card) => ({
      name: card.name,
      reason: `${card.name} is compelling but overlaps with another finalist in style or initial.`,
    })),
  });
}

function stubReport(profile: SessionProfile, selection: ExpertSelection): RunResult["report"] {
  const combos = selection.finalists
    .map((item) => item.combo)
    .filter((combo): combo is NonNullable<typeof combo> => Boolean(combo));

  return {
    summary: "Stub report summarising the AI studio run. Swap in Report Composer agent output once live.",
    loved_names: [],
    finalists: selection.finalists,
    combos,
    tradeoffs: [
      "Nicknames are inferred; validate with the family for preference.",
      "Popularity trends are qualitative placeholders until SSA integration lands.",
    ],
    tie_break_tips: [
      "Say each finalist aloud with the sibling set and surname.",
      "Consider monogram balance with honour initials.",
    ],
  };
}

function honourCombos(
  name: string,
  honor: string[],
  gender?: string,
  middleNames?: { boy?: string; girl?: string },
): Array<{ first: string; middle: string; why: string }> {
  // Check for a pre-selected middle name
  if (middleNames && (gender === "boy" || gender === "girl")) {
    const chosen = middleNames[gender];
    if (chosen) {
      return [
        {
          first: name,
          middle: chosen,
          why: `Pairs with your chosen middle name ${chosen}.`,
        },
      ];
    }
  }

  if (honor.length === 0) {
    return [
      {
        first: name,
        middle: "Elise",
        why: "Balances cadence with a nod to classic elegance.",
      },
      {
        first: name,
        middle: "Ren",
        why: "Honors Irene-like sounds while keeping things light.",
      },
    ];
  }

  return honor.slice(0, 3).map((source) => ({
    first: name,
    middle: source,
    why: `Directly honors ${source} while keeping rhythm gentle.`,
  }));
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  handler: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (items.length === 0) return [];
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await handler(items[index], index);
    }
  };
  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

export class OrchestratorService {
  private runs = new Map<string, RunRecord>();

  startRun(brief: string, mode: RunMode = "serial"): RunRecord {
    const id = uuid();
    const emitter = new EventEmitter<RunEmitterEvents>();
    const record: RunRecord = {
      id,
      brief,
      mode,
      status: "pending",
      events: [],
      emitter,
    };
    this.runs.set(id, record);
    void this.execute(record);
    return record;
  }

  getRun(id: string): RunRecord | undefined {
    return this.runs.get(id);
  }

  subscribe(id: string, listener: (event: ActivityEvent) => void) {
    const run = this.runs.get(id);
    if (!run) throw new Error(`Run ${id} not found`);
    run.emitter.on("event", listener);
    return () => run.emitter.off("event", listener);
  }

  private async execute(record: RunRecord) {
    record.status = "running";

    try {
      const profile = await this.runBriefParser(record, record.brief);
      const candidates = await this.runNameGenerator(record, profile);
      const cards = await this.runResearch(record, profile, candidates);
      const selection = await this.runExpertSelector(record, profile, cards);
      const report = await this.runReportComposer(record, profile, cards, selection);

      const result = RunResultSchema.parse({
        profile,
        candidates: cards,
        selection,
        report,
      });

      record.result = result;
      record.status = "completed";

      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "report-composer",
        payload: report,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "report-composer",
      });
    } catch (error) {
      record.status = "failed";
      const msg = error instanceof Error ? error.message : String(error);
      record.error = msg;
      this.emit(record, {
        t: "error",
        runId: record.id,
        agent: "orchestrator",
        msg,
      });
    }
  }

  private async runBriefParser(record: RunRecord, brief: string): Promise<SessionProfile> {
    this.emit(record, {
      t: "activity",
      runId: record.id,
      agent: "brief-parser",
      msg: "parsing brief",
    });

    if (USE_STUBS) {
      await delay(150);
      const profile = stubProfile(brief);
      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "brief-parser",
        payload: profile,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "brief-parser",
      });
      return profile;
    }

    try {
      const userInput = `Client Brief:\n${brief}\n\nRespond with JSON following SessionProfile schema.`;
      
      // Use a partial schema so the LLM doesn't have to echo the raw_brief
      const PartialProfileSchema = SessionProfileSchema.omit({ raw_brief: true });
      
      const partialProfile = await runJsonAgent<Omit<SessionProfile, "raw_brief">>({
        promptSlug: "brief-parser",
        model: DEFAULT_MODELS.briefParser,
        userInput,
        schema: PartialProfileSchema,
      });

      const profile: SessionProfile = {
        ...partialProfile,
        raw_brief: brief,
      };

      // Validate the assembled profile
      SessionProfileSchema.parse(profile);

      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "brief-parser",
        payload: profile,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "brief-parser",
      });
      return profile;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.emit(record, {
        t: "log",
        runId: record.id,
        agent: "brief-parser",
        msg: `Falling back to stubbed profile due to error: ${msg}`,
      });
      const profile = stubProfile(brief);
      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "brief-parser",
        payload: profile,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "brief-parser",
      });
      return profile;
    }
  }

  private async runNameGenerator(record: RunRecord, profile: SessionProfile): Promise<Candidate[]> {
    this.emit(record, {
      t: "activity",
      runId: record.id,
      agent: "generator",
      msg: "creating naming themes",
    });

    if (USE_STUBS) {
      await delay(150);
      const candidates = stubCandidates(profile);
      this.emit(record, {
        t: "partial",
        runId: record.id,
        agent: "generator",
        field: "candidates",
        value: candidates,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "generator",
      });
      return shouldLimitCandidates(record.mode) ? candidates.slice(0, MAX_SERIAL_NAMES) : candidates;
    }

    try {
      const userInput = `SessionProfile JSON:\n${JSON.stringify(profile, null, 2)}`;
      const candidates = await runJsonAgent<Candidate[]>({
        promptSlug: "name-generator",
        model: DEFAULT_MODELS.nameGenerator,
        userInput,
        schema: CandidateArraySchema,
        temperature: 0.6,
      });

      const limited = shouldLimitCandidates(record.mode)
        ? candidates.slice(0, MAX_SERIAL_NAMES)
        : candidates;

      this.emit(record, {
        t: "partial",
        runId: record.id,
        agent: "generator",
        field: "candidates",
        value: limited,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "generator",
      });
      return limited;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.emit(record, {
        t: "log",
        runId: record.id,
        agent: "generator",
        msg: `Falling back to stubbed candidate list due to error: ${msg}`,
      });
      const candidates = stubCandidates(profile);
      const limited = shouldLimitCandidates(record.mode)
        ? candidates.slice(0, MAX_SERIAL_NAMES)
        : candidates;
      this.emit(record, {
        t: "partial",
        runId: record.id,
        agent: "generator",
        field: "candidates",
        value: limited,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "generator",
      });
      return limited;
    }
  }

  private async runResearch(
    record: RunRecord,
    profile: SessionProfile,
    candidates: Candidate[]
  ): Promise<NameCard[]> {
    const region = profile.region?.[0] ?? DEFAULT_REGION;
    const concurrency = record.mode === "parallel" ? CONCURRENCY : 1;

    return mapWithConcurrency(candidates, concurrency, async (candidate) => {
      this.emit(record, {
        t: "start",
        runId: record.id,
        agent: "researcher",
        name: candidate.name,
      });

      if (USE_STUBS) {
        await delay(120);
        const card = stubCard(candidate.name, candidate.theme, profile);
        this.emit(record, {
          t: "partial",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
          field: "card",
          value: card,
        });
        this.emit(record, {
          t: "done",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
        });
        return card;
      }

      try {
        const tools = await gatherResearchTools(candidate.name, region);
        const userPayload = {
          sessionProfile: profile,
          candidate,
          tools,
          guidance: {
            note: "You have access to the browser.run tool for web searches. Use it to find name meanings, origins, popularity, and cultural context. Cite sources conversationally.",
          },
        };
        const rawCard = await runJsonAgent<NameCard>({
          promptSlug: "researcher",
          model: DEFAULT_MODELS.nameResearcher,
          userInput: JSON.stringify(userPayload),
          schema: NameCardSchema,
          temperature: 0.4,
          enableTools: true,
        });

        // Preserve the generator's theme on the researched card
        const card: NameCard = { ...rawCard, theme: rawCard.theme ?? candidate.theme };

        this.emit(record, {
          t: "partial",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
          field: "card",
          value: card,
        });
        this.emit(record, {
          t: "done",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
        });
        return card;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.emit(record, {
          t: "log",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
          msg: `Researcher fell back to stub data: ${msg}`,
        });
        const card = stubCard(candidate.name, candidate.theme, profile);
        this.emit(record, {
          t: "partial",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
          field: "card",
          value: card,
        });
        this.emit(record, {
          t: "done",
          runId: record.id,
          agent: "researcher",
          name: candidate.name,
        });
        return card;
      }
    });
  }

  private async runExpertSelector(
    record: RunRecord,
    profile: SessionProfile,
    cards: NameCard[]
  ): Promise<ExpertSelection> {
    this.emit(record, {
      t: "activity",
      runId: record.id,
      agent: "expert-selector",
      msg: "curating finalists",
    });

    if (USE_STUBS) {
      await delay(150);
      const selection = stubSelection(cards);
      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "expert-selector",
        payload: selection,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "expert-selector",
      });
      return selection;
    }

    try {
      const payload = {
        sessionProfile: profile,
        cards,
      };
      const selection = await runJsonAgent<ExpertSelection>({
        promptSlug: "expert-selector",
        model: DEFAULT_MODELS.expertSelector,
        userInput: JSON.stringify(payload),
        schema: ExpertSelectionSchema,
        temperature: 0.3,
      });
      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "expert-selector",
        payload: selection,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "expert-selector",
      });
      return selection;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.emit(record, {
        t: "log",
        runId: record.id,
        agent: "expert-selector",
        msg: `Falling back to stubbed shortlist due to error: ${msg}`,
      });
      const selection = stubSelection(cards);
      this.emit(record, {
        t: "result",
        runId: record.id,
        agent: "expert-selector",
        payload: selection,
      });
      this.emit(record, {
        t: "done",
        runId: record.id,
        agent: "expert-selector",
      });
      return selection;
    }
  }

  private async runReportComposer(
    record: RunRecord,
    profile: SessionProfile,
    cards: NameCard[],
    selection: ExpertSelection
  ): Promise<RunResult["report"]> {
    this.emit(record, {
      t: "activity",
      runId: record.id,
      agent: "report-composer",
      msg: "writing consultation",
    });

    if (USE_STUBS) {
      await delay(150);
      return stubReport(profile, selection);
    }

    try {
      const payload = {
        sessionProfile: profile,
        selection,
        candidates: cards,
      };
      const { system, instruction } = await loadPromptSegments("report-composer");
      const messages = [
        { role: "user" as const, content: `${instruction}\n\n${JSON.stringify(payload)}` },
      ];
      const markdown = await callLLM({
        model: DEFAULT_MODELS.reportComposer,
        system,
        messages,
        json: false,
        temperature: 0.4,
      });

      // Extract first meaningful line as summary (skip markdown headers)
      const lines = markdown.trim().split("\n").filter(Boolean);
      const summaryLine = lines.find(line => !line.startsWith("#") && line.trim().length > 10) || lines[0] || "";

      const report = {
        summary: summaryLine.replace(/^\*+|\*+$/g, "").trim(),
        markdown: markdown.trim(),
        loved_names: [],
        finalists: selection.finalists,
        combos: selection.finalists
          .map((f) => f.combo)
          .filter((combo): combo is NonNullable<typeof combo> => Boolean(combo)),
        tradeoffs: [],
        tie_break_tips: [],
      } satisfies RunResult["report"];

      return report;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.emit(record, {
        t: "log",
        runId: record.id,
        agent: "report-composer",
        msg: `Falling back to stubbed report due to error: ${msg}`,
      });
      return stubReport(profile, selection);
    }
  }

  private emit(record: RunRecord, event: ActivityEvent) {
    const safeEvent = ActivityEventSchema.parse(event);
    record.events.push(safeEvent);
    record.emitter.emit("event", safeEvent);
  }
}

export const orchestratorService = new OrchestratorService();

export type { RunMode, ActivityEvent };
