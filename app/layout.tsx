import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/source-serif-4";
import "./globals.css";

export const metadata: Metadata = { title: "Total Property Management" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
