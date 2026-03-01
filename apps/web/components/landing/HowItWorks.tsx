import { Container } from "@/components/layout/Container";
import { landingDesign } from "@/design-system/landing";

const items = [
  {
    title: "Tell us your taste",
    description:
      "Share your surname, style, family context, and what you want to avoid in a quick conversational intake.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "We research the shortlist",
    description:
      "Namazing screens each candidate for meaning, cultural resonance, pronunciation, sibling fit, and phonetic flow.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 2v2M15 20v2M9 2v2M9 20v2M20 9h2M20 14h2M2 9h2M2 14h2" />
      </svg>
    ),
  },
  {
    title: "Get a naming report",
    description:
      "Receive a polished report with finalists, why each one fits, pairings, tradeoffs, and a clear recommendation set.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 sm:py-20 md:py-32 border-t border-studio-border">
      <Container size="xl" className="px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32">
          <div className="w-full md:w-1/3 shrink-0">
            <h2 className={`${landingDesign.headingDisplay} md:sticky md:top-32`}>
              <span className="md:hidden">How It Works</span>
              <span className="hidden md:inline">What<br />We Do</span>
            </h2>
            <p className={`${landingDesign.body} mt-5 max-w-xs`}>
              A short editorial-style intake on the front end, then deep research and curation on the back end.
            </p>
          </div>

          <div className="w-full md:w-2/3 grid gap-y-4 sm:gap-y-5">
            {items.map((item, index) => (
              <div key={item.title}>
                <div className="flex gap-4 rounded-[1.6rem] border border-studio-border/80 bg-white/70 p-4 shadow-soft sm:p-5">
                  <div className="shrink-0">
                    <div className="mb-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-studio-sand px-2 text-xs font-semibold text-studio-forest">
                      {index + 1}
                    </div>
                    <div className="scale-[0.9] origin-top-left">{item.icon}</div>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-lg sm:text-xl font-medium tracking-tight text-studio-ink mb-2">{item.title}</h3>
                    <p className={landingDesign.body}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
