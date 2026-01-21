"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { RunResult, NameCard } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ReportHero } from "./ReportHero";
import { FinalistCard } from "./FinalistCard";
import { NameDetailModal } from "./NameDetailModal";
import { ComboShowcase } from "./ComboShowcase";
import { NearMissesAccordion } from "./NearMissesAccordion";
import { ExportActions } from "./ExportActions";

interface ReportLayoutProps {
  runId: string;
  result: RunResult;
}

export function ReportLayout({ runId, result }: ReportLayoutProps) {
  const [selectedName, setSelectedName] = useState<NameCard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const surname = result.profile.family?.surname || "Family";

  // Create a map of name cards for quick lookup
  const nameCardMap = useMemo(() => {
    const map = new Map<string, NameCard>();
    result.candidates.forEach((card) => {
      map.set(card.name.toLowerCase(), card);
    });
    return map;
  }, [result.candidates]);

  // Get all unique combos
  const allCombos = useMemo(() => {
    const combos: { first: string; middle: string; why: string }[] = [];
    const seen = new Set<string>();

    // From report combos
    if (result.report.combos) {
      result.report.combos.forEach((combo) => {
        const key = `${combo.first}-${combo.middle}`;
        if (!seen.has(key)) {
          seen.add(key);
          combos.push(combo);
        }
      });
    }

    // From finalist combos
    result.report.finalists.forEach((finalist) => {
      if (finalist.combo) {
        const key = `${finalist.combo.first}-${finalist.combo.middle}`;
        if (!seen.has(key)) {
          seen.add(key);
          combos.push(finalist.combo);
        }
      }
    });

    return combos;
  }, [result]);

  const handleViewDetails = (name: string) => {
    const card = nameCardMap.get(name.toLowerCase());
    if (card) {
      setSelectedName(card);
      setModalOpen(true);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <ReportHero surname={surname} summary={result.report.summary} />

      {/* Main content */}
      <Container size="lg" className="py-16 sm:py-20 space-y-20 sm:space-y-24">
        {/* Finalists section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-studio-ink/60 shadow-soft">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top Recommendations
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-studio-ink">
              Our Picks for Your Family
            </h2>
            <p className="text-studio-ink/60 max-w-lg mx-auto">
              Each name carefully selected to match your style, values, and family dynamics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {result.report.finalists.map((finalist, index) => (
              <FinalistCard
                key={finalist.name}
                name={finalist.name}
                why={finalist.why}
                combo={finalist.combo}
                nameCard={nameCardMap.get(finalist.name.toLowerCase())}
                onViewDetails={() => handleViewDetails(finalist.name)}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Combos section */}
        {allCombos.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <ComboShowcase combos={allCombos} />
          </motion.section>
        )}

        {/* Considerations section */}
        {result.report.tradeoffs && result.report.tradeoffs.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-studio-ink/60 shadow-soft">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Food for Thought
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-studio-ink">
                Things to Consider
              </h2>
              <p className="text-studio-ink/60 max-w-lg mx-auto">
                A few thoughtful observations to help guide your decision.
              </p>
            </div>

            <Card variant="glass" padding="lg" className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {result.report.tradeoffs.map((tradeoff, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-studio-rose/30 to-studio-sage/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-studio-ink/60">{index + 1}</span>
                    </div>
                    <p className="text-studio-ink/70 leading-relaxed">{tradeoff}</p>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.section>
        )}

        {/* Tie-break tips */}
        {result.report.tie_break_tips && result.report.tie_break_tips.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-studio-ink/60 shadow-soft">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Helpful Tips
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-studio-ink">
                If You're Torn
              </h2>
              <p className="text-studio-ink/60 max-w-lg mx-auto">
                Loving multiple names is wonderful — here's how to decide.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {result.report.tie_break_tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="gradient" padding="md" className="h-full">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-studio-sage/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-studio-ink/70 leading-relaxed">{tip}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Near misses */}
        {result.selection.near_misses && result.selection.near_misses.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <NearMissesAccordion nearMisses={result.selection.near_misses} />
          </motion.section>
        )}

        {/* Export actions */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ExportActions runId={runId} surname={surname} />
        </motion.section>
      </Container>

      {/* Name detail modal */}
      <NameDetailModal
        nameCard={selectedName}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
