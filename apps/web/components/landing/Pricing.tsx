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
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">Simple pricing</h2>
          <p className="text-studio-muted max-w-lg mx-auto">Get started for free. No credit card required.</p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-studio-border text-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-studio-forest/10 rounded-full text-sm text-studio-forest font-medium mb-4">
                Early Access
              </span>
              <div className="flex items-baseline justify-center gap-3 mb-1">
                <span className="font-display text-2xl text-studio-ink/30 line-through">$49</span>
                <span className="font-display text-5xl text-studio-ink">$0</span>
              </div>
              <p className="text-sm text-studio-muted">Free during early access, normally $49.</p>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-studio-ink/70">
                  <svg
                    className="w-5 h-5 text-studio-forest flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/intake">
              <Button variant="forest" size="lg" className="w-full">Start Consultation</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
