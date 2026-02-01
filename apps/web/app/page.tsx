"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
