export interface ChatProfile {
  surname?: string;
  narrative?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
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
