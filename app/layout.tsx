import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AttributionCapture } from "@/components/forms/attribution";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { indexingAllowed } from "@/lib/env";
import { serviceAreas, siteConfig } from "@/lib/site";

/**
 * Fonts are self-hosted from the @fontsource-variable packages (no request to Google
 * at build or run time). `next/font/local` preloads the Latin subset and generates a
 * size-adjusted fallback so the swap from system font to web font doesn't shift layout.
 */
const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

const sourceSerif = localFont({
  src: "../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
  weight: "200 900",
  variable: "--font-source-serif",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | ${siteConfig.areasPhraseAmp}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  // Off by default so a preview or staging copy never competes with the live site in
  // search. Set ALLOW_INDEXING=true when DNS is cut over (see README).
  robots: indexingAllowed() ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#12263f", width: "device-width", initialScale: 1 };

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  telephone: siteConfig.phoneHref.replace("tel:", ""),
  email: siteConfig.email,
  ...(siteConfig.legalName !== siteConfig.name ? { legalName: siteConfig.legalName } : {}),
  ...(siteConfig.foundedYear ? { foundingDate: String(siteConfig.foundedYear) } : {}),
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: siteConfig.address.poBox,
    ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "US",
  },
  areaServed: serviceAreas.map((a) => ({ "@type": a.code === "DC" ? "AdministrativeArea" : "State", name: a.name })),
  knowsAbout: ["Residential property management", "Commercial property management", "CAM management", "Construction management", "REO and foreclosure property services"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-800 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <AttributionCapture />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
