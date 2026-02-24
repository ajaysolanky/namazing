import * as Accordion from "@radix-ui/react-accordion";
import { Container } from "@/components/layout/Container";
import { faqs } from "@/data/faqs";
import { landingDesign } from "@/design-system/landing";

export function FAQ() {
  return (
    <section id="faq" className={landingDesign.section}>
      <Container size="md" className="px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-studio-ink mb-4">Frequently asked questions</h2>
          <p className="text-studio-muted max-w-lg mx-auto">Everything you need to know before you begin.</p>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={faq.q}
              value={`faq-${index}`}
              className="bg-white rounded-2xl border border-studio-border shadow-soft overflow-hidden"
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
                <div className="px-6 pb-5 text-sm text-studio-muted leading-relaxed">
                  {faq.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>
    </section>
  );
}
