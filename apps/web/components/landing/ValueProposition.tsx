import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { landingDesign } from "@/design-system/landing";

function ChatMockup() {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl shadow-studio-forest/5">
      <div className="space-y-6">
        <div className="bg-studio-sand p-4 sm:p-5 rounded-2xl rounded-tl-sm text-[15px] sm:text-base text-studio-muted w-[92%] sm:w-[85%] leading-relaxed">
          Do you have any sibling names we should consider to make sure the vibe matches perfectly?
        </div>
        <div className="bg-studio-forest p-4 sm:p-5 rounded-2xl rounded-tr-sm text-[15px] sm:text-base text-white w-[92%] sm:w-[85%] ml-auto leading-relaxed shadow-md">
          Yes, we have a daughter named Clara. We like classic but not overly trendy.
        </div>
        <div className="bg-studio-sand p-4 sm:p-5 rounded-2xl rounded-tl-sm text-[15px] sm:text-base text-studio-muted w-[95%] sm:w-[90%] leading-relaxed inline-flex gap-3 sm:gap-4 items-center">
          <svg className="w-6 h-6 text-studio-forest shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
          </svg>
          Perfect. I&apos;ll focus on timeless names that pair beautifully with Clara...
        </div>
      </div>
    </div>
  );
}

export function ValueProposition() {
  return (
    <section id="benefits" className={landingDesign.section}>
      <Container size="xl" className="px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
          <div className="w-full md:w-1/2">
            <h2 className={`${landingDesign.headingDisplay} mb-8`}>Beyond baby-name lists.</h2>
            <p className={`${landingDesign.bodyLarge} max-w-lg mb-8`}>
              Most naming sites give you thousands of options and leave you to sort through them. Namazing acts more like a naming consultant: learning your taste, screening the field, and narrowing things down to names that actually suit your family.
            </p>
            <div className="mb-8 space-y-3">
              {[
                "Not just popularity charts and generic meanings",
                "Not just endless scrolling through databases",
                "Not just names in isolation from your family story",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-studio-ink/80 sm:text-base">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-studio-peach shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/#how-it-works">
              <Button variant="forest" className="h-auto px-8 py-3.5 text-base font-medium">See how it works</Button>
            </Link>
          </div>

          <div className="w-full md:w-1/2">
            <ChatMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}
