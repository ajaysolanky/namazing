"use client";

import { motion } from "framer-motion";
import { type IntakeFormData } from "@/hooks/useIntakeForm";

interface ReviewStepProps {
  formData: IntakeFormData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const genderLabel = {
    boy: "boy names",
    girl: "girl names",
    unknown: "names for any gender",
  }[formData.babyGender || "unknown"];

  const hasStyles = formData.stylePreferences.length > 0;
  const hasCultures = formData.culturalConsiderations.length > 0;
  const hasHonorNames = formData.honorNames.length > 0;
  const hasNamesConsidering = formData.namesConsidering.length > 0;
  const hasNamesToAvoid = formData.namesToAvoid.length > 0;

  // Count meaningful inputs for the "what we'll do" section
  const inputCount = [
    hasStyles,
    hasCultures,
    hasHonorNames,
    hasNamesConsidering,
    formData.additionalNotes.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-studio-sage/30 rounded-full text-sm text-studio-ink/70">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Ready to begin
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Here&apos;s what we learned
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          Review your preferences below, then let us work our magic.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-lg mx-auto space-y-4"
      >
        {/* Summary card */}
        <div className="bg-white rounded-2xl p-6 shadow-soft space-y-4">
          {/* Family */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-studio-rose/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-studio-ink">The {formData.surname || "[Surname]"} family</p>
              <p className="text-sm text-studio-ink/60">
                Looking for {genderLabel}
                {formData.siblings.length > 0 && (
                  <> to join {formData.siblings.map((s) => s.name).join(" and ")}</>
                )}
              </p>
            </div>
          </div>

          {/* Style */}
          {hasStyles && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-studio-sage/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-studio-ink">Style preferences</p>
                <p className="text-sm text-studio-ink/60">
                  {formData.stylePreferences.join(", ")}
                  {formData.lengthPreference !== "any" && (
                    <> · {formData.lengthPreference.replace("-", " to ")} names</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Heritage */}
          {(hasCultures || hasHonorNames) && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-studio-ink">Heritage & honors</p>
                <p className="text-sm text-studio-ink/60">
                  {hasCultures && formData.culturalConsiderations.join(", ")}
                  {hasCultures && hasHonorNames && " · "}
                  {hasHonorNames && `Honoring ${formData.honorNames.join(", ")}`}
                </p>
              </div>
            </div>
          )}

          {/* Names */}
          {(hasNamesConsidering || hasNamesToAvoid) && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-studio-ink">Names on your radar</p>
                <p className="text-sm text-studio-ink/60">
                  {hasNamesConsidering && (
                    <>Considering {formData.namesConsidering.map((n) => n.name).join(", ")}</>
                  )}
                  {hasNamesConsidering && hasNamesToAvoid && " · "}
                  {hasNamesToAvoid && (
                    <>Avoiding {formData.namesToAvoid.join(", ")}</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Additional notes */}
          {formData.additionalNotes && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-studio-ink">Your notes</p>
                <p className="text-sm text-studio-ink/60 line-clamp-2">
                  {formData.additionalNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* What we'll do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-studio-cream to-white rounded-2xl p-6 border border-studio-ink/5"
        >
          <h3 className="font-display text-lg text-studio-ink mb-4">
            What happens next
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-studio-rose/30 flex items-center justify-center flex-shrink-0 text-xs font-medium text-studio-ink/60">1</span>
              <p className="text-sm text-studio-ink/70">
                We&apos;ll explore <strong className="text-studio-ink">dozens of names</strong> that match your style and criteria
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-studio-rose/30 flex items-center justify-center flex-shrink-0 text-xs font-medium text-studio-ink/60">2</span>
              <p className="text-sm text-studio-ink/70">
                Each name gets <strong className="text-studio-ink">deep research</strong> — meaning, origin, popularity, cultural notes
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-studio-rose/30 flex items-center justify-center flex-shrink-0 text-xs font-medium text-studio-ink/60">3</span>
              <p className="text-sm text-studio-ink/70">
                Our experts curate a <strong className="text-studio-ink">personalized shortlist</strong> with perfect middle name pairings
              </p>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-studio-ink/5 flex items-center justify-center gap-2 text-sm text-studio-ink/50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Usually takes 2-3 minutes
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
