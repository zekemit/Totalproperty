import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/owners", priority: 0.9 },
  { path: "/commercial", priority: 0.9 },
  { path: "/lenders", priority: 0.8 },
  { path: "/tenants", priority: 0.8 },
  { path: "/services", priority: 0.8 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
  { path: "/vendors", priority: 0.5 },
  { path: "/portal", priority: 0.4 },
  { path: "/privacy", priority: 0.2 },
  { path: "/accessibility", priority: 0.2 },
  { path: "/fair-housing", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly", priority: r.priority }));
}
