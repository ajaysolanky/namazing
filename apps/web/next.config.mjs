const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ["@namazing/schemas"],
};

export default nextConfig;
