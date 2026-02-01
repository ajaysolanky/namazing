"use client";

import Link from "next/link";
import { Container } from "./Container";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-studio-ink/5 py-12 mt-auto">
      <Container size="xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-lg text-studio-ink/60">namazing</span>
            <p className="text-sm text-studio-ink/40 mt-2 max-w-xs">
              AI-powered baby name consultation — find the perfect name for your little one.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-studio-ink mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-studio-ink mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-studio-ink mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sign-up" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-sm text-studio-ink/50 hover:text-studio-ink transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-studio-ink/5 pt-6">
          <p className="text-sm text-studio-ink/40 text-center">
            &copy; {currentYear} Namazing. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
