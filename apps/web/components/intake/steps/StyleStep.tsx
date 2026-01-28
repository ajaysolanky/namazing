"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { cn } from "@/lib/utils";

interface StyleStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

const styleOptions = [
  {
    value: "classic",
    label: "Timeless",
    examples: "Elizabeth, James, Charlotte",
    description: "Elegant names that have stood the test of time",
    icon: "👑",
    borderStyle: "border-l-4 border-l-studio-gold",
    bgStyle: "from-amber-50/80 to-white",
    activeBg: "from-amber-100 to-amber-50",
    accentColor: "bg-studio-gold",
  },
  {
    value: "modern",
    label: "Contemporary",
    examples: "Luna, Milo, Aria, Jasper",
    description: "Fresh names with current appeal",
    icon: "✦",
    borderStyle: "border-l-4 border-l-sky-400",
    bgStyle: "from-sky-50/80 to-white",
    activeBg: "from-sky-100 to-sky-50",
    accentColor: "bg-sky-400",
  },
  {
    value: "unique",
    label: "Distinctive",
    examples: "Wren, Soren, Thea, Caspian",
    description: "Uncommon names that stand out",
    icon: "◈",
    borderStyle: "border-l-4 border-l-violet-400",
    bgStyle: "from-violet-50/80 to-white",
    activeBg: "from-violet-100 to-violet-50",
    accentColor: "bg-violet-400",
  },
  {
    value: "nature",
    label: "Nature-inspired",
    examples: "Ivy, River, Willow, Sage",
    description: "Names from the natural world",
    icon: "🌿",
    borderStyle: "border-l-4 border-l-emerald-400",
    bgStyle: "from-emerald-50/80 to-white",
    activeBg: "from-emerald-100 to-emerald-50",
    accentColor: "bg-emerald-400",
  },
  {
    value: "literary",
    label: "Storied",
    examples: "Atticus, Ophelia, Darcy",
    description: "Names with literary or mythological roots",
    icon: "📚",
    borderStyle: "border-l-4 border-l-rose-400",
    bgStyle: "from-rose-50/80 to-white",
    activeBg: "from-rose-100 to-rose-50",
    accentColor: "bg-rose-400",
  },
  {
    value: "traditional",
    label: "Heritage",
    examples: "Margaret, Thomas, Catherine",
    description: "Names with deep family roots",
    icon: "🏛️",
    borderStyle: "border-l-4 border-l-orange-400",
    bgStyle: "from-orange-50/80 to-white",
    activeBg: "from-orange-100 to-orange-50",
    accentColor: "bg-orange-400",
  },
];

const lengthOptions = [
  { value: "short", label: "Short & sweet", description: "1-2 syllables like Max, Ava" },
  { value: "short-to-medium", label: "Balanced", description: "1-3 syllables, most common" },
  { value: "any", label: "Open to all", description: "Length doesn't matter" },
] as const;

const nicknameOptions = [
  {
    value: "low",
    label: "Full name, please",
    description: "We want the name to stand on its own",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    value: "medium",
    label: "Nicknames welcome",
    description: "Open to natural shortenings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m-12 5h12m-12 5h8" />
      </svg>
    ),
  },
  {
    value: "high",
    label: "Love nicknames",
    description: "More options the better!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
] as const;

export function StyleStep({ formData, updateField }: StyleStepProps) {
  const toggleStyle = (style: string) => {
    const current = formData.stylePreferences;
    if (current.includes(style)) {
      updateField("stylePreferences", current.filter((s) => s !== style));
    } else {
      updateField("stylePreferences", [...current, style]);
    }
  };

  const selectedCount = formData.stylePreferences.length;

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          What speaks to you?
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          Select all the styles that resonate with your family. Don&apos;t overthink it —
          go with your gut.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Style preferences with visual differentiation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {styleOptions.map((option, index) => {
              const isSelected = formData.stylePreferences.includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleStyle(option.value)}
                  className={cn(
                    "relative text-left p-5 rounded-2xl transition-all duration-300 overflow-hidden",
                    "bg-gradient-to-br",
                    option.borderStyle,
                    isSelected
                      ? `${option.activeBg} shadow-card ring-2 ring-studio-ink/20`
                      : `${option.bgStyle} hover:shadow-soft`
                  )}
                >
                  {/* Selection checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-studio-ink rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon and label */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className={cn(
                      "font-semibold transition-colors",
                      isSelected ? "text-studio-ink" : "text-studio-ink/80"
                    )}>
                      {option.label}
                    </span>
                  </div>

                  <div className={cn(
                    "text-xs transition-colors mb-2",
                    isSelected ? "text-studio-ink/60" : "text-studio-ink/50"
                  )}>
                    {option.description}
                  </div>

                  <div className={cn(
                    "text-xs italic transition-colors",
                    isSelected ? "text-studio-ink/50" : "text-studio-ink/35"
                  )}>
                    e.g., {option.examples}
                  </div>

                  {/* Bottom accent indicator */}
                  <motion.div
                    className={cn("absolute bottom-0 left-0 h-0.5 rounded-full", option.accentColor)}
                    initial={{ width: "0%" }}
                    animate={{ width: isSelected ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Selection counter */}
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={false}
            animate={{ opacity: selectedCount > 0 ? 1 : 0.5 }}
          >
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i <= selectedCount ? "bg-studio-terracotta" : "bg-studio-ink/10"
                  )}
                  animate={{ scale: i === selectedCount ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
              {selectedCount > 3 && (
                <span className="text-xs text-studio-terracotta ml-1">+{selectedCount - 3}</span>
              )}
            </div>
            <span className="text-sm text-studio-ink/50">
              {selectedCount === 0
                ? "Select at least one style"
                : `${selectedCount} style${selectedCount !== 1 ? "s" : ""} selected`}
            </span>
          </motion.div>
        </motion.div>

        {/* Length preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-studio-ink text-center">
            How long should the name be?
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {lengthOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField("lengthPreference", option.value)}
                className={cn(
                  "group relative px-5 py-3 rounded-2xl text-sm transition-all duration-200",
                  formData.lengthPreference === option.value
                    ? "bg-studio-ink text-white shadow-elevated"
                    : "bg-white text-studio-ink hover:bg-studio-cream border border-studio-ink/10"
                )}
              >
                <span className="font-medium">{option.label}</span>
                <span className={cn(
                  "block text-xs mt-0.5 transition-colors",
                  formData.lengthPreference === option.value
                    ? "text-white/70"
                    : "text-studio-ink/50"
                )}>
                  {option.description}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Nickname tolerance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-studio-ink text-center">
            How do you feel about nicknames?
          </label>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {nicknameOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField("nicknameTolerance", option.value)}
                className={cn(
                  "relative p-5 rounded-2xl text-center transition-all duration-200",
                  formData.nicknameTolerance === option.value
                    ? "bg-gradient-to-br from-studio-rose/30 to-studio-sage/30 ring-2 ring-studio-ink/20 shadow-soft"
                    : "bg-white/80 border border-studio-ink/5 hover:bg-white hover:shadow-soft"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors",
                  formData.nicknameTolerance === option.value
                    ? "bg-studio-ink/10 text-studio-ink"
                    : "bg-studio-sand text-studio-ink/50"
                )}>
                  {option.icon}
                </div>
                <div className={cn(
                  "font-medium text-sm mb-1 transition-colors",
                  formData.nicknameTolerance === option.value
                    ? "text-studio-ink"
                    : "text-studio-ink/70"
                )}>
                  {option.label}
                </div>
                <div className={cn(
                  "text-xs transition-colors",
                  formData.nicknameTolerance === option.value
                    ? "text-studio-ink/60"
                    : "text-studio-ink/40"
                )}>
                  {option.description}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
