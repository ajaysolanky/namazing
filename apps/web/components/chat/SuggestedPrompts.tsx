import { motion } from "framer-motion";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  "We're expecting a girl",
  "Help us name our first baby",
  "We want a name that works in two cultures",
  "We love classic, timeless names",
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="flex flex-wrap justify-center gap-2 px-4"
    >
      {PROMPTS.map((prompt, i) => (
        <motion.button
          key={prompt}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.2 }}
          onClick={() => onSelect(prompt)}
          className="px-4 py-2.5 rounded-full bg-white border border-studio-ink/8 text-sm text-studio-ink/70 shadow-soft hover:shadow-card hover:border-studio-ink/15 hover:text-studio-ink transition-all duration-200 active:scale-[0.97]"
        >
          {prompt}
        </motion.button>
      ))}
    </motion.div>
  );
}
