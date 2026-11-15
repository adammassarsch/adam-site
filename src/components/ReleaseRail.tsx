"use client";

import { useEffect, useState } from "react";

type Item = {
  slug: string;
  title: string;
  period: string;
};

type Props = {
  items: readonly Item[];
};

/**
 * The release rail: one entry per project, newest first. The entry for the
 * release being read is marked as current while the visitor scrolls.
 */
export function ReleaseRail({ items }: Props) {
  const [current, setCurrent] = useState<string | undefined>(items[0]?.slug);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    // The current release is the one crossing a reading line 30 % down the
    // screen. Above the first release it is the first; past the last, none.
    const update = () => {
      const line = window.innerHeight * 0.3;
      const first = sections[0];
      if (first && first.getBoundingClientRect().top > line) {
        setCurrent(first.id);
        return;
      }
      const hit = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setCurrent(hit?.id);
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
  }, [items]);

  return (
    <nav aria-label="Projects" className="rail">
      <ol>
        {items.map((item) => (
          <li key={item.slug}>
            <a href={`#${item.slug}`} aria-current={item.slug === current ? "location" : undefined}>
              <span className="rail-date">{item.period}</span>
              <span className="rail-title">{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
