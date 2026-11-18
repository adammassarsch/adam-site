import type { Metadata } from "next";
import { profile } from "@content/profile";
import { projects } from "@content/projects";
import { baseMetadata } from "@/lib/metadata";
import { VideoFilm } from "./VideoFilm";
import "./video.css";

const film = projects.find((p) => p.slug === "text-to-film");
if (!film) throw new Error("No project text-to-film");
const { video } = film;

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
    <VideoFilm
      src={video.src}
      poster={video.poster}
      label="Film från Text → Film: texten på en webbsida faller ner och blir ett löpband i 3D med fyra stationer: förfrågan, offert, produktion och leverans."
    />
  );
}
