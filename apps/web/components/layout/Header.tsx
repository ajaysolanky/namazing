"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "./Container";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/#how-it-works", label: "Services" },
  { href: "/#sample-report", label: "Sample Report" },
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

interface HeaderProps {
  ctaMode?: "default" | "none";
}

export function Header({ ctaMode = "default" }: HeaderProps) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return "";
    const metadataName = user.user_metadata?.display_name;
    if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();
    return user.email ?? "Account";
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return "N";
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return displayName.slice(0, 2).toUpperCase();
  }, [displayName]);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="pt-[max(1rem,env(safe-area-inset-top))] md:pt-0 shrink-0">
      <Container size="xl" className="px-6">
        <div className="flex h-16 sm:h-20 md:h-28 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-studio-forest" aria-label="Namazing">
            <LeafIcon className="w-6 h-6 md:w-8 md:h-8" />
            <span className="font-display text-xl leading-none md:text-2xl text-studio-forest tracking-tight">Namazing</span>
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

          {loading ? null : !user ? (
            ctaMode === "none" ? null : (
            <Link href="/intake">
              <button className="border border-studio-forest/40 bg-studio-cream text-studio-forest px-4 py-2.5 md:px-7 md:py-3.5 rounded-xl text-sm md:text-base font-medium hover:bg-white md:border-0 md:bg-studio-forest md:text-white md:hover:bg-studio-forest-dark transition-colors">
                Start Consultation
              </button>
            </Link>
            )
          ) : (
            <div className="relative">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-studio-border bg-white px-3 py-2 hover:border-studio-forest/40"
              >
                <span className="hidden sm:block text-sm font-medium text-studio-ink max-w-[140px] truncate">
                  {displayName}
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-studio-forest text-xs font-semibold text-white">
                  {initials}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Account menu"
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-studio-border bg-white shadow-lg overflow-hidden z-50"
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-studio-ink hover:bg-studio-cream"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-studio-ink hover:bg-studio-cream border-t border-studio-border/80"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 text-sm text-red-700 hover:bg-red-50 border-t border-studio-border/80"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
