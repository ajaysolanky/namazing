"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28">
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
            Ready to find <span className="text-gradient-terracotta">the one</span>?
          </h2>
          <p className="text-studio-ink/60 mb-8 max-w-md mx-auto">
            Your perfect baby name is waiting. Start your personalized consultation today.
          </p>
          <Link href="/sign-up" onClick={() => posthog.capture("cta_clicked", { cta: "final", label: "Begin your journey" })}>
            <Button variant="terracotta" size="lg">
              Begin your journey
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
