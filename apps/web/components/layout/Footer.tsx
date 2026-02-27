import Link from "next/link";
import { Container } from "./Container";

const currentYear = new Date().getFullYear();

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20c7.732 0 14-6.268 14-14v-.5A13.5 13.5 0 006.5 19H6v1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16c2.5-2 4.5-4.5 6-7.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-studio-border bg-studio-sand mt-auto" id="footer">
      <Container size="xl" className="px-6">
        <div className="py-16 sm:py-20 md:py-32 text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-studio-ink mb-6 sm:mb-8">
            Ready to meet your baby&apos;s name?
          </h2>
          <p className="text-lg sm:text-xl text-studio-muted max-w-xl mx-auto mb-10 sm:mb-12">
            Start your conversational intake now. No commitment required to begin exploring.
          </p>
          <Link href="/intake">
            <button className="bg-studio-forest text-white px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl text-sm sm:text-base font-medium hover:bg-studio-forest-dark transition-colors inline-flex items-center gap-2">
              Start Consultation
            </button>
          </Link>
        </div>

        <div className="py-8 sm:py-10 border-t border-studio-border flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-sm sm:text-base text-studio-muted font-medium">
          <div className="flex items-center gap-2 text-studio-forest">
            <LeafIcon className="w-5 h-5" />
            <span className="font-display text-lg tracking-tight">Namazing</span>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/privacy" className="hover:text-studio-forest transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-studio-forest transition-colors">Terms</Link>
            <Link href="/sign-in" className="hover:text-studio-forest transition-colors">Contact</Link>
          </div>

          <p className="text-sm">&copy; <span suppressHydrationWarning>{currentYear}</span> Namazing. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
