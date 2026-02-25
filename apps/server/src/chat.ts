import fetch from "node-fetch";
import type { Request, Response } from "express";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatProfile {
  surname?: string;
  narrative?: string;
}

function buildSystemPrompt(profile: ChatProfile): string {
  return `You are a warm, perceptive baby-naming consultant at Namazing. You conduct genuine interviews — not questionnaires. Your job is to understand who these parents are, what matters to them, and what this name means in the context of their lives.

Your approach:
- Listen deeply. When a parent shares something, follow that thread — ask *why*, explore the emotion behind it, share an observation or insight. Act like a real consultant, not a form.
- Ask ONE question at a time. Let the conversation breathe.
- Share your expertise naturally: naming trends, cultural context, phonetic observations, sibling harmony. React meaningfully to what they tell you.
- NEVER use emojis or emoticons. Express warmth with words.
- Keep responses concise (2-4 sentences typical, occasionally longer when sharing a genuine insight).

What to explore (not a checklist — follow whatever threads emerge naturally):
- Their story: Who are they? What does this moment mean to them?
- The surname (you do need this — it's the one essential piece)
- Cultural identity, heritage, languages the name needs to work in
- The *feeling* they want the name to evoke — not just style categories
- Names they love (and what specifically draws them), names they dislike (and why)
- Family dynamics: siblings, honor names, traditions, any tensions around naming
- Practical considerations: nicknames, how it sounds called across a playground, initials

IMPORTANT — Narrative notes:
After EACH of your responses, append a profile_update block containing "surname" (when known) and "narrative" — a cohesive prose paragraph summarizing everything you've learned so far. Replace the entire narrative each time (do not append). The narrative should read like interview notes a colleague could pick up and immediately understand the family.

Format:
<profile_update>{"surname":"Chen","narrative":"First-time parents expecting a boy. Chinese-American family — want a name that feels natural in both English and Mandarin. Mom gravitates toward nature imagery and soft sounds; she mentioned loving 'Luca' and 'Arlo' but wanting something less trendy. Dad values meaning and wants a name that carries weight. Both open to honoring paternal grandfather 'Wei' if it can be woven in naturally. No siblings. Names to avoid: anything in the current US top 5."}</profile_update>

When you feel you genuinely understand this family and what they're looking for — not after a fixed number of exchanges, but when the picture feels complete — present a summary:
<ready_summary>Write a warm 2-3 sentence portrait of what you've learned and what you'll be exploring for them. This is shown to the user as confirmation before starting their consultation.</ready_summary>

You may include BOTH a profile_update AND a ready_summary in the same response.

${profile.narrative ? `Here are your interview notes so far (do NOT re-ask for information you already know):\nSurname: ${profile.surname || "unknown"}\nNotes: ${profile.narrative}` : profile.surname ? `You know their surname is ${profile.surname}. Continue the conversation naturally.` : "You haven't spoken yet — greet them warmly and ask an opening question to get to know them."}`;
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
