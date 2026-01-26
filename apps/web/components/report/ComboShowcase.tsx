"use client";

import { motion } from "framer-motion";

interface Combo {
  first: string;
  middle: string;
  why: string;
}

interface ComboShowcaseProps {
  combos: Combo[];
}

export function ComboShowcase({ combos }: ComboShowcaseProps) {
  if (!combos || combos.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-studio-ink/60 shadow-soft">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          First + Middle
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-studio-ink">
          First & Middle Name Pairings
        </h2>
        <p className="text-studio-ink/60 max-w-lg mx-auto">
          Our favorite first and middle name combinations for your little one, chosen for rhythm, meaning, and flow.
        </p>
      </motion.div>

      {/* Combo cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {combos.map((combo, index) => (
          <motion.div
            key={`${combo.first}-${combo.middle}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group"
          >
            <div className="relative h-full bg-gradient-to-br from-studio-cream to-white rounded-2xl p-6 shadow-soft border border-studio-ink/5 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              {/* Decorative quote marks */}
              <div className="absolute top-3 right-4 text-4xl text-studio-rose/20 font-serif leading-none">&quot;</div>

              {/* Names */}
              <div className="relative">
                <p className="font-display text-2xl sm:text-3xl text-studio-ink leading-tight">
                  {combo.first}
                  <span className="text-studio-ink/30 mx-1">&</span>
                  <span className="text-studio-ink/80">{combo.middle}</span>
                </p>

                {/* Full name preview */}
                <p className="mt-2 text-sm text-studio-ink/40">
                  {combo.first} {combo.middle}
                </p>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-studio-ink/10 to-transparent" />

              {/* Reasoning */}
              <p className="text-sm text-studio-ink/60 leading-relaxed">{combo.why}</p>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-studio-rose/0 via-studio-rose/50 to-studio-rose/0 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
