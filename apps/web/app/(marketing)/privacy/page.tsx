import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "Privacy Policy | Namazing",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <Container size="sm">
          <h1 className="font-display text-4xl text-studio-ink mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral max-w-none text-studio-ink/70 space-y-6">
            <p>
              <strong>Last updated:</strong> January 2026
            </p>
            <p>
              Namazing (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
            <h2 className="font-display text-2xl text-studio-ink mt-8">Information We Collect</h2>
            <p>
              We collect information you provide directly, including your email address, display name,
              and the content of your naming consultation briefs and results.
            </p>
            <h2 className="font-display text-2xl text-studio-ink mt-8">How We Use Your Information</h2>
            <p>
              We use your information to provide and improve the Namazing service, including generating
              personalized name recommendations and storing your consultation history.
            </p>
            <h2 className="font-display text-2xl text-studio-ink mt-8">Data Storage</h2>
            <p>
              Your data is stored securely using Supabase infrastructure. We do not sell or share your
              personal data with third parties.
            </p>
            <h2 className="font-display text-2xl text-studio-ink mt-8">Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@namazing.com.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
