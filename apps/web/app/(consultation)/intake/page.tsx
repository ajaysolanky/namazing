import { Header } from "@/components/layout/Header";
import ChatIntakeClient from "./ChatIntakeClient";

export const metadata = {
  title: "Start Your Consultation | Namazing",
  description: "Tell us about your family and preferences, and we'll find the perfect name for your little one.",
  alternates: {
    canonical: "/intake",
  },
};

export default function IntakePage() {
  return (
    <div className="h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden overscroll-none flex flex-col">
      <Header ctaMode="none" />
      <main className="flex-1 min-h-0 overflow-hidden overscroll-none flex flex-col">
        <ChatIntakeClient />
      </main>
    </div>
  );
}
