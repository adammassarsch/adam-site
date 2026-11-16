"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type LogSegment = {
  text: string;
  tone?: "mute" | "stop" | "ok";
  /** Milliseconds to wait after this segment is typed. */
  pause?: number;
};
export type LogLine = readonly LogSegment[];
export type Scene = { id: string; label: string };

type Props = {
  name: string;
  title: string;
  /** The first scene is the top of the page; its id sits on the hero. */
  scenes: readonly Scene[];
  log: readonly LogLine[];
  replayLabel: string;
};

const CHARS_PER_SECOND = 80;
/** The most characters one frame may type, so a slow frame never dumps a line. */
const FRAME_BUDGET = 2;
const HOLD_MS = 600;
/** Matches the lab-tear animation in lab.css. */
const TEAR_MS = 720;
const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta"]);
/** How far down the screen the reading line sits. */
const READING_LINE = 0.34;

/**
 * The status line pinned to the top of /lab, and the boot log under it.
 *
 * The server prints the finished session as a block above the page. Where
 * scripting and motion are both allowed, lab.css lifts that block into a
 * sheet lying over the page, and this component types the log onto it and
 * then tears the sheet away. The page under it never moves: the hero is
 * already in place when the sheet falls.
 */
export function Terminal({ name, title, scenes, log, replayLabel }: Props) {
  const boot = useRef<HTMLElement>(null);
  const replay = useRef<() => void>(() => {});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const section = boot.current;
    const root = section?.closest<HTMLElement>(".lab");
    if (!section || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Scenes below wait for this before they hold anything back for animation.
    root.dataset.live = "";
    const unlive = () => {
      delete root.dataset.live;
    };

    // Only where the stylesheet made the log a sheet over the page is there anything to tear.
    if (getComputedStyle(section).position !== "fixed") return unlive;

    const segments = Array.from(section.querySelectorAll<HTMLElement>("[data-seg]"));
    const full = segments.map((el) => el.textContent ?? "");
    const pauses = segments.map((el) => Number(el.dataset.pause ?? 0));
    let frame = 0;
    let timer = 0;

    const print = () => {
      segments.forEach((el, i) => {
        el.textContent = full[i] ?? "";
      });
      section.querySelector("[data-cursor]")?.removeAttribute("data-cursor");
    };

    const onScroll = () => {
      if (window.scrollY > 0) tear();
    };
    const onKey = (event: KeyboardEvent) => {
      if (!MODIFIERS.has(event.key)) tear();
    };
    const triggers: ReadonlyArray<[string, EventListener, AddEventListenerOptions]> = [
      ["scroll", onScroll, { passive: true }],
      ["wheel", tear, { passive: true }],
      ["touchmove", tear, { passive: true }],
      ["pointerdown", tear, {}],
      ["keydown", onKey as EventListener, {}],
    ];
    const listen = (on: boolean) => {
      for (const [type, handler, options] of triggers) {
        if (on) window.addEventListener(type, handler, options);
        else window.removeEventListener(type, handler, options);
      }
    };

    const halt = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };

    function finish() {
      halt();
      listen(false);
      print();
      root!.dataset.boot = "done";
    }

    function tear() {
      if (root!.dataset.boot !== "typing") return;
      halt();
      listen(false);
      print();
      root!.dataset.boot = "tearing";
      timer = window.setTimeout(finish, TEAR_MS + 30);
    }

    const play = () => {
      halt();
      segments.forEach((el) => {
        el.textContent = "";
      });
      root.dataset.boot = "typing";

      let index = 0;
      let shown = 0;
      let credit = 0;
      let wait = 0;
      let last = performance.now();

      const tick = (now: number) => {
        const elapsed = Math.min(now - last, 100);
        last = now;

        if (wait > 0) {
          wait -= elapsed;
        } else {
          credit = Math.min(credit + (elapsed * CHARS_PER_SECOND) / 1000, FRAME_BUDGET);
          let budget = Math.floor(credit);
          credit -= budget;

          while (budget > 0 && index < segments.length) {
            const el = segments[index];
            const text = full[index] ?? "";
            if (!el) break;
            shown += 1;
            budget -= 1;
            el.textContent = text.slice(0, shown);
            if (shown === 1) {
              section.querySelector("[data-cursor]")?.removeAttribute("data-cursor");
              el.parentElement?.setAttribute("data-cursor", "");
            }
            if (shown >= text.length) {
              wait = pauses[index] ?? 0;
              index += 1;
              shown = 0;
              if (wait > 0) break;
            }
          }
        }

        if (index < segments.length) frame = requestAnimationFrame(tick);
        else timer = window.setTimeout(tear, HOLD_MS);
      };

      listen(true);
      frame = requestAnimationFrame(tick);
    };

    replay.current = () => {
      listen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      play();
    };

    // Arriving mid-page (a scene link, a restored scroll position): no sheet,
    // the reader is already looking at the page.
    if (window.scrollY === 0 && !window.location.hash) play();
    else root.dataset.boot = "done";

    return () => {
      halt();
      listen(false);
      print();
      delete root.dataset.boot;
      unlive();
      replay.current = () => {};
    };
  }, []);

  useEffect(() => {
    const nodes = scenes.map((scene) => document.getElementById(scene.id));
    let frame = 0;

    // The current scene is the last one whose top has passed the reading line.
    // Measured from the scroll position, so it is right in both directions.
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      let now = 0;
      nodes.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top <= line) now = i;
      });
      const page = document.documentElement;
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= page.scrollHeight - 2) {
        now = nodes.length - 1;
      }
      setCurrent(now);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // One-shot effects further down start when their block is first seen.
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-seen", "");
          seen.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    document.querySelectorAll(".lab [data-watch]").forEach((node) => seen.observe(node));

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      seen.disconnect();
    };
  }, [scenes]);

  return (
    <>
      <header className="lab-status lab-ink">
        <Link className="lab-status-name" href="/">
          {name}
        </Link>
        <span className="lab-status-title">{title}</span>
        <nav className="lab-scenes" aria-label={title}>
          <ol>
            {scenes.map((scene, i) => (
              <li key={scene.id}>
                <a href={`#${scene.id}`} aria-current={i === current ? "location" : undefined}>
                  <span className="lab-scene-n">{i + 1}</span>
                  <span className="lab-scene-label">{scene.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <button type="button" className="lab-replay" onClick={() => replay.current()}>
          {replayLabel}
        </button>
        <span className="lab-progress" aria-hidden="true" />
      </header>

      <section className="lab-boot" ref={boot} aria-label={scenes[0]?.label}>
        <div className="lab-sheet lab-ink">
          <ol className="lab-log">
            {log.map((line, i) => (
              <li key={i}>
                {line.map((segment, j) => (
                  <span key={j} data-seg="" data-tone={segment.tone} data-pause={segment.pause}>
                    {segment.text}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
