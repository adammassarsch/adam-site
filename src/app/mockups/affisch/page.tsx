import Image from "next/image";
import { Inter_Tight } from "next/font/google";
import { profile } from "@content/profile";
import { about, contact, howIBuild, repoUrl } from "@content/site";
import { headline, mailto, mockProjects, mockupMetadata, seeking } from "../shared";
import "./affisch.css";

const tight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"], variable: "--a-sans" });

export const metadata = mockupMetadata("Affischen");

export default function Affisch() {
  return (
    <div className={`af ${tight.variable}`}>
      <header className="af-head">
        <a className="af-name" href="#top">
          {profile.name}
        </a>
        <a className="af-email" href={mailto}>
          {contact.action}
        </a>
      </header>

      <main id="main" className="af-main">
        <section id="top" className="af-hero">
          <h1>{headline}</h1>
          <p>{seeking}</p>
        </section>

        <section id="work" aria-label="Work" className="af-work">
          <ol>
            {mockProjects.map((p, i) => (
              <li key={p.slug} id={p.slug}>
                <details>
                  <summary>
                    <span className="af-meta">
                      <span className="af-n">{String(i + 1).padStart(2, "0")}</span> {p.title}
                    </span>
                    <span className={p.result ? "af-claim" : "af-claim af-claim-text"}>
                      {p.result ?? p.sentence}
                    </span>
                  </summary>
                  <div className="af-more">
                    {p.result ? <p>{p.sentence}</p> : <p>{p.description}</p>}
                    <video controls muted playsInline preload="none" poster={p.video.poster} aria-label={p.video.label}>
                      <source src={p.video.src} type="video/mp4" />
                    </video>
                    <p>
                      <a href={`/projects/${p.slug}`}>
                        Read the case<span className="sr-only">: {p.title}</span> →
                      </a>
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section id="how" aria-labelledby="af-how" className="af-sec">
          <h2 id="af-how">{howIBuild.title}</h2>
          <ol className="af-principles">
            {howIBuild.principles.map((pr) => (
              <li key={pr.title}>
                <details>
                  <summary>{pr.title}</summary>
                  <p>
                    {pr.text}
                    {"link" in pr && pr.link && (
                      <>
                        {" "}
                        <a href={pr.link.href}>{pr.link.label}</a>
                      </>
                    )}
                  </p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" aria-labelledby="af-about" className="af-sec af-about">
          <h2 id="af-about">{about.title}</h2>
          <Image
            className="af-photo"
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            sizes="12rem"
          />
          <p>{about.text}</p>
        </section>

        <section id="contact" aria-labelledby="af-contact" className="af-sec">
          <h2 id="af-contact">{contact.title}</h2>
          <p>
            <a className="af-email af-email-big" href={mailto}>
              {profile.links.email}
            </a>
          </p>
          <p className="af-quiet">
            <a href={profile.links.linkedin}>LinkedIn</a> · <a href={profile.links.github}>GitHub</a>
          </p>
        </section>
      </main>

      <footer className="af-foot">
        <nav aria-label="Main" className="af-foot-nav">
          <a href="#work">Work</a>
          <a href="#how">How I build</a>
          <a href="#about">About</a>
        </nav>
        <p className="af-quiet">
          <a href="/lab">Lab</a> · <a href={repoUrl}>Source for this site</a>
        </p>
      </footer>

      {/* Mobile: a fixed bar at the bottom */}
      <nav aria-label="Quick" className="af-bar">
        <a href="#work">Work</a>
        <a href="#how">How</a>
        <a className="af-email" href={mailto}>
          Email
        </a>
      </nav>
    </div>
  );
}
