import { ProcessingView } from "@/components/processing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Finding Your Perfect Names | Namazing",
  description: "Our naming experts are researching and curating personalized recommendations for you.",
};

interface ProcessingPageProps {
  params: {
    runId: string;
  };
}

export default function ProcessingPage({ params }: ProcessingPageProps) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ProcessingView runId={params.runId} />
      </main>
      <Footer />
    </>
  );
}
