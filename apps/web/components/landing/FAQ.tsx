"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Container } from "@/components/layout/Container";

const faqs = [
  {
    q: "How does the AI naming process work?",
    a: "You share your family story, preferences, and any constraints. Our five-stage pipeline parses your brief, generates candidates, researches each name in depth (meanings, origins, popularity, cultural context), curates a shortlist of 8-12 finalists, and composes a personalized consultation report.",
  },
  {
    q: "Is it really free?",
    a: "Yes! The free tier gives you full access to the consultation pipeline. We may offer premium features in the future, but the core experience is free.",
  },
  {
    q: "What kind of names can it suggest?",
    a: "Any style you like: classic, modern, literary, nature-inspired, heritage-based, and more. You tell us your preferences and cultural background, and the AI explores names across those style lanes.",
  },
  {
    q: "How long does a consultation take?",
    a: "A typical run completes in a few minutes. You can watch the pipeline work in real time as it researches each name candidate.",
  },
  {
    q: "Can I run multiple consultations?",
    a: "Absolutely. Each run is saved to your dashboard so you can compare results, try different briefs, or refine your preferences.",
  },
  {
    q: "Is my data private?",
    a: "Your briefs and results are stored securely and only visible to you. We do not share your personal data with third parties.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">
            Frequently asked questions
          </h2>
          <p className="text-studio-ink/60 max-w-lg mx-auto">
            Everything you need to know about Namazing.
          </p>
        </motion.div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Accordion.Item
                value={`faq-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-studio-ink/5 shadow-soft overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left group">
                    <span className="font-medium text-studio-ink pr-4">{faq.q}</span>
                    <svg
                      className="w-5 h-5 text-studio-ink/40 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-6 pb-5 text-sm text-studio-ink/60 leading-relaxed">
                    {faq.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </Container>
    </section>
  );
}
