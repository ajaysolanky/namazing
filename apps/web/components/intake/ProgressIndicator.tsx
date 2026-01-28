"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Welcome", icon: "👋" },
  { label: "Family", icon: "👨‍👩‍👧" },
  { label: "Style", icon: "✨" },
  { label: "Names", icon: "💭" },
  { label: "Heritage", icon: "🌍" },
  { label: "Details", icon: "📝" },
  { label: "Review", icon: "🎯" },
];

interface ProgressIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

// Animated checkmark that bounces in
function AnimatedCheckmark() {
  return (
    <motion.svg
      className="w-5 h-5 text-white relative z-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.1,
      }}
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </motion.svg>
  );
}

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile: Animated fluid progress bar */}
      <div className="sm:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-studio-terracotta to-studio-gold flex items-center justify-center shadow-glow-terracotta"
            >
              <span className="text-lg">{steps[currentStep].icon}</span>
            </motion.div>
            <div>
              <motion.span
                key={`label-${currentStep}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-semibold text-studio-ink block"
              >
                {steps[currentStep].label}
              </motion.span>
              <span className="text-xs text-studio-ink/50">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index < currentStep && "bg-studio-sage",
                  index === currentStep && "bg-studio-terracotta w-4",
                  index > currentStep && "bg-studio-ink/10"
                )}
                initial={false}
                animate={{
                  scale: index === currentStep ? 1 : 0.8,
                }}
              />
            ))}
          </div>
        </div>
        {/* Progress bar with gradient flow */}
        <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full progress-flow-bar"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop: Connected journey path */}
      <div className="hidden sm:block">
        {/* SVG curved path connecting nodes */}
        <div className="relative mx-6 mb-4">
          <svg
            className="w-full h-16 overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 16"
          >
            {/* Background path */}
            <path
              d="M 0 8 Q 8 4, 16.67 8 T 33.33 8 T 50 8 T 66.67 8 T 83.33 8 T 100 8"
              fill="none"
              stroke="rgba(31, 41, 51, 0.08)"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            {/* Animated progress path */}
            <motion.path
              d="M 0 8 Q 8 4, 16.67 8 T 33.33 8 T 50 8 T 66.67 8 T 83.33 8 T 100 8"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d7e3d4" />
                <stop offset="50%" stopColor="#f8d4d8" />
                <stop offset="100%" stopColor="#c4704b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Step nodes */}
        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = onStepClick && index <= currentStep;

            return (
              <button
                key={step.label}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center group relative z-10",
                  isClickable && "cursor-pointer"
                )}
              >
                {/* Node with celebration effect */}
                <div className="relative">
                  {/* Glow ring for current */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-studio-terracotta/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <motion.div
                    className={cn(
                      "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-gradient-to-br from-studio-sage to-studio-mint shadow-glow-sage",
                      isCurrent && "bg-gradient-to-br from-studio-terracotta to-studio-gold shadow-glow-terracotta",
                      !isCompleted && !isCurrent && "bg-white border-2 border-studio-ink/10",
                      isClickable && !isCurrent && "group-hover:border-studio-ink/20 group-hover:bg-studio-cream/50"
                    )}
                    initial={false}
                    animate={
                      isCurrent
                        ? { scale: [1, 1.05, 1] }
                        : isCompleted
                        ? { scale: 1 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <AnimatedCheckmark key="check" />
                      ) : (
                        <motion.span
                          key="number"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className={cn(
                            "text-lg font-semibold relative z-10",
                            isCurrent ? "text-white" : "text-studio-ink/30"
                          )}
                        >
                          {isCurrent ? step.icon : index + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Sparkle effect on completion */}
                  <AnimatePresence>
                    {isCompleted && index === currentStep - 1 && (
                      <>
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-studio-gold rounded-full"
                            style={{
                              top: "50%",
                              left: "50%",
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: [0, Math.cos(i * 90 * Math.PI / 180) * 30],
                              y: [0, Math.sin(i * 90 * Math.PI / 180) * 30],
                            }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.05,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <div className="mt-3 flex flex-col items-center">
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300 whitespace-nowrap",
                      isCurrent ? "text-studio-terracotta" : isCompleted ? "text-studio-ink/70" : "text-studio-ink/35",
                      isClickable && !isCurrent && "group-hover:text-studio-ink/60"
                    )}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-studio-terracotta mt-1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
