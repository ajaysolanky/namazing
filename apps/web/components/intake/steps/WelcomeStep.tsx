"use client";

import { motion } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { cn } from "@/lib/utils";

interface WelcomeStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

const genderOptions = [
  {
    value: "boy",
    label: "A boy",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 12v8M9 16h6" />
      </svg>
    ),
    color: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200",
    activeColor: "from-blue-200 to-blue-100",
  },
  {
    value: "girl",
    label: "A girl",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 12v8M9 20h6M12 16h0" />
      </svg>
    ),
    color: "from-pink-100 to-pink-50",
    borderColor: "border-pink-200",
    activeColor: "from-pink-200 to-pink-100",
  },
  {
    value: "unknown",
    label: "It's a surprise",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17l-6.3 4 2.3-7-6-4.6h7.6L12 2z" />
      </svg>
    ),
    color: "from-amber-100 to-amber-50",
    borderColor: "border-amber-200",
    activeColor: "from-amber-200 to-amber-100",
  },
] as const;

export function WelcomeStep({ formData, updateField }: WelcomeStepProps) {
  return (
    <div className="space-y-10">
      {/* Emotional header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-studio-rose/20 rounded-full text-sm text-studio-ink/70">
          <span className="w-2 h-2 bg-studio-rose rounded-full animate-pulse" />
          Your naming journey begins
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-studio-ink leading-tight">
          Choosing a name is one of the
          <br />
          <span className="text-studio-ink/60">first gifts you'll give</span>
        </h1>

        <p className="text-lg text-studio-ink/60 max-w-lg mx-auto leading-relaxed">
          We're honored to help you find it. In just a few minutes, tell us about
          your family and preferences, and we'll do the research for you.
        </p>
      </motion.div>

      {/* Gender selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <p className="text-center text-studio-ink/70 font-medium">
          First, who are we naming?
        </p>

        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
          {genderOptions.map((option, index) => {
            const isSelected = formData.babyGender === option.value;
            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                onClick={() => updateField("babyGender", option.value)}
                className={cn(
                  "relative group rounded-2xl p-6 text-center transition-all duration-300",
                  "bg-gradient-to-b border-2",
                  isSelected
                    ? `${option.activeColor} ${option.borderColor} shadow-lg scale-[1.02]`
                    : `${option.color} border-transparent hover:border-studio-ink/10 hover:shadow-md`
                )}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-studio-ink rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                <div className={cn(
                  "mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                  isSelected ? "bg-white/80 text-studio-ink" : "bg-white/60 text-studio-ink/60"
                )}>
                  {option.icon}
                </div>

                <div className={cn(
                  "font-medium transition-colors",
                  isSelected ? "text-studio-ink" : "text-studio-ink/70"
                )}>
                  {option.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Reassurance */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center text-sm text-studio-ink/40"
      >
        Don't worry — you can explore names for any gender, and change this anytime.
      </motion.p>
    </div>
  );
}
