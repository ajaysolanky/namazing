import { useState, useEffect, useCallback, useRef } from "react";
import {
  type ChatMessage,
  type ChatProfile,
  type ConversationState,
  mergeProfile,
  createOpeningAssistantMessage,
  createOpeningConversationState,
  normalizeProfile,
  normalizeConversationState,
} from "@/lib/chat-utils";

const STORAGE_KEY = "namazing-chat";

interface ChatState {
  messages: ChatMessage[];
  profile: ChatProfile;
  conversation: ConversationState;
}

const createInitialState = (): ChatState => ({
  messages: [createOpeningAssistantMessage()],
  profile: normalizeProfile({}),
  conversation: createOpeningConversationState(),
});

function loadState(): ChatState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();

    const parsed = JSON.parse(saved);
    let messages: ChatMessage[] = parsed.messages || [];

    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      messages = messages.slice(0, -1);
      const cleaned = { ...parsed, messages };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }

    const normalizedMessages = messages.length > 0 ? messages : [createOpeningAssistantMessage()];
    const profile = normalizeProfile(parsed.profile || {});
    const conversation = normalizeConversationState(parsed.conversation || null);

    return {
      messages: normalizedMessages,
      profile,
      conversation,
    };
  } catch (error) {
    console.error("[chat] Failed to load saved state:", error);
    return createInitialState();
  }
}

function saveState(state: ChatState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[chat] Failed to save state:", error);
  }
}

let idCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++idCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<ChatProfile>(normalizeProfile({}));
  const [conversation, setConversation] = useState<ConversationState>(createOpeningConversationState());
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const state = loadState();
    setMessages(state.messages);
    setProfile(state.profile);
    setConversation(state.conversation);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState({ messages, profile, conversation });
    }
  }, [messages, profile, conversation, isLoaded]);

  const fetchReply = useCallback(
    async (
      allMessages: ChatMessage[],
      currentProfile: ChatProfile,
      currentConversation: ConversationState
    ) => {
      setIsStreaming(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            profile: currentProfile,
            conversation: currentConversation,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error || `Request failed: ${res.status}`);
        }

        const body = await res.text();
        const lines = body.split("\n");

        let assistantText = "";
        let profileUpdate: Partial<ChatProfile> | null = null;
        let conversationUpdate: ConversationState | null = null;

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            switch (event.type) {
              case "content":
                assistantText = typeof event.text === "string" ? event.text : assistantText;
                break;
              case "profile_update":
                if (event.data) {
                  profileUpdate = event.data;
                }
                break;
              case "conversation_state":
                if (event.data) {
                  conversationUpdate = normalizeConversationState(event.data);
                }
                break;
              default:
                break;
            }
          } catch {
            // Ignore malformed lines.
          }
        }

        const nextProfile = profileUpdate ? mergeProfile(currentProfile, profileUpdate) : currentProfile;
        const nextMessages = assistantText
          ? [
              ...allMessages,
              {
                id: generateId(),
                role: "assistant" as const,
                content: assistantText,
              },
            ]
          : allMessages;
        const nextConversation = conversationUpdate ?? currentConversation;

        setMessages(nextMessages);
        setProfile(nextProfile);
        setConversation(nextConversation);
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

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
      };

      const updatedMessages = [...messages, userMessage];
      const nextConversation: ConversationState =
        conversation.phase === "ready"
          ? {
              ...conversation,
              phase: "synthesis_check" as const,
              userAct: "answer" as const,
              assistantAct: "reflect_and_confirm" as const,
              pendingTopic: "summary" as const,
              lastTopic: conversation.pendingTopic,
              misunderstandingsInRow: 0,
              portraitSummary: null,
              briefSummary: null,
            }
          : conversation;

      setMessages(updatedMessages);
      setConversation(nextConversation);
      await fetchReply(updatedMessages, profile, nextConversation);
    },
    [messages, profile, conversation, isStreaming, fetchReply]
  );

  const resetChat = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const initialState = createInitialState();
    setMessages(initialState.messages);
    setProfile(initialState.profile);
    setConversation(initialState.conversation);
    setError(null);
    setIsStreaming(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    profile,
    conversation,
    isStreaming,
    isLoaded,
    error,
    sendMessage,
    resetChat,
  };
}
