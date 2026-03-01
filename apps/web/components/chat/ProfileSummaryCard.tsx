import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ProfileSummaryCardProps {
  portraitSummary: string;
  briefSummary: string;
  readiness: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ProfileSummaryCard({
  portraitSummary,
  briefSummary,
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
        <div className="bg-gradient-to-r from-studio-rose/30 via-studio-cream to-studio-sage/30 px-6 py-4 border-b border-studio-ink/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-studio-terracotta"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-display text-lg text-studio-ink">Ready to begin</h3>
                <p className="text-xs text-studio-ink/55">Here&apos;s the brief I&apos;ll carry into the report.</p>
              </div>
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

        <div className="px-6 pt-5 pb-4 space-y-4">
          <section className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-studio-ink/45">What I understand about you</p>
            <p className="text-[15px] leading-relaxed text-studio-ink/80">{portraitSummary}</p>
          </section>
          <section className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-studio-ink/45">What the name needs to do</p>
            <p className="text-[15px] leading-relaxed text-studio-ink/80">{briefSummary}</p>
          </section>
        </div>

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
            If anything feels off, keep chatting below and I&apos;ll refine the brief before we generate the report.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
