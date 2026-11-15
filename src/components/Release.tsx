import type { Project } from "@content/projects";
import { DemoVideo } from "./DemoVideo";

type Props = {
  project: Project;
  /** The first release sits in the first viewport; its poster loads first and its video early. */
  first?: boolean;
};

/**
 * One project as a release: date, title, media, notes, the one figure that
 * matters, and what it was built with. Every project uses this same anatomy.
 */
export function Release({ project, first = false }: Props) {
  const titleId = `${project.slug}-title`;

  return (
    <article
      id={project.slug}
      className="release"
      data-media={project.video ? "video" : "none"}
      aria-labelledby={titleId}
    >
      {project.video && (
        <DemoVideo video={project.video} className="release-video" eager={first} priority={first} />
      )}
      <div className="release-notes">
        <h2 id={titleId}>
          <span className="release-title">{project.title}</span>
          <span className="release-date">{project.period}</span>
        </h2>
        <p>{project.summary}</p>
        {project.fact && (
          <p className="release-fact">
            <mark>{project.fact.figure}</mark> {project.fact.text}
          </p>
        )}
        <ul className="release-tags" aria-label="Built with">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {project.case && (
          <p className="release-more">
            <a href={`/projects/${project.slug}`}>
              Read the case<span className="sr-only">: {project.title}</span>
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
