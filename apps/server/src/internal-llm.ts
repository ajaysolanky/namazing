import { randomUUID } from "crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import { callOpenRouter } from "./openrouter.js";

const internalLlmToken = process.env.INTERNAL_LLM_PROXY_TOKEN || randomUUID();

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  model: z.string().min(1),
  system: z.string().optional(),
  messages: z.array(messageSchema).min(1),
  json: z.boolean().optional(),
  temperature: z.number().optional(),
});

export function getInternalLlmToken() {
  return internalLlmToken;
}

export async function handleInternalLlmChat(req: Request, res: Response) {
  const authHeader = req.header("x-namazing-internal-token");
  if (authHeader !== internalLlmToken) {
    return res.status(401).json({ error: "Unauthorized internal LLM request" });
  }

  const parsed = requestSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid internal LLM request" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "LLM configuration error" });
  }

  const provider = process.env.LLM_PROVIDER;

  try {
    const content = await callOpenRouter({
      apiKey,
      model: parsed.data.model,
      provider,
      system: parsed.data.system,
      messages: parsed.data.messages,
      json: parsed.data.json ?? false,
      temperature: parsed.data.temperature ?? 0.2,
    });
    return res.json({ content });
  } catch (error) {
    console.error("[internal-llm] Request failed:", error);
    return res.status(502).json({ error: "Failed to call LLM" });
  }
}
