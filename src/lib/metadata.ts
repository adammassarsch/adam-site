import type { Metadata, Viewport } from "next";
import { heroSentence, profile } from "@content/profile";
import { brand } from "./brand";
import { siteUrl } from "./site-url";

export const ogSize = { width: 1200, height: 630 };

/** The site card, app/og.png/route.tsx. Case pages have their own. */
export const ogImage = {
  url: "/og.png",
  ...ogSize,
  alt: heroSentence(),
  type: "image/png",
};

/** Shared by every root layout. */
export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  twitter: { card: "summary_large_image" },
} satisfies Metadata;

/** Case pages, /lab and the 404. Pages override what is their own. */
export const siteMetadata: Metadata = {
  ...baseMetadata,
  title: profile.name,
  description: heroSentence(),
  alternates: { canonical: "/en" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.name,
    description: heroSentence(),
    url: "/en",
    locale: "en",
    images: [ogImage],
  },
};

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brand.ground },
    { media: "(prefers-color-scheme: dark)", color: brand.groundDark },
  ],
};
