import type { CSSProperties } from "react";

type Props = {
  id: string;
  /** Position among the scenes, e.g. "5/5". */
  index: string;
  title: string;
  text: string;
  /** The command at the prompt. It is the email link. */
  prompt: string;
  mailto: string;
  email: string;
  links: readonly { label: string; href: string }[];
};

/**
 * The last scene: the terminal opens once more, on a prompt that emails Adam.
 * No script of its own. The prompt types with CSS steps once the block has
 * been seen, and is simply there without JavaScript or with reduced motion.
 */
export function Prompt({ id, index, title, text, prompt, mailto, email, links }: Props) {
  return (
    <section id={id} className="lab-contact lab-ink" aria-labelledby={`${id}-title`} data-watch="">
      <h2 id={`${id}-title`}>
        <span className="lab-title">{title}</span>
        <span className="lab-date">{index}</span>
      </h2>
      <p className="lab-contact-text">{text}</p>
      <p className="lab-prompt">
        <a href={mailto}>
          <span className="lab-prompt-text" style={{ "--n": prompt.length } as CSSProperties}>
            {prompt}
          </span>
        </a>
      </p>
      <ul className="lab-contact-links">
        <li>
          <a href={mailto}>{email}</a>
        </li>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
