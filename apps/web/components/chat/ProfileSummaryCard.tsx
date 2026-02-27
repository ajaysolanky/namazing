import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ProfileSummaryCardProps {
  summary: string;
  readiness: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ProfileSummaryCard({
  summary,
  readiness,
  onConfirm,
  isSubmitting,
}: ProfileSummaryCardProps) {
  const radialProgress = Math.max(0, Math.min(100, readiness));
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-studio-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="font-display text-lg text-studio-ink">Ready to begin</h3>
            </div>
            <div
              className="w-9 h-9 rounded-full grid place-items-center text-[10px] font-semibold text-studio-ink bg-white/90 border border-studio-ink/10"
              style={{
                background: `conic-gradient(var(--studio-terracotta) ${radialProgress * 3.6}deg, rgba(44,43,41,0.08) 0deg)`,
              }}
              aria-label={`Readiness ${radialProgress}%`}
            >
              <span className="bg-white w-7 h-7 rounded-full grid place-items-center">{radialProgress}%</span>
            </div>
          </div>
        </div>

        {/* Summary text */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-[15px] leading-relaxed text-studio-ink/80">{summary}</p>
        </div>

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
          <p className="text-center text-xs text-studio-ink/45">
            You can keep chatting as long as you want before generating your report.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
