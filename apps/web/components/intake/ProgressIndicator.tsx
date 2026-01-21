"use client";

import { motion } from "framer-motion";
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

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile: Enhanced progress bar */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{steps[currentStep].icon}</span>
            <span className="text-sm font-medium text-studio-ink">
              {steps[currentStep].label}
            </span>
          </div>
          <span className="text-xs text-studio-ink/50 bg-studio-ink/5 px-2 py-1 rounded-full">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-studio-sage via-studio-rose to-studio-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop: Premium step indicators */}
      <div className="hidden sm:block">
        {/* Background track */}
        <div className="relative mx-5">
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-studio-ink/10 rounded-full" />
          <motion.div
            className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-studio-sage to-studio-rose rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step circles */}
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
                {/* Circle with glow effect */}
                <motion.div
                  className={cn(
                    "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-studio-sage shadow-glow-sage",
                    isCurrent && "bg-studio-rose shadow-glow",
                    !isCompleted && !isCurrent && "bg-white border-2 border-studio-ink/10",
                    isClickable && !isCurrent && "group-hover:border-studio-ink/30 group-hover:bg-studio-cream"
                  )}
                  initial={false}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Inner glow for current */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-studio-rose"
                      animate={{ opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {isCompleted ? (
                    <motion.svg
                      className="w-5 h-5 text-studio-ink/70 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold relative z-10",
                        isCurrent ? "text-studio-ink" : "text-studio-ink/30"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.div>

                {/* Label with indicator dot */}
                <div className="mt-3 flex flex-col items-center">
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300 whitespace-nowrap",
                      isCurrent ? "text-studio-ink" : "text-studio-ink/40",
                      isClickable && !isCurrent && "group-hover:text-studio-ink/60"
                    )}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.div
                      className="w-1 h-1 rounded-full bg-studio-ink mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
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
