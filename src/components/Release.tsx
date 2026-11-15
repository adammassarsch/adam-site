import type { Project } from "@content/projects";
import { DemoVideo } from "./DemoVideo";

type Props = {
  project: Project;
  /** The first release sits in the first viewport; its video may load early. */
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
        <DemoVideo video={project.video} className="release-video" eager={first} />
      )}
      <div className="release-notes">
        <h2 id={titleId}>
          <span className="release-date">{project.period}</span>
          <span className="release-title">{project.title}</span>
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
      </div>
    </article>
  );
}
