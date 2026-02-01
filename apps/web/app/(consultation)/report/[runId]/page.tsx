import { ReportLayout } from "@/components/report";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Try fetching from Supabase first (completed runs)
  const { data: run } = await supabase
    .from("runs")
    .select("user_id, run_results(result)")
    .eq("id", runId)
    .single();

  if (run) {
    // Ownership check
    if (run.user_id !== user.id) return null;

    const results = Array.isArray(run.run_results) ? run.run_results[0] : run.run_results;
    if (results?.result) return results.result;
  }

  // Fallback: fetch from Express (in-progress or legacy runs)
  try {
    return await fetchResult(runId);
  } catch {
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
