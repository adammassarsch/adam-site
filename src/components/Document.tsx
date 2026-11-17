import type { ReactNode } from "react";
import Script from "next/script";
import type { Lang } from "@content/home";

type Props = {
  lang: Lang;
  /** Font variables for the whole document. */
  className?: string;
  /** The skip link's label, in the page's language. */
  skip: string;
  children: ReactNode;
};

/** The <html> every root layout renders: its language, a skip link to #main, and Vercel Web Analytics. */
export function Document({ lang, className, skip, children }: Props) {
  return (
    <html lang={lang} className={className}>
      <body>
        <a className="skip-link" href="#main">
          {skip}
        </a>
        {children}
        {/* Vercel Web Analytics: cookieless page views, served once enabled for the project. */}
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
