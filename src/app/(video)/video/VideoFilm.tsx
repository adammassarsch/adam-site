import { mailto, profile } from "@content/profile";

const phone = { label: "070-662 24 65", href: "tel:+46706622465" };

type Props = {
  src: string;
  poster: string;
  /** Swedish description of what happens in the film, for screen readers. */
  label: string;
};

/** A /video page: the film, large and centred, and how to reach Adam. Nothing else. */
export function VideoFilm({ src, poster, label }: Props) {
  return (
    <main id="main" className="vid">
      <video
        className="vid-film"
        poster={poster}
        controls
        playsInline
        preload="metadata"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>

      <address className="vid-contact">
        <span className="vid-name">{profile.name}</span>
        <a href={phone.href}>{phone.label}</a>
        <a href={mailto}>{profile.links.email}</a>
      </address>
    </main>
  );
}
