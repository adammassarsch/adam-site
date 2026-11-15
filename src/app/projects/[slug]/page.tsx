import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@content/profile";
import { projects, type Project } from "@content/projects";
import { DemoVideo } from "@/components/DemoVideo";
import { ReleaseRail } from "@/components/ReleaseRail";
import { Footer, Masthead, projectHref, railItems } from "@/components/SiteChrome";
import "./case.css";

type CaseProject = Project & { case: NonNullable<Project["case"]> };

function findCase(slug: string): CaseProject | undefined {
  const project: Project | undefined = projects.find((p) => p.slug === slug);
  return project?.case ? (project as CaseProject) : undefined;
}

/** Every case page is fully prerendered; the build fails if that ever changes. */
export const ensureStatic = "navigation";

/** Only projects whose case is written get a page. */
export function generateStaticParams() {
  return projects.filter((p) => "case" in p).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findCase(slug);
  if (!project) return {};
  return {
    title: `${project.title} · ${profile.name}`,
    description: project.summary,
  };
}

export default async function CasePage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = findCase(slug);
  if (!project) notFound();

  const { case: c } = project;
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[index + 1] ?? projects[0];

  return (
    <>
      <Masthead />
      <div className="page">
        <ReleaseRail items={railItems(false)} current={slug} />

        <main className="main">
          <article className="case" aria-labelledby="case-title">
            <header className="case-head">
              <h1 id="case-title">
                <span className="case-date">{project.period}</span>
                <span className="case-title">{project.title}</span>
              </h1>
              <p className="case-lede">{project.summary}</p>
              {project.fact && (
                <p className="case-fact">
                  <mark>{project.fact.figure}</mark> {project.fact.text}
                </p>
              )}
              <ul className="release-tags" aria-label="Built with">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </header>

            {project.video && <DemoVideo video={project.video} className="case-video" eager />}

            <section className="case-row" aria-labelledby="problem">
              <h2 id="problem">The problem</h2>
              <div className="case-body">
                <p>{c.problem}</p>
              </div>
            </section>

            <section className="case-row" aria-labelledby="built">
              <h2 id="built">What I built</h2>
              <div className="case-body">
                {c.built.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>

            <section className="case-row" aria-labelledby="how">
              <h2 id="how">How</h2>
              <div className="case-body">
                <p>{c.stack}</p>
                <ul className="case-decisions">
                  {c.decisions.map((d) => (
                    <li key={d.title}>
                      <h3>{d.title}</h3>
                      <p>{d.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="case-row" aria-labelledby="hardest">
              <h2 id="hardest">The hardest part</h2>
              <div className="case-body">
                <p>{c.hardest}</p>
              </div>
            </section>

            {c.results && (
              <section className="case-row" aria-labelledby="results">
                <h2 id="results">Results</h2>
                <div className="case-body">
                  <p>{c.results}</p>
                </div>
              </section>
            )}

            <section className="case-row" aria-labelledby="links">
              <h2 id="links">Links</h2>
              <ul className="case-body case-links">
                {c.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? <a href={link.href}>{link.label}</a> : link.label}
                  </li>
                ))}
              </ul>
            </section>
          </article>

          {next && next.slug !== slug && (
            <nav aria-label="Next project" className="case-next">
              <a href={projectHref(next.slug)}>
                <span className="case-next-label">Next project</span>
                <span className="case-next-title">{next.title}</span>
              </a>
            </nav>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
