import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@content/profile";
import { Footer, Masthead } from "@/components/SiteChrome";
import "./not-found.css";

export const metadata: Metadata = {
  title: `Page not found · ${profile.name}`,
};

export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="missing" id="main">
        <h1>This page doesn’t exist.</h1>
        <p>
          It may have been moved or removed. <Link href="/#projects">Back to the projects</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
