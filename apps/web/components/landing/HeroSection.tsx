"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

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

function NamePreviewCard({ name, meaning, delay }: { name: string; meaning: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-4 shadow-soft border border-studio-ink/5"
    >
      <div className="font-display text-2xl text-studio-ink">{name}</div>
      <div className="text-sm text-studio-ink/50 mt-1">{meaning}</div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
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
              AI-Powered Baby Name Consultation
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-studio-ink leading-[1.1] mb-6">
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
            className="mt-8 text-lg sm:text-xl text-studio-ink/60 max-w-xl mx-auto leading-relaxed"
          >
            Our AI-powered consultation combines deep research, cultural context,
            and personalized curation to discover names your family will love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link href="/sign-up">
              <Button variant="terracotta" size="xl" className="animate-gentle-bounce">
                Get started free
              </Button>
            </Link>
            <p className="text-sm text-studio-ink/40">
              Free — create your account in seconds
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-xs text-studio-ink/60">
                      {["\u{1F476}", "\u{1F4AB}", "\u2728", "\u{1F31F}"][i - 1]}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-studio-ink/50">
                Trusted by growing families
              </span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Sample names preview */}
      <section className="py-12 bg-gradient-to-b from-studio-sand to-white/50">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm text-studio-ink/40 uppercase tracking-wider">
              Sample from our curated collections
            </p>
          </motion.div>
          <div className="flex justify-center gap-4 flex-wrap">
            <NamePreviewCard name="Eliana" meaning="God has answered" delay={0} />
            <NamePreviewCard name="Rowan" meaning="Little red one" delay={0.1} />
            <NamePreviewCard name="Sienna" meaning="From Siena" delay={0.2} />
            <NamePreviewCard name="Theodore" meaning="Divine gift" delay={0.3} />
          </div>
        </Container>
      </section>
    </>
  );
}
