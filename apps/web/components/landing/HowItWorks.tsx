import { Container } from "@/components/layout/Container";
import { landingDesign } from "@/design-system/landing";

const items = [
  {
    title: "The Intake Chat",
    description:
      "Have a natural conversation with our AI. Share your vibes, family traditions, and what you want to avoid.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Intelligent Curation",
    description:
      "Our system analyzes thousands of options, cross-referencing meanings, cultural origins, and phonetic flow.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 2v2M15 20v2M9 2v2M9 20v2M20 9h2M20 14h2M2 9h2M2 14h2" />
      </svg>
    ),
  },
  {
    title: "Vetted & Checked",
    description:
      "We act as your personal consultant, vetting names for negative connotations and perfect sibling flow.",
    icon: (
      <svg className="w-8 h-8 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3 8 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Your Dossier",
    description:
      "Unlock a beautifully formatted, comprehensive report detailing your personalized recommendations.",
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
    <section id="how-it-works" className={landingDesign.section}>
      <Container size="xl" className="px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-32">
          <div className="w-full md:w-1/3 shrink-0">
            <h2 className={`${landingDesign.headingDisplay} md:sticky md:top-32`}>
              <span className="md:hidden">What We Do</span>
              <span className="hidden md:inline">What<br />We Do</span>
            </h2>
          </div>

          <div className="w-full md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-16">
            {items.map((item) => (
              <div key={item.title}>
                <div className="flex gap-5">
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-studio-ink mb-3">{item.title}</h3>
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
