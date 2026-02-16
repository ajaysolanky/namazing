import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { ChatProfile } from "@/lib/chat-utils";

interface ProfileSummaryCardProps {
  summary: string;
  profile: ChatProfile;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ProfileSummaryCard({
  summary,
  profile,
  onConfirm,
  isSubmitting,
}: ProfileSummaryCardProps) {
  const fields: Array<{ label: string; value: string }> = [];

  if (profile.surname) fields.push({ label: "Surname", value: profile.surname });

  if (profile.babyGender) {
    const genderLabel = { boy: "Boy", girl: "Girl", unknown: "Not sure yet" }[profile.babyGender] || profile.babyGender;
    fields.push({ label: "Gender", value: genderLabel });
  }

  if (profile.siblings?.length) {
    fields.push({ label: "Siblings", value: profile.siblings.join(", ") });
  }

  if (profile.stylePreferences?.length) {
    fields.push({ label: "Style", value: profile.stylePreferences.join(", ") });
  }

  if (profile.namesConsidering?.length) {
    fields.push({ label: "Considering", value: profile.namesConsidering.join(", ") });
  }

  if (profile.namesToAvoid?.length) {
    fields.push({ label: "Avoiding", value: profile.namesToAvoid.join(", ") });
  }

  if (profile.culturalConsiderations?.length) {
    fields.push({ label: "Heritage", value: profile.culturalConsiderations.join(", ") });
  }

  if (profile.honorNames?.length) {
    fields.push({ label: "Honor names", value: profile.honorNames.join(", ") });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-[90%] md:max-w-[80%] mx-auto"
    >
      <div className="bg-gradient-to-br from-white to-studio-cream rounded-2xl shadow-card border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-studio-rose/30 via-studio-cream to-studio-sage/30 px-6 py-4 border-b border-studio-ink/5">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-studio-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="font-display text-lg text-studio-ink">Ready to begin</h3>
          </div>
        </div>

        {/* Summary text */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-[15px] leading-relaxed text-studio-ink/80">{summary}</p>
        </div>

        {/* Profile fields */}
        {fields.length > 0 && (
          <div className="px-6 pb-5">
            <div className="flex flex-wrap gap-2">
              {fields.map(({ label, value }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-studio-ink/[0.04] text-sm"
                >
                  <span className="text-studio-ink/50">{label}:</span>
                  <span className="text-studio-ink/80 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          <Button
            variant="terracotta"
            size="lg"
            shimmer
            className="w-full"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Starting...
              </>
            ) : (
              "Start my consultation"
            )}
          </Button>
          <p className="text-center text-xs text-studio-ink/40">
            Want to add more? Keep chatting above
          </p>
        </div>
      </div>
    </motion.div>
  );
}
