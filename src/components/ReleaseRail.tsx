"use client";

import { useEffect, useState } from "react";

export type RailItem = {
  slug: string;
  title: string;
  period: string;
  href: string;
};

type Props = {
  items: readonly RailItem[];
  /**
   * On the home page the rail follows the release being read. On a case page
   * the rail is fixed on that project, so pass its slug instead.
   */
  current?: string;
};

/** The release rail: one entry per project, newest first. */
export function ReleaseRail({ items, current: fixed }: Props) {
  const tracking = fixed === undefined;
  const [tracked, setTracked] = useState<string | undefined>(items[0]?.slug);
  // True while a release crosses the reading line. On small screens the rail
  // only shows then, so it costs no height above or after the record.
  const [inRecord, setInRecord] = useState(false);
  const current = tracking ? tracked : fixed;

  useEffect(() => {
    if (!tracking) return;
    const sections = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    // The current release is the one crossing a reading line 30 % down the
    // screen. Above the first release it is the first; past the last, none.
    const update = () => {
      const line = window.innerHeight * 0.3;
      const first = sections[0];
      if (first && first.getBoundingClientRect().top > line) {
        setTracked(first.id);
        setInRecord(false);
        return;
      }
      const hit = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setTracked(hit?.id);
      setInRecord(hit !== undefined);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, tracking]);

  return (
    <nav
      aria-label="Projects"
      className="rail"
      data-tracking={tracking ? "" : undefined}
      data-in-record={tracking && inRecord ? "" : undefined}
    >
      <ol>
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={item.href}
              aria-current={item.slug === current ? (tracking ? "location" : "page") : undefined}
            >
              <span className="rail-date">{item.period}</span>
              <span className="rail-title">{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
