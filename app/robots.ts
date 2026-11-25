import type { MetadataRoute } from "next";
import { indexingAllowed } from "@/lib/env";
import { buildRobots } from "@/lib/seo";
import { getContent } from "@/lib/cms/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getContent();
  return buildRobots(indexingAllowed(), site.url);
}
