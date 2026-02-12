"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";

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
    <section id="pricing" className="py-14 sm:py-24 bg-studio-blush">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
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
              <span className="inline-block px-3 py-1 bg-studio-terracotta/15 rounded-full text-sm text-studio-terracotta font-medium mb-4">
                Early Access
              </span>
              <div className="flex items-baseline justify-center gap-3 mb-1">
                <span className="font-display text-2xl text-studio-ink/30 line-through">$49</span>
                <span className="font-display text-5xl text-studio-ink">$0</span>
              </div>
              <p className="text-sm text-studio-ink/50">Free during early access — normally $49</p>
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

            <Link href="/sign-up" onClick={() => posthog.capture("cta_clicked", { cta: "pricing", label: "Get your free name report" })}>
              <Button variant="terracotta" size="lg" className="w-full">
                Get your free name report
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
