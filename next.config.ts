import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  env: { NEXT_PUBLIC_BASE_PATH: process.env.PAGES_BASE_PATH ?? "" },
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH ?? "",
  images: { unoptimized: true },
  poweredByHeader: false,
  webpack(config) {
    config.module.rules.push({ test: /\.glsl$/i, resourceQuery: /raw/, type: "asset/source" });
    return config;
  },
};

export default nextConfig;
