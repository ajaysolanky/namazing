"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function NewConsultationCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      whileHover={{ y: -3 }}
    >
      <Card
        variant="gradient"
        padding="lg"
        className="relative overflow-hidden"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-studio-rose/10 via-transparent to-studio-sage/10 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl text-studio-ink mb-3">
            Start a new consultation
          </h2>
          <p className="text-studio-ink/60 mb-6 max-w-lg">
            Tell us about your family, your values, and what matters most — our AI experts will curate a shortlist of names just for you.
          </p>
          <Link href="/intake">
            <Button variant="terracotta" size="md">
              Begin consultation
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
