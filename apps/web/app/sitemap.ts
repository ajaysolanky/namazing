import type { MetadataRoute } from "next";
import { SAMPLE_REPORTS } from "@/lib/sample-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const samplePages = Object.keys(SAMPLE_REPORTS).map((name) => ({
    url: `https://namazing.co/sample/${name}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://namazing.co",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://namazing.co/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://namazing.co/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...samplePages,
  ];
}
