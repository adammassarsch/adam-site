import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import { heroSentence, profile } from "@content/profile";
import { siteUrl } from "@content/site";
import { brand } from "@/lib/brand";
import "./globals.css";
import "./chrome.css";

const grotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: profile.name,
  description: heroSentence(),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.name,
    description: heroSentence(),
    url: "/",
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brand.ground },
    { media: "(prefers-color-scheme: dark)", color: brand.groundDark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
