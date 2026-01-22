import fetch from "node-fetch";

interface CallLLMArgs {
  model: string;
  system?: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  json?: boolean;
  temperature?: number;
}

export async function callLLM({
  model,
  system,
  messages,
  json = false,
  temperature = 0.2,
}: CallLLMArgs) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY missing. Set it in your environment to enable LLM calls.");
  }

  const provider = process.env.LLM_PROVIDER;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      ...(provider ? { provider: { order: [provider], allow_fallbacks: false } } : {}),
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
