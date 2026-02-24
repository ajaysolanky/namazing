import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { landingDesign } from "@/design-system/landing";

export function FinalCTA() {
  return (
    <section className={landingDesign.section}>
      <Container size="md" className="px-6">
        <div className="text-center">
          <h2 className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-studio-ink mb-8">
            Ready to meet your baby&apos;s name?
          </h2>
          <p className={`${landingDesign.bodyLarge} mb-12 max-w-xl mx-auto`}>
            Start your consultation now. No commitment required to begin exploring.
          </p>
          <Link href="/intake">
            <Button variant="forest" size="lg">Make an Appointment</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
