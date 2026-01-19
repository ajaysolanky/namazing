import { z } from "zod";

export const HonorNamesSchema = z.object({
  surname: z.string().optional(),
  siblings: z.array(z.string()).optional(),
  honor_names: z.array(z.string()).optional(),
  special_initials_include: z.array(z.string()).optional(),
  special_initials_avoid: z.array(z.string()).optional(),
});

export const PreferencesSchema = z.object({
  style_lanes: z.array(z.string()).optional(),
  avoid_endings: z.array(z.string()).optional(),
  nickname_tolerance: z.enum(["low", "medium", "high"]).optional(),
  length_pref: z.enum(["short", "short-to-medium", "any"]).optional(),
  cultural_bounds: z.array(z.string()).optional(),
  frozen_callback: z.boolean().optional(),
});

export const VetoSchema = z.object({
  hard: z.array(z.string()).optional(),
  soft: z.array(z.string()).optional(),
});

export const SessionProfileSchema = z.object({
  raw_brief: z.string(),
  family: HonorNamesSchema.optional(),
  preferences: PreferencesSchema.optional(),
  themes: z.array(z.string()).optional(),
  vetoes: VetoSchema.optional(),
  region: z.array(z.string()).optional(),
  target_popularity_band: z.string().nullable().optional(),
  comments: z.string().optional(),
});

const NicknameSchema = z.object({
  intended: z.array(z.string()).optional(),
  likely: z.array(z.string()).optional(),
  avoid: z.array(z.string()).optional(),
});

const PopularitySchema = z.object({
  latest_rank: z.number().nullable().optional(),
  peak_rank: z.number().nullable().optional(),
  trend_notes: z.string().optional(),
});

const NotableBearersSchema = z.object({
  positive: z.array(z.string()).optional(),
  fictional: z.array(z.string()).optional(),
  negative: z.array(z.string()).optional(),
});

const SurnameFitSchema = z.object({
  surname: z.string().optional(),
  notes: z.string(),
});

const SibsetFitSchema = z.object({
  siblings: z.array(z.string()).optional(),
  notes: z.string(),
});

const ComboSchema = z.object({
  first: z.string(),
  middle: z.string(),
  why: z.string(),
});

export const NameCardSchema = z.object({
  name: z.string(),
  ipa: z.string(),
  syllables: z.number(),
  meaning: z.string().nullable().optional(),
  origins: z.array(z.string()).nullable().optional(),
  variants: z.array(z.string()).nullable().optional(),
  nicknames: NicknameSchema.optional(),
  popularity: PopularitySchema.optional(),
  notable_bearers: NotableBearersSchema.optional(),
  cultural_notes: z.array(z.string()).optional(),
  surname_fit: SurnameFitSchema.optional(),
  sibset_fit: SibsetFitSchema.optional(),
  honor_mapping: z.array(z.string()).optional(),
  combo_suggestions: z.array(ComboSchema).optional(),
  eliminations: z.array(z.string()).optional(),
  research_log: z.array(z.string()).optional(),
});

export const ExpertSelectionSchema = z.object({
  finalists: z.array(
    z.object({
      name: z.string(),
      why: z.string(),
      combo: ComboSchema.optional(),
    })
  ),
  near_misses: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
    })
  ),
});

export const RunResultSchema = z.object({
  profile: SessionProfileSchema,
  candidates: z.array(NameCardSchema),
  selection: ExpertSelectionSchema,
  report: z.object({
    summary: z.string(),
    loved_names: z.array(z.string()).optional(),
    finalists: z.array(
      z.object({
        name: z.string(),
        why: z.string(),
        combo: ComboSchema.optional(),
      })
    ),
    combos: z.array(ComboSchema).optional(),
    tradeoffs: z.array(z.string()).optional(),
    tie_break_tips: z.array(z.string()).optional(),
  }),
});

export const ActivityEventSchema = z.union([
  z.object({ t: z.literal("activity"), runId: z.string(), agent: z.string(), msg: z.string() }),
  z.object({ t: z.literal("start"), runId: z.string(), agent: z.string(), name: z.string().optional() }),
  z.object({ t: z.literal("log"), runId: z.string(), agent: z.string(), name: z.string().optional(), msg: z.string() }),
  z.object({ t: z.literal("partial"), runId: z.string(), agent: z.string(), name: z.string().optional(), field: z.string(), value: z.unknown() }),
  z.object({ t: z.literal("done"), runId: z.string(), agent: z.string(), name: z.string().optional() }),
  z.object({ t: z.literal("result"), runId: z.string(), agent: z.string(), payload: z.unknown() }),
  z.object({ t: z.literal("error"), runId: z.string(), agent: z.string(), msg: z.string() }),
]);

export type ActivityEvent = z.infer<typeof ActivityEventSchema>;

export type RunMode = "serial" | "parallel";

export type SessionProfile = z.infer<typeof SessionProfileSchema>;
export type NameCard = z.infer<typeof NameCardSchema>;
export type ExpertSelection = z.infer<typeof ExpertSelectionSchema>;
export type RunResult = z.infer<typeof RunResultSchema>;
