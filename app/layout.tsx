import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getContent } from "@/lib/cms/content";
import { indexingAllowed } from "@/lib/env";

/**
 * Fonts are self-hosted from the @fontsource packages (no request to Google at build or
 * run time). `next/font/local` preloads the Latin subset and generates a size-adjusted
 * fallback so the swap from system font to web font doesn't shift layout.
 *
 * Instrument Serif: display (400 only, plus an italic reserved for pull-quotes).
 * Instrument Sans: text and UI, with true tabular figures for financial numbers.
 */
const instrumentSerif = localFont({
  src: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Times New Roman", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

/** The italic is only used by pull-quotes, so it is not preloaded on every page. */
const instrumentSerifItalic = localFont({
  src: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif-italic",
  display: "swap",
  preload: false,
  fallback: ["Times New Roman", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const instrumentSans = localFont({
  src: "../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-instrument-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getContent();
  const home = seo.pages.home;
  return {
    metadataBase: new URL(site.url),
    title: { default: home.title, template: `%s | ${site.name}` },
    description: home.description,
    applicationName: site.name,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: site.name, title: home.title, description: home.description, url: "/", locale: "en_US" },
    twitter: { card: "summary_large_image", title: home.title, description: home.description },
    // Off by default so a preview or staging copy never competes with the live site in
    // search. Set ALLOW_INDEXING=true when DNS is cut over (see README).
    robots: indexingAllowed() ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#ece6da", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
