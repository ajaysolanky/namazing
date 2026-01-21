import { ReportLayout } from "@/components/report";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchResult } from "@/lib/api";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Your Name Consultation | Namazing",
  description: "Your personalized baby name recommendations are ready.",
};

interface ReportPageProps {
  params: {
    runId: string;
  };
}

async function getResult(runId: string) {
  try {
    const result = await fetchResult(runId);
    return result;
  } catch (error) {
    return null;
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const result = await getResult(params.runId);

  if (!result) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <ReportLayout runId={params.runId} result={result} />
      </main>
      <Footer />
    </>
  );
}
