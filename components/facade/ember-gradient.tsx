"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type EmberPreset = "ember" | "moss" | "dusk";

export interface EmberPalette {
  /** Solid base under the fields. Keep it dark so white text stays readable. */
  base: string;
  /** Up to five field colors, placed top left, bottom left, center, bottom right, top right. */
  fields: string[];
}

/** A preset name, a palette object, or an array whose first entry is the base. */
export type EmberPaletteInput = EmberPreset | EmberPalette | string[];

export interface EmberGradientProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Element to render. Defaults to "div". */
  as?: "div" | "section" | "header" | "aside" | "footer";
  /** Colors of the surface. Defaults to "ember" (copper, forest, olive and rust on near black). */
  palette?: EmberPaletteInput;
  /** Slowly cross-fade through `cyclePalettes`. Off by default. Ignored with reduced motion. */
  cycle?: boolean;
  /** Palettes to cycle through, starting after `palette`. Defaults to the other two presets. */
  cyclePalettes?: EmberPaletteInput[];
  /** Seconds each palette stays before the next fades in. Defaults to 30. */
  cycleDuration?: number;
  /** Seconds per drift cycle of the fields. Higher is calmer. Defaults to 26. */
  speed?: number;
  /** Film grain. `true` for the default strength, a number from 0 to 1 for a custom opacity, `false` for none. */
  grain?: boolean | number;
  /** Opacity of the color fields over the base, 0 to 1. Defaults to 1. */
  intensity?: number;
  /** Class for the layer that holds children. */
  contentClassName?: string;
}

/* ---------- Ember surface engine (shared by all ember items, keep in sync) ---------- */

export const emberPalettes: Record<EmberPreset, EmberPalette> = {
  ember: { base: "#17130F", fields: ["#895735", "#193D25", "#444A29", "#943C27", "#895735"] },
  moss: { base: "#10140F", fields: ["#5A6B32", "#1F4A2C", "#3E4A2A", "#7A5A2E", "#26402F"] },
  dusk: { base: "#16121A", fields: ["#7A3F2F", "#2C2F4A", "#4A2E44", "#9A5A33", "#3A2A3E"] },
};

function resolvePalette(input: EmberPaletteInput): EmberPalette {
  if (typeof input === "string") return emberPalettes[input] ?? emberPalettes.ember;
  if (Array.isArray(input)) return { base: input[0] ?? emberPalettes.ember.base, fields: input.slice(1) };
  return input;
}

/* Field placement. Sizes use container units: wide surfaces get wide bands
   (like a 52px bar), tall ones get round pools instead of vertical stripes.
   `w` and `h` are percent of the surface, `cap` limits height to cap x width,
   `push` moves a field past its anchored edge by that share of its own size. */
type Field = {
  x: "left" | "right" | "center";
  y: "top" | "bottom" | "center";
  w: number;
  h: number;
  cap: number;
  push: [number, number];
  opacity: number;
  drift: "a" | "b" | "c";
  factor: number;
  delay: number;
};

const FIELDS: Field[] = [
  { x: "left", y: "top", w: 70, h: 100, cap: 1.1, push: [0.25, 0.35], opacity: 0.85, drift: "a", factor: 1, delay: 0 },
  { x: "left", y: "bottom", w: 62, h: 95, cap: 1.1, push: [0.25, 0.3], opacity: 0.9, drift: "b", factor: 1.27, delay: -0.3 },
  { x: "center", y: "center", w: 52, h: 84, cap: 1, push: [0, 0], opacity: 0.4, drift: "c", factor: 0.86, delay: -0.55 },
  { x: "right", y: "bottom", w: 72, h: 100, cap: 1.1, push: [0.22, 0.3], opacity: 0.9, drift: "b", factor: 1.13, delay: -0.7 },
  { x: "right", y: "top", w: 50, h: 84, cap: 1, push: [0.2, 0.4], opacity: 0.5, drift: "a", factor: 0.94, delay: -0.2 },
];

function fieldBox(f: Field): React.CSSProperties {
  const width = `max(${f.w}cqw, ${f.w * 0.55}cqh)`;
  const height = `min(${f.h}cqh, max(${f.w * f.cap}cqw, ${f.w * 0.55 * f.cap}cqh))`;
  const box: React.CSSProperties = { width, height };
  if (f.x === "center") box.left = `calc(50% - ${width} / 2)`;
  else box[f.x] = `calc(${width} * ${-f.push[0]})`;
  if (f.y === "center") box.top = `calc(50% - ${height} / 2)`;
  else box[f.y] = `calc(${height} * ${-f.push[1]})`;
  return box;
}

/* Transform and opacity only, so the drift runs on the compositor. The fields
   are soft radial gradients, no blur filter is repainted per frame. */
const EMBER_CSS = `
@keyframes facade-ember-a{0%{transform:translate3d(0,0,0) scale(1);opacity:1}50%{transform:translate3d(10%,14%,0) scale(1.08);opacity:.78}100%{transform:translate3d(-6%,6%,0) scale(.95);opacity:1}}
@keyframes facade-ember-b{0%{transform:translate3d(0,0,0) scale(1.04)}50%{transform:translate3d(-12%,-6%,0) scale(.94)}100%{transform:translate3d(6%,-12%,0) scale(1.1)}}
@keyframes facade-ember-c{0%{transform:translate3d(0,0,0) scale(.95);opacity:.6}50%{transform:translate3d(14%,-10%,0) scale(1.12);opacity:1}100%{transform:translate3d(-10%,8%,0) scale(1);opacity:.7}}
.facade-ember-field{position:absolute;border-radius:9999px;will-change:transform,opacity;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}
.facade-ember[data-paused] .facade-ember-field{animation-play-state:paused}
.facade-ember-stack{position:absolute;inset:0;transition-property:opacity;transition-timing-function:ease-in-out}
@media (prefers-reduced-motion:reduce){.facade-ember-field{animation:none!important}.facade-ember-stack{transition:none!important}}
`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface EmberLayerProps {
  palette: EmberPaletteInput;
  cycle?: boolean;
  cyclePalettes?: EmberPaletteInput[];
  cycleDuration?: number;
  speed?: number;
  grain?: boolean | number;
  intensity?: number;
  /** Pauses drift and cycling, e.g. while the surface is off screen. */
  paused?: boolean;
}

function EmberLayer({
  palette,
  cycle = false,
  cyclePalettes,
  cycleDuration = 30,
  speed = 26,
  grain = true,
  intensity = 1,
  paused = false,
}: EmberLayerProps) {
  const reduce = useReducedMotion();
  const first = resolvePalette(palette);
  const others = (cyclePalettes ?? (Object.keys(emberPalettes) as EmberPreset[]).filter((k) => k !== palette)).map(
    resolvePalette,
  );
  const stacks = cycle ? [first, ...others] : [first];
  const [active, setActive] = React.useState(0);
  const running = cycle && !reduce && !paused && stacks.length > 1;

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % stacks.length), cycleDuration * 1000);
    return () => window.clearInterval(id);
  }, [running, stacks.length, cycleDuration]);

  const fade = Math.min(8, cycleDuration / 3);
  const grainOpacity = grain === true ? 0.16 : typeof grain === "number" ? grain : 0;

  return (
    <div
      aria-hidden
      className="facade-ember pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      data-paused={paused || undefined}
      style={{ backgroundColor: `var(--ember-base, ${first.base})`, containerType: "size" }}
    >
      <style href="facade-ember-v1" precedence="medium">
        {EMBER_CSS}
      </style>
      {stacks.map((p, s) => (
        <div
          key={s}
          className="facade-ember-stack"
          style={{
            opacity: s === active ? 1 : 0,
            transitionDuration: `${fade}s`,
            backgroundColor: s === 0 ? undefined : p.base,
          }}
        >
          <div className="absolute inset-0" style={{ opacity: intensity }}>
            {FIELDS.map((f, i) => {
              const raw = p.fields[i % Math.max(1, p.fields.length)];
              if (!raw) return null;
              // The first palette reads CSS variables, so a theme can override colors without props.
              const color = s === 0 ? `var(--ember-${i + 1}, ${raw})` : raw;
              const duration = speed * f.factor;
              return (
                <span
                  key={i}
                  className="facade-ember-field"
                  style={{
                    ...fieldBox(f),
                    opacity: f.opacity,
                    // A short plateau before the falloff keeps small surfaces from showing hot spots.
                    background: `radial-gradient(closest-side, ${color} 0%, ${color} 22%, color-mix(in srgb, ${color} 50%, transparent) 62%, transparent 100%)`,
                    animationName: `facade-ember-${f.drift}`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${f.delay * duration}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
      {grainOpacity > 0 && (
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ opacity: grainOpacity, backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
        />
      )}
    </div>
  );
}

/** Pauses the surface while it is scrolled out of view. */
function useOffscreen<T extends Element>(ref: React.RefObject<T | null>) {
  const [off, setOff] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return off;
}

/* ---------- end of engine ---------- */

export function EmberGradient({
  children,
  as: Tag = "div",
  palette = "ember",
  cycle = false,
  cyclePalettes,
  cycleDuration = 30,
  speed = 26,
  grain = true,
  intensity = 1,
  className,
  contentClassName,
  ...rest
}: EmberGradientProps) {
  const ref = React.useRef<HTMLElement>(null);
  const offscreen = useOffscreen(ref);

  return (
    <Tag
      {...rest}
      ref={ref as React.Ref<never>}
      className={cn("relative isolate overflow-hidden text-white", className)}
    >
      <EmberLayer
        palette={palette}
        cycle={cycle}
        cyclePalettes={cyclePalettes}
        cycleDuration={cycleDuration}
        speed={speed}
        grain={grain}
        intensity={intensity}
        paused={offscreen}
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </Tag>
  );
}

export default EmberGradient;
