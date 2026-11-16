"use client";

import { useState } from "react";

type Props = {
  summary: string;
  label: string;
  video: { src: string; poster: string };
};

/**
 * "Watch demo" behind a click. The video and its poster are not in the page
 * until the panel is opened, so closed panels cost nothing on load.
 */
export function LazyDemo({ summary, label, video }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <details className="bv-demo" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{summary}</summary>
      {open ? (
        <video controls muted playsInline preload="metadata" poster={video.poster} aria-label={label}>
          <source src={video.src} type="video/mp4" />
        </video>
      ) : (
        <noscript>
          <a href={video.src}>{label}</a>
        </noscript>
      )}
    </details>
  );
}
