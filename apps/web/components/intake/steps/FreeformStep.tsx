"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface FreeformStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

const promptIdeas = [
  {
    category: "Practical",
    prompts: [
      "The name needs to work in both English and [language]",
      "Our last name is hard to spell/pronounce, so we need something simple",
      "We want something easy for grandparents to say",
    ],
  },
  {
    category: "Personal",
    prompts: [
      "My partner vetoed [name] because of [reason]",
      "We met in [place/circumstance] and want something connected to that",
      "We're both musicians/doctors/artists and want something that reflects that",
    ],
  },
  {
    category: "Sound",
    prompts: [
      "We love names that start with a soft sound",
      "We want something that sounds strong but not harsh",
      "The name should flow well with our last name [surname]",
    ],
  },
];

export function FreeformStep({ formData, updateField }: FreeformStepProps) {
  const [showPrompts, setShowPrompts] = useState(false);

  const addPromptToNotes = (prompt: string) => {
    const current = formData.additionalNotes;
    const newValue = current ? `${current}\n\n${prompt}` : prompt;
    updateField("additionalNotes", newValue);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Anything else?
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          This is your space to share the details that make your search unique.
          The more we know, the better we can help.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-xl mx-auto space-y-4"
      >
        <Textarea
          placeholder="Share anything else on your mind..."
          value={formData.additionalNotes}
          onChange={(e) => updateField("additionalNotes", e.target.value)}
          rows={6}
          className="text-base resize-none"
        />

        {/* Prompt inspiration toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="inline-flex items-center gap-2 text-sm text-studio-ink/50 hover:text-studio-ink transition-colors"
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform",
                showPrompts && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showPrompts ? "Hide inspiration" : "Need inspiration? See what others share"}
          </button>
        </div>

        {/* Prompt ideas */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {promptIdeas.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-medium text-studio-ink/40 uppercase tracking-wide mb-2">
                      {group.category}
                    </p>
                    <div className="space-y-2">
                      {group.prompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => addPromptToNotes(prompt)}
                          className="w-full text-left p-3 rounded-lg bg-white/60 hover:bg-white border border-transparent hover:border-studio-ink/10 transition-all text-sm text-studio-ink/70 hover:text-studio-ink"
                        >
                          &quot;{prompt}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character count and encouragement */}
        <div className="flex items-center justify-between text-xs text-studio-ink/40">
          <span>
            {formData.additionalNotes.length === 0
              ? "Optional, but helpful"
              : `${formData.additionalNotes.length} characters`}
          </span>
          {formData.additionalNotes.length > 50 && (
            <span className="text-studio-sage">Great detail!</span>
          )}
        </div>
      </motion.div>

      {/* Real example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl mx-auto"
      >
        <div className="relative p-5 bg-gradient-to-br from-studio-cream to-white rounded-2xl border border-studio-ink/5">
          <div className="absolute -top-3 left-4 px-2 bg-studio-sand text-xs text-studio-ink/50">
            Example from another family
          </div>
          <p className="text-sm text-studio-ink/60 italic leading-relaxed">
            &quot;We want something that works in both English and Spanish since we&apos;re a bilingual family.
            My husband vetoed Felix because of a childhood bully. We love nature-inspired names but
            nothing too unusual — we want her to be taken seriously professionally someday. Also,
            our daughter&apos;s middle name will be Rose after my grandmother, so we need a first name
            that flows well with that.&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}
