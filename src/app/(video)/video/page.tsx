import type { Metadata } from "next";
import { mailto, profile } from "@content/profile";
import { projects } from "@content/projects";
import { baseMetadata } from "@/lib/metadata";
import "./video.css";

const film = projects.find((p) => p.slug === "text-to-film");
if (!film) throw new Error("No project text-to-film");
const { video } = film;

const phone = { label: "070-662 24 65", href: "tel:+46706622465" };
const title = `${profile.name} – Video`;

/** Reached only by direct link: not in any menu or the sitemap, and kept out of search. */
export const metadata: Metadata = {
  ...baseMetadata,
  title,
  alternates: { canonical: "/video" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "video.other",
    siteName: profile.name,
    title,
    url: "/video",
    locale: "sv_SE",
    images: [{ url: video.poster, width: 1280, height: 720, type: "image/jpeg" }],
  },
};

export default function VideoPage() {
  return (
    <main id="main" className="vid">
      <video
        className="vid-film"
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        aria-label="Film från Text → Film: texten på en webbsida faller ner och blir ett löpband i 3D med fyra stationer: förfrågan, offert, produktion och leverans."
      >
        <source src={video.src} type="video/mp4" />
      </video>

      <address className="vid-contact">
        <span className="vid-name">{profile.name}</span>
        <a href={phone.href}>{phone.label}</a>
        <a href={mailto}>{profile.links.email}</a>
      </address>
    </main>
  );
}
