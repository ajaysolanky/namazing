"use client";

import { motion } from "framer-motion";
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
    examples: "Elizabeth, James, Charlotte, William",
    description: "Elegant names that have stood the test of time",
  },
  {
    value: "modern",
    label: "Contemporary",
    examples: "Luna, Milo, Aria, Jasper",
    description: "Fresh names with current appeal",
  },
  {
    value: "unique",
    label: "Distinctive",
    examples: "Wren, Soren, Thea, Caspian",
    description: "Uncommon names that stand out",
  },
  {
    value: "nature",
    label: "Nature-inspired",
    examples: "Ivy, River, Willow, Sage",
    description: "Names from the natural world",
  },
  {
    value: "literary",
    label: "Storied",
    examples: "Atticus, Ophelia, Darcy, Holden",
    description: "Names with literary or mythological roots",
  },
  {
    value: "traditional",
    label: "Heritage",
    examples: "Margaret, Thomas, Catherine, Edward",
    description: "Names with deep family roots",
  },
];

const lengthOptions = [
  { value: "short", label: "Short & sweet", description: "1-2 syllables like Max, Ava, Leo" },
  { value: "short-to-medium", label: "Balanced", description: "1-3 syllables, most common" },
  { value: "any", label: "Open to all", description: "Length doesn't matter to us" },
] as const;

const nicknameOptions = [
  {
    value: "low",
    label: "Full name, please",
    description: "We want the name to stand on its own",
    icon: "→",
  },
  {
    value: "medium",
    label: "Nicknames welcome",
    description: "Open to natural shortenings",
    icon: "↔",
  },
  {
    value: "high",
    label: "Love nicknames",
    description: "More options the better!",
    icon: "⇄",
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
          Select all the styles that resonate with your family. Don't overthink it —
          go with your gut.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Style preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {styleOptions.map((option, index) => {
              const isSelected = formData.stylePreferences.includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  onClick={() => toggleStyle(option.value)}
                  className={cn(
                    "relative text-left p-4 rounded-xl border-2 transition-all duration-200",
                    isSelected
                      ? "bg-white border-studio-ink shadow-card"
                      : "bg-white/60 border-transparent hover:bg-white hover:border-studio-ink/10"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-studio-ink rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}

                  <div className="font-medium text-studio-ink mb-1">{option.label}</div>
                  <div className="text-xs text-studio-ink/50 mb-2">{option.description}</div>
                  <div className="text-xs text-studio-ink/40 italic">
                    e.g., {option.examples}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {formData.stylePreferences.length === 0 && (
            <p className="text-center text-sm text-studio-ink/40">
              Select at least one style you're drawn to
            </p>
          )}
        </motion.div>

        {/* Length preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-studio-ink text-center">
            How long should the name be?
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {lengthOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateField("lengthPreference", option.value)}
                className={cn(
                  "group relative px-4 py-2.5 rounded-full text-sm transition-all duration-200",
                  formData.lengthPreference === option.value
                    ? "bg-studio-ink text-white shadow-md"
                    : "bg-white text-studio-ink hover:bg-studio-cream border border-studio-ink/10"
                )}
              >
                <span className="font-medium">{option.label}</span>

                {/* Tooltip on hover */}
                <span className={cn(
                  "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-studio-ink text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                  formData.lengthPreference === option.value && "hidden"
                )}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Nickname tolerance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-studio-ink text-center">
            How do you feel about nicknames?
          </label>
          <div className="grid sm:grid-cols-3 gap-3 max-w-xl mx-auto">
            {nicknameOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateField("nicknameTolerance", option.value)}
                className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all duration-200",
                  formData.nicknameTolerance === option.value
                    ? "bg-white border-studio-ink shadow-soft"
                    : "bg-white/60 border-transparent hover:bg-white hover:border-studio-ink/10"
                )}
              >
                <div className="text-2xl mb-1 opacity-60">{option.icon}</div>
                <div className="font-medium text-studio-ink text-sm">{option.label}</div>
                <div className="text-xs text-studio-ink/50 mt-0.5">{option.description}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
