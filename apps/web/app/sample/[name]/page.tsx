import { ReportLayout } from "@/components/report";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SAMPLE_REPORTS } from "@/lib/sample-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const VALID_NAMES = Object.keys(SAMPLE_REPORTS);

interface SamplePageProps {
  params: { name: string };
}

export function generateStaticParams() {
  return VALID_NAMES.map((name) => ({ name }));
}

export function generateMetadata({ params }: SamplePageProps): Metadata {
  const name = params.name.toLowerCase();
  const result = SAMPLE_REPORTS[name];
  if (!result) return {};

  const firstName = result.report.finalists[0]?.name ?? name;
  return {
    title: `${firstName} — Sample Report | Namazing`,
    description: `See a sample Namazing consultation report featuring the name ${firstName}.`,
    alternates: {
      canonical: `/sample/${name}`,
    },
  };
}

export default function SampleReportPage({ params }: SamplePageProps) {
  const name = params.name.toLowerCase();
  const result = SAMPLE_REPORTS[name];

  if (!result) {
    notFound();
  }

  const firstName = result.report.finalists[0]?.name ?? name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${firstName} — Sample Report`,
            description: `See a sample Namazing consultation report featuring the name ${firstName}.`,
            url: `https://namazing.co/sample/${name}`,
          }),
        }}
      />
      <Header />
      <main className="flex-1">
        <ReportLayout runId={`sample-${name}`} result={result} />
      </main>
      <Footer />
    </>
  );
}
