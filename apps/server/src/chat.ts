import fetch from "node-fetch";
import type { Request, Response } from "express";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatProfile {
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

function buildSystemPrompt(profile: ChatProfile): string {
  const profileSummary = Object.entries(profile)
    .filter(([, v]) => {
      if (v === undefined || v === null || v === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const hasProfile = profileSummary.length > 0;

  return `You are a warm, knowledgeable baby-naming consultant at Namazing, a premium AI-powered naming studio. You're genuinely excited to help parents find the perfect name for their little one.

Your personality:
- Warm, conversational, and encouraging — like a trusted friend who happens to be a naming expert
- Ask ONE question at a time. Pick up on what parents share naturally and follow their thread
- Celebrate what parents tell you ("What a beautiful tradition!" or "Great taste — those names have such wonderful energy")
- NEVER use emojis or emoticons in your responses. This is a strict rule with no exceptions — not even in your first greeting. Use words to express warmth, not symbols
- Never feel like a checklist or form — this is a conversation
- Keep responses concise (2-4 sentences typical, occasionally longer when sharing insights)

Your goal is to learn enough about the family to create a personalized naming consultation. The key pieces you need:
- Family surname (essential — you must collect this)
- Baby's gender (or if unknown/flexible)
- Style preferences (classic, modern, unique, traditional, nature-inspired, etc.)
- Any names they're already considering or want to avoid
- Cultural heritage or family traditions around naming
- Siblings' names (if any)
- Any other preferences (length, nickname-friendliness, honor names, middle names)

You do NOT need every field — surname is the only truly required one. After 3-5 natural exchanges, once you have at least a surname and a sense of their preferences, you should present a summary.

IMPORTANT — Inline data extraction:
After EACH of your responses, if the user revealed any new information, append a JSON block in this exact format:
<profile_update>{"field": "value"}</profile_update>

Valid fields and their types:
- surname: string
- babyGender: "boy" | "girl" | "unknown"
- siblings: string[] (just names)
- stylePreferences: string[] ("classic", "modern", "unique", "traditional", "nature-inspired", etc.)
- lengthPreference: "short" | "short-to-medium" | "any"
- namesConsidering: string[]
- namesToAvoid: string[]
- culturalConsiderations: string[]
- familyTraditions: string
- honorNames: string[]
- middleNameBoy: string
- middleNameGirl: string
- additionalNotes: string

When you have enough information (at minimum a surname, ideally after 3-5 exchanges), append a summary block:
<ready_summary>Write a warm 2-3 sentence summary of what you've learned about this family and what you'll be looking for. This will be shown to the user as a confirmation before starting their consultation.</ready_summary>

You may include BOTH a profile_update AND a ready_summary in the same response if the user's message completes the picture.

${hasProfile ? `Here is what you already know about this family (do NOT re-ask for information you already have):\n${profileSummary}` : "You haven't learned anything yet — start by warmly greeting them and asking an opening question to get to know them."}`;
}

function parseBlocks(text: string): {
  cleanText: string;
  profileUpdate: ChatProfile | null;
  readySummary: string | null;
} {
  let cleanText = text;
  let profileUpdate: ChatProfile | null = null;
  let readySummary: string | null = null;

  // Extract all profile_update blocks (LLM may send multiple, may omit closing tag)
  const profileRegex = /<profile_update>([\s\S]*?)(?:<\/profile_update>|(?=<profile_update>|<ready_summary>|$))/g;
  let profileMatch;
  while ((profileMatch = profileRegex.exec(cleanText)) !== null) {
    try {
      const parsed = JSON.parse(profileMatch[1].trim()) as ChatProfile;
      if (profileUpdate) {
        Object.assign(profileUpdate, parsed);
      } else {
        profileUpdate = parsed;
      }
    } catch (e) {
      console.warn("[chat] Failed to parse profile_update JSON:", e);
    }
  }
  cleanText = cleanText.replace(profileRegex, "").trim();

  // Extract ready_summary block (closing tag may be omitted by LLM)
  const summaryMatch = cleanText.match(
    /<ready_summary>([\s\S]*?)(?:<\/ready_summary>|$)/
  );
  if (summaryMatch) {
    readySummary = summaryMatch[1].trim();
    cleanText = cleanText.replace(summaryMatch[0], "").trim();
  }

  // Safety: strip any remaining XML-like tags the LLM may have left
  cleanText = cleanText
    .replace(/<\/?(?:profile_update|ready_summary)>/g, "")
    .trim();

  return { cleanText, profileUpdate, readySummary };
}

export async function handleChat(req: Request, res: Response) {
  const { messages, profile } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[chat] OPENROUTER_API_KEY missing");
    return res.status(500).json({ error: "LLM configuration error" });
  }

  const model =
    process.env.CHAT_MODEL || process.env.LLM_MODEL || "openai/gpt-4o-mini";
  const provider = process.env.LLM_PROVIDER;
  const systemPrompt = buildSystemPrompt(profile || {});

  console.log(
    `[chat] Request: ${messages.length} messages, model=${model}`
  );
  const startTime = Date.now();

  try {
    const llmRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          ...(provider
            ? { provider: { order: [provider], allow_fallbacks: false } }
            : {}),
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: ChatMessage) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error(`[chat] OpenRouter error: ${llmRes.status} ${errText}`);
      return res.status(502).json({ error: "LLM request failed" });
    }

    const data = (await llmRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = data.choices?.[0]?.message?.content ?? "";

    const elapsed = Date.now() - startTime;
    console.log(`[chat] Response: ${rawContent.length} chars in ${elapsed}ms`);

    // Parse out inline blocks
    const { cleanText, profileUpdate, readySummary } = parseBlocks(rawContent);

    // Stream as SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    // Send content event
    if (cleanText) {
      res.write(
        `data: ${JSON.stringify({ type: "content", text: cleanText })}\n\n`
      );
    }

    // Send profile update event
    if (profileUpdate) {
      res.write(
        `data: ${JSON.stringify({ type: "profile_update", data: profileUpdate })}\n\n`
      );
    }

    // Send summary event
    if (readySummary) {
      res.write(
        `data: ${JSON.stringify({ type: "summary", text: readySummary })}\n\n`
      );
    }

    // Send done event
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[chat] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
