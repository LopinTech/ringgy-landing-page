import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
