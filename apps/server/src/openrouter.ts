import fetch from "node-fetch";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallLLMArgs {
  model: string;
  system?: string;
  messages: OpenRouterMessage[];
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

  return callOpenRouter({
    apiKey,
    model,
    provider: process.env.LLM_PROVIDER,
    system,
    messages,
    json,
    temperature,
  });
}

interface OpenRouterCallArgs {
  apiKey: string;
  model: string;
  provider?: string;
  system?: string;
  messages: OpenRouterMessage[];
  json?: boolean;
  temperature?: number;
}

export async function callOpenRouter({
  apiKey,
  model,
  provider,
  system,
  messages,
  json = false,
  temperature = 0.2,
}: OpenRouterCallArgs) {
  console.log(`[openrouter] Calling model=${model} json=${json} provider=${provider || "openrouter-auto"}`);
  const startTime = Date.now();

  const makeRequest = async (providerOverride?: string) => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        ...(providerOverride ? { provider: { order: [providerOverride], allow_fallbacks: false } } : {}),
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
      console.error(`[openrouter] Error: ${res.status} for model=${model} provider=${providerOverride || "openrouter-auto"}`);
      const error = new Error(`OpenRouter error: ${res.status} ${text}`);
      (error as Error & { status?: number }).status = res.status;
      throw error;
    }

    return res.json() as Promise<{
      choices?: Array<{ message?: { content?: string } }>;
    }>;
  };

  let data;
  try {
    data = await makeRequest(provider);
  } catch (error: any) {
    if (provider && error?.status === 429) {
      console.warn(`[openrouter] Provider ${provider} rate-limited for model=${model}; retrying with OpenRouter fallback`);
      data = await makeRequest(undefined);
    } else {
      throw error;
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[openrouter] OK model=${model} ${elapsed}ms`);

  return data.choices?.[0]?.message?.content ?? "";
}
