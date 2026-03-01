"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SAMPLE_REPORTS } from "@/lib/sample-data";
import { landingDesign } from "@/design-system/landing";

const sampleEntries = [
  {
    slug: "rowan",
    familyLabel: "The Anderson Family",
    briefLabel: "Gender-neutral brief",
    testimonial:
      "We came in with a vague love of nature names. The report turned that into a shortlist that actually felt livable and specific to our family.",
  },
  {
    slug: "kenji",
    familyLabel: "The Tanaka Family",
    briefLabel: "Boy naming brief",
    testimonial:
      "The report balanced Japanese heritage with everyday ease in English. It felt thoughtful, respectful, and far more nuanced than a name list.",
  },
  {
    slug: "zara",
    familyLabel: "The Hassan Family",
    briefLabel: "Girl naming brief",
    testimonial:
      "We needed something short, global, and unmistakably ours. The report captured that tension perfectly and made the final choice much clearer.",
  },
] as const;

function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}...`;
}

export function SampleReportPreview() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateActiveIndex() {
      const cards = Array.from(track.children) as HTMLElement[];
      const trackLeft = track.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => track.removeEventListener("scroll", updateActiveIndex);
  }, []);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(index);
  }

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < sampleEntries.length - 1;

  return (
    <section id="sample-report" className={landingDesign.section}>
      <Container size="xl" className="px-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-studio-forest shadow-soft">
            Sample reports
          </span>
          <h2 className={`${landingDesign.headingDisplay} mt-5 max-w-[12ch] sm:max-w-none`}>
            Browse more sample reports.
          </h2>
          <p className={`${landingDesign.bodyLarge} mt-5 max-w-2xl`}>
            Swipe through a few example families to see how the report changes with different naming styles, cultures, and constraints.
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-studio-muted">
              Scroll through sample reports
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => canGoPrev && scrollToIndex(activeIndex - 1)}
                disabled={!canGoPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-studio-border bg-white text-studio-ink shadow-soft disabled:opacity-40"
                aria-label="Previous sample report"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => canGoNext && scrollToIndex(activeIndex + 1)}
                disabled={!canGoNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-studio-border bg-white text-studio-ink shadow-soft disabled:opacity-40"
                aria-label="Next sample report"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {sampleEntries.map((entry) => {
              const sample = SAMPLE_REPORTS[entry.slug];
              const featured = sample.report.finalists[0];

              return (
                <article
                  key={entry.slug}
                  className="min-w-[85%] snap-start rounded-[1.9rem] border border-studio-border bg-white p-5 shadow-card-green sm:min-w-[27rem]"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm text-studio-muted">
                    <span className="rounded-full bg-studio-sand px-3 py-1 font-medium text-studio-ink">
                      {entry.familyLabel}
                    </span>
                    <span>{entry.briefLabel}</span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-studio-peach/40 bg-studio-sand p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-studio-muted/70">
                      Top match
                    </p>
                    <p className="mt-3 font-display text-4xl text-studio-ink">
                      {featured.name}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-studio-muted">
                      {truncate(featured.why, 120)}
                    </p>
                  </div>

                  <div className="mt-5 border-l-2 border-studio-peach pl-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-studio-muted/70">
                      Report summary
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-studio-muted">
                      {truncate(sample.report.summary, 140)}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-studio-cream/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-studio-muted/70">
                      From this family
                    </p>
                    <blockquote className="mt-3 text-sm leading-relaxed text-studio-ink">
                      &ldquo;{truncate(entry.testimonial, 120)}&rdquo;
                    </blockquote>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/sample/${entry.slug}`}>
                      <Button variant="forest" size="md">
                        Open sample report
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {sampleEntries.map((entry, index) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => scrollToIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-studio-forest" : "w-2.5 bg-studio-border"
                }`}
                aria-label={`View ${SAMPLE_REPORTS[entry.slug].report.finalists[0].name} sample`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
