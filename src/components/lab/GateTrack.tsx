"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

export type Phase = {
  name: string;
  /** What Adam did at the stop after this phase, when there was one. */
  stop?: string;
};

type Props = {
  phases: readonly Phase[];
  copy: { waiting: string; hold: string; stopped: string };
};

/** How long go has to be held. Matches the fill in lab.css. */
const HOLD_MS = 700;

/**
 * The phases this site was built in, as a track with a gate at every stop.
 * A gate stays shut until the reader says go, the way each phase waited for
 * Adam, and saying go takes a moment: the button is held until it has filled.
 * From the keyboard, or from anything else that clicks without a pointer, a
 * plain click opens it.
 *
 * Without JavaScript, or with reduced motion, every gate is already open and
 * the whole track reads top to bottom (see lab.css: the shut state only
 * applies once the page is live).
 */
export function GateTrack({ phases, copy }: Props) {
  const [opened, setOpened] = useState(0);
  const [holding, setHolding] = useState<number | null>(null);
  const said = useRef<Array<HTMLElement | null>>([]);
  const timer = useRef(0);
  /** A pointer went down on go: the click that follows belongs to the hold, not to the keyboard. */
  const pressed = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // How many gates stand before each phase: a phase runs once they are all open.
  const gatesBefore = phases.map((_, i) => phases.slice(0, i).filter((phase) => phase.stop).length);

  const open = (gate: number) => {
    setOpened(gate + 1);
    // Keyboard and screen-reader focus lands on what the stop was, then reads on.
    requestAnimationFrame(() => said.current[gate]?.focus({ preventScroll: true }));
  };

  const press = (gate: number) => (event: PointerEvent) => {
    if (event.button !== 0) return;
    pressed.current = true;
    setHolding(gate);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setHolding(null);
      open(gate);
    }, HOLD_MS);
  };
  const release = () => {
    window.clearTimeout(timer.current);
    setHolding(null);
  };
  const click = (gate: number) => () => {
    if (!pressed.current) open(gate);
    pressed.current = false;
  };

  return (
    <ol className="gates">
      {phases.map((phase, i) => {
        const gate = gatesBefore[i] ?? 0;
        const waiting = gate > opened;
        const state = waiting ? "ahead" : gate === opened ? "shut" : "open";

        return (
          <li key={phase.name} className="gates-phase" data-waiting={waiting ? "" : undefined}>
            <p className="gates-name">
              <span className="gates-n">{i}</span>
              {phase.name}
            </p>
            {phase.stop && (
              <div className="gates-gate" data-state={state}>
                <p className="gates-wait">{copy.waiting}</p>
                <button
                  type="button"
                  className="gates-go"
                  data-label={copy.hold}
                  data-holding={holding === gate ? "" : undefined}
                  onPointerDown={press(gate)}
                  onPointerUp={release}
                  onPointerLeave={release}
                  onPointerCancel={release}
                  onContextMenu={(event) => event.preventDefault()}
                  onClick={click(gate)}
                >
                  {copy.hold}
                  <span className="sr-only">: {phase.name}</span>
                </button>
                <p
                  className="gates-said"
                  tabIndex={-1}
                  ref={(node) => {
                    said.current[gate] = node;
                  }}
                >
                  <span className="gates-stopped">{copy.stopped}</span> {phase.stop}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
