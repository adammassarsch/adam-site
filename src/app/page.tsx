import type { CSSProperties } from "react";
import Image from "next/image";
import { profile } from "@content/profile";
import { projects } from "@content/projects";
import { about, contact, howIBuild } from "@content/site";
import { Release } from "@/components/Release";
import { ReleaseRail } from "@/components/ReleaseRail";
import { Footer, Masthead, railItems } from "@/components/SiteChrome";
import { VitalsStrip } from "@/components/VitalsStrip";
import "./home.css";

export default function Home() {
  const mailto = `mailto:${profile.links.email}`;
  const heroLinks = profile.hero.items.map((text, i) => ({
    text,
    slug: projects[i]?.slug,
  }));

  return (
    <>
      <Masthead onHome />

      <div className="page" id="top">
        <ReleaseRail items={railItems(true)} />

        <main className="main">
          <h1 className="hero">
            {profile.hero.lead}{" "}
            {heroLinks.map((item, i) => (
              <span key={item.text}>
                {i === heroLinks.length - 1 && "and "}
                {item.slug ? (
                  <a className="hero-link" href={`#${item.slug}`} style={{ "--i": i } as CSSProperties}>
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
                {i < heroLinks.length - 1 ? ", " : "."}
              </span>
            ))}
          </h1>

          <VitalsStrip vitals={profile.vitals} className="home-vitals" />

          <section id="projects" aria-label="Projects" className="releases">
            {projects.map((project, i) => (
              <Release key={project.slug} project={project} first={i === 0} />
            ))}
          </section>

          <section id="how-i-build" className="section how" aria-labelledby="how-title">
            <h2 id="how-title" className="section-title">
              {howIBuild.title}
            </h2>
            <p className="section-lead">{howIBuild.intro}</p>
            <ol className="principles">
              {howIBuild.principles.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>
                    {p.text}
                    {"link" in p && p.link && (
                      <>
                        {" "}
                        <a href={p.link.href}>{p.link.label}</a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="about" className="section about" aria-labelledby="about-title">
            <h2 id="about-title" className="section-title">
              {about.title}
            </h2>
            <Image
              className="about-photo"
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(max-width: 52rem) 40vw, 16rem"
            />
            <p className="about-text">{about.text}</p>
          </section>

          <section id="contact" className="section contact" aria-labelledby="contact-title">
            <h2 id="contact-title" className="contact-title">
              {contact.title}
            </h2>
            <p className="section-lead">{contact.text}</p>
            <div className="contact-actions">
              <a className="button button-large" href={mailto}>
                {contact.action}
              </a>
              <p className="contact-address">{profile.links.email}</p>
            </div>
            <ul className="contact-links">
              <li>
                <a href={profile.links.linkedin}>LinkedIn</a>
              </li>
              <li>
                <a href={profile.links.github}>GitHub</a>
              </li>
            </ul>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
