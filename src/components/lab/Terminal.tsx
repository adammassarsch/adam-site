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
  scenes: readonly Scene[];
  log: readonly LogLine[];
  replayLabel: string;
};

const CHARS_PER_SECOND = 80;
/** The most characters one frame may type, so a slow frame never dumps a line. */
const FRAME_BUDGET = 2;
const HOLD_MS = 600;
const FOLD_MS = 450;
const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta"]);

/**
 * The status line pinned to the top of /lab, and the boot log under it.
 *
 * The server prints the finished session. After hydration, and only when
 * motion is allowed and the reader is at the top of the page, the log is
 * wiped and typed again, then folds up into the status line.
 *
 * The fold moves no layout while it runs: the log is clipped and the page
 * below is translated up by the log's height. On the last frame the log is
 * removed and the translation dropped together, so nothing shifts.
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
      if (window.scrollY > 0) fold();
    };
    const onKey = (event: KeyboardEvent) => {
      if (!MODIFIERS.has(event.key)) fold();
    };
    // A jump to a scene is measured against the folded page, so fold at once.
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="#"]')) finish();
    };
    const triggers: ReadonlyArray<[string, EventListener, AddEventListenerOptions]> = [
      ["scroll", onScroll, { passive: true }],
      ["wheel", fold, { passive: true }],
      ["touchmove", fold, { passive: true }],
      ["pointerdown", fold, {}],
      ["keydown", onKey as EventListener, {}],
      ["click", onClick as EventListener, { capture: true }],
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
      root!.style.removeProperty("--fold");
    }

    function fold() {
      if (root!.dataset.boot !== "typing") return;
      halt();
      print();
      root!.style.setProperty("--fold", `${-section!.offsetHeight}px`);
      root!.dataset.boot = "folding";
      timer = window.setTimeout(finish, FOLD_MS + 30);
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
        else timer = window.setTimeout(fold, HOLD_MS);
      };

      listen(true);
      frame = requestAnimationFrame(tick);
    };

    replay.current = () => {
      listen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      play();
    };

    // Arriving mid-page (a scene link, a restored scroll position): the log
    // stays printed, because a fold would move what the reader is looking at.
    if (window.scrollY === 0 && !window.location.hash) play();

    return () => {
      halt();
      listen(false);
      print();
      delete root.dataset.boot;
      delete root.dataset.live;
      root.style.removeProperty("--fold");
      replay.current = () => {};
    };
  }, []);

  useEffect(() => {
    const nodes = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((el): el is HTMLElement => el !== null);

    // The current scene is the one crossing a reading line a third down the screen.
    const reading = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = nodes.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting && i >= 0) setCurrent(i);
        }
      },
      { rootMargin: "-34% 0px -65% 0px" },
    );
    nodes.forEach((node) => reading.observe(node));

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
      reading.disconnect();
      seen.disconnect();
    };
  }, [scenes]);

  return (
    <>
      <header className="lab-status lab-term">
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

      <section className="lab-boot lab-term" id={scenes[0]?.id} ref={boot} aria-label={scenes[0]?.label}>
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
      </section>
    </>
  );
}
