import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 max-w-[85%] md:max-w-[75%]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-display font-semibold text-studio-ink/70">N</span>
      </div>

      {/* Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-soft rounded-2xl rounded-bl-md px-5 py-3.5"
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-studio-ink/25"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
