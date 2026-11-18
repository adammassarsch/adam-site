import type { Metadata } from "next";
import { profile } from "@content/profile";
import { baseMetadata } from "@/lib/metadata";
import { VideoFilm } from "../VideoFilm";
import "../video.css";

/**
 * The demo film made for JN Solar, shown on the link in their outreach email.
 * This static route takes precedence over the /video/:ref rewrite in next.config.ts.
 */
const film = {
  src: "/media/jn-solar-demo.mp4",
  poster: "/media/jn-solar-demo-poster.jpg",
};

const title = `${profile.name} – Video`;

export const metadata: Metadata = {
  ...baseMetadata,
  title,
  alternates: { canonical: "/video/jnsolar" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "video.other",
    siteName: profile.name,
    title,
    url: "/video/jnsolar",
    locale: "sv_SE",
    images: [{ url: film.poster, width: 1280, height: 720, type: "image/jpeg" }],
  },
};

export default function JnSolarVideoPage() {
  return (
    <VideoFilm
      src={film.src}
      poster={film.poster}
      label="Demofilm för JN Solar: en faluröd villa i 3D får solceller steg för steg, från rådgivning och offert, projektering och installation till driftsättning, och slutar med JN Solars namn."
    />
  );
}
