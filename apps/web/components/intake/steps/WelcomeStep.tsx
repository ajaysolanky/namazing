"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    description: "Explore strong, handsome names",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="16" r="8" />
        <path d="M24 24v16M18 32h12" />
        <path d="M36 8l6-6M36 2h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: "from-blue-100 via-blue-50 to-sky-50",
    activeGradient: "from-blue-200 via-blue-100 to-sky-100",
    borderColor: "border-blue-300",
    accentColor: "bg-blue-500",
  },
  {
    value: "girl",
    label: "A girl",
    description: "Discover beautiful, elegant names",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="14" r="10" />
        <path d="M24 24v18M18 36h12" />
      </svg>
    ),
    gradient: "from-pink-100 via-rose-50 to-pink-50",
    activeGradient: "from-pink-200 via-rose-100 to-pink-100",
    borderColor: "border-pink-300",
    accentColor: "bg-pink-500",
  },
  {
    value: "unknown",
    label: "A surprise",
    description: "Names perfect for any gender",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 4l4.8 9.6L40 15.2l-8 7.8 1.9 11L24 29l-9.9 5 1.9-11-8-7.8 11.2-1.6L24 4z" strokeLinejoin="round" />
        <path d="M24 36v8M20 44h8" strokeLinecap="round" />
      </svg>
    ),
    gradient: "from-amber-100 via-yellow-50 to-orange-50",
    activeGradient: "from-amber-200 via-yellow-100 to-orange-100",
    borderColor: "border-amber-300",
    accentColor: "bg-amber-500",
  },
] as const;

// Sparkle animation on selection
function SelectionSparkles() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-studio-gold rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: Math.cos((i * 60 * Math.PI) / 180) * 50,
            y: Math.sin((i * 60 * Math.PI) / 180) * 50,
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: "easeOut",
          }}
          style={{
            top: "50%",
            left: "50%",
            marginTop: -4,
            marginLeft: -4,
          }}
        />
      ))}
    </>
  );
}

export function WelcomeStep({ formData, updateField }: WelcomeStepProps) {
  return (
    <div className="space-y-12">
      {/* Emotional header with staggered reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-5"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-studio-rose/30 via-white to-studio-sage/30 rounded-full text-sm text-studio-ink/70 shadow-soft"
        >
          <motion.span
            className="w-2 h-2 bg-studio-terracotta rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Your naming journey begins
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-studio-ink leading-tight"
        >
          Choosing a name is one of the
          <br />
          <span className="text-gradient-terracotta">first gifts you&apos;ll give</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-studio-ink/60 max-w-lg mx-auto leading-relaxed"
        >
          We&apos;re honored to help you find it. In just a few minutes, tell us about
          your family and preferences, and we&apos;ll do the research for you.
        </motion.p>
      </motion.div>

      {/* Gender selection - larger cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-5"
      >
        <p className="text-center text-studio-ink/70 font-medium text-lg">
          First, who are we naming?
        </p>

        <div className="grid gap-5 sm:grid-cols-3 max-w-3xl mx-auto">
          {genderOptions.map((option, index) => {
            const isSelected = formData.babyGender === option.value;
            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField("babyGender", option.value)}
                className={cn(
                  "relative group rounded-3xl p-8 text-center transition-all duration-300",
                  "bg-gradient-to-b border-2",
                  isSelected
                    ? `${option.activeGradient} ${option.borderColor} shadow-celebration`
                    : `${option.gradient} border-transparent hover:border-studio-ink/10 hover:shadow-elevated`
                )}
              >
                {/* Selection indicator with animation */}
                <AnimatePresence>
                  {isSelected && (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-studio-ink to-studio-ink/80 rounded-full flex items-center justify-center shadow-elevated z-10"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <SelectionSparkles />
                    </>
                  )}
                </AnimatePresence>

                {/* Icon container with glow */}
                <div className="relative mb-4">
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "absolute -inset-4 rounded-full blur-xl",
                        option.value === "boy" && "bg-blue-200/60",
                        option.value === "girl" && "bg-pink-200/60",
                        option.value === "unknown" && "bg-amber-200/60"
                      )}
                    />
                  )}
                  <motion.div
                    className={cn(
                      "relative mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                      isSelected
                        ? "bg-white/90 text-studio-ink shadow-soft"
                        : "bg-white/60 text-studio-ink/50 group-hover:bg-white/80 group-hover:text-studio-ink/70"
                    )}
                    animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {option.icon}
                  </motion.div>
                </div>

                <motion.div
                  className={cn(
                    "font-semibold text-lg transition-colors mb-1",
                    isSelected ? "text-studio-ink" : "text-studio-ink/70"
                  )}
                >
                  {option.label}
                </motion.div>

                <div className={cn(
                  "text-sm transition-colors",
                  isSelected ? "text-studio-ink/60" : "text-studio-ink/40"
                )}>
                  {option.description}
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className={cn("absolute bottom-0 left-1/2 h-1 rounded-full", option.accentColor)}
                  initial={{ width: 0, x: "-50%" }}
                  animate={{
                    width: isSelected ? "60%" : "0%",
                    x: "-50%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Reassurance message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center text-sm text-studio-ink/40"
      >
        Don&apos;t worry — you can explore names for any gender, and change this anytime.
      </motion.p>
    </div>
  );
}
