import type { Vital } from "@content/profile";
import "./vitals-strip.css";

type Props = {
  vitals: readonly Vital[];
  className?: string;
};

/**
 * The facts row from the Scouting Report variant, built world-neutral so it can
 * be borrowed into Release Notes. Colours, rules and type come from the parent
 * through currentColor and the --vitals-* custom properties.
 */
export function VitalsStrip({ vitals, className }: Props) {
  return (
    <dl className={["vitals", className].filter(Boolean).join(" ")}>
      {vitals.map((v) => (
        <div key={v.label} className="vitals-item">
          <dt>{v.label}</dt>
          <dd>{v.value}</dd>
        </div>
      ))}
    </dl>
  );
}
