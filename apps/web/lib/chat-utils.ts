export type ChatPhase =
  | "opening"
  | "collecting_core"
  | "deepening_portrait"
  | "synthesis_check"
  | "ready";

export type UserAct =
  | "opening"
  | "answer"
  | "partial_answer"
  | "clarification_request"
  | "correction"
  | "factual_question"
  | "preference_signal"
  | "ready_signal"
  | "off_topic";

export type AssistantAct =
  | "opening_prompt"
  | "ask_core_question"
  | "ask_portrait_question"
  | "clarify_previous_question"
  | "answer_then_continue"
  | "reflect_and_confirm"
  | "repair_misunderstanding"
  | "summarize_ready";

export type ConversationTopic =
  | "childGender"
  | "surname"
  | "desiredFeel"
  | "nameExamples"
  | "familyContext"
  | "culturalContext"
  | "practicalConstraints"
  | "hopes"
  | "portrait"
  | "summary";

const PHASES: ChatPhase[] = [
  "opening",
  "collecting_core",
  "deepening_portrait",
  "synthesis_check",
  "ready",
];

export type ConsultationSlotId =
  | "childGender"
  | "surname"
  | "desiredFeel"
  | "nameExamples"
  | "familyContext"
  | "culturalContext"
  | "practicalConstraints"
  | "hopes";

export interface ConsultationSlot {
  id: ConsultationSlotId;
  label: string;
}

export interface ChatProfile {
  childGender?: string;
  surname?: string;
  desiredFeel?: string;
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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ConversationState {
  phase: ChatPhase;
  readiness: number;
  nextQuestion: string | null;
  userAct: UserAct;
  assistantAct: AssistantAct;
  pendingTopic: ConversationTopic | null;
  lastTopic: ConversationTopic | null;
  misunderstandingsInRow: number;
  missingRequired: ConsultationSlot[];
  missingOptional: ConsultationSlot[];
  portraitSummary: string | null;
  briefSummary: string | null;
  guidance: string;
}

type ConversationSlotLike = ConsultationSlot | ConsultationSlotId;

interface ConversationStateLike
  extends Omit<Partial<ConversationState>, "missingRequired" | "missingOptional"> {
  missingRequired?: ConversationSlotLike[];
  missingOptional?: ConversationSlotLike[];
}

const USER_ACTS: UserAct[] = [
  "opening",
  "answer",
  "partial_answer",
  "clarification_request",
  "correction",
  "factual_question",
  "preference_signal",
  "ready_signal",
  "off_topic",
];

const ASSISTANT_ACTS: AssistantAct[] = [
  "opening_prompt",
  "ask_core_question",
  "ask_portrait_question",
  "clarify_previous_question",
  "answer_then_continue",
  "reflect_and_confirm",
  "repair_misunderstanding",
  "summarize_ready",
];

const CONVERSATION_TOPICS: ConversationTopic[] = [
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
];

const SLOT_METADATA: Record<ConsultationSlotId, { label: string; fallbackQuestion: string }> = {
  childGender: {
    label: "whether you're naming for a boy, a girl, or keeping it open-ended",
    fallbackQuestion: "Are you naming for a boy, a girl, or are you keeping the brief open-ended for now?",
  },
  surname: {
    label: "your family surname",
    fallbackQuestion: "Before I shape the brief, what surname should I be listening against?",
  },
  desiredFeel: {
    label: "the feeling or personality you want the name to carry",
    fallbackQuestion: "What feeling do you want the name to carry when people hear it for the first time?",
  },
  nameExamples: {
    label: "a few names you love, dislike, or keep circling around",
    fallbackQuestion: "What names have come close so far, even if they are not quite right?",
  },
  familyContext: {
    label: "family context like siblings, honor names, or traditions",
    fallbackQuestion: "Is there any family context I should keep in mind, like siblings, honor names, or traditions?",
  },
  culturalContext: {
    label: "heritage, languages, or communities the name should work in",
    fallbackQuestion: "Are there languages, heritages, or communities the name should feel natural in?",
  },
  practicalConstraints: {
    label: "practical constraints like pronunciation, initials, or popularity",
    fallbackQuestion: "Are there any practical constraints I should watch for, like pronunciation, initials, or popularity?",
  },
  hopes: {
    label: "what you hope the name will express about your child or family",
    fallbackQuestion: "What do you hope this name will express about your child or your family?",
  },
};

export const CHAT_OPENING_MESSAGE =
  "Hi, I’m your Namazing naming consultant. To start, share your last name, whether you're naming for a boy, a girl, or keeping it open-ended, and one naming vibe you want (classic, literary, modern, or heritage-rich). You can answer directly or tap a starter below.";

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    const unique = new Set<string>();
    for (const item of value) {
      const normalized = normalizeText(item);
      if (normalized) unique.add(normalized);
    }
    return [...unique];
  }

  const normalized = normalizeText(value);
  return normalized ? [normalized] : [];
}

function createSlot(id: ConsultationSlotId): ConsultationSlot {
  return {
    id,
    label: SLOT_METADATA[id].label,
  };
}

function normalizeSlotArray(value: ConversationSlotLike[] | undefined): ConsultationSlot[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string" && item in SLOT_METADATA) {
      return [createSlot(item as ConsultationSlotId)];
    }

    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof item.id === "string" &&
      item.id in SLOT_METADATA
    ) {
      return [createSlot(item.id as ConsultationSlotId)];
    }

    return [];
  });
}

function hasNames(profile: ChatProfile): boolean {
  return (profile.likedNames?.length ?? 0) + (profile.dislikedNames?.length ?? 0) > 0;
}

function listToPhrase(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function normalizeProfile(profile?: Partial<ChatProfile> | null): ChatProfile {
  return {
    childGender: normalizeText(profile?.childGender),
    surname: normalizeText(profile?.surname),
    desiredFeel: normalizeText(profile?.desiredFeel),
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

export function createOpeningAssistantMessage(): ChatMessage {
  return {
    id: "msg_opening",
    role: "assistant",
    content: CHAT_OPENING_MESSAGE,
  };
}

export function createOpeningConversationState(): ConversationState {
  return {
    phase: "opening",
    readiness: 8,
    nextQuestion: "Start by sharing your surname, whether you're naming for a boy, a girl, or keeping it open-ended, and one naming vibe you keep coming back to.",
    userAct: "opening",
    assistantAct: "opening_prompt",
    pendingTopic: "childGender",
    lastTopic: null,
    misunderstandingsInRow: 0,
    missingRequired: [createSlot("childGender"), createSlot("surname"), createSlot("desiredFeel"), createSlot("nameExamples")],
    missingOptional: [
      createSlot("familyContext"),
      createSlot("culturalContext"),
      createSlot("practicalConstraints"),
      createSlot("hopes"),
    ],
    portraitSummary: null,
    briefSummary: null,
    guidance: "I’m opening the conversation and listening for the essentials.",
  };
}

export function normalizeConversationState(
  input?: ConversationStateLike | null
): ConversationState {
  const opening = createOpeningConversationState();

  if (!input) return opening;

  const phase = PHASES.includes(input.phase as ChatPhase)
    ? (input.phase as ChatPhase)
    : opening.phase;

  return {
    phase,
    readiness:
      typeof input.readiness === "number"
        ? Math.max(0, Math.min(100, Math.round(input.readiness)))
        : opening.readiness,
    nextQuestion:
      input.nextQuestion === null
        ? null
        : normalizeText(input.nextQuestion) ?? opening.nextQuestion,
    userAct: USER_ACTS.includes(input.userAct as UserAct)
      ? (input.userAct as UserAct)
      : opening.userAct,
    assistantAct: ASSISTANT_ACTS.includes(input.assistantAct as AssistantAct)
      ? (input.assistantAct as AssistantAct)
      : phase === "ready"
        ? "summarize_ready"
        : opening.assistantAct,
    pendingTopic:
      input.pendingTopic === null
        ? null
        : CONVERSATION_TOPICS.includes(input.pendingTopic as ConversationTopic)
          ? (input.pendingTopic as ConversationTopic)
          : opening.pendingTopic,
    lastTopic:
      input.lastTopic === null
        ? null
        : CONVERSATION_TOPICS.includes(input.lastTopic as ConversationTopic)
          ? (input.lastTopic as ConversationTopic)
          : opening.lastTopic,
    misunderstandingsInRow:
      typeof input.misunderstandingsInRow === "number"
        ? Math.max(0, Math.min(3, Math.round(input.misunderstandingsInRow)))
        : opening.misunderstandingsInRow,
    missingRequired: normalizeSlotArray(input.missingRequired) || opening.missingRequired,
    missingOptional: normalizeSlotArray(input.missingOptional) || opening.missingOptional,
    portraitSummary:
      input.portraitSummary === null
        ? null
        : normalizeText(input.portraitSummary) ?? null,
    briefSummary:
      input.briefSummary === null
        ? null
        : normalizeText(input.briefSummary) ?? null,
    guidance: normalizeText(input.guidance) ?? opening.guidance,
  };
}

export function mergeProfile(existing: ChatProfile, update: Partial<ChatProfile>): ChatProfile {
  const current = normalizeProfile(existing);
  const incoming = normalizeProfile(update);

  return {
    childGender: incoming.childGender ?? current.childGender,
    surname: incoming.surname ?? current.surname,
    desiredFeel: incoming.desiredFeel ?? current.desiredFeel,
    likedNames: [...new Set([...(current.likedNames ?? []), ...(incoming.likedNames ?? [])])],
    dislikedNames: [...new Set([...(current.dislikedNames ?? []), ...(incoming.dislikedNames ?? [])])],
    familyContext: incoming.familyContext ?? current.familyContext,
    culturalContext: incoming.culturalContext ?? current.culturalContext,
    practicalConstraints: [
      ...new Set([...(current.practicalConstraints ?? []), ...(incoming.practicalConstraints ?? [])]),
    ],
    hopes: incoming.hopes ?? current.hopes,
    portraitHighlights: [
      ...new Set([...(current.portraitHighlights ?? []), ...(incoming.portraitHighlights ?? [])]),
    ],
    portraitSummary: incoming.portraitSummary ?? current.portraitSummary,
    briefSummary: incoming.briefSummary ?? current.briefSummary,
    narrative: incoming.narrative ?? current.narrative,
  };
}

export function buildPortraitSummary(profile: ChatProfile): string {
  const traits: string[] = [];
  if (profile.childGender) {
    const normalizedGender = profile.childGender.toLowerCase();
    if (normalizedGender.includes("open")) {
      traits.push("an open-ended naming brief");
    } else {
      traits.push(`a ${profile.childGender} naming brief`);
    }
  }
  if (profile.desiredFeel) traits.push(`a name that feels ${profile.desiredFeel}`);
  if (profile.culturalContext) traits.push(`something that sits naturally within ${profile.culturalContext}`);
  if (profile.familyContext) traits.push(`a choice that respects ${profile.familyContext}`);
  if (profile.hopes) traits.push(`a name that can carry ${profile.hopes}`);

  const highlights = (profile.portraitHighlights ?? []).slice(0, 3);

  if (traits.length === 0 && highlights.length === 0) {
    if (profile.narrative) {
      return profile.narrative;
    }
    return "I have the practical outline, but I still want a little more texture about who you are and what the name should feel like in your family.";
  }

  const opening = profile.surname
    ? `You come across as a ${profile.surname} family looking for ${traits[0] ?? "a name with real character"}.`
    : `You come across as a family looking for ${traits[0] ?? "a name with real character"}.`;

  const extraTraits = traits.slice(1);
  const bodyParts: string[] = [];
  if (extraTraits.length > 0) {
    bodyParts.push(`You also care about ${listToPhrase(extraTraits)}.`);
  }
  if (highlights.length > 0) {
    bodyParts.push(`What stands out is ${listToPhrase(highlights)}.`);
  }

  return [opening, ...bodyParts].join(" ").trim();
}

export function buildBriefSummary(profile: ChatProfile): string {
  const clauses: string[] = [];

  if (profile.childGender) clauses.push(`This brief is for ${profile.childGender}.`);
  if (profile.surname) clauses.push(`The name needs to sound convincing with ${profile.surname}.`);
  if (profile.desiredFeel) clauses.push(`It should feel ${profile.desiredFeel}.`);
  if (hasNames(profile)) {
    const liked = [...(profile.likedNames ?? []), ...(profile.dislikedNames ?? []).map((name) => `not ${name}`)];
    clauses.push(`Your examples point toward ${listToPhrase(liked.slice(0, 4))}.`);
  }
  if (profile.familyContext) clauses.push(`Family context to respect: ${profile.familyContext}.`);
  if (profile.culturalContext) clauses.push(`It should work naturally in ${profile.culturalContext}.`);
  if ((profile.practicalConstraints?.length ?? 0) > 0) {
    clauses.push(`Practical watch-outs: ${listToPhrase(profile.practicalConstraints ?? [])}.`);
  }

  if (clauses.length === 0) {
    return "I have the broad shape of the brief, but I still need a few practical anchors before I start naming.";
  }

  return clauses.join(" ").trim();
}

export function buildBriefFromProfile(profileInput: ChatProfile): string {
  const profile = normalizeProfile(profileInput);

  if (
    !profile.childGender &&
    !profile.surname &&
    !profile.desiredFeel &&
    !hasNames(profile) &&
    !profile.familyContext &&
    !profile.culturalContext &&
    !(profile.practicalConstraints?.length ?? 0) &&
    !profile.hopes &&
    profile.narrative
  ) {
    return profile.narrative;
  }

  const lines: string[] = [];
  if (profile.childGender) lines.push(`Child gender / stance: ${profile.childGender}`);
  if (profile.surname) lines.push(`Family surname: ${profile.surname}`);
  if (profile.desiredFeel) lines.push(`Desired feel: ${profile.desiredFeel}`);
  if ((profile.likedNames?.length ?? 0) > 0) {
    lines.push(`Liked or promising names: ${listToPhrase(profile.likedNames ?? [])}`);
  }
  if ((profile.dislikedNames?.length ?? 0) > 0) {
    lines.push(`Names to avoid or move away from: ${listToPhrase(profile.dislikedNames ?? [])}`);
  }
  if (profile.familyContext) lines.push(`Family context: ${profile.familyContext}`);
  if (profile.culturalContext) lines.push(`Cultural / language context: ${profile.culturalContext}`);
  if ((profile.practicalConstraints?.length ?? 0) > 0) {
    lines.push(`Practical constraints: ${listToPhrase(profile.practicalConstraints ?? [])}`);
  }
  if (profile.hopes) lines.push(`Emotional hope: ${profile.hopes}`);
  if ((profile.portraitHighlights?.length ?? 0) > 0) {
    lines.push(`Portrait notes: ${listToPhrase(profile.portraitHighlights ?? [])}`);
  }

  const portrait = profile.portraitSummary || buildPortraitSummary(profile);
  const brief = profile.briefSummary || buildBriefSummary(profile);

  return [portrait, brief, ...lines].filter(Boolean).join("\n\n");
}
