import { ReportLayout } from "@/components/report";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { getOwnedRunResult } from "@/lib/run-access";
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
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return await getOwnedRunResult(runId, user.id);
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
