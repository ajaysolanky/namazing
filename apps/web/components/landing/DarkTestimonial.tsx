import { Container } from "@/components/layout/Container";

export function DarkTestimonial() {
  return (
    <section id="stories" className="py-24 md:py-32 border-t border-studio-border">
      <Container size="md" className="px-6">
        <div className="max-w-4xl mx-auto text-center">
          <svg className="w-14 h-14 mx-auto mb-10 text-studio-peach opacity-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
          </svg>

          <blockquote className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.3] text-studio-ink mb-12">
            &ldquo;We spent months arguing over names on random apps. Namazing&apos;s chat took 5 minutes, and the report gave us &lsquo;the one&rsquo; almost instantly.&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-5">
            <div className="w-14 h-14 rounded-full bg-studio-forest text-white flex items-center justify-center text-base font-medium">
              S&amp;J
            </div>
            <div className="text-left">
              <span className="text-base font-medium text-studio-ink block">Sarah &amp; James T.</span>
              <span className="text-sm text-studio-muted mt-1 block">Found their son&apos;s name in 2023</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
