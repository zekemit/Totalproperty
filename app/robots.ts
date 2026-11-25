import type { MetadataRoute } from "next";
import { indexingAllowed } from "@/lib/env";
import { buildRobots } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(indexingAllowed(), siteConfig.url);
}
