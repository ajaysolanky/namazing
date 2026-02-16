import ChatIntakeClient from "./ChatIntakeClient";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "Start Your Consultation | Namazing",
  description: "Tell us about your family and preferences, and we'll find the perfect name for your little one.",
  alternates: {
    canonical: "/intake",
  },
};

export default function IntakePage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <ChatIntakeClient />
      </main>
    </>
  );
}
