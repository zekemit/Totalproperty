import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const allowIndexing = process.env.ALLOW_INDEXING?.trim().toLowerCase() === "true";

/**
 * Content-Security-Policy.
 * Next.js emits small inline bootstrap scripts, so `script-src` needs
 * 'unsafe-inline' unless every page is rendered dynamically with a per-request
 * nonce (which would forfeit static caching). We keep pages static and compensate
 * with a tight allow-list everywhere else. Cloudflare Turnstile is the only
 * third-party origin permitted.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  // https: lets the picture links Rafi pastes into /admin load. Images can't run script, so this is a small widening.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // No `preload`: joining the browser preload list is a one-way door; decide it deliberately later.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Belt and braces with robots.txt and the meta tag: also covers images and files.
  ...(allowIndexing ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The editor and its API are never indexable and never cached, whatever ALLOW_INDEXING says.
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
  async redirects() {
    // Legacy PHP URLs from the 2009-era site. Permanent so inbound links and
    // directory listings keep their value after cutover.
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/aboutus.php", destination: "/about", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
      { source: "/contactus.php", destination: "/contact", permanent: true },
      // The maxalley.net/tpm reference draft's URLs and nav names.
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/team", destination: "/careers", permanent: true },
      { source: "/team.php", destination: "/careers", permanent: true },
      { source: "/space", destination: "/spaces", permanent: true },
      { source: "/looking-for-a-space", destination: "/spaces", permanent: true },
      { source: "/admin.php", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
