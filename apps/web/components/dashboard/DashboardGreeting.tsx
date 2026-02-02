"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DashboardGreetingProps {
  displayName?: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting({ displayName }: DashboardGreetingProps) {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl px-6 py-12 sm:py-16">
      {/* Ambient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-20 -right-20 w-[350px] h-[350px] bg-studio-rose/20 rounded-full blur-3xl blob-organic pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-studio-sage/15 rounded-full blur-3xl blob-organic pointer-events-none"
      />

      {/* Sparkles */}
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute top-8 right-1/4 text-studio-terracotta/30 text-lg pointer-events-none"
      >
        ✦
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-10 right-1/3 text-studio-rose/40 text-sm pointer-events-none"
      >
        ✦
      </motion.span>

      {/* Content */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl text-studio-ink mb-3"
        >
          {greeting}
          {displayName ? `, ${displayName}` : ""}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="text-studio-ink/50 text-lg"
        >
          Your naming studio awaits
        </motion.p>
      </div>
    </div>
  );
}
