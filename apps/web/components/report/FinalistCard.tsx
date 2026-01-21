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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <div
        className={cn(
          "relative h-full rounded-3xl transition-all duration-300 group",
          isTopPick ? "hover-lift" : "hover:shadow-card hover:-translate-y-0.5"
        )}
      >
        {/* Gradient border for top pick */}
        {isTopPick && (
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-studio-rose via-studio-sage to-studio-rose opacity-60 blur-[1px]" />
        )}

        <div
          className={cn(
            "relative h-full flex flex-col bg-white rounded-3xl p-6 sm:p-8",
            isTopPick ? "shadow-glow" : "shadow-card"
          )}
        >
          {/* Top pick badge */}
          {isTopPick && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-studio-rose to-studio-sage rounded-full text-xs font-medium text-studio-ink shadow-soft">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Our top pick
              </span>
            </div>
          )}

          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-studio-rose/10 to-transparent rounded-3xl" />

          {/* Name */}
          <div className={cn("mb-5", isTopPick && "mt-3")}>
            <motion.h3
              className={cn(
                "font-display text-studio-ink",
                isTopPick ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 + 0.2 }}
            >
              {name}
            </motion.h3>
            {nameCard?.ipa && (
              <p className="text-sm text-studio-ink/40 mt-2 font-light tracking-wide">
                {nameCard.ipa}
              </p>
            )}
          </div>

          {/* Why this name */}
          <p className="text-studio-ink/70 leading-relaxed flex-1 text-[15px]">
            {why}
          </p>

          {/* Quick facts */}
          {nameCard && (
            <div className="mt-5 pt-5 border-t border-studio-ink/5 space-y-3">
              {nameCard.meaning && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-studio-sage/30 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  <div className="text-sm">
                    <span className="text-studio-ink/40 block text-xs uppercase tracking-wider mb-0.5">Meaning</span>
                    <span className="text-studio-ink/70">{nameCard.meaning}</span>
                  </div>
                </div>
              )}
              {nameCard.origins && nameCard.origins.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-studio-rose/30 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </span>
                  <div className="text-sm">
                    <span className="text-studio-ink/40 block text-xs uppercase tracking-wider mb-0.5">Origin</span>
                    <span className="text-studio-ink/70">{nameCard.origins.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggested combo */}
          {combo && (
            <div className="mt-5 p-4 bg-gradient-to-br from-studio-sage/20 to-studio-sage/10 rounded-2xl border border-studio-sage/20">
              <p className="text-xs text-studio-ink/50 uppercase tracking-wider mb-2">Perfect pairing</p>
              <p className="font-display text-xl text-studio-ink">
                {combo.first} <span className="text-studio-ink/40">&</span> {combo.middle}
              </p>
              <p className="text-sm text-studio-ink/60 mt-2 leading-relaxed">{combo.why}</p>
            </div>
          )}

          {/* View details button */}
          {onViewDetails && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}
