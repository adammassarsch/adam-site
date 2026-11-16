"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

export type RowClass = { label: string; note?: string };

type Props = {
  /** Smallest and largest group a subagent gets. */
  min: number;
  max: number;
  /** The four classes a row can end in, most confident first. */
  classes: readonly RowClass[];
  /** What the drawing shows, for screen readers. */
  description: string;
  labels: { list: string; lanes: string; sheet: string };
  copy: { check: string; caption: string; dare: string; replay: string };
};

const LANES = 8;
const SEED = 1525;
/** How the made-up rows fall into the four classes. An illustration, not a result. */
const SHARE = [0.4, 0.26, 0.14, 0.2];
/** Seconds: the list stands, rows travel to their lanes, the script writes, the check runs. */
const T = { list: 0.6, travel: 0.6, gap: 0.3, write: 1.6, check: 0.8, fetch: 0.45 };
/** A row the reader lets go of falls at this rate, in px/s². */
const GRAVITY = 1600;
/** How near a row a pointer has to be to take hold of it, in px. */
const REACH = 6;

type Row = { lane: number; slot: number; kind: number; at: number };
type Model = { rows: Row[]; sizes: number[]; resolved: number; end: number };
type Box = readonly [x: number, y: number, w: number, h: number];
type Mark = { text: string; x: number; y: number; align?: CanvasTextAlign; agent?: boolean };
type Plan = {
  list: Box[];
  lane: Box[];
  sheet: Box[];
  marks: Mark[];
  icon: readonly [number, number];
  /** The rule the check draws along the list as it goes: its full extent, and the way it grows. */
  check: { box: Box; down: boolean };
};

/** Small seeded generator, so the server, the client and every replay draw the same run. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildModel(min: number, max: number): Model {
  const random = mulberry32(SEED);
  const rows: Row[] = [];
  const sizes: number[] = [];
  let resolved = 0;

  for (let lane = 0; lane < LANES; lane++) {
    const size = min + Math.floor(random() * (max - min + 1));
    // Every lane starts at the same moment and works at its own pace.
    const pace = 0.1 + random() * 0.08;
    sizes.push(size);
    for (let slot = 0; slot < size; slot++) {
      const roll = random();
      let kind = SHARE.length - 1;
      let edge = 0;
      for (let k = 0; k < SHARE.length; k++) {
        edge += SHARE[k] ?? 0;
        if (roll < edge) {
          kind = k;
          break;
        }
      }
      const at = T.list + T.travel + (slot + 1) * pace;
      resolved = Math.max(resolved, at);
      rows.push({ lane, slot, kind, at });
    }
  }

  return { rows, sizes, resolved, end: resolved + T.gap + T.write + T.check };
}

/** Narrow screens stack the three stages; the lanes become a vertical list. */
const NARROW = { pad: 14, top: 34, listCols: 32, listRow: 7, gap: 40, lane: 26, sheetCols: 20, sheetRow: 11 };

function narrowHeight(rows: number) {
  const n = NARROW;
  return (
    n.top +
    Math.ceil(rows / n.listCols) * n.listRow +
    n.gap +
    LANES * n.lane +
    n.gap +
    Math.ceil(rows / n.sheetCols) * n.sheetRow +
    16
  );
}

function plan(width: number, height: number, wide: boolean, model: Model, max: number, labels: Props["labels"]): Plan {
  const list: Box[] = [];
  const lane: Box[] = [];
  const sheet: Box[] = [];
  const marks: Mark[] = [];
  const total = model.rows.length;

  if (wide) {
    const pad = 24;
    const top = 46;
    const body = height - top - 22;
    const listW = 64;
    const sheetW = Math.min(200, width * 0.2);
    const sheetX = width - pad - sheetW;
    const laneX = pad + listW + 48;
    const laneH = body / LANES;
    const cellW = (sheetX - 64 - laneX - 26) / max;
    const cellH = Math.min(22, laneH - 12);
    const cols = 8;
    const sw = sheetW / cols;
    const sh = body / Math.ceil(total / cols);
    const rowH = body / total;

    model.rows.forEach((row, i) => {
      list.push([pad, top + i * rowH, listW, Math.max(1, rowH - 1)]);
      lane.push([
        laneX + 26 + row.slot * cellW,
        top + row.lane * laneH + (laneH - cellH) / 2,
        Math.max(2, cellW - 2),
        cellH,
      ]);
      sheet.push([sheetX + (i % cols) * sw, top + Math.floor(i / cols) * sh, sw - 2, sh - 2]);
    });
    model.sizes.forEach((size, l) => {
      const y = top + l * laneH + laneH / 2;
      marks.push({ text: String(l + 1), x: laneX + 14, y, align: "right", agent: true });
      marks.push({ text: String(size), x: laneX + 26 + size * cellW + 6, y });
    });
    marks.push({ text: labels.list, x: pad, y: 22 });
    marks.push({ text: labels.lanes, x: laneX, y: 22, agent: true });
    marks.push({ text: labels.sheet, x: sheetX + 24, y: 22 });
    return { list, lane, sheet, marks, icon: [sheetX, 15], check: { box: [pad - 8, top, 3, body], down: true } };
  }

  const n = NARROW;
  const inner = width - n.pad * 2;
  const listW = inner / n.listCols;
  const laneTop = n.top + Math.ceil(total / n.listCols) * n.listRow + n.gap;
  const cellW = (inner - 22) / max;
  const sheetTop = laneTop + LANES * n.lane + n.gap;
  const sw = inner / n.sheetCols;

  model.rows.forEach((row, i) => {
    list.push([n.pad + (i % n.listCols) * listW, n.top + Math.floor(i / n.listCols) * n.listRow, listW - 2, n.listRow - 3]);
    lane.push([n.pad + 22 + row.slot * cellW, laneTop + row.lane * n.lane + 5, Math.max(2, cellW - 2), n.lane - 10]);
    sheet.push([
      n.pad + (i % n.sheetCols) * sw,
      sheetTop + Math.floor(i / n.sheetCols) * n.sheetRow,
      sw - 2,
      n.sheetRow - 2,
    ]);
  });
  model.sizes.forEach((_, l) => {
    marks.push({
      text: String(l + 1),
      x: n.pad + 12,
      y: laneTop + l * n.lane + n.lane / 2,
      align: "right",
      agent: true,
    });
  });
  marks.push({ text: labels.list, x: n.pad, y: n.top - 16 });
  marks.push({ text: labels.lanes, x: n.pad, y: laneTop - 16, agent: true });
  marks.push({ text: labels.sheet, x: n.pad + 24, y: sheetTop - 16 });
  return {
    list,
    lane,
    sheet,
    marks,
    icon: [n.pad, sheetTop - 23],
    check: { box: [n.pad, n.top - 6, inner, 2], down: false },
  };
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (p: number) => 1 - (1 - p) ** 3;

/**
 * Blue Mesa's contact research as one canvas: the company list splits into
 * groups, one lane per subagent, all starting at once. Each row ends in one of
 * four classes, a script writes the rows into the sheet, and a check compares
 * the two. The rows are simulated; the mechanism is the real one. No totals
 * are shown: a count of made-up rows would read as a result.
 *
 * The reader can try to lose a row: drag one out of a lane or the sheet and
 * let go. It falls out of the picture, and the check runs again, finds it
 * missing against the list and fetches it back before it reports.
 */
export function Lanes({ min, max, classes, description, labels, copy }: Props) {
  const model = useMemo(() => buildModel(min, max), [min, max]);
  const figure = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const restart = useRef<() => void>(() => {});

  useEffect(() => {
    const root = figure.current;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!root || !el || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideQuery = window.matchMedia("(min-width: 40rem)");
    const style = getComputedStyle(el);
    // One meaning per colour, as in lab.css: ink draws, blue is an agent at
    // work, yellow is a verified address, the tint is a row not reached yet.
    const color = {
      ink: style.getPropertyValue("--ink").trim(),
      agent: style.getPropertyValue("--agent").trim(),
      verified: style.getPropertyValue("--verified").trim(),
      tint: style.getPropertyValue("--tint").trim(),
      ground: style.getPropertyValue("--ground").trim(),
    };
    const font = `11px ${style.fontFamily}`;
    const total = model.rows.length;
    const writeStart = model.resolved + T.gap;
    const checkStart = writeStart + T.write;

    let width = 0;
    let height = 0;
    let layout: Plan | null = null;
    let time = reduce ? model.end : 0;
    let last = 0;
    let frame = 0;
    let visible = false;

    /** A row the reader has pulled out. It falls until the check fetches it back. */
    type Loose = {
      /** Taken from the sheet, not from its lane: that is where it goes back to. */
      sheet: boolean;
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      held: boolean;
      /** When the check started fetching it, and from where. Negative while it is still lost. */
      back: number;
      bx: number;
      by: number;
    };
    const loose = new Map<number, Loose>();
    // When the check sweeps the list. It sweeps again after every row that is thrown.
    let sweepStart = checkStart;
    let held = -1;
    let grip = { x: 0, y: 0, t: 0 };
    const written = () => Math.floor(clamp((time - writeStart) / T.write) * total);
    const finished = () => time >= model.end && time >= sweepStart + T.check && loose.size === 0;

    // Every finished row is a box in ink; what fills it is its class.
    const cell = ([x, y, w, h]: Box, kind: number) => {
      if (kind === 0) {
        ctx.fillStyle = color.verified;
        ctx.fillRect(x, y, w, h);
      } else if (kind === 1) {
        // Half filled: derived from a proven pattern, not seen directly.
        ctx.fillStyle = color.verified;
        ctx.fillRect(x, y + h * 0.55, w, h * 0.45);
      } else if (kind === 2) {
        ctx.fillStyle = color.ink;
        ctx.fillRect(x, y, w, h);
      }
      // Not found stays an empty, closed box. A finished answer, not a failure.
      ctx.strokeStyle = color.ink;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    };

    const paint = () => {
      if (!layout) return;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.font = font;
      ctx.textBaseline = "middle";
      for (const mark of layout.marks) {
        ctx.fillStyle = mark.agent ? color.agent : color.ink;
        ctx.textAlign = mark.align ?? "left";
        ctx.fillText(mark.text, mark.x, mark.y);
      }

      const writing = clamp((time - writeStart) / T.write);
      const writtenRows = written();
      const checking = clamp((time - sweepStart) / T.check);
      // Where a pulled-out row was: an empty place, lightly marked.
      const gap = ([x, y, w, h]: Box) => {
        ctx.strokeStyle = color.tint;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      };
      const working = new Set<number>();

      // The script: a prompt icon beside the sheet, filled in while it writes.
      const [ix, iy] = layout.icon;
      const busy = writing > 0 && writing < 1;
      ctx.strokeStyle = color.ink;
      if (busy) {
        ctx.fillStyle = color.ink;
        ctx.fillRect(ix, iy, 17, 14);
        ctx.strokeStyle = style.getPropertyValue("--ground").trim();
      }
      ctx.strokeRect(ix + 0.5, iy + 0.5, 16, 13);
      ctx.beginPath();
      ctx.moveTo(ix + 4, iy + 4);
      ctx.lineTo(ix + 7, iy + 7);
      ctx.lineTo(ix + 4, iy + 10);
      ctx.moveTo(ix + 9, iy + 10);
      ctx.lineTo(ix + 13, iy + 10);
      ctx.stroke();

      // The check: a rule drawn along the original list, row by row.
      if (checking > 0) {
        const [cx, cy, cw, ch] = layout.check.box;
        ctx.fillStyle = color.ink;
        if (layout.check.down) ctx.fillRect(cx, cy, cw, ch * checking);
        else ctx.fillRect(cx, cy, cw * checking, ch);
      }

      model.rows.forEach((row, i) => {
        const from = layout?.list[i];
        const to = layout?.lane[i];
        const out = layout?.sheet[i];
        if (!from || !to || !out) return;

        // The list stays where it is: it is the original the check compares against.
        ctx.fillStyle = color.ink;
        ctx.fillRect(from[0], from[1], from[2], from[3]);

        const travel = clamp((time - T.list - row.slot * 0.004) / T.travel);
        if (travel > 0 && travel < 1) {
          const p = ease(travel);
          ctx.fillStyle = color.tint;
          ctx.fillRect(
            from[0] + (to[0] - from[0]) * p,
            from[1] + (to[1] - from[1]) * p,
            from[2] + (to[2] - from[2]) * p,
            from[3] + (to[3] - from[3]) * p,
          );
        } else if (travel >= 1) {
          if (loose.has(i)) {
            gap(to);
          } else if (time >= row.at) {
            cell(to, row.kind);
          } else {
            // The first open row in a lane is the one its subagent is on.
            const active = !working.has(row.lane);
            if (active) working.add(row.lane);
            ctx.fillStyle = active ? color.agent : color.tint;
            ctx.fillRect(to[0], to[1], to[2], to[3]);
          }
        }

        if (i < writtenRows) {
          if (loose.has(i)) gap(out);
          else cell(out, row.kind);
        } else if (i === writtenRows && writing > 0) {
          ctx.fillStyle = color.ink;
          ctx.fillRect(out[0], out[1], out[2], out[3]);
        }
      });

      // The rows that are out, drawn last so they pass over everything.
      for (const [i, chip] of loose) {
        const row = model.rows[i];
        if (!row) continue;
        const box: Box = [chip.x - chip.w / 2, chip.y - chip.h / 2, chip.w, chip.h];
        ctx.fillStyle = time >= row.at ? color.ground : color.tint;
        ctx.fillRect(box[0], box[1], box[2], box[3]);
        if (time >= row.at) cell(box, row.kind);
      }
    };

    /** Moves the rows that are out: falling, or on their way back once the check has reached them. */
    const advance = (dt: number) => {
      if (!layout) return;
      // The check does not finish behind the reader's back: it waits for the hand to let go.
      if (held >= 0) sweepStart = Math.max(sweepStart, time + T.gap);
      const reached = clamp((time - sweepStart) / T.check) * total;
      for (const [i, chip] of loose) {
        if (chip.held) continue;
        if (chip.back < 0) {
          chip.vy += GRAVITY * dt;
          chip.x += chip.vx * dt;
          chip.y += chip.vy * dt;
          if (time >= sweepStart && reached > i) {
            // Found missing. It comes back in from wherever it left the picture.
            chip.back = time;
            chip.bx = Math.min(width + 30, Math.max(-30, chip.x));
            chip.by = Math.min(height + 30, Math.max(-30, chip.y));
          }
          continue;
        }
        const home = (chip.sheet ? layout.sheet : layout.lane)[i];
        const p = clamp((time - chip.back) / T.fetch);
        if (!home || p >= 1) {
          loose.delete(i);
          continue;
        }
        chip.x = chip.bx + (home[0] + home[2] / 2 - chip.bx) * ease(p);
        chip.y = chip.by + (home[1] + home[3] / 2 - chip.by) * ease(p);
      }
    };

    /** The row under a point, if it is one the reader can take: in its lane, or written to the sheet. */
    const rowAt = (x: number, y: number) => {
      if (!layout) return null;
      const writtenRows = written();
      let found: { row: number; sheet: boolean; box: Box } | null = null;
      let nearest = REACH * REACH;
      const test = (row: number, sheet: boolean, box: Box | undefined) => {
        if (!box) return;
        const dx = Math.max(box[0] - x, 0, x - box[0] - box[2]);
        const dy = Math.max(box[1] - y, 0, y - box[1] - box[3]);
        if (dx * dx + dy * dy <= nearest) {
          nearest = dx * dx + dy * dy;
          found = { row, sheet, box };
        }
      };
      model.rows.forEach((row, i) => {
        if (loose.has(i)) return;
        if (time - T.list - row.slot * 0.004 >= T.travel) test(i, false, layout?.lane[i]);
        if (i < writtenRows) test(i, true, layout?.sheet[i]);
      });
      return found as { row: number; sheet: boolean; box: Box } | null;
    };
    const point = (event: PointerEvent): [number, number] => {
      const box = el.getBoundingClientRect();
      return [event.clientX - box.left, event.clientY - box.top];
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 3);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layout = plan(width, height, wideQuery.matches, model, max, labels);
      paint();
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      time += dt;
      last = now;
      advance(dt);
      paint();
      if (finished()) {
        frame = 0;
        root.dataset.run = "done";
        return;
      }
      frame = requestAnimationFrame(step);
    };
    const play = () => {
      if (frame || reduce || !visible || document.hidden || finished()) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? pause() : play());

    const onDown = (event: PointerEvent) => {
      if (reduce || !event.isPrimary || event.button !== 0 || held >= 0) return;
      const [x, y] = point(event);
      const hit = rowAt(x, y);
      if (!hit) return;
      el.setPointerCapture(event.pointerId);
      loose.set(hit.row, {
        sheet: hit.sheet,
        x,
        y,
        vx: 0,
        vy: 0,
        w: hit.box[2],
        h: hit.box[3],
        held: true,
        back: -1,
        bx: 0,
        by: 0,
      });
      held = hit.row;
      grip = { x, y, t: event.timeStamp };
      root.dataset.run = "running";
      el.style.cursor = "grabbing";
      play();
    };
    const onMove = (event: PointerEvent) => {
      const [x, y] = point(event);
      const chip = loose.get(held);
      if (!chip) {
        if (!reduce) el.style.cursor = rowAt(x, y) ? "grab" : "";
        return;
      }
      // Speed is smoothed over the last few moves, so the throw follows the hand.
      const dt = Math.max(1, event.timeStamp - grip.t) / 1000;
      chip.vx = chip.vx * 0.6 + ((x - grip.x) / dt) * 0.4;
      chip.vy = chip.vy * 0.6 + ((y - grip.y) / dt) * 0.4;
      chip.x = x;
      chip.y = y;
      grip = { x, y, t: event.timeStamp };
    };
    const onUp = (event: PointerEvent) => {
      const chip = loose.get(held);
      held = -1;
      el.style.cursor = "";
      if (!chip) return;
      chip.held = false;
      // A cancelled touch is a scroll, not a throw: the row goes straight back.
      if (event.type === "pointercancel") {
        chip.back = time;
        chip.bx = chip.x;
        chip.by = chip.y;
      }
      const speed = Math.hypot(chip.vx, chip.vy);
      if (speed > 2400) {
        chip.vx *= 2400 / speed;
        chip.vy *= 2400 / speed;
      }
      // The check runs again shortly after, unless its first run is still to come.
      sweepStart = Math.max(sweepStart, time + 0.5);
    };

    restart.current = () => {
      pause();
      loose.clear();
      held = -1;
      sweepStart = checkStart;
      time = 0;
      root.dataset.run = "running";
      paint();
      play();
    };

    if (!reduce) root.dataset.run = "running";
    const resized = new ResizeObserver(resize);
    resized.observe(el);
    const watched = new IntersectionObserver(
      (entries) => {
        // Several changes can arrive in one call; only the latest is true now.
        visible = entries.at(-1)?.isIntersecting ?? false;
        if (visible) play();
        else pause();
      },
      { threshold: 0.25 },
    );
    watched.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      pause();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      resized.disconnect();
      watched.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      restart.current = () => {};
      delete root.dataset.run;
    };
  }, [model, max, labels]);

  return (
    <figure className="lanes lab-term" ref={figure}>
      <canvas
        ref={canvas}
        className="lanes-canvas"
        role="img"
        aria-label={description}
        style={{ "--narrow": `${narrowHeight(model.rows.length)}px` } as CSSProperties}
      />
      <ul className="lanes-key">
        {classes.map((item, kind) => (
          <li key={item.label} data-kind={kind}>
            <span className="lanes-swatch" aria-hidden="true" />
            <span className="lanes-label">{item.label}</span>
            {item.note && <span className="lanes-note">{item.note}</span>}
          </li>
        ))}
      </ul>
      <figcaption className="lanes-foot">
        <p className="lanes-check">
          <span aria-hidden="true">✓ </span>
          {copy.check}
        </p>
        <p className="lanes-caption">{copy.caption}</p>
        <p className="lanes-dare">{copy.dare}</p>
        <button type="button" className="lanes-replay" onClick={() => restart.current()}>
          {copy.replay}
        </button>
      </figcaption>
    </figure>
  );
}
