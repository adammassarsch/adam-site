import type { ReactNode } from "react";
import type { Lang } from "@content/home";

type Props = {
  lang: Lang;
  /** Font variables for the whole document. */
  className?: string;
  /** The skip link's label, in the page's language. */
  skip: string;
  children: ReactNode;
};

/** The <html> every root layout renders: its language, and a skip link to #main. */
export function Document({ lang, className, skip, children }: Props) {
  return (
    <html lang={lang} className={className}>
      <body>
        <a className="skip-link" href="#main">
          {skip}
        </a>
        {children}
      </body>
    </html>
  );
}
