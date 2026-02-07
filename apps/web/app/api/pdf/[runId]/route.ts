import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/pdf/ReportDocument";
import { fetchResult } from "@/lib/api";
import { SAMPLE_REPORTS } from "@/lib/sample-data";

const PDF_TIMEOUT_MS = 30_000; // 30 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    const { runId } = params;

    // Use static sample data for sample reports, otherwise fetch from backend
    let result;
    if (runId.startsWith("sample-")) {
      const sampleName = runId.replace("sample-", "");
      result = SAMPLE_REPORTS[sampleName];
    } else {
      result = await fetchResult(runId);
    }

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    // Generate PDF buffer with a timeout to prevent blocking the event loop indefinitely
    const pdfBuffer = await Promise.race([
      renderToBuffer(ReportDocument({ result })),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("PDF generation timed out")), PDF_TIMEOUT_MS)
      ),
    ]);

    // Get surname for filename
    const surname = result.profile.family?.surname || "family";
    const filename = `namazing-${surname.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return PDF response
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8Array.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", errorMessage);
    console.error("Stack:", errorStack);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: errorMessage },
      { status: 500 }
    );
  }
}
