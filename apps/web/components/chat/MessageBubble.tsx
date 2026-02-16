import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/chat-utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-display font-semibold text-studio-ink/70">N</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] md:max-w-[75%] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-studio-ink text-white rounded-2xl rounded-br-md shadow-soft"
            : "bg-white text-studio-ink rounded-2xl rounded-bl-md shadow-soft"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
