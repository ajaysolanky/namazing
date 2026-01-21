import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-studio-rose/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-studio-sage/30 rounded-full blur-3xl" />
          </div>

          <Container size="md" className="relative text-center">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-studio-ink leading-tight">
              Find the perfect name
              <br />
              <span className="text-studio-ink/60">for your little one</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-studio-ink/60 max-w-xl mx-auto">
              Our AI-powered consultation combines deep research, cultural context,
              and personalized curation to discover names your family will love.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/intake">
                <Button size="lg">
                  Start your consultation
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Features section */}
        <section className="py-16 bg-white/50">
          <Container size="lg">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-studio-rose/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-studio-ink mb-2">Deep Research</h3>
                <p className="text-studio-ink/60 text-sm">
                  We explore meanings, origins, popularity trends, and cultural significance for every name.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-studio-sage/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-studio-ink mb-2">Personalized</h3>
                <p className="text-studio-ink/60 text-sm">
                  Your preferences, family name, and style guide every recommendation.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-studio-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-studio-ink mb-2">Curated Results</h3>
                <p className="text-studio-ink/60 text-sm">
                  A beautifully presented shortlist with middle name pairings and thoughtful explanations.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
