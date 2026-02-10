import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-6xl sm:text-7xl text-studio-ink mb-4">
        404
      </h1>
      <p className="text-lg text-studio-ink/60 mb-8 max-w-md">
        We couldn&apos;t find that page. It may have been moved or doesn&apos;t
        exist.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-full bg-studio-terracotta text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
        <Link
          href="/#faq"
          className="inline-flex items-center px-6 py-3 rounded-full border border-studio-ink/10 text-studio-ink/70 font-medium text-sm hover:bg-white/50 transition-colors"
        >
          FAQ
        </Link>
      </div>
    </div>
  );
}
