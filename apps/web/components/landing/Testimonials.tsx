"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

const testimonials = [
  {
    quote:
      "We were completely stuck on names. Namazing gave us a shortlist we both loved, with meanings and combos we never would have found on our own.",
    name: "Sarah & James",
    initials: "SJ",
  },
  {
    quote:
      "The research depth blew me away. Every name came with pronunciation, cultural notes, and popularity trends. It felt like having a naming consultant on speed dial.",
    name: "Priya M.",
    initials: "PM",
  },
  {
    quote:
      "We wanted something that honored our Irish heritage but felt modern. Namazing nailed it with options we hadn't even considered.",
    name: "Ciara & Liam",
    initials: "CL",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-studio-cream/30 to-studio-sand">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">
            Loved by families
          </h2>
          <p className="text-studio-ink/60 max-w-lg mx-auto">
            Hear from parents who found the perfect name for their little one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-white/50"
            >
              <p className="text-studio-ink/70 leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage flex items-center justify-center">
                  <span className="text-xs font-medium text-studio-ink/70">{t.initials}</span>
                </div>
                <span className="text-sm font-medium text-studio-ink">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
