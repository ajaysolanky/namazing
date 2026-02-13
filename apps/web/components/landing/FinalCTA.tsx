"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";

export function FinalCTA() {
  return (
    <section className="py-14 sm:py-20">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-white via-studio-cream to-white rounded-3xl p-12 shadow-soft border border-studio-ink/5"
        >
          <div className="mb-6">
            <span className="text-4xl">{"\u2728"}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-studio-ink mb-4">
            Your baby&apos;s perfect name is <span className="text-gradient-terracotta">minutes away</span>
          </h2>
          <p className="text-studio-ink/60 mb-8 max-w-md mx-auto">
            Tell us your story. Our AI does the research. You get a beautiful report with names your whole family will love.
          </p>
          <Link href="/intake" onClick={() => posthog.capture("cta_clicked", { cta: "final", label: "Start your interview" })}>
            <Button variant="terracotta" size="lg">
              Start your interview
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
