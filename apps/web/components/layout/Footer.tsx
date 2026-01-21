"use client";

import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-studio-ink/5 py-8 mt-auto">
      <Container size="xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-studio-ink/60">namazing</span>
          </div>
          <p className="text-sm text-studio-ink/40">
            Finding the perfect name for your little one
          </p>
        </div>
      </Container>
    </footer>
  );
}
