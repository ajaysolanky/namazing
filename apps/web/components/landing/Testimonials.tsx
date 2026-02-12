"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

const testimonials = [
  {
    quote:
      "We were completely stuck — couldn't agree on a single name. Namazing gave us 10 finalists in under 5 minutes, and we both fell in love with the same one.",
    name: "Sarah & James",
    initials: "SJ",
    context: "Found their daughter's name",
  },
  {
    quote:
      "The research depth blew me away. We chose Arjun — every name came with pronunciation, cultural notes, and middle-name pairings we never would have thought of.",
    name: "Priya M.",
    initials: "PM",
    context: "Honored their Indian heritage",
  },
  {
    quote:
      "We wanted something that honored our Irish heritage but felt modern. Namazing suggested Siobhán with full cultural context and spelling guidance — perfect.",
    name: "Ciara & Liam",
    initials: "CL",
    context: "Cross-cultural naming consultation",
  },
];

const stats = [
  { value: "8–12", label: "finalist names per report" },
  { value: "~3 min", label: "average consultation time" },
  { value: "5-stage", label: "AI research pipeline" },
];

export function Testimonials() {
  return (
    <section className="py-14 sm:py-24 bg-white">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">
            Loved by families
          </h2>
          <p className="text-studio-ink/60 max-w-lg mx-auto">
            Hear from parents who found the perfect name for their little one.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 mb-10 sm:mb-14"
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <div className="hidden sm:block w-px h-10 bg-studio-ink/10 mx-8" />
              )}
              <div className="text-center">
                <div className="font-display text-2xl sm:text-3xl text-studio-terracotta">
                  {stat.value}
                </div>
                <div className="text-sm text-studio-ink/50">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-studio-cream/50 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-studio-ink/5"
            >
              <p className="text-studio-ink/70 leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage flex items-center justify-center">
                  <span className="text-xs font-medium text-studio-ink/70">{t.initials}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-studio-ink block">{t.name}</span>
                  <span className="text-xs text-studio-ink/40">{t.context}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
