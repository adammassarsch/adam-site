import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import { heroSentence, profile } from "@content/profile";
import "./globals.css";

const grotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: profile.name,
  description: heroSentence(),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#151715" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
