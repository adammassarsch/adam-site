"use client";

import { useId, useState } from "react";
import type { Vital } from "@content/profile";
import "./vitals-strip.css";

type Props = {
  vitals: readonly Vital[];
  className?: string;
};

/**
 * The facts row. Every fact shows on wide screens. On small screens only the
 * essential facts show until the visitor opens "More"; the CSS decides when
 * the button and the collapse apply, so wide screens never see either.
 * Without JavaScript the strip stays collapsed on small screens, which still
 * leaves the essential facts readable.
 */
export function VitalsStrip({ vitals, className }: Props) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const essentials = vitals.filter((v) => v.essential);
  const lastEssential = essentials.at(-1);
  const hasMore = essentials.length > 0 && essentials.length < vitals.length;

  return (
    <div className={["vitals-wrap", className].filter(Boolean).join(" ")}>
      <dl id={listId} className="vitals" data-expanded={expanded ? "" : undefined}>
        {vitals.map((v) => (
          <div
            key={v.label}
            className="vitals-item"
            data-secondary={hasMore && !v.essential ? "" : undefined}
            data-wide={hasMore && v === lastEssential && essentials.length % 2 === 1 ? "" : undefined}
          >
            <dt>{v.label}</dt>
            <dd>{v.value}</dd>
          </div>
        ))}
      </dl>
      {hasMore && (
        <button
          type="button"
          className="vitals-more"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </div>
  );
}
