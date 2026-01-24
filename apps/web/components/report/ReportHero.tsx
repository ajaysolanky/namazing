"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

interface ReportHeroProps {
  surname: string;
  summary: string;
}

// Sparkle component for celebratory effect
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-gradient-to-br from-studio-rose to-studio-sage rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    />
  );
}

export function ReportHero({ surname, summary }: ReportHeroProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Slight delay before showing content for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Parse summary into opening line and details
  const summaryParts = summary.split(/(?<=\.)\s+/).filter(Boolean);
  const openingLine = summaryParts[0] || summary;
  const detailLines = summaryParts.slice(1);

  return (
    <div className="relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-studio-cream via-studio-warm to-studio-sand" />

      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-studio-rose/15 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-studio-sage/15 rounded-full blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Celebratory sparkles */}
        <Sparkle delay={0} x={10} y={20} />
        <Sparkle delay={0.5} x={85} y={15} />
        <Sparkle delay={1} x={20} y={70} />
        <Sparkle delay={1.5} x={75} y={80} />
        <Sparkle delay={2} x={50} y={30} />
        <Sparkle delay={2.5} x={30} y={50} />
        <Sparkle delay={3} x={90} y={45} />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231f2933' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Container size="md" className="relative py-20 sm:py-28">
        {showContent && (
          <div className="text-center space-y-10">
            {/* Celebration badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full text-sm text-studio-ink/70 shadow-soft border border-white/50">
                <span className="w-2 h-2 bg-studio-sage rounded-full animate-pulse" />
                Your personalized name consultation is ready
                <span className="w-2 h-2 bg-studio-rose rounded-full animate-pulse" />
              </span>
            </motion.div>

            {/* Main celebration heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-studio-ink/50 text-xl font-light tracking-wide">
                Introducing names for
              </p>
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-studio-ink leading-none">
                The {surname}
                <span className="block text-4xl sm:text-5xl md:text-6xl mt-2 bg-gradient-to-r from-studio-rose via-studio-ink to-studio-sage bg-clip-text text-transparent">
                  Family
                </span>
              </h1>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-studio-rose/50" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-studio-sage/50" />
            </motion.div>

            {/* Summary as a letter-style message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              {/* Opening line - emphasized */}
              <p className="text-xl sm:text-2xl text-studio-ink/80 font-light leading-relaxed italic">
                &ldquo;{openingLine}&rdquo;
              </p>

              {/* Detail lines - if any */}
              {detailLines.length > 0 && (
                <div className="space-y-3 pt-4">
                  {detailLines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      className="text-base sm:text-lg text-studio-ink/60 leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="pt-8"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-studio-ink/40"
              >
                <span className="text-xs uppercase tracking-widest">Discover your names</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        )}
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-studio-sand to-transparent" />
    </div>
  );
}
