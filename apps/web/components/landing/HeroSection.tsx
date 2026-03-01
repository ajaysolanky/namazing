import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { landingDesign } from "@/design-system/landing";

function DossierCard() {
  return (
    <div className="relative z-10 w-full max-w-[18rem] sm:max-w-sm origin-top">
      <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-studio-forest/5 text-left">
        <div className="flex items-start justify-between mb-5 pb-4 sm:mb-8 sm:pb-6 border-b border-studio-border">
          <div>
            <div className="text-[11px] sm:text-sm font-medium text-studio-peach uppercase tracking-[0.24em] sm:tracking-widest mb-2 inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top Match
            </div>
            <h3 className="font-display text-[3rem] leading-none sm:text-5xl tracking-tight text-studio-ink">Amara</h3>
          </div>
        </div>

        <div className="space-y-5 sm:space-y-8">
          <div>
            <p className="text-[15px] sm:text-base font-medium text-studio-ink mb-2 sm:mb-3 inline-flex items-center gap-2.5">
              <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Meaning
            </p>
            <p className="text-[15px] sm:text-base text-studio-muted leading-relaxed">
              Grace in Igbo, eternal in Sanskrit. A name with real cultural depth that still feels easy and elegant in everyday use.
            </p>
          </div>

          <div className="bg-studio-sand rounded-2xl p-4 sm:p-6">
            <p className="text-[15px] sm:text-base font-medium text-studio-ink mb-3 sm:mb-4 inline-flex items-center gap-2.5">
              <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-studio-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why it fits
            </p>
            <p className="text-[15px] sm:text-base text-studio-muted leading-relaxed">
              A warm, cross-cultural choice that pairs beautifully with sibling name Ezra and travels naturally between Nigeria and the U.S.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTeaserCard() {
  return (
    <Link href="/sample/amara" className="block md:hidden mt-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-studio-border bg-white p-5 shadow-card-green">
            <div className="absolute right-[-2rem] top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-studio-peach/80" />
            <div className="relative z-10 max-w-[75%]">
              <div className="text-[11px] font-medium text-studio-peach uppercase tracking-[0.24em] mb-2 inline-flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Top match preview
              </div>
              <h3 className="font-display text-4xl leading-none tracking-tight text-studio-ink">
                Amara
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-studio-muted">
                Graceful, cross-cultural, and at home in more than one world.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-studio-sand px-3 py-1.5 text-xs font-medium text-studio-forest">
                See a real sample report
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className={landingDesign.sectionWide}>
      <Container size="xl" className="px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 pb-2 md:pb-0">
            <h1 className={`${landingDesign.heroHeading} max-w-[9ch] sm:max-w-none`}>
              <span className="md:hidden">Find the perfect name, beautifully curated for your family.</span>
              <span className="hidden md:inline">Find the perfect<br />name, beautifully<br />curated for you.</span>
            </h1>
            <p className={`${landingDesign.bodyLarge} max-w-[28ch] sm:max-w-md mt-6 sm:mt-8`}>
              Answer a short baby-name intake, then get a personalized naming report with researched finalists, meanings, sibling fit, and cultural context.
            </p>
            <div className="mt-7 sm:mt-8 md:mt-10">
              <Link href="/intake">
                <Button variant="forest" size="lg" className="h-auto px-8 sm:px-9 py-3.5 sm:py-4 text-base font-medium">Start Consultation</Button>
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5 text-sm font-medium text-studio-muted">
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-soft">5-minute intake</span>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-soft">No credit card</span>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-soft">Baby name guide</span>
            </div>
            <MobileTeaserCard />
          </div>

          <div className="hidden md:flex w-full md:w-1/2 relative justify-center items-start md:items-center h-[355px] sm:h-[500px] mt-3 sm:mt-6 md:mt-0">
            <div className="absolute right-[-1.25rem] top-[46%] -translate-y-1/2 w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] md:w-[480px] md:h-[480px] bg-studio-peach rounded-full -z-10 sm:translate-x-4 md:translate-x-12" />
            <DossierCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
