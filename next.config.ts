import type { NextConfig } from "next";

/** The Ringgy NestJS API. Read on the server only (rewrites, live plans). */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Public landing-page links, inlined into the bundle at build time so the
  // client components can read them without a NEXT_PUBLIC_ prefix.
  env: {
    PORTAL_URL: process.env.PORTAL_URL ?? "",
    DEMO_PHONE_NUMBER: process.env.DEMO_PHONE_NUMBER ?? "",
    LINKEDIN_URL: process.env.LINKEDIN_URL ?? "",
    TWITTER_URL: process.env.TWITTER_URL ?? "",
  },
  // The backoffice talks to the API through its own origin. The admin
  // session cookie is then first-party to the backoffice's domain, so it
  // survives a reload even when the API lives on another site — browsers
  // neither store nor send a SameSite=Lax cookie on a cross-site fetch, and
  // Safari blocks third-party cookies outright.
  async rewrites() {
    return [{ source: "/backoffice/api/:path*", destination: `${API_URL}/:path*` }];
  },
  // The backoffice is internal: keep it out of search indexes even if a URL leaks.
  async headers() {
    return [
      {
        source: "/backoffice/:path*", // also matches /backoffice itself
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
