import { profile } from "@content/profile";
import { projects } from "@content/projects";
import { contact, repoUrl } from "@content/site";
import type { RailItem } from "./ReleaseRail";

/** Where a project lives: its case page once written, else its release on the home page. */
export function projectHref(slug: string): string {
  const project = projects.find((p) => p.slug === slug);
  return project && "case" in project ? `/projects/${slug}` : `/#${slug}`;
}

/** Rail entries. On the home page they jump to the release; elsewhere to the case. */
export function railItems(onHome: boolean): RailItem[] {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    period: p.period,
    href: onHome ? `#${p.slug}` : projectHref(p.slug),
  }));
}

type MastheadProps = {
  /** On the home page the nav uses in-page anchors. */
  onHome?: boolean;
};

export function Masthead({ onHome = false }: MastheadProps) {
  const base = onHome ? "" : "/";
  return (
    <header className="mast">
      <a className="mast-name" href={onHome ? "#top" : "/"}>
        {profile.name}
      </a>
      <nav aria-label="Main" className="mast-nav">
        <a href={`${base}#projects`}>Projects</a>
        <a href={`${base}#how-i-build`}>How I build</a>
        <a href={`${base}#about`}>About</a>
        <a className="button" href={`mailto:${profile.links.email}`}>
          {contact.action}
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <p>{profile.name}</p>
      <a href={repoUrl}>Source for this site</a>
    </footer>
  );
}
