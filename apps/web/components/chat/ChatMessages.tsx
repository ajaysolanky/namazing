import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ChatMessage, ConversationState } from "@/lib/chat-utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ProfileSummaryCard } from "./ProfileSummaryCard";

interface ChatMessagesProps {
  messages: ChatMessage[];
  conversation: ConversationState;
  isStreaming: boolean;
  isSubmitting: boolean;
  onInsertPrompt: (prompt: string) => void;
  onConfirm: () => void;
}

const PHASE_LABELS: Record<ConversationState["phase"], string> = {
  opening: "Opening the conversation",
  collecting_core: "Shaping the essentials",
  deepening_portrait: "Getting to know your family",
  synthesis_check: "Reflecting the brief",
  ready: "Ready to begin",
};

const ACT_LABELS: Partial<Record<ConversationState["assistantAct"], string>> = {
  ask_core_question: "Shaping the essentials",
  ask_portrait_question: "Getting to know your family",
  clarify_previous_question: "Clarifying the brief",
  answer_then_continue: "Answering and refining",
  reflect_and_confirm: "Reflecting the brief",
  repair_misunderstanding: "Clearing up a misunderstanding",
  summarize_ready: "Ready to begin",
};

export function ChatMessages({
  messages,
  conversation,
  isStreaming,
  isSubmitting,
  onInsertPrompt,
  onConfirm,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, conversation.phase]);

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const showPromptSet = conversation.phase === "opening" && userMessageCount === 0 && !isStreaming;
  const showReadiness = userMessageCount > 0 && conversation.phase !== "ready";
  const showSummary = conversation.phase === "ready" && !isStreaming;
  const readinessLabel = ACT_LABELS[conversation.assistantAct] ?? PHASE_LABELS[conversation.phase];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
      <div className="min-h-full max-w-2xl mx-auto px-4 pt-2 pb-4 sm:pt-3 sm:pb-6 flex flex-col justify-end">
        <div className="space-y-4">
          {showReadiness && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-3 z-10"
            >
              <div className="bg-white/92 backdrop-blur rounded-2xl border border-studio-border shadow-soft px-4 py-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-studio-ink/75">
                      {readinessLabel}
                    </p>
                    <p className="text-[11px] sm:text-xs text-studio-ink/45">
                      Consultation readiness
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-studio-ink">
                    {conversation.readiness}%
                  </p>
                </div>
                <div className="h-2 rounded-full bg-studio-ink/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-studio-sage via-studio-rose to-studio-terracotta"
                    initial={{ width: 0 }}
                    animate={{ width: `${conversation.readiness}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={`${message.id}-${index}`}
              message={message}
              emphasize={index === 0 && message.role === "assistant" && userMessageCount === 0}
            />
          ))}

          {showPromptSet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-center text-sm text-studio-ink/60">
                Pick a starter or type your own response below
              </p>
              <p className="text-center text-xs text-studio-ink/50">
                Tap a starter to insert it into the text box, then edit as needed.
              </p>
              <SuggestedPrompts onSelect={onInsertPrompt} />
            </motion.div>
          )}

          {isStreaming && <TypingIndicator />}

          {showSummary && (
            <ProfileSummaryCard
              portraitSummary={conversation.portraitSummary ?? "I have a strong feel for your family and the world this name needs to live in."}
              briefSummary={conversation.briefSummary ?? "I have enough to generate the report and start shaping a shortlist."}
              readiness={conversation.readiness}
              onConfirm={onConfirm}
              isSubmitting={isSubmitting}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
