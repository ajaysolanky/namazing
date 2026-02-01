"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface HeritageStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

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

  const showBoyMiddle = formData.babyGender !== "girl";
  const showGirlMiddle = formData.babyGender !== "boy";

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Roots & traditions
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          Names carry stories. Tell us about your heritage and anyone you&apos;d like to honor.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* ─── Cultural Heritage ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/50 border border-studio-ink/[0.04] p-5 sm:p-6 space-y-4"
        >
          <div>
            <h2 className="text-sm font-medium text-studio-ink">Cultural heritage</h2>
            <p className="text-xs text-studio-ink/45 mt-0.5">
              Select backgrounds meaningful to your family
            </p>
          </div>

          {/* Selected cultures */}
          <AnimatePresence>
            {formData.culturalConsiderations.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-1.5 overflow-hidden"
              >
                {formData.culturalConsiderations.map((culture) => (
                  <motion.span
                    key={culture}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-studio-ink text-white rounded-full text-xs"
                  >
                    {culture}
                    <button
                      onClick={() => toggleCulture(culture)}
                      className="hover:bg-white/20 rounded-full p-0.5 -mr-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact accordion */}
          <div className="grid grid-cols-2 gap-1.5">
            {cultureGroups.map((group) => {
              const isExpanded = expandedRegion === group.region;
              const hasSelected = group.cultures.some((c) =>
                formData.culturalConsiderations.includes(c)
              );
              return (
                <div
                  key={group.region}
                  className={cn(
                    "rounded-xl overflow-hidden transition-colors",
                    isExpanded ? "col-span-2 bg-studio-sand/60" : "bg-studio-sand/30",
                    hasSelected && !isExpanded && "ring-1 ring-studio-ink/10"
                  )}
                >
                  <button
                    onClick={() => setExpandedRegion(isExpanded ? null : group.region)}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-studio-sand/50 transition-colors"
                  >
                    <span className="text-studio-ink text-xs font-medium">{group.region}</span>
                    <svg
                      className={cn(
                        "w-3.5 h-3.5 text-studio-ink/30 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                          {group.cultures.map((culture) => {
                            const isSelected = formData.culturalConsiderations.includes(culture);
                            return (
                              <button
                                key={culture}
                                onClick={() => toggleCulture(culture)}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-xs transition-all",
                                  isSelected
                                    ? "bg-studio-ink text-white"
                                    : "bg-white/80 text-studio-ink/65 hover:bg-white"
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
              );
            })}
          </div>

          {/* Add custom */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Add another heritage..."
              value={customCulture}
              onChange={(e) => setCustomCulture(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomCulture()}
              className="flex-1 px-3 py-1.5 bg-white/60 border border-studio-ink/8 rounded-full text-xs focus:outline-none focus:border-studio-ink/25 placeholder:text-studio-ink/30"
            />
            <button
              onClick={addCustomCulture}
              className="text-xs text-studio-ink/50 hover:text-studio-ink transition-colors px-2 py-1"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* ─── Family Names (honor + middle combined) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white/50 border border-studio-ink/[0.04] p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="text-sm font-medium text-studio-ink">Family names</h2>
            <p className="text-xs text-studio-ink/45 mt-0.5">
              Names to honor or a middle name you&apos;ve already chosen
            </p>
          </div>

          {/* Honor names subsection */}
          <div className="space-y-3">
            <p className="text-xs text-studio-ink/55 font-medium">Names to draw from</p>

            {formData.honorNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.honorNames.map((name, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-studio-sage/40 text-studio-ink rounded-full text-xs"
                  >
                    {name}
                    <button
                      onClick={() => removeHonorName(index)}
                      className="hover:bg-studio-ink/10 rounded-full p-0.5 -mr-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Grandparent, relative, or loved one..."
                value={newHonorName}
                onChange={(e) => setNewHonorName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHonorName()}
                className="flex-1 px-3 py-1.5 bg-white/60 border border-studio-ink/8 rounded-full text-xs focus:outline-none focus:border-studio-ink/25 placeholder:text-studio-ink/30"
              />
              <button
                onClick={addHonorName}
                className="text-xs text-studio-ink/50 hover:text-studio-ink transition-colors px-2 py-1"
              >
                Add
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-studio-ink/[0.05]" />

          {/* Middle name subsection */}
          <div className="space-y-3">
            <p className="text-xs text-studio-ink/55 font-medium">Already chosen a middle name?</p>

            <div className={cn(
              "grid gap-3",
              showBoyMiddle && showGirlMiddle ? "grid-cols-2" : "grid-cols-1 max-w-[16rem]"
            )}>
              {showBoyMiddle && (
                <input
                  type="text"
                  placeholder={showGirlMiddle ? "Boy middle name" : "Middle name"}
                  value={formData.middleNameBoy}
                  onChange={(e) => updateField("middleNameBoy", e.target.value)}
                  className="px-3 py-1.5 bg-white/60 border border-studio-ink/8 rounded-full text-xs focus:outline-none focus:border-studio-ink/25 placeholder:text-studio-ink/30"
                />
              )}
              {showGirlMiddle && (
                <input
                  type="text"
                  placeholder={showBoyMiddle ? "Girl middle name" : "Middle name"}
                  value={formData.middleNameGirl}
                  onChange={(e) => updateField("middleNameGirl", e.target.value)}
                  className="px-3 py-1.5 bg-white/60 border border-studio-ink/8 rounded-full text-xs focus:outline-none focus:border-studio-ink/25 placeholder:text-studio-ink/30"
                />
              )}
            </div>
            <p className="text-[11px] text-studio-ink/35">
              We&apos;ll pair it with every finalist instead of suggesting alternatives
            </p>
          </div>
        </motion.div>

        {/* ─── Traditions ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/50 border border-studio-ink/[0.04] p-5 sm:p-6 space-y-3"
        >
          <div>
            <h2 className="text-sm font-medium text-studio-ink">Naming traditions</h2>
            <p className="text-xs text-studio-ink/45 mt-0.5">
              Patterns or customs we should know about
            </p>
          </div>
          <Textarea
            placeholder="e.g., 'All boys have J names', 'First daughters are named after grandmothers', 'We want to break from tradition entirely...'"
            value={formData.familyTraditions}
            onChange={(e) => updateField("familyTraditions", e.target.value)}
            rows={2}
            className="text-xs !rounded-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
