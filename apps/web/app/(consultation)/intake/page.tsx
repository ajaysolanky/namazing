import { IntakeWizard } from "@/components/intake";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Start Your Consultation | Namazing",
  description: "Tell us about your family and preferences, and we'll find the perfect name for your little one.",
};

export default function IntakePage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <IntakeWizard />
      </main>
      <Footer />
    </>
  );
}
