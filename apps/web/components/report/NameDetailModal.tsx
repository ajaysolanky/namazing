"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import type { NameCard } from "@/lib/types";

interface NameDetailModalProps {
  nameCard: NameCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NameDetailModal({ nameCard, open, onOpenChange }: NameDetailModalProps) {
  const [showDeepDive, setShowDeepDive] = useState(false);

  if (!nameCard) return null;

  const hasDeepDiveContent =
    (nameCard.popularity?.latest_rank || nameCard.popularity?.trend_notes) ||
    (nameCard.notable_bearers?.positive?.length || nameCard.notable_bearers?.fictional?.length) ||
    nameCard.cultural_notes?.length ||
    (nameCard.combo_suggestions?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) setShowDeepDive(false);
    }}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-b from-studio-cream via-studio-cream to-transparent pt-6 px-6 pb-8 z-10">
          <DialogHeader>
            <DialogTitle className="font-display text-4xl sm:text-5xl text-center">
              {nameCard.name}
            </DialogTitle>
            {nameCard.ipa && (
              <p className="text-center text-studio-ink/50 text-lg mt-1">{nameCard.ipa}</p>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6 -mt-4">
          {/* Quick facts - always visible */}
          <div className="grid grid-cols-2 gap-3">
            {nameCard.meaning && (
              <div className="col-span-2 p-4 bg-white rounded-xl">
                <p className="text-xs text-studio-ink/40 uppercase tracking-wide mb-1">Meaning</p>
                <p className="text-studio-ink">{nameCard.meaning}</p>
              </div>
            )}
            {nameCard.origins && nameCard.origins.length > 0 && (
              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs text-studio-ink/40 uppercase tracking-wide mb-1">Origin</p>
                <p className="text-studio-ink">{nameCard.origins.join(", ")}</p>
              </div>
            )}
            {nameCard.syllables && (
              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs text-studio-ink/40 uppercase tracking-wide mb-1">Syllables</p>
                <p className="text-studio-ink">{nameCard.syllables}</p>
              </div>
            )}
          </div>

          {/* Nicknames */}
          {nameCard.nicknames && (nameCard.nicknames.intended?.length || nameCard.nicknames.likely?.length) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-studio-ink">Nicknames</p>
              <div className="flex flex-wrap gap-2">
                {nameCard.nicknames.intended?.map((nick) => (
                  <span key={nick} className="px-3 py-1.5 bg-studio-sage/30 text-studio-ink rounded-full text-sm">
                    {nick}
                  </span>
                ))}
                {nameCard.nicknames.likely?.map((nick) => (
                  <span key={nick} className="px-3 py-1.5 bg-studio-sand text-studio-ink/70 rounded-full text-sm">
                    {nick}
                  </span>
                ))}
              </div>
              {nameCard.nicknames.avoid && nameCard.nicknames.avoid.length > 0 && (
                <p className="text-xs text-studio-ink/40 mt-1">
                  May want to avoid: {nameCard.nicknames.avoid.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Surname fit */}
          {nameCard.surname_fit && (
            <div className="p-4 bg-studio-rose/10 rounded-xl">
              <p className="text-sm font-medium text-studio-ink mb-1">
                With {nameCard.surname_fit.surname}
              </p>
              <p className="text-sm text-studio-ink/70">{nameCard.surname_fit.notes}</p>
            </div>
          )}

          {/* Sibling fit */}
          {nameCard.sibset_fit && nameCard.sibset_fit.siblings && nameCard.sibset_fit.siblings.length > 0 && (
            <div className="p-4 bg-studio-sage/10 rounded-xl">
              <p className="text-sm font-medium text-studio-ink mb-1">Sibling harmony</p>
              <p className="text-sm text-studio-ink/70">{nameCard.sibset_fit.notes}</p>
            </div>
          )}

          {/* Deep dive toggle */}
          {hasDeepDiveContent && (
            <div className="pt-2">
              <button
                onClick={() => setShowDeepDive(!showDeepDive)}
                className="w-full py-3 text-sm text-studio-ink/60 hover:text-studio-ink flex items-center justify-center gap-2 transition-colors"
              >
                <span>{showDeepDive ? "Hide details" : "Show more details"}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform",
                    showDeepDive && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showDeepDive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4 border-t border-studio-ink/5">
                      {/* Popularity */}
                      {(nameCard.popularity?.latest_rank || nameCard.popularity?.trend_notes) && (
                        <div>
                          <p className="text-sm font-medium text-studio-ink mb-2">Popularity</p>
                          <div className="p-3 bg-white rounded-lg">
                            {nameCard.popularity.latest_rank && (
                              <p className="text-sm text-studio-ink">
                                Current rank: <span className="font-semibold">#{nameCard.popularity.latest_rank}</span>
                              </p>
                            )}
                            {nameCard.popularity.trend_notes && (
                              <p className="text-sm text-studio-ink/70 mt-1">{nameCard.popularity.trend_notes}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notable bearers */}
                      {(nameCard.notable_bearers?.positive?.length || nameCard.notable_bearers?.fictional?.length) && (
                        <div>
                          <p className="text-sm font-medium text-studio-ink mb-2">Notable bearers</p>
                          <div className="space-y-2">
                            {nameCard.notable_bearers.positive && nameCard.notable_bearers.positive.length > 0 && (
                              <div className="p-3 bg-white rounded-lg">
                                <p className="text-xs text-studio-ink/40 uppercase tracking-wide mb-1">Notable figures</p>
                                <p className="text-sm text-studio-ink/70">{nameCard.notable_bearers.positive.join(", ")}</p>
                              </div>
                            )}
                            {nameCard.notable_bearers.fictional && nameCard.notable_bearers.fictional.length > 0 && (
                              <div className="p-3 bg-white rounded-lg">
                                <p className="text-xs text-studio-ink/40 uppercase tracking-wide mb-1">In fiction</p>
                                <p className="text-sm text-studio-ink/70">{nameCard.notable_bearers.fictional.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Cultural notes */}
                      {nameCard.cultural_notes && nameCard.cultural_notes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-studio-ink mb-2">Cultural notes</p>
                          <ul className="space-y-1">
                            {nameCard.cultural_notes.map((note, i) => (
                              <li key={i} className="text-sm text-studio-ink/70 flex items-start gap-2">
                                <span className="text-studio-sage mt-1">•</span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Middle name suggestions */}
                      {nameCard.combo_suggestions && nameCard.combo_suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-studio-ink mb-2">Middle name pairings</p>
                          <div className="space-y-2">
                            {nameCard.combo_suggestions.map((combo, i) => (
                              <div key={i} className="p-3 bg-white rounded-lg">
                                <p className="font-display text-lg text-studio-ink">
                                  {combo.first} {combo.middle}
                                </p>
                                <p className="text-sm text-studio-ink/60 mt-1">{combo.why}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
