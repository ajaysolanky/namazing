"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";

function AnimatedBlob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        x: [0, 10, -10, 0],
        y: [0, -10, 10, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function FloatingSparkle({ delay, x, y, size = 4 }: { delay: number; x: string; y: string; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-studio-terracotta/60 to-studio-gold/40"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedHeadline({ children, className }: { children: string; className?: string }) {
  const words = children.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function NamePreviewCard({
  name,
  meaning,
  origins,
  ipa,
  syllables,
  delay,
  href,
}: {
  name: string;
  meaning: string;
  origins: string[];
  ipa: string;
  syllables: number;
  delay: number;
  href?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.04, y: -2 }}
      className="h-full"
    >
      <Link href={(href || `/sample/${name.toLowerCase()}`) as any} className="h-full block">
        <div className="relative bg-white rounded-2xl p-4 shadow-soft border border-studio-ink/5 cursor-pointer group h-full">
          <div className="font-display text-2xl sm:text-3xl text-studio-ink">{name}</div>
          <div className="text-xs text-studio-ink/40 mt-1">
            {ipa} · {syllables} syl
          </div>
          <div className="text-sm text-studio-ink/50 mt-1.5 line-clamp-2">{meaning}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {origins.map((origin) => (
              <span
                key={origin}
                className="inline-block px-2 py-0.5 bg-studio-cream rounded-full text-[11px] text-studio-ink/50"
              >
                {origin}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ReportPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.0 }}
      whileHover={{ y: -4 }}
      className="max-w-md mx-auto"
    >
      <Link href={"/sample/amara" as any} className="block">
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-card hover:shadow-elevated transition-all duration-300 border border-studio-ink/5 cursor-pointer group text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-studio-terracotta to-studio-terracotta-light rounded-full text-xs text-white font-medium mb-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Sample Report Preview
          </div>

          {/* Name */}
          <div className="font-display text-4xl sm:text-5xl text-studio-ink mb-1">Amara</div>

          {/* Pronunciation + meaning */}
          <div className="text-sm text-studio-ink/40 mb-2">/uh-MAH-ruh/ · 3 syllables</div>
          <div className="text-sm text-studio-ink/60 mb-4">
            {"\u201CGrace, mercy\u201D in Igbo \u00B7 \u201CImmortal\u201D in Sanskrit"}
          </div>

          {/* Suggested full name — inline */}
          <div className="text-xs text-studio-ink/40 mb-5">
            Full name suggestion: <span className="font-display text-sm text-studio-ink/70">Amara Chidinma Okafor</span>
          </div>

          {/* Link */}
          <div className="text-sm text-studio-terracotta font-medium group-hover:underline">
            See the full sample report →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated blob composition */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatedBlob
            className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-studio-rose/25 rounded-full blur-3xl blob-organic"
            delay={0}
          />
          <AnimatedBlob
            className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-studio-sage/20 rounded-full blur-3xl blob-organic"
            delay={5}
          />
          <AnimatedBlob
            className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-studio-terracotta/10 rounded-full blur-3xl blob-organic"
            delay={10}
          />

          <FloatingSparkle delay={0} x="15%" y="20%" size={6} />
          <FloatingSparkle delay={1} x="80%" y="25%" size={4} />
          <FloatingSparkle delay={2} x="25%" y="60%" size={5} />
          <FloatingSparkle delay={1.5} x="70%" y="70%" size={4} />
          <FloatingSparkle delay={0.5} x="45%" y="15%" size={5} />
          <FloatingSparkle delay={2.5} x="60%" y="45%" size={6} />
        </div>

        <Container size="md" className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-studio-ink/70 shadow-soft border border-white/50">
              <span className="w-2 h-2 bg-studio-terracotta rounded-full animate-pulse" />
              Free During Early Access
            </span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-studio-ink leading-[1.1] mb-4 sm:mb-6">
            <AnimatedHeadline>Find the</AnimatedHeadline>
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-block"
            >
              <span className="text-gradient-terracotta font-semibold" style={{ fontSize: "1.15em" }}>
                perfect name
              </span>
              <motion.svg
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full h-3 text-studio-terracotta/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.path
                  d="M2 8 Q50 2 100 8 T198 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.svg>
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-studio-ink/50"
            >
              for your little one
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-5 sm:mt-8 text-base sm:text-xl text-studio-ink/60 max-w-xl mx-auto leading-relaxed"
          >
            Tell us your family&apos;s story and heritage. In minutes, get a personalized shortlist
            of 8–12 names — each researched for meaning, cultural roots, pronunciation, and
            middle-name pairings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link href="/intake" onClick={() => posthog.capture("cta_clicked", { cta: "hero", label: "Start your interview" })}>
              <Button variant="terracotta" size="xl" className="animate-gentle-bounce w-full sm:w-auto">
                Start your interview
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-[10px] text-studio-ink/60">
                      {["\u{1F476}", "\u{1F4AB}", "\u2728", "\u{1F31F}"][i - 1]}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-studio-ink/40">
                No credit card needed · Results in minutes
              </span>
            </div>
          </motion.div>

          {/* Report preview card */}
          <div className="mt-12 sm:mt-16">
            <ReportPreviewCard />
          </div>
        </Container>
      </section>

      {/* Sample names preview */}
      <section className="py-12 bg-white">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm text-studio-ink/50 uppercase tracking-wider">
              Explore sample reports — click any name to see a full consultation
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <NamePreviewCard
              name="Amara"
              meaning="Grace, mercy; immortal, eternal"
              origins={["Igbo", "Sanskrit"]}
              ipa="/uh-MAH-ruh/"
              syllables={3}
              delay={0}
            />
            <NamePreviewCard
              name="Rowan"
              meaning="Little red one; rowan tree"
              origins={["Irish", "English"]}
              ipa="/ROH-uhn/"
              syllables={2}
              delay={0.1}
            />
            <NamePreviewCard
              name="Kenji"
              meaning="Intelligent second son; strong and vigorous"
              origins={["Japanese"]}
              ipa="/KEN-jee/"
              syllables={2}
              delay={0.2}
            />
            <NamePreviewCard
              name="Zara"
              meaning="Blooming flower; princess"
              origins={["Arabic", "Hebrew"]}
              ipa="/ZAH-ruh/"
              syllables={2}
              delay={0.3}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
