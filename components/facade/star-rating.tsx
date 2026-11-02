"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { star: "size-3.5", gap: "gap-0.5", text: "text-xs" },
  md: { star: "size-5", gap: "gap-1", text: "text-sm" },
  lg: { star: "size-7", gap: "gap-1.5", text: "text-base" },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------
   Display mode
------------------------------------------------------------------- */

export interface StarRatingProps {
  /** Rating value, fractional allowed (e.g. 4.8). Defaults to 5. */
  value?: number;
  max?: number;
  /** Number of reviews. Shown as "4.8 · 312 Google reviews". */
  count?: number;
  /** Review source shown before "reviews", e.g. "Google". */
  source?: string;
  size?: keyof typeof SIZES;
  /** Hide the numeric value and count. */
  starsOnly?: boolean;
  /** Animate the fill when scrolled into view. */
  animate?: boolean;
  className?: string;
}

export function StarRating({
  value = 5,
  max = 5,
  count,
  source,
  size = "md",
  starsOnly = false,
  animate = true,
  className,
}: StarRatingProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(max, value));
  const s = SIZES[size];
  const shouldAnimate = animate && !reduce;
  const label = `Rated ${clamped.toFixed(1)} out of ${max}${count ? `, based on ${count.toLocaleString("en-US")} reviews` : ""}`;

  return (
    <div ref={ref} className={cn("inline-flex items-center gap-2", className)} role="img" aria-label={label}>
      <div className={cn("flex items-center", s.gap)} aria-hidden>
        {Array.from({ length: max }, (_, i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return (
            <span key={i} className={cn("relative inline-block shrink-0", s.star)}>
              <Star className={cn("absolute inset-0 fill-foreground/15 text-foreground/15", s.star)} strokeWidth={0} />
              <motion.span
                className="absolute inset-0 overflow-hidden"
                initial={shouldAnimate ? { clipPath: "inset(0 100% 0 0)" } : false}
                animate={
                  inView || !shouldAnimate
                    ? { clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }
                    : { clipPath: "inset(0 100% 0 0)" }
                }
                transition={{ duration: 0.6, delay: shouldAnimate ? 0.08 * i : 0, ease: EASE }}
              >
                <Star className={cn("fill-star text-star", s.star)} strokeWidth={0} />
              </motion.span>
            </span>
          );
        })}
      </div>
      {!starsOnly && (
        <span className={cn("flex items-center gap-1.5 whitespace-nowrap", s.text)} aria-hidden>
          <span className="font-semibold tabular-nums text-foreground">{clamped.toFixed(1)}</span>
          {typeof count === "number" && (
            <span className="text-muted-foreground">
              {count.toLocaleString("en-US")} {source ? `${source} ` : ""}
              {count === 1 ? "review" : "reviews"}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Input mode (radio group semantics)
------------------------------------------------------------------- */

export interface StarRatingInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: keyof typeof SIZES;
  /** Accessible group label. */
  label?: string;
  /** Labels per star, shown as hint text. */
  hints?: string[];
  name?: string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_HINTS = ["Poor", "Fair", "Good", "Great", "Excellent"];

export function StarRatingInput({
  value: valueProp,
  defaultValue = 0,
  onChange,
  max = 5,
  size = "lg",
  label = "Your rating",
  hints = DEFAULT_HINTS,
  name,
  disabled = false,
  className,
}: StarRatingInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [hover, setHover] = React.useState<number | null>(null);
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const s = SIZES[size];
  const shown = hover ?? value;
  const groupId = React.useId();

  const commit = (v: number) => {
    if (disabled) return;
    if (valueProp === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(max, i + 2);
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(1, i);
    if (e.key === "Home") next = 1;
    if (e.key === "End") next = max;
    if (next !== null) {
      e.preventDefault();
      commit(next);
      refs.current[next - 1]?.focus();
    }
  };

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-describedby={`${groupId}-hint`}
        aria-disabled={disabled || undefined}
        className={cn("flex items-center", s.gap, disabled && "opacity-50")}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const active = n <= shown;
          const checked = value === n;
          const tabbable = value === 0 ? i === 0 : checked;
          return (
            <motion.button
              key={n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}${hints[i] ? `, ${hints[i]}` : ""}`}
              tabIndex={tabbable ? 0 : -1}
              disabled={disabled}
              onClick={() => commit(n)}
              onMouseEnter={() => !disabled && setHover(n)}
              onFocus={() => setHover(null)}
              onKeyDown={(e) => onKeyDown(e, i)}
              whileTap={reduce ? undefined : { scale: 0.9 }}
              className={cn(
                "relative rounded-md p-0.5 outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              <motion.span
                className="block"
                animate={reduce ? undefined : { scale: active && hover !== null ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              >
                <Star
                  className={cn(
                    s.star,
                    "transition-colors duration-150",
                    active ? "fill-star text-star" : "fill-foreground/15 text-foreground/15",
                    hover !== null && active && n > value && "fill-star/60 text-star/60",
                  )}
                  strokeWidth={0}
                  aria-hidden
                />
              </motion.span>
            </motion.button>
          );
        })}
      </div>
      <p id={`${groupId}-hint`} className="h-5 text-sm text-muted-foreground" aria-live="polite">
        {shown > 0 ? (
          <span>
            <span className="font-medium text-foreground">{hints[shown - 1] ?? `${shown} stars`}</span>
            {hover === null && value > 0 ? " selected" : ""}
          </span>
        ) : (
          "Tap a star to rate"
        )}
      </p>
      {name && <input type="hidden" name={name} value={value || ""} />}
    </div>
  );
}

export default StarRating;
