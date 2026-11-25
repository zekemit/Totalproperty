import type { Metadata } from "next";
import type { ReactNode } from "react";

// Never indexable, whatever ALLOW_INDEXING says: the editor is private.
export const metadata: Metadata = {
  title: { absolute: "Site editor" },
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-limestone text-text">{children}</div>;
}
