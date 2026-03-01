import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { landingDesign } from "@/design-system/landing";

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
    <section id="pricing" className={landingDesign.section}>
      <Container size="md" className="px-6">
        <div className="rounded-[2rem] border border-studio-border bg-white px-6 py-8 text-center shadow-soft sm:px-8">
          <span className="inline-block rounded-full bg-studio-forest/10 px-3 py-1 text-sm font-medium text-studio-forest">
            Early access
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-studio-ink">
            Start free while we&apos;re in early access.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-studio-muted sm:text-lg">
            Full consultation pipeline, researched finalists, and your personalized naming report. No credit card required.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-studio-ink/70">
            {features.slice(0, 4).map((feature) => (
              <span key={feature} className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-studio-forest"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/intake">
              <Button variant="forest" size="lg">Start Consultation</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
