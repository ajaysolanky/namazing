import Link from "next/link";
import { Container } from "./Container";

const navLinks = [
  { href: "/#how-it-works", label: "Services" },
  { href: "/#benefits", label: "The Dossier" },
  { href: "/#stories", label: "Testimonials" },
];

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20c7.732 0 14-6.268 14-14v-.5A13.5 13.5 0 006.5 19H6v1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16c2.5-2 4.5-4.5 6-7.5" />
    </svg>
  );
}

export function Header() {
  return (
    <header>
      <Container size="xl" className="px-6">
        <div className="flex h-28 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-studio-forest" aria-label="Namazing">
            <LeafIcon className="w-8 h-8" />
            <span className="font-display text-2xl text-studio-forest tracking-tight">Namazing</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="text-base font-medium text-studio-muted hover:text-studio-forest transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/intake">
            <button className="bg-studio-forest text-white px-7 py-3.5 rounded-xl text-base font-medium hover:bg-studio-forest-dark transition-colors">
              Start Consultation
            </button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
