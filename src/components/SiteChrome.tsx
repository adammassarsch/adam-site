import { profile } from "@content/profile";
import { projects } from "@content/projects";
import { contact, repoUrl } from "@content/site";
import type { RailItem } from "./ReleaseRail";

/** The English home page, where these English pages lead back to. */
const home = "/en";

/** Where a project lives: its case page once written, else the work list on the home page. */
export function projectHref(slug: string): string {
  const project = projects.find((p) => p.slug === slug);
  return project && "case" in project ? `/projects/${slug}` : `${home}#work`;
}

/** Rail entries, each leading to its project. */
export function railItems(): RailItem[] {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    period: p.period,
    href: projectHref(p.slug),
  }));
}

export function Masthead() {
  return (
    <header className="mast">
      <a className="mast-name" href={home}>
        {profile.name}
      </a>
      <nav aria-label="Main" className="mast-nav">
        <a href={`${home}#work`}>Projects</a>
        <a href={`${home}#how`}>How I build</a>
        <a href={`${home}#about`}>About</a>
        <a className="button" href={`mailto:${profile.links.email}`}>
          {contact.action}
        </a>
      </nav>
    </header>
  );
}

type FooterProps = {
  /** The link to /lab. Left out on /lab itself. */
  lab?: boolean;
};

export function Footer({ lab = true }: FooterProps) {
  return (
    <footer className="foot">
      <p>{profile.name}</p>
      <p className="foot-links">
        {lab && <a href="/lab">Lab →</a>}
        <a href={repoUrl}>Source for this site</a>
      </p>
    </footer>
  );
}
