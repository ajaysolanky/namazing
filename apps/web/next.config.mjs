const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    // typedRoutes is unsupported by Turbopack; disable when using --turbo
    typedRoutes: !process.env.TURBOPACK,
  },
  transpilePackages: ["@namazing/schemas"],
  async headers() {
    const headers = [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];

    // Avoid stale CSS/JS during local development. Long-term immutable caching
    // on /_next/static is only appropriate for production builds.
    if (process.env.NODE_ENV === "production") {
      headers.push({
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      });
    }

    return headers;
  },
};

export default nextConfig;
