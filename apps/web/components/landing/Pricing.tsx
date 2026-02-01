"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const features = [
  "Full 5-stage AI consultation pipeline",
  "Deep name research with cultural context",
  "Curated shortlist of 8-12 finalists",
  "Middle name pairing suggestions",
  "Personalized consultation report",
  "Unlimited consultations",
  "Dashboard with run history",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gradient-to-b from-studio-sand to-white/50">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">
            Simple pricing
          </h2>
          <p className="text-studio-ink/60 max-w-lg mx-auto">
            Get started for free. No credit card required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-sm mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-studio-ink/5 text-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-studio-sage/20 rounded-full text-sm text-studio-ink/60 mb-4">
                Free tier
              </span>
              <div className="font-display text-5xl text-studio-ink mb-1">$0</div>
              <p className="text-sm text-studio-ink/50">Free forever</p>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-studio-ink/70">
                  <svg
                    className="w-5 h-5 text-studio-terracotta flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/sign-up">
              <Button variant="terracotta" size="lg" className="w-full">
                Get started free
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
