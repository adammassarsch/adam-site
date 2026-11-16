import type { Metadata, Viewport } from "next";
import { copy, type Lang } from "@content/home";
import { profile } from "@content/profile";
import { baseMetadata, ogImage } from "@/lib/metadata";

export const brevetPaths = {
  sv: "/",
  en: "/en",
} as const satisfies Record<Lang, string>;

const ogLocale = { sv: "sv_SE", en: "en" } as const satisfies Record<Lang, string>;

/** The home page in one language, with the other as its alternate. */
export function brevetMetadata(lang: Lang): Metadata {
  const t = copy[lang];
  const other: Lang = lang === "sv" ? "en" : "sv";
  const description = `${t.headline} ${t.seeking}`;
  return {
    ...baseMetadata,
    title: profile.name,
    description,
    alternates: {
      canonical: brevetPaths[lang],
      languages: { sv: brevetPaths.sv, en: brevetPaths.en },
    },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title: profile.name,
      description,
      url: brevetPaths[lang],
      locale: ogLocale[lang],
      alternateLocale: ogLocale[other],
      images: [ogImage],
    },
  };
}

/** The letter's paper (--paper in brevet.css), in light and dark alike: the page has no dark mode. */
export const brevetViewport: Viewport = { themeColor: "#faf8f3" };
