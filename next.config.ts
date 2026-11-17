import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Three root layouts and no app/layout.tsx: unknown URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
  // /video/<company> serves /video, so each outreach email gets its own path in Vercel's stats.
  async rewrites() {
    return [{ source: "/video/:ref", destination: "/video" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
