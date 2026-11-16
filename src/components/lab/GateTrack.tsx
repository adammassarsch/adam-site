"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

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
/** Down and up closer together than this were not a hand: software sent both at once. */
const INSTANT_MS = 20;

/**
 * A pointer event a screen reader made up for a tap. VoiceOver and TalkBack
 * report a touch with no size, or a 1×1 "mouse" with no pressure; a real
 * finger or mouse button never does.
 */
function isVirtualPointer(event: PointerEvent): boolean {
  if (event.width === 0 && event.height === 0) return true;
  return event.width === 1 && event.height === 1 && event.pressure === 0 && event.pointerType === "mouse";
}

/** A click nobody pressed for: the keyboard, a switch, voice control or a screen reader. */
function isVirtualClick(event: MouseEvent): boolean {
  const native = event.nativeEvent as globalThis.PointerEvent;
  return event.detail === 0 || native.pointerType === "";
}

/**
 * The phases this site was built in, as a track with a gate at every stop.
 * A gate stays shut until the reader says go, the way each phase waited for
 * Adam, and saying go takes a moment: with a mouse or a finger the button is
 * held until it has filled. A plain click opens it for everyone who cannot
 * hold: the keyboard, and assistive tech such as a screen reader, whose tap
 * arrives as a click with no real pointer press before it.
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
  /** A real pointer went down on go: the click that follows belongs to the hold. */
  const pressed = useRef(false);
  /** When that pointer went down, and how long it stayed down. */
  const downAt = useRef(0);
  const heldFor = useRef(Infinity);

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
    // A screen reader's tap is not a hold: leave it to the click that follows.
    if (isVirtualPointer(event)) {
      pressed.current = false;
      return;
    }
    pressed.current = true;
    downAt.current = event.timeStamp;
    heldFor.current = Infinity;
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
  const lift = (event: PointerEvent) => {
    heldFor.current = event.timeStamp - downAt.current;
    release();
  };
  const click = (gate: number) => (event: MouseEvent) => {
    if (!pressed.current || isVirtualClick(event) || heldFor.current < INSTANT_MS) {
      release();
      open(gate);
    }
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
                  onPointerUp={lift}
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
