"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const initial = user?.user_metadata?.display_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || "?";

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-studio-sand/80 backdrop-blur-md border-b border-studio-ink/5">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl text-studio-ink group-hover:text-studio-ink/80 transition-colors">
              namazing
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="text-sm font-medium text-studio-ink/60 hover:text-studio-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-studio-ink/70 hover:text-studio-ink transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-studio-terracotta to-studio-terracotta-light text-white flex items-center justify-center text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        {initial}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-studio-ink/5 py-2 z-50">
                          <div className="px-4 py-2 border-b border-studio-ink/5">
                            <p className="text-sm font-medium text-studio-ink truncate">
                              {user.user_metadata?.display_name || user.email}
                            </p>
                            <p className="text-xs text-studio-ink/40 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-studio-ink/70 hover:bg-studio-cream transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-studio-ink/70 hover:bg-studio-cream transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-studio-ink/70 hover:bg-studio-cream transition-colors"
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button variant="terracotta" size="sm">
                        Get started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-studio-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-studio-ink/5 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="block text-sm font-medium text-studio-ink/60 hover:text-studio-ink transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-sm font-medium text-studio-ink/70 hover:text-studio-ink transition-colors py-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block text-sm font-medium text-studio-ink/70 hover:text-studio-ink transition-colors py-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMobileOpen(false); }}
                      className="block text-sm font-medium text-studio-ink/60 hover:text-studio-ink transition-colors py-1"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" size="sm">Sign in</Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                      <Button variant="terracotta" size="sm">Get started</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}
