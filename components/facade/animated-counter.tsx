"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedCounterProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Target value. */
  value: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Text before the number, e.g. "$". */
  prefix?: string;
  /** Text after the number, e.g. "+", "M", "%". */
  suffix?: string;
  /** Fixed number of decimals. Defaults to 0. */
  decimals?: number;
  /** BCP 47 locale for Intl.NumberFormat. Defaults to "en-US". */
  locale?: string;
  /** Extra Intl.NumberFormat options (merged after decimals). */
  formatOptions?: Intl.NumberFormatOptions;
  /** Animation duration in seconds. Defaults to 1.8. */
  duration?: number;
  /** Delay in seconds once in view. Defaults to 0. */
  delay?: number;
  /** Animate only the first time it enters the viewport. Defaults to true. */
  once?: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en-US",
  formatOptions,
  duration = 1.8,
  delay = 0,
  once = true,
  className,
  "aria-label": ariaLabel,
  ...rest
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  // Compare `formatOptions` by value so an inline object does not restart the animation on every parent render.
  const formatOptionsKey = JSON.stringify(formatOptions ?? null);
  const formatter = React.useMemo(() => {
    const extra = JSON.parse(formatOptionsKey) as Intl.NumberFormatOptions | null;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...extra,
    });
  }, [locale, decimals, formatOptionsKey]);

  const format = React.useCallback((n: number) => `${prefix}${formatter.format(n)}${suffix}`, [formatter, prefix, suffix]);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView) {
      if (!once) node.textContent = format(from);
      return;
    }
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(from, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, from, value, duration, delay, reduce, once, format]);

  return (
    <span {...rest} className={cn("tabular-nums", className)}>
      {/* Screen readers get the final value; the animated text is decorative. */}
      <span className="sr-only">{ariaLabel ?? format(value)}</span>
      <span ref={ref} aria-hidden>
        {format(from)}
      </span>
    </span>
  );
}

export default AnimatedCounter;
