import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/chat-utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ProfileSummaryCard } from "./ProfileSummaryCard";

interface ChatMessagesProps {
  messages: ChatMessage[];
  summary: string | null;
  isStreaming: boolean;
  isSubmitting: boolean;
  onSendPrompt: (prompt: string) => void;
  onConfirm: () => void;
}

export function ChatMessages({
  messages,
  summary,
  isStreaming,
  isSubmitting,
  onSendPrompt,
  onConfirm,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, summary]);

  const isEmpty = messages.length === 0;

  return (
    <div ref={scrollRef} className={`flex-1 overflow-y-auto ${isEmpty ? "flex items-center" : ""}`}>
      <div className={`max-w-2xl mx-auto px-4 py-6 ${isEmpty ? "w-full" : "space-y-4"}`}>
        {/* Welcome state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-studio-rose/50 to-studio-sage/50 flex items-center justify-center">
              <span className="font-display text-2xl text-studio-ink/60">N</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
                Let&apos;s find the perfect name
              </h1>
              <p className="text-studio-ink/50 max-w-sm mx-auto text-[15px] leading-relaxed">
                Tell us about your family and what matters to you. We&apos;ll craft a personalized naming consultation just for you.
              </p>
            </div>

            <SuggestedPrompts onSelect={onSendPrompt} />
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isStreaming && <TypingIndicator />}

        {/* Summary card */}
        {summary && !isStreaming && (
          <ProfileSummaryCard
            summary={summary}
            onConfirm={onConfirm}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
