"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ExportActionsProps {
  runId: string;
  surname: string;
}

export function ExportActions({ runId, surname }: ExportActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60_000);
      const response = await fetch(`/api/pdf/${runId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate PDF (${response.status})`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/pdf")) {
        throw new Error("Invalid response from PDF endpoint");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `namazing-${surname.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      setDownloadError(error instanceof Error ? error.message : "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out the baby names we're considering for the ${surname} family!`;

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `Baby names for the ${surname} family`
    )}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  };

  return (
    <Card variant="gradient" padding="lg" className="bg-gradient-to-br from-white via-studio-cream/50 to-studio-rose/10 border border-studio-ink/5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-studio-terracotta to-studio-gold flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-xl text-studio-ink">Save & share your results</h3>
              <p className="text-sm text-studio-ink/60">
                Download a beautiful PDF to share with your partner, or share online.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Share dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowShareOptions(!showShareOptions)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </Button>

            {showShareOptions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowShareOptions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-studio-ink/5 py-2 z-20"
                >
                  <button
                    onClick={() => {
                      handleCopyLink();
                      setShowShareOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-studio-ink hover:bg-studio-sand/50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copySuccess ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    onClick={() => {
                      shareViaEmail();
                      setShowShareOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-studio-ink hover:bg-studio-sand/50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-studio-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                  <button
                    onClick={() => {
                      shareToTwitter();
                      setShowShareOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-studio-ink hover:bg-studio-sand/50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-studio-ink/50" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter / X
                  </button>
                  <button
                    onClick={() => {
                      shareToFacebook();
                      setShowShareOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-studio-ink hover:bg-studio-sand/50 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-studio-ink/50" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Download PDF */}
          <div className="flex flex-col items-end gap-1">
            <Button variant="terracotta" size="lg" onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </>
              )}
            </Button>
            {downloadError && (
              <p className="text-xs text-red-500">{downloadError}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
