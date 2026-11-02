"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type UrgencyVariant = "neutral" | "brand" | "warning";

export interface UrgencyBadgeProps {
  /** Main message, e.g. "Only 3 homes left". */
  label?: React.ReactNode;
  /** Secondary line shown next to the progress bar, e.g. "Phase 2". */
  detail?: React.ReactNode;
  /** Percent sold (0 to 100). When set, a progress bar animates in. */
  progress?: number;
  /** Text after the percentage, defaults to "sold". */
  progressSuffix?: string;
  variant?: UrgencyVariant;
  /** Show the pulsing live dot. */
  pulse?: boolean;
  className?: string;
}

const variants: Record<UrgencyVariant, { root: string; dot: string; ping: string; bar: string; track: string }> = {
  neutral: {
    root: "bg-muted text-foreground",
    dot: "bg-success",
    ping: "bg-success/60",
    bar: "bg-foreground",
    track: "bg-foreground/[0.08]",
  },
  brand: {
    root: "bg-accent text-accent-foreground",
    dot: "bg-brand",
    ping: "bg-brand/60",
    bar: "bg-brand",
    track: "bg-brand/15",
  },
  warning: {
    root: "bg-warning/10 text-foreground",
    dot: "bg-warning",
    ping: "bg-warning/70",
    bar: "bg-warning",
    track: "bg-warning/20",
  },
};

export function UrgencyBadge({
  label = "Only 3 homes left",
  detail,
  progress,
  progressSuffix = "sold",
  variant = "brand",
  pulse = true,
  className,
}: UrgencyBadgeProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const v = variants[variant];
  const hasProgress = typeof progress === "number";
  const pct = hasProgress ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        "inline-flex flex-col gap-2.5 rounded-2xl px-4 py-3 text-sm",
        hasProgress ? "min-w-[260px]" : "rounded-full px-3.5 py-1.5",
        v.root,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {pulse && (
          <span className="relative flex size-2 shrink-0" aria-hidden="true">
            {!reduce && <span className={cn("absolute inline-flex size-full animate-ping-slow rounded-full", v.ping)} />}
            <span className={cn("relative inline-flex size-2 rounded-full", v.dot)} />
          </span>
        )}
        <span className="font-medium">{label}</span>
        {detail && !hasProgress && <span className="opacity-60">· {detail}</span>}
      </div>
      {hasProgress && (
        <div className="space-y-1.5">
          <div
            className={cn("h-1.5 w-full overflow-hidden rounded-full", v.track)}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            aria-label={`${Math.round(pct)}% ${progressSuffix}`}
          >
            <motion.div
              className={cn("relative h-full rounded-full", v.bar)}
              initial={{ width: reduce ? `${pct}%` : "0%" }}
              animate={{ width: inView || reduce ? `${pct}%` : "0%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>
              <span className="font-semibold tabular-nums opacity-100">{Math.round(pct)}%</span> {progressSuffix}
            </span>
            {detail && <span>{detail}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default UrgencyBadge;
