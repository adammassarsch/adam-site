"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** How many tokens to draw. One point each, no more and no fewer. */
  count: number;
  /** The cache is warm: the tokens settle into one still block. */
  warm: boolean;
  /** What the drawing shows, for screen readers. */
  label: string;
};

/** Seconds: the tokens rain in, settle into the block, and come loose again. */
const T = { enter: 1.6, settle: 1.1, loosen: 0.7 };
/** Width over height of the settled block, roughly. */
const ASPECT = 1.4;

/**
 * Every point is placed by the vertex shader from its index alone, so there
 * are no buffers to fill: one draw call with `count` vertices. A point has a
 * loose home it drifts around, and a cell in the block it settles into.
 * All positions are in device pixels.
 */
const VERTEX = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_enter;
uniform float u_warm;
uniform float u_cols;
uniform float u_rows;
uniform float u_dpr;
uniform float u_size;
out float v_ink;

// PCG: an integer hash, so neighbouring indices share no pattern.
float hash(uint v) {
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return float((w >> 22u) ^ w) / 4294967295.0;
}

void main() {
  uint id = uint(gl_VertexID);
  float i = float(gl_VertexID);
  float a = hash(id * 3u);
  float b = hash(id * 3u + 1u);
  float c = hash(id * 3u + 2u);

  float t = u_time * (0.15 + 0.35 * c);
  vec2 drift = 0.035 * vec2(
    sin(t + a * 6.283) + 0.5 * sin(t * 1.7 + b * 40.0),
    cos(t * 0.9 + b * 6.283) + 0.5 * cos(t * 1.3 + a * 40.0)
  );
  vec2 loose = (vec2(a, b) * 0.92 + 0.04 + drift) * u_res;

  float fall = clamp((u_enter - c * 0.6) / 0.4, 0.0, 1.0);
  fall = 1.0 - pow(1.0 - fall, 3.0);
  loose.y = mix(-12.0 * u_dpr - a * u_res.y * 0.6, loose.y, fall);

  // The block sits on whole device pixels, so its rows and columns never beat
  // against the screen. Cells of three pixels or more keep a gap between dots.
  float col = mod(i, u_cols);
  float row = floor(i / u_cols);
  float cell = max(1.0, floor(min(u_res.x, u_res.y * u_cols / u_rows) * 0.92 / u_cols));
  float dot_ = cell > 2.0 ? cell - 1.0 : cell;
  vec2 origin = floor((u_res - cell * vec2(u_cols, u_rows)) * 0.5);
  vec2 block = origin + vec2(col, row) * cell + dot_ * 0.5;

  // The block fills from the top, row by row, like a sheet being printed.
  float w = clamp(u_warm * 1.7 - (row / u_rows) * 0.5 - c * 0.2, 0.0, 1.0);
  w = w * w * (3.0 - 2.0 * w);
  vec2 p = mix(loose, block, w);

  // The pointer pushes loose tokens aside; settled ones barely move.
  vec2 away = (p - u_mouse) / u_dpr;
  float near = exp(-dot(away, away) / 3200.0);
  p += normalize(away + 0.0001) * near * 30.0 * u_dpr * (1.0 - w);

  gl_Position = vec4(p.x / u_res.x * 2.0 - 1.0, 1.0 - p.y / u_res.y * 2.0, 0.0, 1.0);
  gl_PointSize = mix(u_size, dot_, w);
  // Settled, each token takes its own amount of ink, so the block keeps its grain.
  v_ink = mix(1.0, 0.55 + 0.45 * c, w);
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
uniform vec4 u_color;
in float v_ink;
out vec4 color;

void main() {
  color = u_color * v_ink;
}`;

/** The divisor of `count` nearest the width that gives the block its aspect, so the last row is full when it can be. */
function columns(count: number): number {
  const ideal = Math.round(Math.sqrt(count * ASPECT));
  for (let d = 0; d < ideal / 4; d++) {
    if (count % (ideal + d) === 0) return ideal + d;
    if (count % (ideal - d) === 0) return ideal - d;
  }
  return ideal;
}

/** "#rrggbb" as premultiplied RGBA. */
function rgba(hex: string, alpha: number): [number, number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [(((n >> 16) & 255) / 255) * alpha, (((n >> 8) & 255) / 255) * alpha, ((n & 255) / 255) * alpha, alpha];
}

/**
 * The prompt of one Seminar question, drawn token by token. Cold, the tokens
 * drift loose; when the cache is warm they settle into one still block. Only
 * the total is drawn: nothing here says how many of them are cached.
 *
 * Needs WebGL 2. Without it, or without scripting, the figure is not shown
 * (see lab.css) and the number stays in the text beside it.
 */
export function TokenSwarm({ count, warm, label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef(warm);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    target.current = warm;
    wake.current();
  }, [warm]);

  useEffect(() => {
    const el = canvas.current;
    const holder = el?.parentElement;
    if (!el || !holder) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cols = columns(count);
    const rows = Math.ceil(count / cols);
    const ink = rgba(getComputedStyle(el).getPropertyValue("--agent").trim(), 0.85);

    let gl: WebGL2RenderingContext | null = null;
    let uniform: Record<string, WebGLUniformLocation | null> = {};
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let enter = reduce ? 1 : 0;
    let settled = target.current ? 1 : 0;
    let mouse: [number, number] = [-9999, -9999];
    let last = 0;
    let frame = 0;
    let visible = false;

    const setup = () => {
      gl = el.getContext("webgl2", { antialias: false, powerPreference: "low-power" });
      if (!gl) return false;
      const program = gl.createProgram();
      for (const [type, source] of [
        [gl.VERTEX_SHADER, VERTEX],
        [gl.FRAGMENT_SHADER, FRAGMENT],
      ] as const) {
        const shader = gl.createShader(type);
        if (!shader) return false;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);
      uniform = {};
      for (const name of ["res", "mouse", "time", "enter", "warm", "cols", "rows", "dpr", "size", "color"]) {
        uniform[name] = gl.getUniformLocation(program, `u_${name}`);
      }
      gl.uniform1f(uniform.cols ?? null, cols);
      gl.uniform1f(uniform.rows ?? null, rows);
      gl.uniform4f(uniform.color ?? null, ...ink);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      return true;
    };

    const draw = () => {
      if (!gl || !width || !height) return;
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uniform.res ?? null, el.width, el.height);
      gl.uniform2f(uniform.mouse ?? null, mouse[0] * dpr, mouse[1] * dpr);
      gl.uniform1f(uniform.time ?? null, time);
      gl.uniform1f(uniform.enter ?? null, enter);
      gl.uniform1f(uniform.warm ?? null, settled);
      gl.uniform1f(uniform.dpr ?? null, dpr);
      // Loose, the points together cover about half the canvas, whatever its size.
      gl.uniform1f(uniform.size ?? null, Math.max(1, Math.sqrt((0.5 * el.width * el.height) / count)));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      enter = Math.min(1, enter + dt / T.enter);
      const goal = target.current ? 1 : 0;
      settled = goal > settled ? Math.min(goal, settled + dt / T.settle) : Math.max(goal, settled - dt / T.loosen);
      draw();
      // A settled block with no pointer near it is a still picture: stop drawing.
      if (settled === 1 && enter === 1 && mouse[0] < 0) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    const play = () => {
      if (frame || !gl || !visible || document.hidden) return;
      if (reduce) {
        // No motion: the picture jumps to the state it is in.
        settled = target.current ? 1 : 0;
        draw();
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      draw();
    };
    const onMove = (event: PointerEvent) => {
      if (reduce) return;
      const box = el.getBoundingClientRect();
      mouse = [event.clientX - box.left, event.clientY - box.top];
      play();
    };
    const onLeave = () => {
      mouse = [-9999, -9999];
    };
    const onVisibility = () => (document.hidden ? pause() : play());
    const onLost = (event: Event) => {
      event.preventDefault();
      pause();
      gl = null;
    };
    const onRestored = () => {
      if (setup()) play();
    };

    if (!setup()) {
      holder.dataset.swarm = "off";
      return;
    }
    holder.dataset.swarm = "on";
    wake.current = play;

    const resized = new ResizeObserver(resize);
    resized.observe(el);
    const watched = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) play();
        else pause();
      },
      { threshold: 0.2 },
    );
    watched.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("webglcontextlost", onLost);
    el.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      resized.disconnect();
      watched.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("webglcontextrestored", onRestored);
      document.removeEventListener("visibilitychange", onVisibility);
      wake.current = () => {};
      delete holder.dataset.swarm;
    };
  }, [count]);

  return <canvas ref={canvas} className="swarm-canvas" role="img" aria-label={label} />;
}
