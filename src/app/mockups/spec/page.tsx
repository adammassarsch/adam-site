import Image from "next/image";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { profile } from "@content/profile";
import { about, contact, howIBuild, repoUrl } from "@content/site";
import { aboutFacts, mailto, mockProjects, mockupMetadata } from "../shared";
import { FilmDialog } from "./FilmDialog";
import "./spec.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--s-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--s-mono" });

export const metadata = mockupMetadata("Specifikationen");

const studying = profile.vitals.find((v) => v.label === "Studying")?.value;
const lookingFor = profile.vitals.find((v) => v.label === "Looking for")?.value;

export default function Spec() {
  return (
    <div className={`sp ${sans.variable} ${mono.variable}`}>
      <nav aria-label="Main" className="sp-nav">
        <a href="#top" className="sp-nav-name">
          {profile.name}
        </a>
        <a href="#projects">Projects</a>
        <a href="#how">How I build</a>
        <a href="#contact">Contact</a>
        <a href={mailto}>{contact.action}</a>
      </nav>

      <main id="main" className="sp-main">
        <section id="top" aria-label="Summary">
          <dl className="sp-sheet">
            <div>
              <dt>Who</dt>
              <dd>
                <h1>{profile.name}</h1>
                <span className="sp-sub">{studying}</span>
              </dd>
            </div>
            <div>
              <dt>Built</dt>
              <dd>
                Working AI software with Claude Code:{" "}
                {mockProjects.map((p, i) => (
                  <span key={p.slug}>
                    <a href={`#${p.slug}`}>{p.title}</a>
                    {i < mockProjects.length - 1 ? ", " : "."}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Looking for</dt>
              <dd>{lookingFor}</dd>
            </div>
          </dl>
        </section>

        <section id="projects" aria-labelledby="sp-projects" className="sp-sec">
          <h2 id="sp-projects">Projects</h2>
          <table className="sp-table">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">What</th>
                <th scope="col">Result</th>
                <th scope="col">Built with</th>
                <th scope="col">Case</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((p) => (
                <tr key={p.slug} id={p.slug}>
                  <th scope="row" data-label="Project">
                    {p.title}
                  </th>
                  <td data-label="What">{p.sentence}</td>
                  <td data-label="Result" className={p.result ? "sp-num" : "sp-none"}>
                    {p.result ?? p.description}
                  </td>
                  <td data-label="Built with" className="sp-mono">
                    {p.tags.join(", ")}
                  </td>
                  <td data-label="Case" className="sp-actions">
                    <a href={`/projects/${p.slug}`}>
                      Read<span className="sr-only"> the case: {p.title}</span>
                    </a>
                    <FilmDialog label="Film" video={p.video} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="how" aria-labelledby="sp-how" className="sp-sec">
          <h2 id="sp-how">{howIBuild.title}</h2>
          <p className="sp-lead">{howIBuild.intro}</p>
          <table className="sp-table sp-how">
            <tbody>
              {howIBuild.principles.map((pr, i) => (
                <tr key={pr.title}>
                  <td className="sp-mono sp-n">{String(i + 1).padStart(2, "0")}</td>
                  <th scope="row">{pr.title}</th>
                  <td>
                    {pr.text}
                    {"link" in pr && pr.link && (
                      <>
                        {" "}
                        <a href={pr.link.href}>{pr.link.label}</a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="contact" aria-labelledby="sp-contact" className="sp-sec">
          <h2 id="sp-contact">{contact.title}</h2>
          <div className="sp-contact">
            <Image
              className="sp-photo"
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="7rem"
            />
            <div>
              <p>{about.text}</p>
              <dl className="sp-sheet sp-sheet-small">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={mailto}>{profile.links.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Elsewhere</dt>
                  <dd>
                    <a href={profile.links.linkedin}>LinkedIn</a>, <a href={profile.links.github}>GitHub</a>
                  </dd>
                </div>
                {aboutFacts
                  .filter((f) => f.label !== "Studying")
                  .map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="sp-foot">
        <a href="/lab">Lab</a>
        <a href={repoUrl}>Source for this site</a>
      </footer>
    </div>
  );
}
