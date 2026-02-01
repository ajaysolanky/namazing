"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

const steps = [
  {
    number: 1,
    title: "Tell your story",
    description:
      "Share your family background, style preferences, heritage, and any names you love (or want to avoid).",
  },
  {
    number: 2,
    title: "AI researches",
    description:
      "Our pipeline generates candidates, researches meanings, origins, popularity trends, and cultural context for each.",
  },
  {
    number: 3,
    title: "Get your shortlist",
    description:
      "Receive a curated shortlist of 8-12 finalists with middle name pairings and a warm consultation report.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-gradient-to-b from-white/50 to-studio-cream/30">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-studio-sage/20 rounded-full text-sm text-studio-ink/60 mb-6">
            How it works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">
            A thoughtful naming journey
          </h2>
          <p className="text-studio-ink/60 max-w-lg mx-auto">
            We don&apos;t just suggest names. We understand your story and find names that fit perfectly.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-studio-terracotta/30 via-studio-sage/30 to-studio-rose/30 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex items-start gap-6"
              >
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-soft border border-studio-ink/5 flex items-center justify-center">
                  <span className="font-display text-2xl text-studio-terracotta font-semibold">
                    {step.number}
                  </span>
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl text-studio-ink mb-2">{step.title}</h3>
                  <p className="text-studio-ink/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
