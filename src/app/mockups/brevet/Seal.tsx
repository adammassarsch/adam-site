/*
 * The wax seal, drawn once in SVG and shown as three shards clipped along the
 * same crack lines. Whole, the shards line up into one seal; opening, they
 * part along the cracks like broken wax. Server-rendered, no client JS.
 */

/** Deterministic pseudo-random numbers, so the wax looks the same every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** An uneven blob of poured wax: a circle with ripples and two spills. */
function waxPath(
  cx: number,
  cy: number,
  r: number,
  n: number,
  seed: number,
): string {
  const rand = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let k =
      1 +
      0.035 * Math.sin(3 * a + 0.7) +
      0.025 * Math.sin(5 * a + 2.1) +
      (rand() - 0.5) * 0.045;
    k +=
      0.1 * Math.exp(-(wrap(a - 2.5) ** 2) / 0.05) +
      0.07 * Math.exp(-(wrap(a - 5.4) ** 2) / 0.03);
    pts.push([cx + r * k * Math.cos(a), cy + r * k * Math.sin(a)]);
  }
  // Closed Catmull-Rom spline through the points, as cubic Béziers.
  const at = (i: number) => pts[(i + n) % n] as [number, number];
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(at(0)[0])} ${f(at(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0]!)} ${f(c1[1]!)} ${f(c2[0]!)} ${f(c2[1]!)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

const wax = waxPath(50, 50, 39, 40, 7);

/* Crack lines in the 0–100 box. The shard clip-paths in brevet.css follow them. */
const cracks = [
  "50,4 46,18 54,30 49,46",
  "49,46 38,52 24,58 6,66",
  "49,46 62,54 78,57 95,64",
];

function SealArt() {
  return (
    <svg viewBox="0 0 100 100" overflow="visible" className="bv-seal-svg">
      <path
        d={wax}
        transform="translate(1.4 2.6)"
        fill="#3a1206"
        opacity="0.4"
        filter="url(#bvSealBlur)"
      />
      <path d={wax} fill="url(#bvWax)" />
      <path
        d={wax}
        fill="none"
        stroke="#4a1307"
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      {/* The pressed disc: concave, so lit from below right */}
      <circle cx="50" cy="50" r="27" fill="url(#bvPress)" />
      <circle
        cx="50"
        cy="50"
        r="27"
        fill="none"
        stroke="url(#bvRim)"
        strokeWidth="1.8"
      />
      <circle
        cx="50.5"
        cy="50.7"
        r="23"
        fill="none"
        stroke="#f39477"
        strokeOpacity="0.28"
        strokeWidth="0.6"
      />
      <circle
        cx="50"
        cy="50"
        r="23"
        fill="none"
        stroke="#55140a"
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />
      {/* Engraved initials: a light edge below, the cut itself in shadow */}
      <text
        x="50.5"
        y="51.5"
        className="bv-seal-am"
        fill="#f5a084"
        fillOpacity="0.5"
      >
        AM
      </text>
      <text
        x="50"
        y="50.7"
        className="bv-seal-am"
        fill="#4d1208"
        fillOpacity="0.82"
      >
        AM
      </text>
      {/* Gloss on the raised rim */}
      <ellipse
        cx="33"
        cy="25"
        rx="12"
        ry="4.6"
        transform="rotate(-34 33 25)"
        fill="#fff"
        opacity="0.38"
        filter="url(#bvSealSoft)"
      />
      <ellipse
        cx="72"
        cy="80"
        rx="7"
        ry="2.2"
        transform="rotate(-38 72 80)"
        fill="#fff"
        opacity="0.14"
        filter="url(#bvSealSoft)"
      />
    </svg>
  );
}

export function Seal() {
  return (
    <div className="bv-seal">
      <svg width="0" height="0" className="bv-seal-defs" aria-hidden="true">
        <defs>
          <radialGradient id="bvWax" cx="36%" cy="30%" r="78%">
            <stop offset="0" stopColor="#dc6446" />
            <stop offset="0.3" stopColor="#bd3d22" />
            <stop offset="0.72" stopColor="#962a15" />
            <stop offset="1" stopColor="#6a1b0b" />
          </radialGradient>
          <radialGradient id="bvPress" cx="62%" cy="68%" r="74%">
            <stop offset="0" stopColor="#c4472a" />
            <stop offset="0.65" stopColor="#a3311a" />
            <stop offset="1" stopColor="#862410" />
          </radialGradient>
          <linearGradient id="bvRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f1307" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#a1301a" stopOpacity="0" />
            <stop offset="1" stopColor="#f6a083" stopOpacity="0.6" />
          </linearGradient>
          <filter id="bvSealBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
          <clipPath id="bvWaxClip">
            <path d={wax} />
          </clipPath>
          <filter id="bvSealSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.3" />
          </filter>
        </defs>
      </svg>
      {/* Whole until the first crack, so no seams show in the unbroken wax */}
      <div className="bv-shard bv-shard-whole bv-anim">
        <SealArt />
      </div>
      <div className="bv-shard bv-shard-l bv-anim">
        <SealArt />
      </div>
      <div className="bv-shard bv-shard-r bv-anim">
        <SealArt />
      </div>
      <div className="bv-shard bv-shard-b bv-anim">
        <SealArt />
      </div>
      <svg viewBox="0 0 100 100" className="bv-crack bv-anim">
        <g clipPath="url(#bvWaxClip)">
          {cracks.map((c) => (
            <g key={c}>
              <polyline
                points={c}
                transform="translate(0.6 0.7)"
                fill="none"
                stroke="#f08a6a"
                strokeOpacity="0.5"
                strokeWidth="0.7"
              />
              <polyline
                points={c}
                fill="none"
                stroke="#2e0a03"
                strokeOpacity="0.85"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
