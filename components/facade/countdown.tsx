"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CountdownProps {
  /** Target date. Accepts a Date, ISO string or timestamp. Include a UTC offset in strings ("2026-11-14T10:00:00-05:00") so the event time is the same for every visitor. */
  target?: Date | string | number;
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void;
  /** Labels for each unit. */
  labels?: { days: string; hours: string; minutes: string; seconds: string };
  /** Hide the seconds column. */
  hideSeconds?: boolean;
  /** Rendered when time is up. */
  completeContent?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

// md and lg shrink below the sm breakpoint so four units plus separators fit a 360px viewport.
const sizes = {
  sm: { box: "h-10 w-7 text-xl rounded-lg", gap: "gap-1", label: "text-[10px]", sep: "text-lg", sepOffset: "mt-1" },
  md: { box: "h-11 w-8 text-2xl rounded-lg sm:h-14 sm:w-11 sm:text-[30px] sm:rounded-xl", gap: "gap-1", label: "text-[11px]", sep: "text-lg sm:text-2xl", sepOffset: "mt-1.5 sm:mt-2.5" },
  lg: { box: "h-12 w-9 text-2xl rounded-lg sm:h-20 sm:w-14 sm:text-5xl sm:rounded-xl", gap: "gap-1 sm:gap-1.5", label: "text-[11px] sm:text-xs", sep: "text-xl sm:text-4xl", sepOffset: "mt-2 sm:mt-4" },
};

function Digit({ value, size }: { value: string; size: keyof typeof sizes }) {
  const reduce = useReducedMotion();
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-background font-display font-semibold tabular-nums tracking-[-0.02em] text-foreground shadow-sm shadow-foreground/[0.06] dark:bg-foreground/[0.1] dark:shadow-none",
        sizes[size].box,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduce ? { opacity: 0 } : { y: "-70%", rotateX: 75, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { y: "70%", rotateX: -75, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
          style={{ transformPerspective: 300 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label, size, pad }: { value: number; label: string; size: keyof typeof sizes; pad: number }) {
  const str = String(value).padStart(pad, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("flex", sizes[size].gap)}>
        {str.split("").map((d, i) => (
          <Digit key={`${str.length}-${i}`} value={d} size={size} />
        ))}
      </div>
      <span className={cn("font-medium uppercase tracking-[0.1em] text-muted-foreground", sizes[size].label)}>{label}</span>
    </div>
  );
}

export function Countdown({
  target,
  onComplete,
  labels = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  hideSeconds = false,
  completeContent,
  size = "md",
  className,
}: CountdownProps) {
  const targetMs = React.useMemo(() => {
    if (target === undefined) return null;
    return target instanceof Date ? target.getTime() : new Date(target).getTime();
  }, [target]);

  // Render only after mount to avoid hydration mismatch from Date.now().
  const [now, setNow] = React.useState<number | null>(null);
  const [fallbackTarget, setFallbackTarget] = React.useState<number | null>(null);
  const completedRef = React.useRef(false);
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  React.useEffect(() => {
    const start = Date.now();
    if (targetMs === null) setFallbackTarget(start + ((3 * 24 + 7) * 3600 + 42 * 60 + 18) * 1000);
    setNow(start);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const end = targetMs ?? fallbackTarget;
  const remaining = now !== null && end !== null ? end - now : null;
  const done = remaining !== null && remaining <= 0;

  React.useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }
    if (!done) completedRef.current = false;
  }, [done]);

  const sep = (
    <span className={cn("self-start font-display font-medium text-muted-foreground/50", sizes[size].sep, sizes[size].sepOffset)} aria-hidden="true">
      :
    </span>
  );

  // Units are grouped in pairs (days + hours, minutes + seconds). Each pair never breaks, but the
  // pairs may wrap to a 2x2 layout on narrow screens. From `sm` up it is one row, as before.
  const rootCls = "inline-flex flex-wrap items-start justify-center gap-x-5 gap-y-4 sm:flex-nowrap sm:gap-3";
  const pairCls = "flex items-start gap-1.5 sm:gap-3";

  if (remaining === null) {
    // Placeholder skeleton with stable layout before mount.
    const skeleton = (
      <div className="flex flex-col items-center gap-2">
        <div className={cn("flex", sizes[size].gap)}>
          <span className={cn("bg-foreground/[0.05]", sizes[size].box)} />
          <span className={cn("bg-foreground/[0.05]", sizes[size].box)} />
        </div>
        <span className={cn("invisible", sizes[size].label)}>00</span>
      </div>
    );
    return (
      <div className={cn(rootCls, className)} aria-hidden="true">
        <div className={pairCls}>
          {skeleton}
          {sep}
          {skeleton}
        </div>
        <span className="hidden sm:contents">{sep}</span>
        <div className={pairCls}>
          {skeleton}
          {!hideSeconds && sep}
          {!hideSeconds && skeleton}
        </div>
      </div>
    );
  }

  if (done && completeContent) return <div className={className}>{completeContent}</div>;

  const p = getParts(remaining);
  const a11y = `${p.days} days, ${p.hours} hours, ${p.minutes} minutes${hideSeconds ? "" : `, ${p.seconds} seconds`} remaining`;

  return (
    <div className={cn(rootCls, className)} role="timer" aria-label={a11y}>
      <div className={pairCls}>
        <Unit value={p.days} label={labels.days} size={size} pad={2} />
        {sep}
        <Unit value={p.hours} label={labels.hours} size={size} pad={2} />
      </div>
      {/* Middle colon only when the four groups sit in one row. */}
      <span className="hidden sm:contents">{sep}</span>
      <div className={pairCls}>
        <Unit value={p.minutes} label={labels.minutes} size={size} pad={2} />
        {!hideSeconds && (
          <>
            {sep}
            <Unit value={p.seconds} label={labels.seconds} size={size} pad={2} />
          </>
        )}
      </div>
    </div>
  );
}

export default Countdown;
