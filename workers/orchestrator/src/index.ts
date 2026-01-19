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
} from "@namazing/tools";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPTS_DIR = path.resolve(__dirname, "../../../packages/prompts");

const DEFAULT_MODELS = {
  briefParser: process.env.BRIEF_PARSER_MODEL ?? "z-ai/glm-4.5-air:free",
  nameGenerator: process.env.NAME_GENERATOR_MODEL ?? "z-ai/glm-4.5-air:free",
  nameResearcher: process.env.NAME_RESEARCHER_MODEL ?? "z-ai/glm-4.5-air:free",
  expertSelector: process.env.EXPERT_SELECTOR_MODEL ?? "z-ai/glm-4.5-air:free",
  reportComposer: process.env.REPORT_COMPOSER_MODEL ?? "z-ai/glm-4.5-air:free",
};

const USE_STUBS = !process.env.OPENROUTER_API_KEY;
const DEFAULT_REGION = "US";
const MAX_SERIAL_NAMES = 24;
const CONCURRENCY = Number(process.env.AGENT_CONCURRENCY ?? "8");

type Candidate = {
  name: string;
  lane: string;
  rationale: string;
  theme_links: string[];
};

const CandidateInputSchema = z.object({
  name: z.string(),
  lane: z.string(),
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
      lane: item.lane,
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

interface CallLLMArgs {
  model: string;
  system?: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  json?: boolean;
  temperature?: number;
}

async function callLLM({ model, system, messages, json = false, temperature = 0.2 }: CallLLMArgs): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY missing. Set it to enable live agent runs.");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages,
      ],
      temperature,
      response_format: json ? { type: "json_object" } : undefined,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
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
};

async function runJsonAgent<T>({
  promptSlug,
  model,
  userInput,
  schema,
  jsonMode = true,
  temperature = 0.3,
}: JsonAgentOptions<T>): Promise<T> {
  const { system, instruction } = await loadPromptSegments(promptSlug);
  const content = `${instruction}\n\n${userInput}`.trim();
  const raw = await callLLM({
    model,
    system,
    messages: [{ role: "user", content }],
    json: jsonMode,
    temperature,
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

const SAMPLE_LANES_GIRL: Record<string, string[]> = {
  "traditional feminine": ["Eleanor", "Margot", "Vivienne", "Helena", "Clara"],
  literary: ["Isolde", "Beatrice", "Ophelia", "Rowena", "Celeste"],
  nature: ["Iris", "Willow", "Juniper", "Wren", "Marigold"],
  "modern-classic": ["Avery", "Emery", "Sloane", "Quinn", "Maren"],
  heritage: ["Liora", "Mireille", "Annelise", "Sabine", "Selene"],
};

const SAMPLE_LANES_BOY: Record<string, string[]> = {
  "classic masculine": ["James", "William", "Thomas", "Henry", "Arthur"],
  literary: ["Atticus", "Holden", "Sawyer", "Finn", "Sebastian"],
  nature: ["River", "Rowan", "Jasper", "August", "Silas"],
  "modern-classic": ["Hudson", "Asher", "Milo", "Ezra", "Julian"],
  heritage: ["Killian", "Otto", "Maddox", "Merrick", "Malcolm"],
};

const SAMPLE_LANES = SAMPLE_LANES_GIRL; // Default for backwards compat if needed

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
  const honorMatch = brief.match(/honou?r\s*names?\s*:?\s*([A-Za-z ,]+)/i);
  const initialsMatch = brief.match(/initials?\s*:?\s*([A-Z ,]+)/i);
  
  // Simple heuristic for gender
  const isBoy = /\b(boy|son|brother|male)\b/i.test(brief);
  const isGirl = /\b(girl|daughter|sister|female)\b/i.test(brief) && !isBoy;

  const siblings = siblingsMatch
    ? siblingsMatch[1]
        .split(/[,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;

  const honorNames = honorMatch
    ? honorMatch[1]
        .split(/[,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;

  const initials = initialsMatch
    ? initialsMatch[1]
        .split(/[,\s]+/)
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;

  return SessionProfileSchema.parse({
    raw_brief: brief,
    family: {
      surname: surnameMatch ? surnameMatch[1].trim() : undefined,
      siblings,
      honor_names: honorNames,
      special_initials_include: initials,
    },
    preferences: {
      style_lanes: isBoy ? Object.keys(SAMPLE_LANES_BOY) : Object.keys(SAMPLE_LANES_GIRL),
      length_pref: "short-to-medium",
      nickname_tolerance: "medium",
    },
    region: [DEFAULT_REGION],
    comments: `Stubbed profile derived heuristically. Detected gender: ${isBoy ? "boy" : "girl"}.`,
  });
}

function stubCandidates(profile?: SessionProfile): Candidate[] {
  const entries: Candidate[] = [];
  // Heuristic: check if the first lane in preferences matches a boy lane key
  const isBoy = profile?.preferences?.style_lanes?.some(lane => Object.keys(SAMPLE_LANES_BOY).includes(lane)) ?? false;
  const source = isBoy ? SAMPLE_LANES_BOY : SAMPLE_LANES_GIRL;

  Object.entries(source).forEach(([lane, names]) => {
    names.forEach((name) => {
      entries.push({
        name,
        lane,
        rationale: `${name} carries a ${lane} energy that suits the brief.`,
        theme_links: [],
      });
    });
  });
  return entries;
}

function stubCard(name: string, lane: string, profile: SessionProfile): NameCard {
  const syllables = countSyllables(name);
  const ipa = roughIPA(name);
  const honorNames = profile.family?.honor_names ?? [];
  const comboSuggestions = honourCombos(name, honorNames);

  return NameCardSchema.parse({
    name,
    ipa,
    syllables,
    meaning: `${lane} inspired meaning placeholder for ${name}.`,
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
  honor: string[]
): Array<{ first: string; middle: string; why: string }> {
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
      return profile;
    }
  }

  private async runNameGenerator(record: RunRecord, profile: SessionProfile): Promise<Candidate[]> {
    this.emit(record, {
      t: "activity",
      runId: record.id,
      agent: "generator",
      msg: "creating name lanes",
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
        const card = stubCard(candidate.name, candidate.lane, profile);
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
            note: "You have access to OpenRouter model browsing. When you need fresh facts, search the web and cite sources conversationally.",
          },
        };
        const card = await runJsonAgent<NameCard>({
          promptSlug: "researcher",
          model: DEFAULT_MODELS.nameResearcher,
          userInput: JSON.stringify(userPayload),
          schema: NameCardSchema,
          temperature: 0.4,
        });

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
        const card = stubCard(candidate.name, candidate.lane, profile);
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

      const report = {
        summary: markdown.trim().split("\n")[0] ?? markdown.trim(),
        loved_names: [],
        finalists: selection.finalists,
        combos: selection.finalists
          .map((f) => f.combo)
          .filter((combo): combo is NonNullable<typeof combo> => Boolean(combo)),
        tradeoffs: ["Review the generated markdown report for full detail."],
        tie_break_tips: ["Read the closing section of the markdown report for action items."],
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
