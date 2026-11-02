"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Ember surface engine (same as ember-gradient, inlined so this file stays self-contained) ---------- */

export type EmberPreset = "ember" | "moss" | "dusk";

export interface EmberPalette {
  /** Solid base under the fields. Keep it dark so white text stays readable. */
  base: string;
  /** Up to five field colors, placed top left, bottom left, center, bottom right, top right. */
  fields: string[];
}

/** A preset name, a palette object, or an array whose first entry is the base. */
export type EmberPaletteInput = EmberPreset | EmberPalette | string[];

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

export interface PromoBarProps {
  /** Message on tablet and desktop. */
  text: React.ReactNode;
  /** Shorter message below 640px. Falls back to `text`. */
  mobileText?: React.ReactNode;
  /** Short bold lead, e.g. "Fall special". Hidden on phones to save space. */
  badge?: string;
  href?: string;
  linkLabel?: string;
  /** ISO date with offset ("2026-11-30T23:59:00-05:00"). Shows a live countdown next to the text. */
  countdownTo?: string;
  /** Words before the countdown. Defaults to "Ends in". */
  countdownLabel?: string;
  /** Show the countdown below 640px too. Off by default so the bar stays one line on phones. */
  countdownOnMobile?: boolean;
  /** Hide the bar once the countdown reaches zero. Defaults to true. */
  hideWhenExpired?: boolean;
  dismissible?: boolean;
  /** localStorage key that remembers the dismissal. Change it for every new campaign. */
  storageKey?: string;
  /** Called after the bar has collapsed. */
  onDismiss?: () => void;
  /** Surface colors. Defaults to "ember". */
  palette?: EmberPaletteInput;
  /** Cross-fade slowly between the presets. */
  cycle?: boolean;
  /** Let the color fields drift. Defaults to true. Always static with reduced motion. */
  drift?: boolean;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const ATTR = "data-promo-bar-dismissed";

const safeKey = (key: string) => key.replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * Pre-paint script that hides an already dismissed bar before first paint.
 * The bar renders this inline right above itself, so it works without setup.
 * If you render the bar lower in the tree, you can also put it in <head>:
 *   <script dangerouslySetInnerHTML={{ __html: promoBarScript("fall-tuneup-2026") }} />
 * This module is a client module, so call it from a client component or copy the string.
 */
export function promoBarScript(storageKey = "facade-promo-bar") {
  const key = safeKey(storageKey);
  return `try{if(localStorage.getItem(${JSON.stringify(key)})==="1"){var d=document.documentElement,v=d.getAttribute("${ATTR}")||"";if((" "+v+" ").indexOf(" ${key} ")<0)d.setAttribute("${ATTR}",(v+" ${key}").trim())}}catch(e){}`;
}

function markDismissed(key: string) {
  const d = document.documentElement;
  const v = d.getAttribute(ATTR) ?? "";
  if (!` ${v} `.includes(` ${key} `)) d.setAttribute(ATTR, `${v} ${key}`.trim());
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function remaining(target: number) {
  const total = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    total,
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function PromoBar({
  text,
  mobileText,
  badge,
  href,
  linkLabel = "Learn more",
  countdownTo,
  countdownLabel = "Ends in",
  countdownOnMobile = false,
  hideWhenExpired = true,
  dismissible = true,
  storageKey = "facade-promo-bar",
  onDismiss,
  palette = "ember",
  cycle = false,
  drift = true,
  className,
}: PromoBarProps) {
  const reduce = useReducedMotion();
  const key = safeKey(storageKey);
  const target = countdownTo ? Date.parse(countdownTo) : NaN;
  const hasCountdown = Number.isFinite(target);
  // The countdown renders after mount only, server and client clocks never agree to the second.
  const [left, setLeft] = React.useState<ReturnType<typeof remaining> | null>(null);
  const [open, setOpen] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);
  const offscreen = useOffscreen(ref);

  React.useEffect(() => {
    if (!hasCountdown) return;
    const tick = () => setLeft(remaining(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hasCountdown, target]);

  // Client-rendered bars (client navigation, dynamic imports) never run the inline script.
  // A layout effect runs before paint, so a dismissed bar is hidden before it can flash.
  useIsomorphicLayoutEffect(() => {
    try {
      if (localStorage.getItem(key) === "1") markDismissed(key);
    } catch {}
  }, [key]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(key, "1");
    } catch {}
  }

  function collapsed() {
    markDismissed(key);
    onDismiss?.();
  }

  if (hasCountdown && hideWhenExpired && left?.total === 0) return null;

  return (
    <>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: promoBarScript(key) }} />
      <style href={`facade-promo-bar-${key}`} precedence="medium">
        {`html[${ATTR}~="${key}"] [data-promo-bar="${key}"]{display:none}`}
      </style>
      <motion.div
        ref={ref}
        role="region"
        aria-label="Promotion"
        data-promo-bar={key}
        initial={false}
        animate={open ? { height: "auto" } : { height: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        onAnimationComplete={() => {
          if (!open) collapsed();
        }}
        className={cn("relative isolate w-full overflow-hidden text-white", className)}
      >
        <EmberLayer palette={palette} cycle={cycle} paused={!drift || offscreen} grain />
        <div className="mx-auto flex min-h-12 max-w-[1120px] items-center gap-3 px-4 py-2 sm:min-h-14 sm:px-6">
          {dismissible && <span className="w-7 shrink-0" aria-hidden />}

          <p className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center text-[13px] leading-snug sm:text-sm">
            <span className="min-w-0">
              {badge && <span className="mr-1.5 hidden font-semibold sm:inline">{badge}</span>}
              <span className="text-white/90 sm:hidden">{mobileText ?? text}</span>
              <span className="hidden text-white/90 sm:inline">{text}</span>
            </span>

            {hasCountdown && (
              <span
                role="timer"
                aria-label={
                  left ? `${countdownLabel} ${left.d} days, ${left.h} hours and ${left.m} minutes` : countdownLabel
                }
                className={cn(
                  "shrink-0 items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-0.5 text-[12px] font-medium tabular-nums text-white ring-1 ring-white/15",
                  countdownOnMobile ? "inline-flex" : "hidden sm:inline-flex",
                )}
              >
                <span className="text-white/70" aria-hidden>
                  {countdownLabel}
                </span>
                {/* Fixed width placeholder until mount, so nothing shifts when the time appears */}
                <span aria-hidden className={cn(!left && "invisible")}>
                  {left ? (left.d > 0 ? `${left.d}d ${pad(left.h)}h ${pad(left.m)}m` : `${pad(left.h)}:${pad(left.m)}:${pad(left.s)}`) : "0d 00h 00m"}
                </span>
              </span>
            )}

            {href && (
              <a
                href={href}
                className="shrink-0 rounded font-medium underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                {linkLabel}
              </a>
            )}
          </p>

          {dismissible && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss promotion"
              className="grid size-7 shrink-0 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default PromoBar;
