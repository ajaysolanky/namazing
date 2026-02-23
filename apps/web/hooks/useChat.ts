import { useState, useEffect, useCallback, useRef } from "react";
import {
  type ChatMessage,
  type ChatProfile,
  mergeProfile,
} from "@/lib/chat-utils";

const STORAGE_KEY = "namazing-chat";

interface ChatState {
  messages: ChatMessage[];
  profile: ChatProfile;
  summary: string | null;
}

function loadState(): ChatState {
  if (typeof window === "undefined") {
    return { messages: [], profile: {}, summary: null };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      let messages: ChatMessage[] = parsed.messages || [];

      // Strip orphaned user message from a previous session that never
      // received an assistant reply — roll back to last clean state.
      if (messages.length > 0 && messages[messages.length - 1].role === "user") {
        messages = messages.slice(0, -1);
        // Persist the cleanup so it doesn't reappear on next load
        const cleaned = { ...parsed, messages };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }

      return {
        messages,
        profile: parsed.profile || {},
        summary: parsed.summary || null,
      };
    }
  } catch (e) {
    console.error("[chat] Failed to load saved state:", e);
  }
  return { messages: [], profile: {}, summary: null };
}

function saveState(state: ChatState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("[chat] Failed to save state:", e);
  }
}

let idCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++idCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<ChatProfile>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const state = loadState();
    setMessages(state.messages);
    setProfile(state.profile);
    setSummary(state.summary);
    setIsLoaded(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      saveState({ messages, profile, summary });
    }
  }, [messages, profile, summary, isLoaded]);

  // Core API call — fetches a response for the given messages + profile
  const fetchReply = useCallback(
    async (allMessages: ChatMessage[], currentProfile: ChatProfile) => {
      setIsStreaming(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            profile: currentProfile,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(
            errBody?.error || `Request failed: ${res.status}`
          );
        }

        // Parse SSE events from response body
        const body = await res.text();
        const lines = body.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            switch (event.type) {
              case "content":
                setMessages((prev) => [
                  ...prev,
                  {
                    id: generateId(),
                    role: "assistant",
                    content: event.text,
                  },
                ]);
                break;

              case "profile_update":
                if (event.data) {
                  setProfile((prev) => mergeProfile(prev, event.data));
                }
                break;

              case "summary":
                setSummary(event.text);
                break;

              case "done":
                break;
            }
          } catch {
            // Skip malformed lines
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("[chat] Error sending message:", err);
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      // Clear summary so user can continue chatting
      setSummary(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      fetchReply(updatedMessages, profile);
    },
    [messages, profile, isStreaming, fetchReply]
  );

  const resetChat = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setMessages([]);
    setProfile({});
    setSummary(null);
    setError(null);
    setIsStreaming(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    profile,
    summary,
    isStreaming,
    isLoaded,
    error,
    sendMessage,
    resetChat,
  };
}
