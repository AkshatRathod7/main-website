import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // inlineCss was measured and left off: no reliable LCP gain, and it would stop the stylesheet from being
  // cached across pages.
  experimental: { optimizePackageImports: ["zod"] },
  // Older routes that the one-page home replaces.
  async redirects() {
    return [
      // The home page is the site. The four overview pages became chapters of it.
      // Service detail pages (/what-we-do/:slug) stay; only the exact overview paths move.
      { source: "/what-we-do", destination: "/#what-we-do", permanent: true },
      { source: "/how-we-work", destination: "/#how-we-work", permanent: true },
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/approach", destination: "/#how-we-work", permanent: true },
      { source: "/systems", destination: "/#what-we-do", permanent: true },
      { source: "/systems/:path*", destination: "/#what-we-do", permanent: true },
      { source: "/styleguide", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
