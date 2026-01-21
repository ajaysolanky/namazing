"use client";

import Link from "next/link";
import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-studio-sand/80 backdrop-blur-md border-b border-studio-ink/5">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl text-studio-ink group-hover:text-studio-ink/80 transition-colors">
              namazing
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/intake"
              className="text-sm font-medium text-studio-ink/70 hover:text-studio-ink transition-colors"
            >
              Start consultation
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
