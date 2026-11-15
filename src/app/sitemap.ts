import type { MetadataRoute } from "next";
import { projects } from "@content/projects";
import { siteUrl } from "@content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    ...projects.filter((p) => "case" in p).map((p) => ({ url: `${siteUrl}/projects/${p.slug}` })),
  ];
}
