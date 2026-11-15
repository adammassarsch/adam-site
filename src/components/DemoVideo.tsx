"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import type { Video } from "@content/projects";

type Props = {
  video: Video;
  className?: string;
  /** The first video on the page may fetch its metadata straight away. */
  eager?: boolean;
  /** The poster is the largest thing on screen: fetch it before anything else. */
  priority?: boolean;
};

/**
 * Muted, looping product demo. It loads nothing but the poster until it is
 * near the viewport, plays only while visible, and never plays on its own when
 * the visitor has asked for reduced motion. Native controls are always there.
 * The caption under it says what it is, so nobody mistakes silence or Swedish
 * for a fault.
 */
export function DemoVideo({ video, className, eager = false, priority = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  if (priority) preload(video.poster, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let startedByUs = false;

    const sync = () => {
      if (visible && !reduced.matches) {
        startedByUs = true;
        el.play().catch(() => {
          // The browser may refuse autoplay; the controls still work.
        });
      } else if (startedByUs) {
        el.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    reduced.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <figure className={["demo", className].filter(Boolean).join(" ")}>
      <video
        ref={ref}
        className="demo-video"
        poster={video.poster}
        muted
        loop
        playsInline
        controls
        preload={eager ? "metadata" : "none"}
        aria-label={video.label}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <figcaption className="demo-caption">{video.caption}</figcaption>
    </figure>
  );
}
