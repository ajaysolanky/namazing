export interface ChatProfile {
  surname?: string;
  narrative?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ConsultationGap {
  id: "surname" | "style" | "examples" | "context" | "culture";
  label: string;
}

export const CHAT_OPENING_MESSAGE =
  "Hi, I’m your Namazing naming consultant. To start, share your last name and one naming vibe you want (classic, literary, modern, or heritage-rich). You can answer directly or tap a starter below.";

export function createOpeningAssistantMessage(): ChatMessage {
  return {
    id: "msg_opening",
    role: "assistant",
    content: CHAT_OPENING_MESSAGE,
  };
}

/**
 * Merge a partial profile update into the existing profile.
 * Both fields are scalars — newer values replace older ones.
 */
export function mergeProfile(
  existing: ChatProfile,
  update: Partial<ChatProfile>
): ChatProfile {
  return {
    ...existing,
    ...(update.surname !== undefined && update.surname !== null
      ? { surname: update.surname }
      : {}),
    ...(update.narrative !== undefined && update.narrative !== null
      ? { narrative: update.narrative }
      : {}),
  };
}

/**
 * Build a brief string from the chat profile.
 * The narrative is already a rich prose summary — send it directly.
 */
export function buildBriefFromProfile(profile: ChatProfile): string {
  if (profile.narrative) {
    return profile.narrative;
  }
  // Fallback: surname-only edge case
  if (profile.surname) {
    return `Family surname: ${profile.surname}.`;
  }
  return "";
}

export function buildReadySummaryFromProfile(profile: ChatProfile): string {
  const narrative = profile.narrative?.trim();
  if (narrative) {
    const normalized = narrative.replace(/\s+/g, " ");
    const sentences = normalized.match(/[^.!?]+[.!?]+/g) ?? [normalized];
    const concise = sentences.slice(0, 2).join(" ").trim() || normalized;
    return `I have a strong picture of what fits your family. ${concise}`;
  }

  if (profile.surname) {
    return `I have enough to begin exploring names for the ${profile.surname} family, and I can refine further once we start shaping the shortlist.`;
  }

  return "I have enough to begin, but one final note from you would help me tailor the report more precisely.";
}

function getUserConversationText(messages: ChatMessage[]): string {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function getConsultationGaps(
  messages: ChatMessage[],
  profile: ChatProfile
): ConsultationGap[] {
  const text = getUserConversationText(messages);
  const userMessages = messages.filter((message) => message.role === "user");
  const gaps: ConsultationGap[] = [];

  if (!profile.surname) {
    gaps.push({
      id: "surname",
      label: "your family surname",
    });
  }

  if (
    userMessages.length < 1 ||
    !hasAny(text, [
      /\bclassic\b/,
      /\bliterary\b/,
      /\bmodern\b/,
      /\bheritage\b/,
      /\bstyle\b/,
      /\bvibe\b/,
      /\bfeel\b/,
      /\btimeless\b/,
      /\bwarm\b/,
      /\bstrong\b/,
      /\bsoft\b/,
      /\bstory\b/,
    ])
  ) {
    gaps.push({
      id: "style",
      label: "the feeling or vibe you want the name to have",
    });
  }

  if (
    userMessages.length < 2 ||
    !hasAny(text, [
      /\bwe like\b/,
      /\bi like\b/,
      /\blove\b/,
      /\bfavorite\b/,
      /\bavoid\b/,
      /\bdislike\b/,
      /\bdon't like\b/,
      /\btop\b/,
      /\bname(s)?\b/,
    ])
  ) {
    gaps.push({
      id: "examples",
      label: "a few names you love or want to avoid",
    });
  }

  if (
    userMessages.length < 2 ||
    !hasAny(text, [
      /\bsibling\b/,
      /\bbrother\b/,
      /\bsister\b/,
      /\bhonor\b/,
      /\btradition\b/,
      /\bfamily\b/,
      /\binitials?\b/,
      /\bmiddle name\b/,
      /\bnickname\b/,
    ])
  ) {
    gaps.push({
      id: "context",
      label: "any family context like siblings, honor names, traditions, or initials to watch",
    });
  }

  if (
    userMessages.length < 2 ||
    !hasAny(text, [
      /\bheritage\b/,
      /\bcultural\b/,
      /\bculture\b/,
      /\broots\b/,
      /\blanguage\b/,
      /\bpronounc/i,
      /\benglish\b/,
      /\bspanish\b/,
      /\birish\b/,
      /\bitalian\b/,
      /\bindian\b/,
      /\bchinese\b/,
      /\bjapanese\b/,
      /\barabic\b/,
      /\bhebrew\b/,
      /\bnigerian\b/,
      /\bfrench\b/,
      /\bgreek\b/,
      /\blatin\b/,
      /\bmandarin\b/,
    ])
  ) {
    gaps.push({
      id: "culture",
      label: "any heritage, languages, or cultural context the name should work in",
    });
  }

  return gaps;
}

export function computeConsultationReadiness(
  messages: ChatMessage[],
  profile: ChatProfile,
  summary: string | null
): number {
  if (summary) return 100;
  const gaps = getConsultationGaps(messages, profile);
  const userMessages = messages.filter((m) => m.role === "user").length;
  const hasNarrative = Boolean(profile.narrative);

  let score = 12;
  if (profile.surname) score += 24;
  if (hasNarrative) score += 20;
  score += Math.min(userMessages * 8, 24);
  score += Math.max(0, 4 - gaps.length) * 11;

  if (userMessages >= 5 && hasNarrative) {
    score = Math.max(score, gaps.length === 0 ? 92 : 82);
  }

  const cap = gaps.length === 0 ? 95 : 88;
  return Math.max(12, Math.min(cap, score));
}
