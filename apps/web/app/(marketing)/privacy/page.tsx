import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Namazing collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <h1 className="font-display text-4xl text-studio-ink mb-2">Privacy Policy</h1>
          <p className="text-sm text-studio-ink/50 mb-10">Last updated: February 6, 2026</p>

          <div className="prose prose-neutral max-w-none space-y-8 text-studio-ink/80">
            <section>
              <h2 className="font-display text-xl text-studio-ink">1. Information we collect</h2>
              <p>
                <strong>Account information.</strong> When you sign in with Google, we receive your
                name, email address, and profile picture from Google. We do not receive or store your
                Google password.
              </p>
              <p>
                <strong>Naming preferences.</strong> When you use our service, we collect the
                preferences and criteria you provide for baby name consultations (e.g., cultural
                background, style preferences, family surname).
              </p>
              <p>
                <strong>Usage data.</strong> We collect anonymous analytics about how you use the app
                (pages visited, features used) to improve the service. We do not use cookies for
                tracking.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">2. How we use your information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide and personalize the baby name consultation service</li>
                <li>To generate your name reports and PDF exports</li>
                <li>To authenticate your account and maintain your session</li>
                <li>To improve and develop new features</li>
                <li>To communicate with you about your account or the service</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">3. AI processing</h2>
              <p>
                Your naming preferences are processed by AI language models to generate personalized
                name recommendations. Your data may be sent to third-party AI providers for
                processing. These providers are contractually bound to keep your data confidential and
                not use it for their own purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">4. Data storage and security</h2>
              <p>
                Your data is stored securely using Supabase, which provides encryption at rest and in
                transit. We retain your account data and consultation results for as long as your
                account is active. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">5. Data sharing</h2>
              <p>
                We do not sell your personal information. We share data only with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI processing providers (to generate name recommendations)</li>
                <li>Infrastructure providers (hosting, database, authentication)</li>
                <li>Analytics providers (anonymous usage data only)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">6. Your rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">7. Children&apos;s privacy</h2>
              <p>
                Namazing is intended for use by expecting parents and is not directed at children
                under 13. We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">8. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. We will notify you of significant changes
                by posting a notice on our website or sending you an email.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-studio-ink">9. Contact</h2>
              <p>
                If you have questions about this privacy policy or want to exercise your rights,
                contact us at{" "}
                <a href="mailto:hello@namazing.co" className="text-studio-terracotta hover:underline">
                  hello@namazing.co
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
