export interface ChatProfile {
  surname?: string;
  babyGender?: string;
  siblings?: string[];
  stylePreferences?: string[];
  lengthPreference?: string;
  namesConsidering?: string[];
  namesToAvoid?: string[];
  culturalConsiderations?: string[];
  familyTraditions?: string;
  honorNames?: string[];
  middleNameBoy?: string;
  middleNameGirl?: string;
  additionalNotes?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Merge a partial profile update into the existing profile.
 * Arrays are merged (deduped for strings), scalars are replaced.
 */
export function mergeProfile(
  existing: ChatProfile,
  update: Partial<ChatProfile>
): ChatProfile {
  const merged = { ...existing };

  for (const [key, value] of Object.entries(update)) {
    const k = key as keyof ChatProfile;
    if (value === undefined || value === null) continue;

    const existingVal = merged[k];
    if (Array.isArray(value) && Array.isArray(existingVal)) {
      // Merge arrays, dedup strings
      const combined = [...existingVal, ...value];
      (merged as any)[k] = [...new Set(combined)];
    } else {
      (merged as any)[k] = value;
    }
  }

  return merged;
}

/**
 * Build a brief string from the chat profile, producing the same format
 * as transformToSessionProfile().raw_brief from the wizard flow.
 */
export function buildBriefFromProfile(profile: ChatProfile): string {
  const parts: string[] = [];

  if (profile.babyGender && profile.babyGender !== "unknown") {
    parts.push(`Looking for ${profile.babyGender} names.`);
  } else {
    parts.push("Looking for names (gender unknown or flexible).");
  }

  if (profile.surname) {
    parts.push(`Family surname: ${profile.surname}.`);
  }

  if (profile.siblings && profile.siblings.length > 0) {
    parts.push(
      `Existing children (siblings for the new baby): ${profile.siblings.join(", ")}.`
    );
  }

  if (profile.stylePreferences && profile.stylePreferences.length > 0) {
    parts.push(`Style preferences: ${profile.stylePreferences.join(", ")}.`);
  }

  if (profile.lengthPreference && profile.lengthPreference !== "any") {
    parts.push(`Prefer ${profile.lengthPreference} names.`);
  }

  if (profile.namesConsidering && profile.namesConsidering.length > 0) {
    parts.push(
      `Names the client LIKES and wants us to INCLUDE or suggest similar to: ${profile.namesConsidering.join(", ")}.`
    );
  }

  if (profile.namesToAvoid && profile.namesToAvoid.length > 0) {
    parts.push(`Names to avoid: ${profile.namesToAvoid.join(", ")}.`);
  }

  if (profile.honorNames && profile.honorNames.length > 0) {
    parts.push(`Honor names to consider: ${profile.honorNames.join(", ")}.`);
  }

  if (profile.middleNameBoy) {
    parts.push(`Pre-selected middle name for a boy: ${profile.middleNameBoy}.`);
  }

  if (profile.middleNameGirl) {
    parts.push(
      `Pre-selected middle name for a girl: ${profile.middleNameGirl}.`
    );
  }

  if (
    profile.culturalConsiderations &&
    profile.culturalConsiderations.length > 0
  ) {
    parts.push(
      `Cultural considerations: ${profile.culturalConsiderations.join(", ")}.`
    );
  }

  if (profile.familyTraditions) {
    parts.push(`Family traditions: ${profile.familyTraditions}`);
  }

  if (profile.additionalNotes) {
    parts.push(`Additional notes: ${profile.additionalNotes}`);
  }

  return parts.join(" ");
}
