"use client";

import { useId, useState, type CSSProperties } from "react";
import { TokenSwarm } from "./TokenSwarm";

/** One line of the ledger: what a question costs in one state of the cache. */
export type LedgerRow = {
  cost: string;
  when: string;
  detail: string;
  state: string;
};

type Props = {
  cold: LedgerRow;
  warm: LedgerRow;
  /** How long the cache stays warm after a question. */
  windowMinutes: number;
  /** The prompt in order: the first two sit before the cache breakpoint. */
  blocks: readonly [string, string, string];
  breakpoint: string;
  perQuestion: string;
  /** How many tokens the cold question was measured at: the swarm draws exactly this many. */
  tokens: number;
  copy: {
    scrub: string;
    hint: string;
    now: string;
    minutes: string;
    hours: string;
    note: string;
    dot: string;
    total: string;
  };
};

const amount = (cost: string) => Number(cost.replace(/[^\d.]/g, ""));

/**
 * Seminar's per-question cost as something to drag. The axis ends at "now";
 * the handle is the previous question, in the human colour because moving it
 * is the reader's doing. Inside the cache window the stable
 * part of the prompt is read from cache and the cost drops, and the prompt's
 * tokens, drawn one by one beside it, settle into a block.
 */
export function CostLedger({ cold, warm, windowMinutes, blocks, breakpoint, perQuestion, tokens, copy }: Props) {
  const id = useId();
  const span = windowMinutes * 2;
  // Position on the axis in minutes; the right edge is now. Starts cold.
  const [position, setPosition] = useState(windowMinutes / 2);
  // The invitation to drag. Gone for good once the reader has moved the handle.
  const [invited, setInvited] = useState(true);
  const move = (minutes: number) => {
    setPosition(minutes);
    setInvited(false);
  };
  const ago = span - position;
  const isWarm = ago < windowMinutes;
  const active = isWarm ? warm : cold;

  const duration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return [hours > 0 && `${hours} ${copy.hours}`, (rest > 0 || hours === 0) && `${rest} ${copy.minutes}`]
      .filter(Boolean)
      .join(" ");
  };

  // The step is drawn to scale: the warm line sits at its share of the cold cost.
  const share = amount(warm.cost) / amount(cold.cost);
  const top = 6;
  const floor = top + (100 - top) * (1 - share);
  const level = (isWarm ? floor : top) / 100;

  return (
    <figure className="ledger lab-term" data-cache={isWarm ? "warm" : "cold"} data-invited={invited ? "" : undefined}>
      <div className="ledger-read">
        <p className="ledger-cost">
          <span className="ledger-figure">{active.cost}</span>
          <span className="ledger-per">{perQuestion}</span>
        </p>
        <p className="ledger-state">
          <span className="ledger-chip">{active.state}</span>
          {active.detail}
        </p>
      </div>

      <div className="ledger-swarm">
        <TokenSwarm
          count={tokens}
          warm={isWarm}
          label={`${cold.detail}. ${copy.dot}`}
          // A shortcut for the drag: a click on the tokens asks again 20 minutes later.
          onPress={() => move(span - windowMinutes / 3)}
        />
        <p className="ledger-note">
          <strong>{cold.detail}.</strong> {copy.dot} {copy.total}
        </p>
      </div>

      <div className="ledger-scrub">
        <label htmlFor={id}>
          {copy.scrub}: <output htmlFor={id}>{duration(ago)}</output>
        </label>
        <div
          className="ledger-axis"
          style={{ "--at": position / span, "--level": level } as CSSProperties}
        >
          <span className="ledger-window" aria-hidden="true" />
          <svg className="ledger-step" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points={`0,${top} 50,${top} 50,${floor} 100,${floor}`}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="ledger-level" data-side="cold" aria-hidden="true">
            {cold.cost}
          </span>
          <span className="ledger-level" data-side="warm" aria-hidden="true">
            {warm.cost}
          </span>
          <span className="ledger-handle" aria-hidden="true">
            {invited && <span className="ledger-hint">{copy.hint}</span>}
          </span>
          <input
            id={id}
            type="range"
            min={0}
            max={span}
            step={1}
            value={position}
            onChange={(event) => move(Number(event.target.value))}
            aria-valuetext={`${duration(ago)}: ${active.state}, ${active.cost}`}
          />
        </div>
        <p className="ledger-ticks" aria-hidden="true">
          <span>{duration(span)}</span>
          <span>{duration(windowMinutes)}</span>
          <span>{copy.now}</span>
        </p>
      </div>

      <div className="ledger-prompt">
        <ol className="ledger-stack">
          <li data-cached="">{blocks[0]}</li>
          <li data-cached="">{blocks[1]}</li>
          <li className="ledger-break">{breakpoint}</li>
          <li>{blocks[2]}</li>
        </ol>
        <p className="ledger-note">{copy.note}</p>
      </div>

      <table className="ledger-rows">
        <tbody>
          {[cold, warm].map((row) => (
            <tr key={row.state} data-active={row === active ? "" : undefined}>
              <th scope="row">
                <span>{row.when}</span>
                <span className="ledger-detail">{row.detail}</span>
              </th>
              <td>{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
