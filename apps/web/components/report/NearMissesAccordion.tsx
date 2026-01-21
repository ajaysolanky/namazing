"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NearMiss {
  name: string;
  reason: string;
}

interface NearMissesAccordionProps {
  nearMisses: NearMiss[];
}

export function NearMissesAccordion({ nearMisses }: NearMissesAccordionProps) {
  if (!nearMisses || nearMisses.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-studio-ink/60 shadow-soft">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          More Options
        </div>
      </div>

      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="near-misses" className="border-0">
          <Accordion.Trigger
            className={cn(
              "group flex w-full items-center justify-between rounded-2xl bg-white p-5 sm:p-6 text-left shadow-soft transition-all",
              "hover:shadow-card data-[state=open]:rounded-b-none data-[state=open]:shadow-none"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-studio-sage/30 to-studio-rose/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-studio-ink">
                  Honorable Mentions
                </h3>
                <p className="text-sm text-studio-ink/50 mt-1">
                  {nearMisses.length} lovely names that almost made the cut
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-studio-sand flex items-center justify-center transition-colors group-hover:bg-studio-cream">
              <svg
                className="h-5 w-5 text-studio-ink/40 transition-transform duration-300 group-data-[state=open]:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-b-2xl px-5 sm:px-6 pb-6 shadow-soft"
            >
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-studio-ink/5">
                {nearMisses.map((miss, index) => (
                  <motion.div
                    key={miss.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="group/item flex items-start gap-3 p-4 bg-gradient-to-br from-studio-sand/50 to-studio-cream/50 rounded-xl transition-all hover:shadow-soft"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                      <span className="text-xs font-medium text-studio-ink/40">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-display text-lg text-studio-ink group-hover/item:text-studio-ink/80 transition-colors">
                        {miss.name}
                      </p>
                      <p className="text-sm text-studio-ink/50 mt-1 leading-relaxed">{miss.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
