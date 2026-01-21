"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HeritageStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

// Grouped by region for better organization
const cultureGroups = [
  {
    region: "British Isles",
    cultures: ["English", "Irish", "Scottish", "Welsh"],
  },
  {
    region: "Western Europe",
    cultures: ["French", "German", "Dutch", "Italian", "Spanish", "Portuguese"],
  },
  {
    region: "Nordic & Eastern",
    cultures: ["Scandinavian", "Polish", "Russian", "Greek"],
  },
  {
    region: "Middle East & Africa",
    cultures: ["Arabic", "Hebrew/Jewish", "Persian", "African"],
  },
  {
    region: "Asia",
    cultures: ["Chinese", "Japanese", "Korean", "Indian", "Vietnamese", "Filipino"],
  },
  {
    region: "Americas",
    cultures: ["Latin American", "Native American", "Caribbean"],
  },
];

export function HeritageStep({ formData, updateField }: HeritageStepProps) {
  const [newHonorName, setNewHonorName] = useState("");
  const [customCulture, setCustomCulture] = useState("");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const toggleCulture = (culture: string) => {
    const current = formData.culturalConsiderations;
    if (current.includes(culture)) {
      updateField("culturalConsiderations", current.filter((c) => c !== culture));
    } else {
      updateField("culturalConsiderations", [...current, culture]);
    }
  };

  const addCustomCulture = () => {
    if (customCulture.trim() && !formData.culturalConsiderations.includes(customCulture.trim())) {
      updateField("culturalConsiderations", [...formData.culturalConsiderations, customCulture.trim()]);
      setCustomCulture("");
    }
  };

  const addHonorName = () => {
    if (newHonorName.trim()) {
      updateField("honorNames", [...formData.honorNames, newHonorName.trim()]);
      setNewHonorName("");
    }
  };

  const removeHonorName = (index: number) => {
    updateField("honorNames", formData.honorNames.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Roots & traditions
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          Names carry stories. Tell us about your heritage and anyone you'd like to honor.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-10">
        {/* Cultural backgrounds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="text-center">
            <label className="block text-sm font-medium text-studio-ink mb-1">
              Cultural backgrounds to explore
            </label>
            <p className="text-xs text-studio-ink/50">
              Select any that are meaningful to your family
            </p>
          </div>

          {/* Selected cultures */}
          {formData.culturalConsiderations.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pb-2">
              {formData.culturalConsiderations.map((culture) => (
                <motion.span
                  key={culture}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-studio-ink text-white rounded-full text-sm"
                >
                  {culture}
                  <button
                    onClick={() => toggleCulture(culture)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Culture groups */}
          <div className="space-y-2">
            {cultureGroups.map((group) => (
              <div key={group.region} className="rounded-xl bg-white/60 overflow-hidden">
                <button
                  onClick={() => setExpandedRegion(expandedRegion === group.region ? null : group.region)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
                >
                  <span className="font-medium text-studio-ink text-sm">{group.region}</span>
                  <svg
                    className={cn(
                      "w-4 h-4 text-studio-ink/40 transition-transform",
                      expandedRegion === group.region && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {expandedRegion === group.region && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 flex flex-wrap gap-2">
                        {group.cultures.map((culture) => {
                          const isSelected = formData.culturalConsiderations.includes(culture);
                          return (
                            <button
                              key={culture}
                              onClick={() => toggleCulture(culture)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-all",
                                isSelected
                                  ? "bg-studio-ink text-white"
                                  : "bg-studio-sand text-studio-ink/70 hover:bg-studio-sand/80"
                              )}
                            >
                              {culture}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Add custom culture */}
          <div className="flex gap-2 justify-center">
            <input
              type="text"
              placeholder="Add another heritage..."
              value={customCulture}
              onChange={(e) => setCustomCulture(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomCulture()}
              className="px-4 py-2 bg-white/60 border border-studio-ink/10 rounded-full text-sm focus:outline-none focus:border-studio-ink/30 w-48"
            />
            <Button variant="ghost" size="sm" onClick={addCustomCulture}>
              Add
            </Button>
          </div>
        </motion.div>

        {/* Honor names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="text-center">
            <label className="block text-sm font-medium text-studio-ink mb-1">
              Anyone to honor?
            </label>
            <p className="text-xs text-studio-ink/50">
              Grandparents, relatives, or loved ones whose names hold meaning
            </p>
          </div>

          {formData.honorNames.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {formData.honorNames.map((name, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-studio-sage/50 text-studio-ink rounded-full text-sm"
                >
                  {name}
                  <button
                    onClick={() => removeHonorName(index)}
                    className="hover:bg-studio-ink/10 rounded-full p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <input
              type="text"
              placeholder="Name of person to honor"
              value={newHonorName}
              onChange={(e) => setNewHonorName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHonorName()}
              className="px-4 py-2 bg-white/60 border border-studio-ink/10 rounded-full text-sm focus:outline-none focus:border-studio-ink/30 w-56"
            />
            <Button variant="ghost" size="sm" onClick={addHonorName}>
              Add
            </Button>
          </div>

          <p className="text-center text-xs text-studio-ink/40">
            We'll find names that honor them while still feeling fresh
          </p>
        </motion.div>

        {/* Family traditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="text-center">
            <label className="block text-sm font-medium text-studio-ink mb-1">
              Family naming traditions
            </label>
            <p className="text-xs text-studio-ink/50">
              Any patterns or customs we should know about?
            </p>
          </div>
          <Textarea
            placeholder="e.g., 'All boys have J names', 'First daughters are named after grandmothers', 'We want to break from tradition entirely...'"
            value={formData.familyTraditions}
            onChange={(e) => updateField("familyTraditions", e.target.value)}
            rows={3}
            className="text-sm"
          />
        </motion.div>
      </div>
    </div>
  );
}
