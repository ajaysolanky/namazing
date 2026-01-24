"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { NameCard } from "@/lib/types";

interface FinalistCardProps {
  name: string;
  why: string;
  combo?: {
    first: string;
    middle: string;
    why: string;
  };
  nameCard?: NameCard;
  onViewDetails?: () => void;
  index?: number;
}

export function FinalistCard({
  name,
  why,
  combo,
  nameCard,
  onViewDetails,
  index = 0,
}: FinalistCardProps) {
  const isTopPick = index === 0;

  // Get a meaningful descriptor for the name
  const getMeaningPreview = () => {
    if (nameCard?.meaning) return nameCard.meaning;
    if (nameCard?.origins && nameCard.origins.length > 0) {
      return `${nameCard.origins[0]} origin`;
    }
    return null;
  };

  const meaningPreview = getMeaningPreview();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="h-full"
    >
      <div
        className={cn(
          "relative h-full rounded-3xl transition-all duration-500 group",
          isTopPick
            ? "hover:scale-[1.02] hover:shadow-2xl"
            : "hover:shadow-xl hover:-translate-y-1"
        )}
      >
        {/* Gradient border for top pick */}
        {isTopPick && (
          <>
            <motion.div
              className="absolute -inset-[3px] rounded-3xl bg-gradient-to-br from-studio-rose via-studio-sage to-studio-rose opacity-70 blur-sm"
              animate={{
                background: [
                  "linear-gradient(135deg, #e8c4c4, #c4d4c4, #e8c4c4)",
                  "linear-gradient(135deg, #c4d4c4, #e8c4c4, #c4d4c4)",
                  "linear-gradient(135deg, #e8c4c4, #c4d4c4, #e8c4c4)",
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-studio-rose via-studio-sage to-studio-rose opacity-60" />
          </>
        )}

        <div
          className={cn(
            "relative h-full flex flex-col bg-white rounded-3xl overflow-hidden",
            isTopPick ? "shadow-glow" : "shadow-card"
          )}
        >
          {/* Top accent bar */}
          <div className={cn(
            "h-1.5 w-full",
            isTopPick
              ? "bg-gradient-to-r from-studio-rose via-studio-sage to-studio-rose"
              : "bg-gradient-to-r from-studio-sand via-studio-sage/30 to-studio-sand"
          )} />

          <div className="p-6 sm:p-8 flex flex-col flex-1">
            {/* Top pick badge */}
            {isTopPick && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-studio-rose/20 to-studio-sage/20 rounded-full text-xs font-medium text-studio-ink">
                  <svg className="w-4 h-4 text-studio-rose" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Our Top Pick
                </span>
              </motion.div>
            )}

            {/* Rank number for non-top picks */}
            {!isTopPick && (
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-studio-sand/50 flex items-center justify-center">
                <span className="text-sm font-medium text-studio-ink/40">#{index + 1}</span>
              </div>
            )}

            {/* Name - the star of the show */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
            >
              <h3
                className={cn(
                  "font-display text-studio-ink leading-none",
                  isTopPick ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
                )}
              >
                {name}
              </h3>
              {nameCard?.ipa && (
                <p className="text-sm text-studio-ink/40 mt-2 font-light tracking-wide">
                  {nameCard.ipa}
                </p>
              )}
            </motion.div>

            {/* Meaning preview - gives immediate context */}
            {meaningPreview && (
              <motion.p
                className="text-sm text-studio-sage font-medium mb-3 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-studio-sage" />
                {meaningPreview}
              </motion.p>
            )}

            {/* Why this name - the personalized reason */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              <p className="text-studio-ink/70 leading-relaxed text-[15px]">
                {why}
              </p>
            </motion.div>

            {/* Quick stats */}
            {nameCard && (nameCard.syllables || (nameCard.origins && nameCard.origins.length > 0)) && (
              <motion.div
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-studio-ink/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.6 }}
              >
                {nameCard.syllables && (
                  <span className="px-2.5 py-1 bg-studio-sand/50 rounded-full text-xs text-studio-ink/60">
                    {nameCard.syllables} syllable{nameCard.syllables !== 1 ? 's' : ''}
                  </span>
                )}
                {nameCard.origins && nameCard.origins.slice(0, 2).map((origin) => (
                  <span
                    key={origin}
                    className="px-2.5 py-1 bg-studio-sage/10 rounded-full text-xs text-studio-ink/60"
                  >
                    {origin}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Suggested combo - if available */}
            {combo && (
              <motion.div
                className="mt-5 p-4 bg-gradient-to-br from-studio-sage/15 to-studio-rose/10 rounded-2xl border border-studio-sage/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.7 }}
              >
                <p className="text-xs text-studio-ink/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Perfect Pairing
                </p>
                <p className="font-display text-xl text-studio-ink">
                  {combo.first} <span className="text-studio-ink/30 font-light">&</span> {combo.middle}
                </p>
                <p className="text-sm text-studio-ink/60 mt-1.5 leading-relaxed">{combo.why}</p>
              </motion.div>
            )}

            {/* View details button */}
            {onViewDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewDetails}
                  className="mt-5 w-full group/btn"
                >
                  <span>View full details</span>
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
