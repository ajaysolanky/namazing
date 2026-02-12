"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { NameCard } from "@/lib/types";

// Map of theme string -> style, passed from parent for max color separation
export type ThemeColorMap = Record<string, typeof THEME_STYLES[number]>;

interface FinalistCardProps {
  name: string;
  why: string;
  nameCard?: NameCard;
  onViewDetails?: () => void;
  index?: number;
  themeColorMap?: ThemeColorMap;
}

// Theme color palette — matches the processing page's THEME_COLORS
const THEME_STYLES = [
  { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400", accent: "#38bdf8" },
  { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", accent: "#fbbf24" },
  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", accent: "#34d399" },
  { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400", accent: "#a78bfa" },
  { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400", accent: "#fb7185" },
  { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400", accent: "#2dd4bf" },
  { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400", accent: "#fb923c" },
] as const;

// Stable hash so the same theme always gets the same color
function hashTheme(theme: string): number {
  let hash = 0;
  for (let i = 0; i < theme.length; i++) {
    hash = (hash * 31 + theme.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getThemeStyle(theme: string | undefined | null) {
  if (!theme || theme === "user-favorite") return null;
  return THEME_STYLES[hashTheme(theme) % THEME_STYLES.length];
}

export function FinalistCard({
  name,
  why,
  nameCard,
  onViewDetails,
  index = 0,
  themeColorMap,
}: FinalistCardProps) {
  const isTopPick = index === 0;
  const isTopThree = index < 3;

  const themeStyle = themeColorMap && nameCard?.theme
    ? themeColorMap[nameCard.theme] ?? null
    : getThemeStyle(nameCard?.theme);

  // Get a meaningful descriptor for the name
  const getMeaningPreview = () => {
    if (nameCard?.meaning) return nameCard.meaning;
    if (nameCard?.origins && nameCard.origins.length > 0) {
      return `${nameCard.origins[0]} origin`;
    }
    return null;
  };

  const meaningPreview = getMeaningPreview();

  // Top pick gets special hero treatment
  if (isTopPick) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-full"
      >
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-studio-rose/30 via-studio-cream to-studio-sage/30"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(248,212,216,0.3), rgba(250,248,245,1), rgba(215,227,212,0.3))",
                "linear-gradient(135deg, rgba(215,227,212,0.3), rgba(250,248,245,1), rgba(248,212,216,0.3))",
                "linear-gradient(135deg, rgba(248,212,216,0.3), rgba(250,248,245,1), rgba(215,227,212,0.3))",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Decorative sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-studio-gold/60 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </div>

          <div className="relative p-10 sm:p-14 lg:p-16">
            {/* Top pick badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-studio-terracotta to-studio-gold text-white rounded-full text-sm font-semibold shadow-glow-terracotta">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Our Top Recommendation
              </span>
            </motion.div>

            {/* Name - dramatic reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-7xl sm:text-8xl lg:text-9xl text-studio-ink leading-none mb-4">
                {name}
              </h2>
              {nameCard?.ipa && (
                <p className="text-lg text-studio-ink/40 font-light tracking-wide">
                  {nameCard.ipa}
                </p>
              )}
            </motion.div>

            {/* Meaning and origin badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {meaningPreview && (
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-studio-ink/70 shadow-soft">
                  {meaningPreview}
                </span>
              )}
              {nameCard?.syllables && (
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-studio-ink/70 shadow-soft">
                  {nameCard.syllables} syllable{nameCard.syllables !== 1 ? "s" : ""}
                </span>
              )}
              {nameCard?.theme && nameCard.theme !== "user-favorite" && (
                <span
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium shadow-soft",
                    themeStyle ? `${themeStyle.bg} ${themeStyle.text}` : "bg-white/80 text-studio-ink/70"
                  )}
                >
                  {nameCard.theme}
                </span>
              )}
              {nameCard?.origins?.slice(0, 2).map((origin) => (
                <span
                  key={origin}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-studio-ink/70 shadow-soft"
                >
                  {origin}
                </span>
              ))}
            </motion.div>

            {/* Why this name */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-studio-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-10"
            >
              {why}
            </motion.p>

            {/* Nicknames */}
            {nameCard?.nicknames && ((nameCard.nicknames.intended?.length ?? 0) > 0 || (nameCard.nicknames.likely?.length ?? 0) > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-10"
              >
                <p className="text-xs text-studio-ink/50 uppercase tracking-wider text-center mb-2">Nicknames</p>
                <div className="flex flex-wrap justify-center gap-2">
                {nameCard.nicknames.intended?.map((nick) => (
                  <span key={nick} className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-studio-ink font-medium shadow-soft border border-studio-ink/5">
                    {nick}
                  </span>
                ))}
                {nameCard.nicknames.likely?.map((nick) => (
                  <span key={nick} className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-studio-ink/60 shadow-soft border border-studio-ink/5">
                    {nick}
                  </span>
                ))}
                </div>
              </motion.div>
            )}

            {/* View details button */}
            {onViewDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Button variant="primary" size="lg" onClick={onViewDetails}>
                  Explore full details
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular cards for positions 2+
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <div
        className={cn(
          "relative h-full rounded-3xl transition-all duration-500 group",
          isTopThree
            ? "hover:scale-[1.02] hover:shadow-2xl"
            : "hover:shadow-xl hover:-translate-y-1"
        )}
      >
        {/* Gradient border for positions 2-3 */}
        {isTopThree && !isTopPick && (
          <>
            <motion.div
              className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-studio-rose via-studio-sage to-studio-rose opacity-50 blur-sm"
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-studio-rose via-studio-sage to-studio-rose opacity-40" />
          </>
        )}

        <div
          className={cn(
            "relative h-full flex flex-col bg-white rounded-3xl overflow-hidden",
            isTopThree ? "shadow-glow" : "shadow-card",
          )}
        >
          {/* Top accent bar */}
          <div
            className={cn(
              "h-1.5 w-full",
              isTopThree
                ? "bg-gradient-to-r from-studio-rose via-studio-sage to-studio-rose"
                : "bg-gradient-to-r from-studio-sand via-studio-sage/30 to-studio-sand"
            )}
            style={themeStyle ? { background: `linear-gradient(90deg, ${themeStyle.accent}66, ${themeStyle.accent}33)` } : undefined}
          />

          <div className="p-6 sm:p-8 flex flex-col flex-1">
            {/* Rank badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                  isTopThree
                    ? "bg-gradient-to-r from-studio-rose/30 to-studio-sage/30 text-studio-ink"
                    : "bg-studio-sand/50 text-studio-ink/50"
                )}
              >
                #{index + 1}
                {isTopThree && !isTopPick && (
                  <>
                    <svg className="w-3.5 h-3.5 text-studio-rose" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </>
                )}
              </span>
              {nameCard?.theme && nameCard.theme !== "user-favorite" && themeStyle && (
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium",
                    themeStyle.bg,
                    themeStyle.text,
                  )}
                >
                  {nameCard.theme}
                </span>
              )}
            </div>

            {/* Name */}
            <motion.div className="mb-4">
              <h3
                className={cn(
                  "font-display text-studio-ink leading-none",
                  isTopThree ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
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

            {/* Meaning preview */}
            {meaningPreview && (
              <p className="text-sm text-studio-ink/60 font-medium mb-3 flex items-center gap-2">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", themeStyle?.dot || "bg-studio-sage")}
                />
                {meaningPreview}
              </p>
            )}

            {/* Why this name */}
            <div className="flex-1">
              <p className="text-studio-ink/70 leading-relaxed text-[15px]">{why}</p>
            </div>

            {/* Quick stats */}
            {nameCard && (nameCard.syllables || (nameCard.origins && nameCard.origins.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-studio-ink/5">
                {nameCard.syllables && (
                  <span className="px-2.5 py-1 bg-studio-sand/50 rounded-full text-xs text-studio-ink/60">
                    {nameCard.syllables} syllable{nameCard.syllables !== 1 ? "s" : ""}
                  </span>
                )}
                {nameCard.origins &&
                  nameCard.origins.slice(0, 2).map((origin) => (
                    <span
                      key={origin}
                      className="px-2.5 py-1 bg-studio-sage/10 rounded-full text-xs text-studio-ink/60"
                    >
                      {origin}
                    </span>
                  ))}
              </div>
            )}

            {/* Nicknames */}
            {nameCard?.nicknames && ((nameCard.nicknames.intended?.length ?? 0) > 0 || (nameCard.nicknames.likely?.length ?? 0) > 0) && (
              <div className="mt-5">
                <p className="text-xs text-studio-ink/40 uppercase tracking-wider mb-1.5">Nicknames</p>
                <div className="flex flex-wrap gap-1.5">
                {nameCard.nicknames.intended?.map((nick) => (
                  <span key={nick} className="px-2.5 py-1 bg-studio-sage/20 rounded-full text-xs font-medium text-studio-ink">
                    {nick}
                  </span>
                ))}
                {nameCard.nicknames.likely?.map((nick) => (
                  <span key={nick} className="px-2.5 py-1 bg-studio-sand/80 rounded-full text-xs text-studio-ink/60">
                    {nick}
                  </span>
                ))}
                </div>
              </div>
            )}

            {/* View details button */}
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={onViewDetails} className="mt-5 w-full group/btn">
                <span>View full details</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
