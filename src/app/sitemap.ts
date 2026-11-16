import type { MetadataRoute } from "next";
import { projects } from "@content/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/en` },
    ...projects.filter((p) => "case" in p).map((p) => ({ url: `${siteUrl}/projects/${p.slug}` })),
  ];
}
