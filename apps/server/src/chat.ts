import type { Request, Response } from "express";
import { z } from "zod";
import { callOpenRouter } from "./openrouter.js";

const SLOT_IDS = [
  "childGender",
  "surname",
  "desiredFeel",
  "nameExamples",
  "familyContext",
  "culturalContext",
  "practicalConstraints",
  "hopes",
] as const;

const PHASES = [
  "opening",
  "collecting_core",
  "deepening_portrait",
  "synthesis_check",
  "ready",
] as const;

const USER_ACTS = [
  "opening",
  "answer",
  "partial_answer",
  "clarification_request",
  "correction",
  "factual_question",
  "preference_signal",
  "ready_signal",
  "off_topic",
] as const;

const ASSISTANT_ACTS = [
  "opening_prompt",
  "ask_core_question",
  "ask_portrait_question",
  "clarify_previous_question",
  "answer_then_continue",
  "reflect_and_confirm",
  "repair_misunderstanding",
  "summarize_ready",
] as const;

const TOPICS = [
  "childGender",
  "surname",
  "desiredFeel",
  "nameExamples",
  "familyContext",
  "culturalContext",
  "practicalConstraints",
  "hopes",
  "portrait",
  "summary",
] as const;

const QUESTION_FAMILIES = [
  "childGender",
  "surname",
  "desiredFeel",
  "nameExamples",
  "context",
  "practicalConstraints",
  "hopes",
  "portrait",
  "summary",
] as const;

type ConsultationSlotId = (typeof SLOT_IDS)[number];
type ChatPhase = (typeof PHASES)[number];
type UserAct = (typeof USER_ACTS)[number];
type AssistantAct = (typeof ASSISTANT_ACTS)[number];
type ConversationTopic = (typeof TOPICS)[number];
type QuestionFamily = (typeof QUESTION_FAMILIES)[number];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatProfile {
  childGender?: string;
  surname?: string;
  desiredFeel?: string;
  nameExamplesStatus?: string;
  likedNames?: string[];
  dislikedNames?: string[];
  familyContext?: string;
  culturalContext?: string;
  practicalConstraints?: string[];
  hopes?: string;
  portraitHighlights?: string[];
  portraitSummary?: string;
  briefSummary?: string;
  narrative?: string;
}

interface NormalizedConversationState {
  phase: ChatPhase;
  readiness: number;
  nextQuestion: string | null;
  userAct: UserAct;
  assistantAct: AssistantAct;
  pendingTopic: ConversationTopic | null;
  lastTopic: ConversationTopic | null;
  misunderstandingsInRow: number;
  missingRequired: Array<{ id: ConsultationSlotId; label: string }>;
  missingOptional: Array<{ id: ConsultationSlotId; label: string }>;
  portraitSummary: string | null;
  briefSummary: string | null;
  guidance: string;
  catchAllAsked: boolean;
  catchAllAnswered: boolean;
  recentQuestionFamilies: QuestionFamily[];
  topicAttemptCounts: Array<{ family: QuestionFamily; count: number }>;
}

interface ConversationStateInput {
  phase?: ChatPhase;
  readiness?: number;
  nextQuestion?: string | null;
  userAct?: UserAct;
  assistantAct?: AssistantAct;
  pendingTopic?: ConversationTopic | null;
  lastTopic?: ConversationTopic | null;
  misunderstandingsInRow?: number;
  missingRequired?: ConsultationSlotId[];
  missingOptional?: ConsultationSlotId[];
  portraitSummary?: string | null;
  briefSummary?: string | null;
  guidance?: string;
  catchAllAsked?: boolean;
  catchAllAnswered?: boolean;
  recentQuestionFamilies?: QuestionFamily[];
  topicAttemptCounts?: Array<{ family: QuestionFamily; count: number }>;
}

function isPortraitTopic(topic?: ConversationTopic | null): boolean {
  return (
    topic === "familyContext" ||
    topic === "culturalContext" ||
    topic === "hopes" ||
    topic === "portrait" ||
    topic === "summary"
  );
}

function questionFamilyForTopic(topic?: ConversationTopic | null): QuestionFamily | null {
  if (!topic) return null;
  if (topic === "familyContext" || topic === "culturalContext") return "context";
  return topic;
}

function normalizeQuestionFamilies(value: unknown): QuestionFamily[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string" && QUESTION_FAMILIES.includes(item as QuestionFamily)) {
      return [item as QuestionFamily];
    }
    return [];
  });
}

function normalizeTopicAttemptCounts(
  value: unknown
): Array<{ family: QuestionFamily; count: number }> {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      "family" in item &&
      typeof (item as { family?: unknown }).family === "string" &&
      QUESTION_FAMILIES.includes((item as { family: QuestionFamily }).family)
    ) {
      const count = Math.max(
        0,
        Math.min(
          9,
          Math.round(
            typeof (item as { count?: unknown }).count === "number"
              ? (item as { count: number }).count
              : 0
          )
        )
      );
      return [{ family: (item as { family: QuestionFamily }).family, count }];
    }

    return [];
  });
}

function sanitizeIncomingConversation(
  conversation?: ConversationStateInput | null
): ConversationStateInput | null {
  if (!conversation) return null;

  const next: ConversationStateInput = { ...conversation };
  const hasNextQuestion = Boolean(normalizeText(conversation.nextQuestion));
  const hasMissingRequired = Array.isArray(conversation.missingRequired)
    ? conversation.missingRequired.length > 0
    : false;
  const hasMissingOptional = Array.isArray(conversation.missingOptional)
    ? conversation.missingOptional.length > 0
    : false;
  const pendingTopic = conversation.pendingTopic ?? null;

  if (conversation.phase === "ready") {
    next.readiness = 100;
    next.nextQuestion = null;
    next.assistantAct = "summarize_ready";
    next.pendingTopic = "summary";
    next.catchAllAsked = true;
    next.catchAllAnswered = true;
    return next;
  }

  if (conversation.phase === "opening" && hasNextQuestion && conversation.assistantAct !== "opening_prompt") {
    next.assistantAct = "opening_prompt";
  }

  if (
    conversation.phase === "collecting_core" &&
    !hasMissingRequired
  ) {
    next.phase = hasMissingOptional ? "deepening_portrait" : "synthesis_check";
  }

  if (
    conversation.phase !== "synthesis_check" &&
    conversation.assistantAct === "reflect_and_confirm"
  ) {
    next.assistantAct = isPortraitTopic(pendingTopic) || !hasMissingRequired
      ? "ask_portrait_question"
      : "ask_core_question";
  }

  if (
    hasNextQuestion &&
    (conversation.assistantAct === "summarize_ready" || conversation.assistantAct === "opening_prompt")
  ) {
    next.assistantAct = isPortraitTopic(pendingTopic) || !hasMissingRequired
      ? "ask_portrait_question"
      : "ask_core_question";
  }

  if (!hasNextQuestion && conversation.phase !== "synthesis_check") {
    next.nextQuestion = buildFallbackQuestion(pendingTopic);
  }

  if (typeof conversation.readiness === "number") {
    if (next.phase === "opening") {
      next.readiness = Math.max(5, Math.min(15, Math.round(conversation.readiness)));
    } else if (next.phase === "collecting_core") {
      next.readiness = Math.max(20, Math.min(70, Math.round(conversation.readiness)));
    } else if (next.phase === "deepening_portrait") {
      next.readiness = Math.max(70, Math.min(88, Math.round(conversation.readiness)));
    } else if (next.phase === "synthesis_check") {
      next.readiness = Math.max(88, Math.min(96, Math.round(conversation.readiness)));
    }
  }

  if (next.phase !== "ready") {
    next.portraitSummary = null;
    next.briefSummary = null;
  }

  next.catchAllAsked = typeof conversation.catchAllAsked === "boolean"
    ? conversation.catchAllAsked
    : false;
  next.catchAllAnswered = typeof conversation.catchAllAnswered === "boolean"
    ? conversation.catchAllAnswered
    : false;
  next.recentQuestionFamilies = normalizeQuestionFamilies(conversation.recentQuestionFamilies);
  next.topicAttemptCounts = normalizeTopicAttemptCounts(conversation.topicAttemptCounts);

  return next;
}

function normalizeEnvString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const inner = trimmed.slice(1, -1).trim();
    return inner || undefined;
  }

  return trimmed;
}

const SLOT_LABELS: Record<ConsultationSlotId, string> = {
  childGender: "whether you're naming for a boy, a girl, or keeping it open-ended",
  surname: "your family surname",
  desiredFeel: "the feeling or personality you want the name to carry",
  nameExamples: "whether you already have any names in orbit",
  familyContext: "family context like siblings, honor names, or traditions",
  culturalContext: "heritage, languages, or communities the name should work in",
  practicalConstraints: "practical constraints like pronunciation, initials, or popularity",
  hopes: "what you hope the name will express about your child or family",
};

const TOPIC_FALLBACK_QUESTIONS: Record<ConversationTopic, string> = {
  childGender: "Are you naming for a boy, a girl, or are you keeping the brief open-ended for now?",
  surname: "What surname should I be listening against as I shape this brief?",
  desiredFeel: "What feeling matters most when someone hears the name for the first time?",
  nameExamples: "Are there any names already in orbit for you, or are you starting from a blank page?",
  familyContext: "Is there any family context I should keep in mind, like siblings, honor names, or traditions?",
  culturalContext: "Are there languages, cultures, or communities the name should feel natural in?",
  practicalConstraints: "Are there any practical watch-outs I should keep in mind, like initials, pronunciation, or popularity?",
  hopes: "What do you most want the name to communicate about your child or your family?",
  portrait: "What feels most important to get emotionally right about this name?",
  summary: "Is there anything else we should know before I lock the brief?",
};

const PROFILE_SCHEMA = z.object({
  childGender: z.string().nullable(),
  surname: z.string().nullable(),
  desiredFeel: z.string().nullable(),
  nameExamplesStatus: z.string().nullable(),
  likedNames: z.array(z.string()),
  dislikedNames: z.array(z.string()),
  familyContext: z.string().nullable(),
  culturalContext: z.string().nullable(),
  practicalConstraints: z.array(z.string()),
  hopes: z.string().nullable(),
  portraitHighlights: z.array(z.string()),
  portraitSummary: z.string().nullable(),
  briefSummary: z.string().nullable(),
  narrative: z.string().nullable(),
});

const SLOT_ID_SCHEMA = z.enum(SLOT_IDS);
const USER_ACT_SCHEMA = z.enum(USER_ACTS);
const ASSISTANT_ACT_SCHEMA = z.enum(ASSISTANT_ACTS);
const TOPIC_SCHEMA = z.enum(TOPICS);
const SLOT_REFERENCE_SCHEMA = z.union([
  SLOT_ID_SCHEMA,
  z.object({
    id: SLOT_ID_SCHEMA,
    label: z.string().optional(),
  }),
]);

const MODEL_CONVERSATION_SCHEMA = z.object({
  phase: z.enum(PHASES),
  readiness: z.number().int().min(0).max(100),
  nextQuestion: z.string().nullable(),
  userAct: USER_ACT_SCHEMA,
  assistantAct: ASSISTANT_ACT_SCHEMA,
  pendingTopic: TOPIC_SCHEMA.nullable(),
  lastTopic: TOPIC_SCHEMA.nullable(),
  misunderstandingsInRow: z.number().int().min(0).max(3),
  missingRequired: z.array(SLOT_REFERENCE_SCHEMA),
  missingOptional: z.array(SLOT_REFERENCE_SCHEMA),
  portraitSummary: z.string().nullable(),
  briefSummary: z.string().nullable(),
  guidance: z.string(),
});

const MODEL_RESPONSE_SCHEMA = z.object({
  assistantText: z.string().min(1),
  profile: PROFILE_SCHEMA,
  conversation: MODEL_CONVERSATION_SCHEMA,
});

type ModelResponse = z.infer<typeof MODEL_RESPONSE_SCHEMA>;

const PHASE_ALIASES: Record<string, ChatPhase> = {
  collecting_optional: "deepening_portrait",
  collecting_family: "deepening_portrait",
  collecting_context: "deepening_portrait",
  collecting_constraints: "deepening_portrait",
  deepening_hopes: "deepening_portrait",
  deepening_family: "deepening_portrait",
  deepening_context: "deepening_portrait",
  clarifying: "synthesis_check",
  summarizing: "synthesis_check",
  complete: "ready",
};

const ASSISTANT_ACT_ALIASES: Record<string, AssistantAct> = {
  ask_optional_question: "ask_portrait_question",
  ask_followup_question: "ask_portrait_question",
  clarify_question: "clarify_previous_question",
  answer_question_then_continue: "answer_then_continue",
  summarize_brief: "summarize_ready",
};

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  for (const item of value) {
    const normalized = normalizeText(item);
    if (normalized) unique.add(normalized);
  }
  return [...unique];
}

function normalizeProfile(profile?: Partial<ChatProfile> | null): ChatProfile {
  return {
    childGender: normalizeText(profile?.childGender),
    surname: normalizeText(profile?.surname),
    desiredFeel: normalizeText(profile?.desiredFeel),
    nameExamplesStatus: normalizeText(profile?.nameExamplesStatus),
    likedNames: normalizeList(profile?.likedNames),
    dislikedNames: normalizeList(profile?.dislikedNames),
    familyContext: normalizeText(profile?.familyContext),
    culturalContext: normalizeText(profile?.culturalContext),
    practicalConstraints: normalizeList(profile?.practicalConstraints),
    hopes: normalizeText(profile?.hopes),
    portraitHighlights: normalizeList(profile?.portraitHighlights),
    portraitSummary: normalizeText(profile?.portraitSummary),
    briefSummary: normalizeText(profile?.briefSummary),
    narrative: normalizeText(profile?.narrative),
  };
}

function normalizeConversation(input: ModelResponse["conversation"]): NormalizedConversationState {
  const toSlot = (value: z.infer<typeof SLOT_REFERENCE_SCHEMA>) => {
    const id = typeof value === "string" ? value : value.id;
    return { id, label: SLOT_LABELS[id] };
  };

  return {
    phase: input.phase,
    readiness: Math.max(0, Math.min(100, input.readiness)),
    nextQuestion:
      input.phase === "ready"
        ? null
        : input.nextQuestion === null
          ? null
          : normalizeText(input.nextQuestion) ?? null,
    userAct: input.userAct,
    assistantAct: input.phase === "ready" ? "summarize_ready" : input.assistantAct,
    pendingTopic: input.pendingTopic,
    lastTopic: input.lastTopic,
    misunderstandingsInRow: Math.max(0, Math.min(3, input.misunderstandingsInRow)),
    missingRequired: input.missingRequired.map(toSlot),
    missingOptional: input.missingOptional.map(toSlot),
    portraitSummary:
      input.phase === "ready"
        ? normalizeText(input.portraitSummary) ?? null
        : null,
    briefSummary:
      input.phase === "ready"
        ? normalizeText(input.briefSummary) ?? null
        : null,
    guidance: normalizeText(input.guidance) ?? "",
    catchAllAsked: input.phase === "ready" ? true : false,
    catchAllAnswered: input.phase === "ready" ? true : false,
    recentQuestionFamilies: [],
    topicAttemptCounts: [],
  };
}

function buildProfileContext(profile: ChatProfile): string {
  return JSON.stringify(
    {
      childGender: profile.childGender ?? null,
      surname: profile.surname ?? null,
      desiredFeel: profile.desiredFeel ?? null,
      nameExamplesStatus: profile.nameExamplesStatus ?? null,
      likedNames: profile.likedNames ?? [],
      dislikedNames: profile.dislikedNames ?? [],
      familyContext: profile.familyContext ?? null,
      culturalContext: profile.culturalContext ?? null,
      practicalConstraints: profile.practicalConstraints ?? [],
      hopes: profile.hopes ?? null,
      portraitHighlights: profile.portraitHighlights ?? [],
      portraitSummary: profile.portraitSummary ?? null,
      briefSummary: profile.briefSummary ?? null,
      narrative: profile.narrative ?? null,
    },
    null,
    2
  );
}

function buildConversationContext(conversation?: ConversationStateInput | null): string {
  if (!conversation) return "null";

  return JSON.stringify(
    {
      phase: conversation.phase ?? null,
      readiness: conversation.readiness ?? null,
      nextQuestion: conversation.nextQuestion ?? null,
      userAct: conversation.userAct ?? null,
      assistantAct: conversation.assistantAct ?? null,
      pendingTopic: conversation.pendingTopic ?? null,
      lastTopic: conversation.lastTopic ?? null,
      misunderstandingsInRow: conversation.misunderstandingsInRow ?? null,
      missingRequired: conversation.missingRequired ?? [],
      missingOptional: conversation.missingOptional ?? [],
      portraitSummary: conversation.portraitSummary ?? null,
      briefSummary: conversation.briefSummary ?? null,
      guidance: conversation.guidance ?? null,
      catchAllAsked: conversation.catchAllAsked ?? false,
      catchAllAnswered: conversation.catchAllAnswered ?? false,
      recentQuestionFamilies: conversation.recentQuestionFamilies ?? [],
      topicAttemptCounts: conversation.topicAttemptCounts ?? [],
    },
    null,
    2
  );
}

function buildTranscript(messages: ChatMessage[]): string {
  const MAX_MESSAGES = 12;
  const windowed = messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages;
  const prefix =
    messages.length > MAX_MESSAGES
      ? `[Transcript truncated to last ${MAX_MESSAGES} messages out of ${messages.length} total]\n`
      : "";

  return prefix + windowed
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");
}

function buildRecentAssistantQuestions(messages: ChatMessage[]): string {
  const recent = messages
    .filter((message) => message.role === "assistant")
    .map((message) => normalizeText(message.content))
    .filter((content): content is string => typeof content === "string" && content.includes("?"))
    .slice(-4);

  return recent.length > 0 ? recent.join("\n- ").replace(/^/, "- ") : "- none";
}

function buildRecentAssistantOpenings(messages: ChatMessage[]): string {
  const recent = messages
    .filter((message) => message.role === "assistant")
    .map((message) => normalizeText(message.content))
    .filter((content): content is string => Boolean(content))
    .slice(-4)
    .map((content) => content.split(/\s+/).slice(0, 5).join(" "));

  return recent.length > 0 ? recent.map((opening) => `- ${opening}`).join("\n") : "- none";
}

function getLatestUserMessage(messages: ChatMessage[]): string {
  const latest = [...messages].reverse().find((message) => message.role === "user");
  return latest?.content ?? "";
}

function getLatestAssistantMessage(messages: ChatMessage[]): string {
  const latest = [...messages].reverse().find((message) => message.role === "assistant");
  return latest?.content ?? "";
}

function buildSummaryAnchors(profile: ChatProfile): string {
  const anchors: string[] = [];

  if (profile.childGender) anchors.push(`child gender or stance: ${profile.childGender}`);
  if (profile.surname) anchors.push(`surname: ${profile.surname}`);
  if (profile.desiredFeel) anchors.push(`desired feel: ${profile.desiredFeel}`);
  if (profile.nameExamplesStatus) anchors.push(`names-in-orbit status: ${profile.nameExamplesStatus}`);
  if ((profile.likedNames?.length ?? 0) > 0) {
    anchors.push(`liked names: ${profile.likedNames?.join(", ")}`);
  }
  if ((profile.dislikedNames?.length ?? 0) > 0) {
    anchors.push(`disliked names or avoids: ${profile.dislikedNames?.join(", ")}`);
  }
  if (profile.familyContext) anchors.push(`family context: ${profile.familyContext}`);
  if (profile.culturalContext) anchors.push(`cultural or language context: ${profile.culturalContext}`);
  if ((profile.practicalConstraints?.length ?? 0) > 0) {
    anchors.push(`practical constraints: ${profile.practicalConstraints?.join(", ")}`);
  }
  if (profile.hopes) anchors.push(`hopes: ${profile.hopes}`);

  return anchors.length > 0 ? anchors.map((anchor) => `- ${anchor}`).join("\n") : "- none yet";
}

function buildReadyChecklist(profile: ChatProfile): string {
  const checklist = [
    `child gender / stance known: ${profile.childGender ? "yes" : "no"}`,
    `surname known: ${profile.surname ? "yes" : "no"}`,
    `desired feel known: ${profile.desiredFeel ? "yes" : "no"}`,
    `has preference anchors: ${hasPreferenceAnchors(profile) ? "yes" : "no"}`,
    `names-in-orbit status known: ${profile.nameExamplesStatus ? "yes" : "no"}`,
    `family context known: ${profile.familyContext ? "yes" : "no"}`,
    `cultural context known: ${profile.culturalContext ? "yes" : "no"}`,
    `practical constraints known: ${(profile.practicalConstraints?.length ?? 0) > 0 ? "yes" : "no"}`,
    `hopes known: ${profile.hopes ? "yes" : "no"}`,
    `has essential anchor: ${hasEssentialAnchor(profile) ? "yes" : "no"}`,
    `has contextual anchor: ${hasContextAnchor(profile) ? "yes" : "no"}`,
    `has portrait anchor: ${hasPortraitAnchor(profile) ? "yes" : "no"}`,
  ];

  return checklist.map((item) => `- ${item}`).join("\n");
}

function listToPhrase(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildFallbackPortraitSummary(profile: ChatProfile): string {
  const anchors: string[] = [];
  if (profile.familyContext) anchors.push(profile.familyContext);
  if (profile.culturalContext) anchors.push(profile.culturalContext);
  if (profile.hopes) anchors.push(profile.hopes);
  if ((profile.likedNames?.length ?? 0) > 0) anchors.push(`the pull toward ${listToPhrase(profile.likedNames ?? [])}`);

  const opening = profile.surname
    ? `You're shaping a ${profile.surname} brief that wants to feel ${profile.desiredFeel ?? "clear and grounded"}.`
    : `You're shaping a brief that wants to feel ${profile.desiredFeel ?? "clear and grounded"}.`;

  const detail = anchors.length > 0
    ? `What stands out is ${listToPhrase(anchors.slice(0, 3))}.`
    : "You want something that feels specific to your family rather than generic.";

  return `${opening} ${detail}`.trim();
}

function buildFallbackBriefSummary(profile: ChatProfile): string {
  const clauses: string[] = [];
  if (profile.surname) clauses.push(`Prioritize names that sound convincing with ${profile.surname}.`);
  else clauses.push("Prioritize names that hold together in everyday use.");
  if (profile.desiredFeel) clauses.push(`Keep the overall feel ${profile.desiredFeel}.`);
  if (profile.culturalContext) clauses.push(`Keep ${profile.culturalContext} in play.`);
  if (profile.familyContext) clauses.push(`Respect ${profile.familyContext}.`);
  if ((profile.practicalConstraints?.length ?? 0) > 0) {
    clauses.push(`Watch for ${listToPhrase(profile.practicalConstraints ?? [])}.`);
  }
  if ((profile.likedNames?.length ?? 0) > 0 || (profile.dislikedNames?.length ?? 0) > 0) {
    const parts = [
      (profile.likedNames?.length ?? 0) > 0 ? `build around ${listToPhrase(profile.likedNames ?? [])}` : "",
      (profile.dislikedNames?.length ?? 0) > 0 ? `avoid the feel of ${listToPhrase(profile.dislikedNames ?? [])}` : "",
    ].filter(Boolean);
    if (parts.length > 0) clauses.push(`${parts.join(" while also ")}.`);
  } else if (profile.nameExamplesStatus) {
    clauses.push(`Treat the brief as ${profile.nameExamplesStatus}.`);
  }

  return clauses.join(" ").trim();
}

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s']/g, " ");
}

function extractLastQuestion(text?: string | null): string | undefined {
  const normalized = normalizeText(text);
  if (!normalized || !normalized.includes("?")) return undefined;
  const matches = normalized.match(/[^?]*\?/g);
  if (!matches || matches.length === 0) return undefined;
  return matches[matches.length - 1]?.trim();
}

function normalizeQuestionForComparison(value?: string | null): string | undefined {
  const normalized = normalizeText(value);
  if (!normalized) return undefined;
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueNonTrivialTokens(value: string): string[] {
  const stopWords = new Set([
    "the",
    "and",
    "with",
    "that",
    "this",
    "from",
    "into",
    "your",
    "they",
    "them",
    "their",
    "name",
    "names",
    "want",
    "wants",
    "looking",
    "something",
    "family",
    "works",
    "would",
    "should",
    "avoid",
    "easy",
    "more",
    "feel",
    "feels",
  ]);

  return [...new Set(
    normalizeForMatch(value)
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !stopWords.has(token))
  )];
}

function portraitMentionsConcreteAnchor(profile: ChatProfile, portraitSummary?: string): boolean {
  const summary = normalizeText(portraitSummary);
  if (!summary) return false;

  const normalizedSummary = normalizeForMatch(summary);
  const exactAnchors = [
    profile.surname,
    ...(profile.likedNames ?? []),
    ...(profile.dislikedNames ?? []),
  ]
    .map((value) => normalizeText(value))
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizeForMatch(value));

  if (exactAnchors.some((anchor) => anchor && normalizedSummary.includes(anchor))) {
    return true;
  }

  const tokenSources = [
    profile.desiredFeel,
    profile.familyContext,
    profile.culturalContext,
    profile.hopes,
    ...(profile.practicalConstraints ?? []),
  ]
    .map((value) => normalizeText(value))
    .filter((value): value is string => Boolean(value));

  return tokenSources.some((source) =>
    uniqueNonTrivialTokens(source).some((token) => normalizedSummary.includes(token))
  );
}

function countContextSignals(profile: ChatProfile): number {
  let count = 0;
  if (profile.familyContext) count += 1;
  if (profile.culturalContext) count += 1;
  if ((profile.practicalConstraints?.length ?? 0) > 0) count += 1;
  if (profile.hopes) count += 1;
  return count;
}

function hasPreferenceAnchors(profile: ChatProfile): boolean {
  return (profile.likedNames?.length ?? 0) > 0 || (profile.dislikedNames?.length ?? 0) > 0;
}

function hasEssentialAnchor(profile: ChatProfile): boolean {
  return hasPreferenceAnchors(profile) ||
    Boolean(profile.nameExamplesStatus) ||
    (profile.practicalConstraints?.length ?? 0) > 0 ||
    Boolean(profile.hopes);
}

function hasContextAnchor(profile: ChatProfile): boolean {
  return Boolean(profile.familyContext) ||
    Boolean(profile.culturalContext) ||
    (profile.practicalConstraints?.length ?? 0) > 0;
}

function hasPortraitAnchor(profile: ChatProfile): boolean {
  return Boolean(profile.hopes) ||
    Boolean(profile.familyContext) ||
    Boolean(profile.culturalContext);
}

function qualifiesForSynthesisCheck(profile: ChatProfile): boolean {
  return Boolean(profile.childGender) &&
    Boolean(profile.surname) &&
    Boolean(profile.desiredFeel) &&
    hasEssentialAnchor(profile) &&
    hasContextAnchor(profile) &&
    hasPortraitAnchor(profile);
}

function qualifiesForReady(
  profile: ChatProfile,
  conversation?: { catchAllAsked?: boolean; catchAllAnswered?: boolean } | null
): boolean {
  return qualifiesForSynthesisCheck(profile) &&
    hasPortraitAnchor(profile) &&
    Boolean(conversation?.catchAllAsked) &&
    Boolean(conversation?.catchAllAnswered);
}

function isCatchAllQuestion(text?: string | null): boolean {
  const normalized = normalizeText(text)?.toLowerCase() ?? "";
  return normalized.includes("anything else we should know") ||
    normalized.includes("before i lock the brief") ||
    normalized.includes("before i lock this brief");
}

function inferQuestionFamily(
  text?: string | null,
  pendingTopic?: ConversationTopic | null
): QuestionFamily | null {
  const topicFamily = questionFamilyForTopic(pendingTopic);
  if (topicFamily) return topicFamily;

  const normalized = normalizeText(text)?.toLowerCase() ?? "";
  if (!normalized) return null;
  if (isCatchAllQuestion(normalized)) return "summary";
  if (normalized.includes("boy") || normalized.includes("girl") || normalized.includes("open-ended")) return "childGender";
  if (normalized.includes("surname") || normalized.includes("last name")) return "surname";
  if (normalized.includes("vibe") || normalized.includes("feeling") || normalized.includes("personality")) return "desiredFeel";
  if (normalized.includes("names in orbit") || normalized.includes("starting from a blank page") || normalized.includes("examples")) return "nameExamples";
  if (normalized.includes("siblings") || normalized.includes("traditions") || normalized.includes("heritage") || normalized.includes("languages") || normalized.includes("communities")) return "context";
  if (normalized.includes("pronunciation") || normalized.includes("initials") || normalized.includes("popularity") || normalized.includes("practical")) return "practicalConstraints";
  if (normalized.includes("hope") || normalized.includes("express")) return "hopes";
  if (normalized.includes("brief")) return "summary";
  return null;
}

function incrementTopicAttemptCounts(
  priorCounts: Array<{ family: QuestionFamily; count: number }> | undefined,
  family: QuestionFamily | null
): Array<{ family: QuestionFamily; count: number }> {
  const counts = new Map<string, number>();
  for (const item of priorCounts ?? []) {
    counts.set(item.family, item.count);
  }
  if (family) {
    counts.set(family, (counts.get(family) ?? 0) + 1);
  }
  return [...counts.entries()].map(([family, count]) => ({ family: family as QuestionFamily, count }));
}

function getTopicAttemptCount(
  counts: Array<{ family: QuestionFamily; count: number }> | undefined,
  family: QuestionFamily | null
): number {
  if (!family) return 0;
  return counts?.find((item) => item.family === family)?.count ?? 0;
}

function updateConversationMemory(
  priorConversation: ConversationStateInput | null | undefined,
  nextConversation: NormalizedConversationState,
  assistantText: string
) {
  const family = inferQuestionFamily(nextConversation.nextQuestion ?? assistantText, nextConversation.pendingTopic);
  const priorFamilies = normalizeQuestionFamilies(priorConversation?.recentQuestionFamilies);
  const recentQuestionFamilies = family
    ? [...priorFamilies.slice(-2), family]
    : priorFamilies.slice(-3);
  const catchAllAsked = Boolean(priorConversation?.catchAllAsked) || family === "summary" || isCatchAllQuestion(assistantText);
  const catchAllAnswered =
    Boolean(priorConversation?.catchAllAnswered) ||
    (Boolean(priorConversation?.catchAllAsked) &&
      nextConversation.userAct !== "clarification_request" &&
      nextConversation.userAct !== "correction" &&
      nextConversation.userAct !== "off_topic");

  nextConversation.recentQuestionFamilies = recentQuestionFamilies;
  nextConversation.topicAttemptCounts = incrementTopicAttemptCounts(
    priorConversation?.topicAttemptCounts,
    family
  );
  nextConversation.catchAllAsked = catchAllAsked || nextConversation.phase === "ready";
  nextConversation.catchAllAnswered = catchAllAnswered || nextConversation.phase === "ready";
}

function buildFallbackQuestion(topic: ConversationTopic | null | undefined): string {
  return TOPIC_FALLBACK_QUESTIONS[topic ?? "summary"] ?? TOPIC_FALLBACK_QUESTIONS.summary;
}

function pickNextHighValueTopic(
  profile: ChatProfile,
  conversation?: ConversationStateInput | null
): ConversationTopic {
  const recentFamilies = normalizeQuestionFamilies(conversation?.recentQuestionFamilies);
  const lastFamily = recentFamilies[recentFamilies.length - 1] ?? null;

  if (!profile.childGender) return "childGender";
  if (!profile.surname) return "surname";
  if (!profile.desiredFeel) return "desiredFeel";
  if (!hasEssentialAnchor(profile)) {
    if (!profile.nameExamplesStatus && !hasPreferenceAnchors(profile)) return "nameExamples";
    if ((profile.practicalConstraints?.length ?? 0) === 0) return "practicalConstraints";
    if (!profile.hopes) return "hopes";
  }
  if (!hasContextAnchor(profile)) {
    return lastFamily === "context" ? "hopes" : "familyContext";
  }
  if (!hasPortraitAnchor(profile)) {
    return "hopes";
  }
  return "summary";
}

function salvageStructuredResponse(
  base: ModelResponse,
  priorConversation?: ConversationStateInput | null
): ModelResponse {
  const normalizedProfile = normalizeProfile(base.profile as Partial<ChatProfile>);
  const pendingTopic =
    base.conversation.pendingTopic ??
    priorConversation?.pendingTopic ??
    priorConversation?.lastTopic ??
    "summary";

  const userAct = base.conversation.userAct;
  const needsClarification =
    userAct === "clarification_request" || userAct === "correction";
  const hasMissingRequired =
    Array.isArray(base.conversation.missingRequired) && base.conversation.missingRequired.length > 0;
  const canClose =
    qualifiesForSynthesisCheck(normalizedProfile) &&
    Boolean(priorConversation?.catchAllAsked) &&
    !needsClarification &&
    userAct !== "off_topic";
  const priorPhase = priorConversation?.phase ?? "deepening_portrait";
  const fallbackTopic = canClose ? "summary" : pickNextHighValueTopic(normalizedProfile, priorConversation);
  const assistantAct: AssistantAct = needsClarification
    ? "clarify_previous_question"
    : userAct === "factual_question"
      ? "answer_then_continue"
      : hasMissingRequired
        ? isPortraitTopic(pendingTopic) ? "ask_portrait_question" : "ask_core_question"
        : "reflect_and_confirm";

  const assistantText = needsClarification
    ? "Let me make that more concrete. I mean things like sibling names, relatives you may want to honor, or traditions you want to ignore. What applies here, if anything?"
    : userAct === "factual_question"
      ? "That can matter, but your taste still matters more than a popularity chart. Before I lock in the brief, what should I keep in mind here?"
      : canClose
        ? "Your brief is ready."
        : buildFallbackQuestion(fallbackTopic);

  return {
    assistantText,
    profile: {
      childGender: normalizedProfile.childGender ?? null,
      surname: normalizedProfile.surname ?? null,
      desiredFeel: normalizedProfile.desiredFeel ?? null,
      nameExamplesStatus: normalizedProfile.nameExamplesStatus ?? null,
      likedNames: normalizedProfile.likedNames ?? [],
      dislikedNames: normalizedProfile.dislikedNames ?? [],
      familyContext: normalizedProfile.familyContext ?? null,
      culturalContext: normalizedProfile.culturalContext ?? null,
      practicalConstraints: normalizedProfile.practicalConstraints ?? [],
      hopes: normalizedProfile.hopes ?? null,
      portraitHighlights: normalizedProfile.portraitHighlights ?? [],
      portraitSummary: canClose
        ? normalizedProfile.portraitSummary ?? buildFallbackPortraitSummary(normalizedProfile)
        : null,
      briefSummary: canClose
        ? normalizedProfile.briefSummary ?? buildFallbackBriefSummary(normalizedProfile)
        : null,
      narrative: normalizedProfile.narrative ?? null,
    },
    conversation: {
      phase: canClose
        ? "ready"
        : needsClarification || userAct === "factual_question"
        ? (priorPhase === "ready" ? "deepening_portrait" : priorPhase)
        : hasMissingRequired
          ? isPortraitTopic(pendingTopic) ? "deepening_portrait" : "collecting_core"
          : "synthesis_check",
      readiness: canClose
        ? 100
        : needsClarification
        ? Math.min(88, Math.max(priorConversation?.readiness ?? base.conversation.readiness, 30))
        : hasMissingRequired
          ? Math.min(80, Math.max(base.conversation.readiness, 35))
          : Math.min(92, Math.max(base.conversation.readiness, 84)),
      nextQuestion: canClose ? null : buildFallbackQuestion(fallbackTopic),
      userAct,
      assistantAct: canClose ? "summarize_ready" : assistantAct,
      pendingTopic: canClose ? "summary" : fallbackTopic,
      lastTopic: base.conversation.lastTopic ?? priorConversation?.lastTopic ?? pendingTopic,
      misunderstandingsInRow:
        needsClarification
          ? Math.max(1, base.conversation.misunderstandingsInRow)
          : 0,
      missingRequired: base.conversation.missingRequired,
      missingOptional: base.conversation.missingOptional,
      portraitSummary: null,
      briefSummary: null,
      guidance: hasMissingRequired
        ? "I still need one practical anchor before I can lock the brief."
        : "I have the brief mostly shaped, but I want one final clarification before I lock it in.",
    },
  };
}

function buildDeterministicRecoveryResponse(params: {
  profile: ChatProfile;
  conversation?: ConversationStateInput | null;
  messages: ChatMessage[];
}): ModelResponse {
  const profile = normalizeProfile(params.profile);
  const priorConversation = params.conversation ?? null;
  const latestUser = normalizeText(getLatestUserMessage(params.messages));
  const userAct: UserAct =
    latestUser && /\b(not sure|what do you mean|i don't follow|confused)\b/i.test(latestUser)
      ? "clarification_request"
      : "answer";
  const canClose =
    qualifiesForSynthesisCheck(profile) &&
    Boolean(priorConversation?.catchAllAsked) &&
    userAct !== "clarification_request";

  if (canClose) {
    return {
      assistantText: "Your brief is ready.",
      profile: {
        childGender: profile.childGender ?? null,
        surname: profile.surname ?? null,
        desiredFeel: profile.desiredFeel ?? null,
        nameExamplesStatus: profile.nameExamplesStatus ?? null,
        likedNames: profile.likedNames ?? [],
        dislikedNames: profile.dislikedNames ?? [],
        familyContext: profile.familyContext ?? null,
        culturalContext: profile.culturalContext ?? null,
        practicalConstraints: profile.practicalConstraints ?? [],
        hopes: profile.hopes ?? null,
        portraitHighlights: profile.portraitHighlights ?? [],
        portraitSummary: profile.portraitSummary ?? buildFallbackPortraitSummary(profile),
        briefSummary: profile.briefSummary ?? buildFallbackBriefSummary(profile),
        narrative: profile.narrative ?? null,
      },
      conversation: {
        phase: "ready",
        readiness: 100,
        nextQuestion: null,
        userAct,
        assistantAct: "summarize_ready",
        pendingTopic: "summary",
        lastTopic: priorConversation?.pendingTopic ?? "summary",
        misunderstandingsInRow: 0,
        missingRequired: [],
        missingOptional: [],
        portraitSummary: profile.portraitSummary ?? buildFallbackPortraitSummary(profile),
        briefSummary: profile.briefSummary ?? buildFallbackBriefSummary(profile),
        guidance: "I have enough to lock the brief and move into the report stage.",
      },
    };
  }

  const fallbackTopic = pickNextHighValueTopic(profile, priorConversation);
  const fallbackQuestion = userAct === "clarification_request"
    ? "Let me make that more concrete. I mean things like sibling names, relatives you may want to honor, or traditions you may want to ignore. What applies here, if anything?"
    : buildFallbackQuestion(fallbackTopic);

  return {
    assistantText: fallbackQuestion,
    profile: {
      childGender: profile.childGender ?? null,
      surname: profile.surname ?? null,
      desiredFeel: profile.desiredFeel ?? null,
      nameExamplesStatus: profile.nameExamplesStatus ?? null,
      likedNames: profile.likedNames ?? [],
      dislikedNames: profile.dislikedNames ?? [],
      familyContext: profile.familyContext ?? null,
      culturalContext: profile.culturalContext ?? null,
      practicalConstraints: profile.practicalConstraints ?? [],
      hopes: profile.hopes ?? null,
      portraitHighlights: profile.portraitHighlights ?? [],
      portraitSummary: null,
      briefSummary: null,
      narrative: profile.narrative ?? null,
    },
    conversation: {
      phase: qualifiesForSynthesisCheck(profile) ? "synthesis_check" : isPortraitTopic(fallbackTopic) ? "deepening_portrait" : "collecting_core",
      readiness: qualifiesForSynthesisCheck(profile) ? 90 : isPortraitTopic(fallbackTopic) ? 76 : 48,
      nextQuestion: userAct === "clarification_request" ? "What applies here, if anything?" : fallbackQuestion,
      userAct,
      assistantAct: userAct === "clarification_request" ? "clarify_previous_question" : isPortraitTopic(fallbackTopic) ? "ask_portrait_question" : "ask_core_question",
      pendingTopic: fallbackTopic,
      lastTopic: priorConversation?.pendingTopic ?? null,
      misunderstandingsInRow: userAct === "clarification_request" ? Math.max(1, priorConversation?.misunderstandingsInRow ?? 0) : 0,
      missingRequired: [],
      missingOptional: [],
      portraitSummary: null,
      briefSummary: null,
      guidance: "I fell back to a deterministic next question to keep the intake moving cleanly.",
    },
  };
}

function getAllowedAssistantActs(userAct: UserAct, phase: ChatPhase): AssistantAct[] {
  if (phase === "ready") return ["summarize_ready"];

  switch (userAct) {
    case "opening":
      return ["opening_prompt", "ask_core_question"];
    case "clarification_request":
      return ["clarify_previous_question", "repair_misunderstanding"];
    case "correction":
      return ["clarify_previous_question", "repair_misunderstanding", "reflect_and_confirm"];
    case "factual_question":
      return ["answer_then_continue"];
    case "ready_signal":
      return ["reflect_and_confirm", "summarize_ready", "ask_portrait_question", "ask_core_question"];
    case "preference_signal":
      return ["ask_portrait_question", "ask_core_question", "reflect_and_confirm"];
    case "partial_answer":
      return ["ask_core_question", "ask_portrait_question", "clarify_previous_question"];
    case "off_topic":
      return ["answer_then_continue", "ask_core_question", "ask_portrait_question"];
    case "answer":
    default:
      return ["ask_core_question", "ask_portrait_question", "reflect_and_confirm", "answer_then_continue"];
  }
}

function buildSystemPrompt(strict = false): string {
  return `You are the Namazing intake engine. Read the provided profile, conversation state, and transcript. Return valid JSON only.

You are both the parser and the next-turn writer. There is no regex fallback.

You are managing two things at once:
- brief state: what the report needs to know
- dialogue state: what kind of conversational move should happen next

Rules:
- Infer meaning from natural language flexibly.
- Preserve strong earlier information. Do not replace a solid field with a weaker fragment.
- Whether the child is a boy, a girl, or intentionally open-ended is a required field. If the user does not know yet or wants to keep the brief open-ended, capture that explicitly in childGender.
- "not too trendy" is a practical constraint, not the core desired feel.
- Heritage/language context should not overwrite the style/vibe field.
- Explicit example names should populate likedNames or dislikedNames when the user names them.
- Statements like "it's a boy", "we're naming a girl", "we don't know yet", or "keep it open-ended / gender-neutral" should populate childGender.
- Statements like "we like Julian and Theo" should become likedNames.
- Statements like "we haven't considered any names yet", "we're starting from scratch", or "nothing in orbit yet" should populate nameExamplesStatus.
- Statements like "not too trendy", "avoid awkward initials", or "easy in English" should become practicalConstraints.
- Statements like "older sister Clara" or "no honor names" should become familyContext.
- Language and heritage statements like "works in Korean and English" or "Spanish and Irish roots" should populate culturalContext.
- Only use these phase values: opening, collecting_core, deepening_portrait, synthesis_check, ready.
- Only use these userAct values: opening, answer, partial_answer, clarification_request, correction, factual_question, preference_signal, ready_signal, off_topic.
- Only use these assistantAct values: opening_prompt, ask_core_question, ask_portrait_question, clarify_previous_question, answer_then_continue, reflect_and_confirm, repair_misunderstanding, summarize_ready.
- Only use these topic values: childGender, surname, desiredFeel, nameExamples, familyContext, culturalContext, practicalConstraints, hopes, portrait, summary.
- Only use these slot IDs in missingRequired and missingOptional: ${SLOT_IDS.join(", ")}.
- If missingRequired is empty, do not stay in collecting_core.
- If both missingRequired and missingOptional are empty, phase must be synthesis_check or ready.
- Treat required inputs as: childGender, surname, desiredFeel, and at least one strong anchor from names-in-orbit stance, practical constraints, or hopes.
- Treat familyContext and culturalContext as strongly preferred, not absolute blockers if the brief is otherwise rich.
- If missingRequired is empty and only one optional dimension remains, prefer ready unless that missing detail is truly essential to writing a good report.
- Once you know childGender, surname, overall feel, at least one strong anchor, and at least one contextual anchor, you usually have enough to move to a final catch-all check.
- A real liked/disliked name anchor helps, but it is not mandatory if the user has explicitly said there are no names in orbit yet.
- Do not move to ready from a thin opening message that only gives childGender, surname, vibe, and one loose constraint.
- Before phase becomes ready, ask one final open-ended catch-all question in synthesis_check, such as "Is there anything else we should know before I lock the brief?".
- After the user answers that catch-all question, move to ready unless the answer reveals a meaningful new required gap.
- Use synthesis_check for that final catch-all check or one last material correction. Do not linger there.
- Never ask the final catch-all question twice unless the user explicitly asked for clarification about that question.
- Do not ask "would you like me to suggest names" unless phase is ready.
- Never provide actual name suggestions during intake. Do not output candidate names or lists of names in assistantText. Use assistantText only to ask the next question or briefly acknowledge that the brief is ready.
- If phase is not ready, assistantText must end with one clear direct question and nextQuestion must match that question exactly.
- If phase is ready, nextQuestion must be null, readiness must be 100, and both summaries must be non-null.
- If phase is ready, assistantText should be a short acknowledgement like "Your brief is ready." or "I have the shape of your brief now." Do not ask another question and do not mention generating or suggesting names in assistantText.
- Use null or [] when unknown.
- Do not re-ask information that is already clearly captured in the profile or transcript.
- If the user asks a factual follow-up, answer it briefly and then pivot to one targeted next question unless phase is ready.
- Every turn must declare both userAct and assistantAct.
- pendingTopic is the topic the assistant is currently trying to resolve.
- lastTopic is the topic the previous assistant move was primarily about.
- misunderstandingsInRow should increment only when the latest user turn shows confusion or correction; otherwise reset it to 0.
- If userAct is clarification_request or correction, do not advance to a new topic. Keep pendingTopic on the same topic you were already trying to resolve unless the user explicitly redirects you.
- If userAct is clarification_request, assistantAct must be clarify_previous_question or repair_misunderstanding.
- If userAct is correction, assistantAct must be clarify_previous_question, repair_misunderstanding, or reflect_and_confirm.
- If userAct is factual_question, assistantAct must be answer_then_continue unless phase is ready.
- If userAct is ready_signal and the brief is already rich enough, prefer synthesis_check or ready rather than asking another exploratory question.
- Before writing the next question, choose the single highest-value unresolved topic that has not already been pushed on repeatedly.
- Use recentQuestionFamilies and topicAttemptCounts from the conversation state to avoid harassing the user about the same kind of information.
- Do not ask more than two questions from the same semantic family unless the user is actively clarifying it.
- Treat negative constraints as real information:
  - "no honor names" counts as family context
  - "easy in English" counts as a practical constraint
  - "not too trendy" counts as a practical constraint
  - "no sibling constraints" still counts as family context

Conversation style:
- Sound like a sharp human consultant, not a survey or support bot.
- Avoid repetitive stems like "Could you share", "Tell me more", or "Thanks for sharing" if a more specific question is available.
- Skip filler acknowledgements after the first turn. Move quickly to the next substantive question.
- Most non-ready assistantText should be 1-2 sentences and under 45 words.
- Usually sentence 1 should briefly reflect one concrete detail you just learned.
- Sentence 2 should ask one high-leverage question that moves the brief forward.
- If the user directly answers the current question, do not repeat that same question back to them. Move forward or ask a narrower clarification only if their answer is genuinely ambiguous.
- Do not ask semantically duplicate questions across family, heritage, language, or community context. Treat those as one broader context family unless a specific sub-question is genuinely necessary.
- Treat confusion as a first-class conversational event, not as a failure to fill another slot.
- If the user says they are confused or asks what you mean, explain the previous question plainly, give 2-3 examples of acceptable answers, and then re-ask that same topic in simpler language.
- If the user pushes back or corrects your framing, acknowledge the correction and update your understanding before asking anything else.
- Do not repeat the same reflection stem, the same list of liked names, or the same question topic in nearly identical wording across consecutive turns.
- Example: if you asked about siblings or family traditions and the user says "Not sure I follow", do not pivot to heritage or language. Clarify that you mean things like sibling names, relatives they may want to honor, or traditions they do not care about, then ask that same question more plainly.
- Prefer specific prompts like:
  - "When you say classic, do you mean dignified, literary, or quietly traditional?"
  - "Between heritage and ease in English, which matters more if you have to trade off?"
  - "What have you liked so far that came close but not quite?"
  - "Is this name meant to feel warm, serious, luminous, or steady?"
- Do not use the same question stem repeatedly across turns.

Summary style:
- portraitSummary should sound like you genuinely understand the family's taste, background, tensions, and hopes.
- portraitSummary should read like an observant editorial reflection, not a form summary.
- portraitSummary should be 2-4 sentences, concrete, specific to the transcript, and written in plain prose.
- portraitSummary should be written in second person, speaking back to the user as "you".
- Start with "You" or "You're", not "The family", "They", or "This family".
- Vary the opening cadence. Do not default to "You seem drawn to" or "Your profile paints a picture of" every time.
- Mention at least two concrete anchors from the transcript when they exist, such as a liked name, sibling, heritage, language context, or explicit constraint.
- Make the first sentence feel like a perceptive read on their taste or family identity, not a data recap.
- Use one sentence to name the core aesthetic and one sentence to name the most important tradeoff or real-world constraint.
- Prefer precise words like "quietly confident", "carries culture lightly", "warm without being precious", or "rooted but easy to live with" over vague phrases like "meaningful and special".
- Start with what kind of family they seem to be or what kind of taste they have, not with generic phrasing like "The family seeks".
- Do not begin portraitSummary with stock phrases like "The family seeks", "They want", or "The user wants".
- Do not write portraitSummary like a checklist, intake recap, or slot dump.
- Name the emotional tradeoff if one is present, such as heritage vs ease, classic vs fresh, warmth vs gravity.
- portraitSummary may include one careful inference, but only if it is clearly grounded in what the user said.
- briefSummary should sound like precise instructions for the report composer.
- briefSummary should be 2-4 sentences, practical, and include the key positive anchors, constraints, sibling/family context, and language/cultural context.
- briefSummary should be written as direct editorial instructions, e.g. "Prioritize..." or "Look for...", not as vague commentary.
- Avoid generic phrases like "the family wants a name" when a more specific formulation is possible.
- If the brief is already rich and complete, prefer ready over lingering in synthesis_check.

Good portraitSummary example:
- "You seem drawn to names that feel rooted and articulate rather than fashionable for a season. With Clara already in the family and Spanish and Irish roots in the mix, you want something that carries culture lightly and still feels easy in English. The pull toward Julian and Theo suggests you like names with quiet structure, warmth, and confidence."

Good briefSummary example:
- "Prioritize classic, literary options that sit naturally with Romero, echo the clarity of Julian and Theo, and avoid trendy spikes in feel. Keep Spanish and Irish resonance in play, make sure the name is easy in English, and check that it pairs gracefully with Clara."

Bad portraitSummary example:
- "The family wants a meaningful name that reflects their culture and values. They care about heritage, sibling fit, and ease of use."

When deciding whether phase should be ready:
- If childGender, surname, overall feel, one strong anchor, and one contextual anchor are known, you usually have enough to ask the final catch-all question.
- You do not need an actual liked/disliked list if the user has explicitly said there are no names in orbit yet.
- You should still gather at least one portrait or emotional anchor before ready, such as hopes, a family dynamic, or a clear emotional tradeoff.
- Do not keep interviewing just because one optional detail is still blank.
- Move to synthesis_check for that final catch-all question or when one final correction would materially improve the report.
- Move to ready once that catch-all question has been asked and answered and the summaries can be specific and grounded.

Use exactly this JSON shape:
{
  "assistantText": "string",
  "profile": {
    "childGender": "string or null",
    "surname": "string or null",
    "desiredFeel": "string or null",
    "nameExamplesStatus": "string or null",
    "likedNames": ["string"],
    "dislikedNames": ["string"],
    "familyContext": "string or null",
    "culturalContext": "string or null",
    "practicalConstraints": ["string"],
    "hopes": "string or null",
    "portraitHighlights": ["string"],
    "portraitSummary": "string or null",
    "briefSummary": "string or null",
    "narrative": "string or null"
  },
  "conversation": {
    "phase": "opening | collecting_core | deepening_portrait | synthesis_check | ready",
    "readiness": 0,
    "nextQuestion": "string or null",
    "userAct": "opening | answer | partial_answer | clarification_request | correction | factual_question | preference_signal | ready_signal | off_topic",
    "assistantAct": "opening_prompt | ask_core_question | ask_portrait_question | clarify_previous_question | answer_then_continue | reflect_and_confirm | repair_misunderstanding | summarize_ready",
    "pendingTopic": "childGender | surname | desiredFeel | nameExamples | familyContext | culturalContext | practicalConstraints | hopes | portrait | summary | null",
    "lastTopic": "childGender | surname | desiredFeel | nameExamples | familyContext | culturalContext | practicalConstraints | hopes | portrait | summary | null",
    "misunderstandingsInRow": 0,
    "missingRequired": ["childGender"],
    "missingOptional": ["familyContext"],
    "portraitSummary": "string or null",
    "briefSummary": "string or null",
    "guidance": "string"
  }
}

Readiness guidance:
- opening: 5-15
- collecting_core: 20-70
- deepening_portrait: 70-88
- synthesis_check: 88-96
- ready: 100

${strict ? "This is a strict retry. Every required field in the JSON shape must be present." : "Return JSON only."}`;
}

function buildAnalysisPrompt(profile: ChatProfile, conversation?: ConversationStateInput | null, messages: ChatMessage[] = []): string {
  return [
    "Read the following transcript and return the complete updated JSON state.",
    "",
    "Current known profile:",
    buildProfileContext(profile),
    "",
    "Current conversation state:",
    buildConversationContext(conversation),
    "",
    "Concrete anchors available for the summaries when present:",
    buildSummaryAnchors(profile),
    "",
    "Current readiness checklist:",
    buildReadyChecklist(profile),
    "",
    "Latest user turn:",
    getLatestUserMessage(messages) || "(none)",
    "",
    "Latest assistant turn:",
    getLatestAssistantMessage(messages) || "(none)",
    "",
    "Recent assistant questions to avoid repeating verbatim:",
    buildRecentAssistantQuestions(messages),
    "",
    "Recent assistant openings to avoid repeating stylistically:",
    buildRecentAssistantOpenings(messages),
    "",
    "Transcript:",
    buildTranscript(messages),
  ].join("\n");
}

function buildRepairPrompt(): string {
  return `You are repairing a failed JSON response for an intake-chat state machine.

Rules:
- Return valid JSON only.
- Use the exact schema requested.
- Ground every field in the transcript and prior known profile/context.
- Do not invent new facts.
- If something is unknown, use null or [].
- If phase is not "ready", nextQuestion must be a concrete direct question.
- If phase is "ready", nextQuestion must be null and both summaries must be present.
- Preserve dialogue-state consistency: userAct, assistantAct, pendingTopic, and lastTopic should make sense together.
- Preserve strong earlier information rather than overwriting it with weaker fragments.`;
}

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseStructuredResponse(raw: string): ModelResponse | null {
  try {
    const parsed = JSON.parse(stripCodeFences(raw));
    if (
      parsed &&
      typeof parsed === "object" &&
      "conversation" in parsed &&
      parsed.conversation &&
      typeof parsed.conversation === "object" &&
      "assistantAct" in parsed.conversation &&
      typeof parsed.conversation.assistantAct === "string" &&
      parsed.conversation.assistantAct in ASSISTANT_ACT_ALIASES
    ) {
      parsed.conversation.assistantAct =
        ASSISTANT_ACT_ALIASES[parsed.conversation.assistantAct as keyof typeof ASSISTANT_ACT_ALIASES];
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      "conversation" in parsed &&
      parsed.conversation &&
      typeof parsed.conversation === "object" &&
      "phase" in parsed.conversation &&
      typeof parsed.conversation.phase === "string" &&
      parsed.conversation.phase in PHASE_ALIASES
    ) {
      parsed.conversation.phase =
        PHASE_ALIASES[parsed.conversation.phase as keyof typeof PHASE_ALIASES];
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      "conversation" in parsed &&
      parsed.conversation &&
      typeof parsed.conversation === "object" &&
      parsed.conversation.phase === "ready"
    ) {
      parsed.conversation.readiness = 100;
      parsed.conversation.nextQuestion = null;
      parsed.conversation.assistantAct = "summarize_ready";
      parsed.conversation.pendingTopic = "summary";
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      "assistantText" in parsed &&
      typeof parsed.assistantText === "string" &&
      "conversation" in parsed &&
      parsed.conversation &&
      typeof parsed.conversation === "object" &&
      parsed.conversation.phase !== "ready"
    ) {
      const extractedQuestion = extractLastQuestion(parsed.assistantText);
      if (extractedQuestion) {
        parsed.conversation.nextQuestion = extractedQuestion;
      }
    }
    const result = MODEL_RESPONSE_SCHEMA.safeParse(parsed);
    if (!result.success) {
      console.warn("[chat] Structured response validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch (error) {
    const preview = stripCodeFences(raw).slice(0, 600).replace(/\s+/g, " ");
    console.warn("[chat] Failed to parse structured response:", error);
    console.warn(`[chat] Raw preview (${raw.length} chars): ${preview}`);
    return null;
  }
}

function getStructuredResponseIssue(
  result: ModelResponse,
  priorConversation?: ConversationStateInput | null
): string | null {
  const normalizedProfile = normalizeProfile(result.profile as Partial<ChatProfile>);
  const assistantText = normalizeText(result.assistantText);
  const nextQuestion = normalizeText(result.conversation.nextQuestion);
  const portraitSummary = normalizeText(result.conversation.portraitSummary);
  const briefSummary = normalizeText(result.conversation.briefSummary);
  const hasMissingRequired = result.conversation.missingRequired.length > 0;
  const hasMissingOptional = result.conversation.missingOptional.length > 0;
  const missingRequiredIds = new Set(result.conversation.missingRequired.map((slot) => typeof slot === "string" ? slot : slot.id));
  const suggestionQuestion = /would you like me to (?:suggest|share|provide)/i.test(
    assistantText ?? ""
  );
  const questionMarks = (assistantText?.match(/\?/g) ?? []).length;
  const providesNamesInline = /\b(?:here are|some options|possible names|a shortlist|name ideas|i suggest)\b/i.test(
    assistantText ?? ""
  );
  const genericPortraitOpening = /^(?:the family seeks|they want|the user wants)\b/i.test(
    portraitSummary ?? ""
  );
  const invalidPortraitOpening = !/^(?:you(?:'re|\b)|your\b)/i.test(portraitSummary ?? "");
  const checklistPortrait = /\b(?:the family|this family|they want|the user|meaningful and special|reflects their values)\b/i.test(
    portraitSummary ?? ""
  );
  const needsConcretePortraitAnchor =
    Boolean(normalizedProfile.surname) ||
    (normalizedProfile.likedNames?.length ?? 0) > 0 ||
    (normalizedProfile.dislikedNames?.length ?? 0) > 0 ||
    Boolean(normalizedProfile.familyContext) ||
    Boolean(normalizedProfile.culturalContext) ||
    (normalizedProfile.practicalConstraints?.length ?? 0) > 0 ||
    Boolean(normalizedProfile.hopes);
  const hasPreferenceAnchor = hasPreferenceAnchors(normalizedProfile);
  const hasRequiredAnchor = hasEssentialAnchor(normalizedProfile);
  const hasContextualAnchor = hasContextAnchor(normalizedProfile);
  const hasEmotionalAnchor = hasPortraitAnchor(normalizedProfile);
  const allowedAssistantActs = getAllowedAssistantActs(
    result.conversation.userAct,
    result.conversation.phase
  );
  const priorPendingTopic = priorConversation?.pendingTopic ?? null;
  const priorLastTopic = priorConversation?.lastTopic ?? null;
  const priorCatchAllAsked = Boolean(priorConversation?.catchAllAsked);
  const richOpeningAnchor =
    hasPreferenceAnchor ||
    Boolean(normalizedProfile.familyContext) ||
    Boolean(normalizedProfile.hopes);
  const catchAllAnsweredThisTurn =
    priorCatchAllAsked &&
    result.conversation.userAct !== "clarification_request" &&
    result.conversation.userAct !== "correction" &&
    result.conversation.userAct !== "off_topic";
  const priorQuestion = normalizeQuestionForComparison(priorConversation?.nextQuestion ?? null);
  const currentQuestion =
    normalizeQuestionForComparison(nextQuestion) ??
    normalizeQuestionForComparison(extractLastQuestion(assistantText));
  const priorQuestionFamily = inferQuestionFamily(priorConversation?.nextQuestion ?? null, priorPendingTopic);
  const currentQuestionFamily = inferQuestionFamily(nextQuestion ?? assistantText, result.conversation.pendingTopic);
  const priorRecentFamilies = normalizeQuestionFamilies(priorConversation?.recentQuestionFamilies);
  const priorTopicAttemptCounts = normalizeTopicAttemptCounts(priorConversation?.topicAttemptCounts);
  const directiveBriefOpening = /^(?:prioritize|look for|build around|favor|compose)\b/i.test(
    briefSummary ?? ""
  );
  const readyAssistantIsCta = /\b(?:would you like|let me know if you'd like|we'?ll proceed|generate name suggestions|suggest names now)\b/i.test(
    assistantText ?? ""
  );

  if (!assistantText) {
    return "assistantText is missing";
  }

  if (!allowedAssistantActs.includes(result.conversation.assistantAct)) {
    return "assistantAct does not match the declared userAct";
  }

  if (!normalizedProfile.childGender && !missingRequiredIds.has("childGender")) {
    return "childGender must remain in missingRequired until it is explicitly known or marked open-ended";
  }
  if (!normalizedProfile.surname && !missingRequiredIds.has("surname")) {
    return "surname must remain in missingRequired until it is known";
  }
  if (!normalizedProfile.desiredFeel && !missingRequiredIds.has("desiredFeel")) {
    return "desiredFeel must remain in missingRequired until it is known";
  }
  if (
    !hasRequiredAnchor &&
    !["nameExamples", "practicalConstraints", "hopes"].some((slotId) =>
      missingRequiredIds.has(slotId as ConsultationSlotId)
    )
  ) {
    return "one of nameExamples, practicalConstraints, or hopes must remain unresolved until a strong anchor is known";
  }

  if (result.conversation.phase === "ready") {
    if (result.conversation.readiness !== 100) {
      return "ready responses must report readiness 100";
    }
    if (nextQuestion) {
      return "ready responses must not include nextQuestion";
    }
    if (!portraitSummary || !briefSummary) {
      return "ready responses must include both summaries";
    }
    if (
      !normalizedProfile.childGender ||
      !normalizedProfile.surname ||
      !normalizedProfile.desiredFeel ||
      !hasRequiredAnchor
    ) {
      return "ready responses require child gender or an explicit open-ended stance, surname, desired feel, and at least one strong anchor";
    }
    if (!hasContextualAnchor) {
      return "ready responses require at least one contextual anchor";
    }
    if (!hasEmotionalAnchor) {
      return "ready responses require at least one portrait or emotional anchor";
    }
    if (!priorCatchAllAsked || !(priorConversation?.catchAllAnswered || catchAllAnsweredThisTurn)) {
      return "ready responses must come after the final catch-all has been asked and answered";
    }
    if (genericPortraitOpening) {
      return "portraitSummary starts with a generic opening";
    }
    if (invalidPortraitOpening) {
      return "portraitSummary must speak back to the user in second person";
    }
    if (checklistPortrait) {
      return "portraitSummary sounds like a generic checklist recap";
    }
    if (needsConcretePortraitAnchor && !portraitMentionsConcreteAnchor(normalizedProfile, portraitSummary)) {
      return "portraitSummary must mention at least one concrete anchor from the profile";
    }
    if (!directiveBriefOpening) {
      return "briefSummary must start with directive editorial language like 'Prioritize' or 'Look for'";
    }
    if (questionMarks > 0 || readyAssistantIsCta) {
      return "ready assistantText must be a short acknowledgement, not a question or CTA";
    }
    if (result.conversation.assistantAct !== "summarize_ready") {
      return "ready responses must use summarize_ready";
    }
    if (
      priorConversation &&
      priorConversation.phase !== "synthesis_check" &&
      priorConversation.pendingTopic !== "summary"
    ) {
      return "ready responses must come after the final catch-all synthesis check";
    }
    return null;
  }

  if (!nextQuestion) {
    return "non-ready responses must include nextQuestion";
  }

  if (result.conversation.readiness >= 100) {
    return "non-ready responses must not report readiness 100";
  }

  if (result.conversation.assistantAct === "summarize_ready") {
    return "non-ready responses must not use summarize_ready";
  }

  if (result.conversation.phase === "collecting_core" && !hasMissingRequired) {
    return "collecting_core cannot be used when required slots are complete";
  }

  if (result.conversation.phase === "synthesis_check" && hasMissingRequired) {
    return "synthesis_check cannot be used while required slots are still missing";
  }

  if (result.conversation.phase === "synthesis_check" && !qualifiesForSynthesisCheck(normalizedProfile)) {
    return "synthesis_check requires the brief to be substantively complete first";
  }

  if (
    priorConversation?.phase === "opening" &&
    result.conversation.phase === "synthesis_check" &&
    !richOpeningAnchor
  ) {
    return "the conversation should not jump from opening to closing without richer context";
  }

  if (!hasMissingRequired && !hasMissingOptional && result.conversation.phase === "deepening_portrait") {
    return "deepening_portrait should advance once no slots are missing";
  }

  if (
    (result.conversation.userAct === "clarification_request" ||
      result.conversation.userAct === "correction") &&
    priorPendingTopic &&
    result.conversation.pendingTopic &&
    result.conversation.pendingTopic !== priorPendingTopic &&
    result.conversation.pendingTopic !== priorLastTopic
  ) {
    return "clarification and correction turns should stay on the same topic";
  }

  if (
    priorPendingTopic &&
    result.conversation.pendingTopic === priorPendingTopic &&
    priorQuestion &&
    currentQuestion &&
    priorQuestion === currentQuestion &&
    (result.conversation.userAct === "answer" ||
      result.conversation.userAct === "partial_answer" ||
      result.conversation.userAct === "preference_signal")
  ) {
    return "the assistant repeated the same question after the user answered it";
  }

  if (
    currentQuestionFamily &&
    currentQuestionFamily !== "summary" &&
    result.conversation.userAct !== "clarification_request" &&
    result.conversation.userAct !== "correction" &&
    priorRecentFamilies.at(-1) === currentQuestionFamily &&
    (result.conversation.userAct === "answer" ||
      result.conversation.userAct === "partial_answer" ||
      result.conversation.userAct === "preference_signal")
  ) {
    return "the assistant repeated the same semantic question family after the user answered it";
  }

  if (
    currentQuestionFamily &&
    currentQuestionFamily !== "summary" &&
    result.conversation.userAct !== "clarification_request" &&
    result.conversation.userAct !== "correction" &&
    getTopicAttemptCount(priorTopicAttemptCounts, currentQuestionFamily) >= 2
  ) {
    return "the assistant is pushing the same topic family too many times";
  }

  if (
    priorCatchAllAsked &&
    (priorConversation?.catchAllAnswered || catchAllAnsweredThisTurn) &&
    currentQuestionFamily === "summary" &&
    result.conversation.userAct !== "clarification_request"
  ) {
    return "the final catch-all cannot be asked twice after the user already answered it";
  }

  if (currentQuestionFamily === "summary" && result.conversation.phase !== "synthesis_check") {
    return "the final catch-all question should only be asked during synthesis_check";
  }

  if (
    priorCatchAllAsked &&
    (priorConversation?.catchAllAnswered || catchAllAnsweredThisTurn) &&
    !hasMissingRequired &&
    currentQuestionFamily !== null &&
    currentQuestionFamily !== "summary" &&
    currentQuestionFamily !== priorQuestionFamily &&
    !result.conversation.missingOptional.some((slot) => {
      const id = typeof slot === "string" ? slot : slot.id;
      return questionFamilyForTopic(id) === currentQuestionFamily;
    })
  ) {
    return "after the catch-all is answered, the assistant must either go ready or name a real remaining gap";
  }

  if (
    result.conversation.userAct !== "clarification_request" &&
    result.conversation.userAct !== "correction" &&
    result.conversation.misunderstandingsInRow > 0 &&
    priorConversation?.misunderstandingsInRow === 0
  ) {
    return "misunderstandingsInRow should reset when the user is no longer confused";
  }

  if (suggestionQuestion) {
    return "do not ask if the user wants name suggestions unless phase is ready";
  }

  if (questionMarks > 1) {
    return "assistantText should ask only one question at a time";
  }

  if (providesNamesInline) {
    return "intake assistantText must not provide candidate names inline";
  }

  return null;
}

async function requestStructuredChat(params: {
  apiKey: string;
  model: string;
  provider?: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const { apiKey, model, provider, systemPrompt, userPrompt } = params;

  return callOpenRouter({
    apiKey,
    model,
    provider,
    temperature: 0.1,
    json: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
}

async function repairStructuredChat(params: {
  apiKey: string;
  model: string;
  provider?: string;
  profile: ChatProfile;
  conversation?: ConversationStateInput | null;
  messages: ChatMessage[];
  invalidOutput: string;
  issue?: string | null;
}) {
  return requestStructuredChat({
    apiKey: params.apiKey,
    model: params.model,
    provider: params.provider,
    systemPrompt: buildRepairPrompt(),
    userPrompt: [
      "Repair this failed model output into valid JSON matching the exact Namazing schema.",
      "",
      "Current known profile:",
      buildProfileContext(params.profile),
      "",
      "Current conversation state:",
      buildConversationContext(params.conversation),
      "",
      "Issue to fix:",
      params.issue || "response was invalid",
      "",
      "Transcript:",
      buildTranscript(params.messages),
      "",
      "Invalid prior output:",
      params.invalidOutput || "(empty)",
    ].join("\n"),
  });
}

async function getStructuredResponse(params: {
  apiKey: string;
  model: string;
  provider?: string;
  profile: ChatProfile;
  conversation?: ConversationStateInput | null;
  messages: ChatMessage[];
}): Promise<ModelResponse> {
  const basePrompt = buildSystemPrompt(false);
  const firstRaw = await requestStructuredChat({
    apiKey: params.apiKey,
    model: params.model,
    provider: params.provider,
    systemPrompt: basePrompt,
    userPrompt: buildAnalysisPrompt(params.profile, params.conversation, params.messages),
  });

  const firstParsed = parseStructuredResponse(firstRaw);
  const firstIssue = firstParsed ? getStructuredResponseIssue(firstParsed, params.conversation) : "response was not valid JSON";
  if (firstParsed && !firstIssue) return firstParsed;
  if (firstIssue) {
    console.warn(`[chat] Structured response issue: ${firstIssue}`);
  }

  const secondRaw = firstParsed
    ? await requestStructuredChat({
        apiKey: params.apiKey,
        model: params.model,
        provider: params.provider,
        systemPrompt: buildSystemPrompt(true),
        userPrompt: buildAnalysisPrompt(params.profile, params.conversation, params.messages),
      })
    : await repairStructuredChat({
        apiKey: params.apiKey,
        model: params.model,
        provider: params.provider,
        profile: params.profile,
        conversation: params.conversation,
        messages: params.messages,
        invalidOutput: firstRaw,
        issue: firstIssue,
      });

  const secondParsed = parseStructuredResponse(secondRaw);
  const secondIssue = secondParsed ? getStructuredResponseIssue(secondParsed, params.conversation) : "second response was not valid JSON";
  if (secondParsed && !secondIssue) return secondParsed;
  if (secondIssue) {
    console.warn(`[chat] Second structured response issue: ${secondIssue}`);
  }

  const salvageCandidate = secondParsed ?? firstParsed;
  if (salvageCandidate) {
    console.warn("[chat] Falling back to synthesis_check recovery response");
    return salvageStructuredResponse(salvageCandidate, params.conversation);
  }

  console.warn("[chat] Falling back to deterministic recovery response");
  return buildDeterministicRecoveryResponse({
    profile: params.profile,
    conversation: params.conversation,
    messages: params.messages,
  });
}

export async function handleChat(req: Request, res: Response) {
  const { messages, profile, conversation } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[chat] OPENROUTER_API_KEY missing");
    return res.status(500).json({ error: "LLM configuration error" });
  }

  const model =
    normalizeEnvString(process.env.CHAT_STRUCTURED_MODEL) ??
    normalizeEnvString(process.env.LLM_MODEL) ??
    "openai/gpt-oss-20b";
  const provider =
    normalizeEnvString(process.env.CHAT_STRUCTURED_PROVIDER) ??
    normalizeEnvString(process.env.LLM_PROVIDER);
  const normalizedProfile = normalizeProfile(profile || {});
  const sanitizedConversation = sanitizeIncomingConversation(conversation || null);

  console.log(`[chat] Request: ${messages.length} messages, model=${model}`);
  const startTime = Date.now();

  try {
    const structured = await getStructuredResponse({
      apiKey,
      model,
      provider,
      profile: normalizedProfile,
      conversation: sanitizedConversation,
      messages: messages as ChatMessage[],
    });

    const profileUpdate = normalizeProfile(structured.profile as Partial<ChatProfile>);
    const conversationState = normalizeConversation(structured.conversation);
    let assistantText = normalizeText(structured.assistantText) ?? "Could you tell me a little more?";
    const priorMisunderstandings = typeof sanitizedConversation?.misunderstandingsInRow === "number"
      ? sanitizedConversation.misunderstandingsInRow
      : 0;
    if (
      conversationState.userAct === "clarification_request" ||
      conversationState.userAct === "correction"
    ) {
      conversationState.misunderstandingsInRow = Math.max(
        1,
        conversationState.misunderstandingsInRow,
        priorMisunderstandings + 1
      );
    } else {
      conversationState.misunderstandingsInRow = 0;
    }
    if (conversationState.phase !== "ready") {
      const extractedQuestion = extractLastQuestion(assistantText);
      if (extractedQuestion) {
        conversationState.nextQuestion = extractedQuestion;
      }
    }

    if (
      sanitizedConversation?.phase === "opening" &&
      (conversationState.phase === "synthesis_check" || conversationState.phase === "ready") &&
      !(
        hasPreferenceAnchors(profileUpdate) ||
        Boolean(profileUpdate.familyContext) ||
        Boolean(profileUpdate.hopes)
      )
    ) {
      const fallbackTopic = pickNextHighValueTopic(profileUpdate, sanitizedConversation);
      conversationState.phase = isPortraitTopic(fallbackTopic) ? "deepening_portrait" : "collecting_core";
      conversationState.readiness = Math.min(78, conversationState.readiness);
      conversationState.pendingTopic = fallbackTopic;
      conversationState.nextQuestion = buildFallbackQuestion(fallbackTopic);
      conversationState.assistantAct = isPortraitTopic(fallbackTopic) ? "ask_portrait_question" : "ask_core_question";
      assistantText = buildFallbackQuestion(fallbackTopic);
      conversationState.portraitSummary = null;
      conversationState.briefSummary = null;
    }

    updateConversationMemory(sanitizedConversation, conversationState, assistantText);

    if (
      conversationState.phase !== "ready" &&
      qualifiesForReady(profileUpdate, conversationState)
    ) {
      assistantText = "Your brief is ready.";
      conversationState.phase = "ready";
      conversationState.readiness = 100;
      conversationState.nextQuestion = null;
      conversationState.assistantAct = "summarize_ready";
      conversationState.pendingTopic = "summary";
      conversationState.catchAllAsked = true;
      conversationState.catchAllAnswered = true;
      conversationState.portraitSummary =
        normalizeText(structured.conversation.portraitSummary) ??
        profileUpdate.portraitSummary ??
        buildFallbackPortraitSummary(profileUpdate);
      conversationState.briefSummary =
        normalizeText(structured.conversation.briefSummary) ??
        profileUpdate.briefSummary ??
        buildFallbackBriefSummary(profileUpdate);
    }

    if (conversationState.phase === "ready") {
      conversationState.portraitSummary =
        conversationState.portraitSummary ??
        profileUpdate.portraitSummary ??
        buildFallbackPortraitSummary(profileUpdate);
      conversationState.briefSummary =
        conversationState.briefSummary ??
        profileUpdate.briefSummary ??
        buildFallbackBriefSummary(profileUpdate);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[chat] Structured response in ${elapsed}ms phase=${conversationState.phase}`);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ type: "content", text: assistantText })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "profile_update", data: profileUpdate })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "conversation_state", data: conversationState })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[chat] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) {
      res.status(503).json({ error: "The chat model is temporarily rate-limited. Please try again." });
      return;
    }
    res.status(502).json({ error: "Unable to produce a valid structured chat response" });
  }
}
