"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsBandItem {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  /** Short trend text, e.g. "+18% vs 2024". */
  trend?: string;
  /** Direction of the trend. "down" can still be positive (e.g. response time). */
  trendDirection?: "up" | "down";
  /** Whether the trend is good news. Defaults to true. */
  trendPositive?: boolean;
}

export interface StatsBandProps {
  eyebrow?: string;
  title?: string;
  stats?: StatsBandItem[];
  /** Renders the band on an inverted (primary) surface. */
  inverted?: boolean;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const DEFAULT_STATS: StatsBandItem[] = [
  { value: 12480, suffix: "+", label: "Jobs completed in Central Texas", trend: "+18% vs last year" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average rating across 1,200 reviews", trend: "+0.2 this year" },
  { value: 47, suffix: " min", label: "Average arrival time for same-day calls", trend: "-9 min faster", trendDirection: "down" },
  { value: 98, suffix: "%", label: "Customers who would book us again", trend: "+3 pts" },
];

function AnimatedNumber({ item, delay }: { item: StatsBandItem; delay: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduce = useReducedMotion();
  const decimals = item.decimals ?? 0;

  const format = React.useCallback(
    (n: number) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = format(item.value);
      return;
    }
    const c = animate(0, item.value, {
      duration: 2.2,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => c.stop();
  }, [inView, reduce, item.value, delay, format]);

  return (
    <span className="tabular-nums">
      {item.prefix}
      <span ref={ref}>{format(0)}</span>
      {item.suffix && <span className="text-[0.5em] font-medium text-muted-foreground">{item.suffix}</span>}
    </span>
  );
}

export function StatsBand({
  eyebrow = "By the numbers",
  title = "Fifteen years of showing up on time.",
  stats = DEFAULT_STATS,
  inverted = false,
  className,
}: StatsBandProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduce = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 sm:py-28",
        inverted ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-[1120px] px-6">
        {(eyebrow || title) && (
          <div className="mb-12 max-w-2xl sm:mb-16">
            {eyebrow && (
              <p className={cn("text-[13px] font-medium uppercase tracking-[0.08em]", inverted ? "text-primary-foreground/60" : "text-muted-foreground")}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance sm:text-[48px]">
                {title}
              </h2>
            )}
          </div>
        )}

        <div ref={ref} className="relative">
          {/* Top rule drawing in */}
          <motion.div
            aria-hidden
            className={cn("absolute inset-x-0 top-0 h-px origin-left", inverted ? "bg-primary-foreground/15" : "bg-foreground/[0.1]")}
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => {
              const positive = s.trendPositive ?? true;
              return (
                <li key={s.label} className="relative px-0 py-8 sm:px-8 lg:py-10 lg:first:pl-0 lg:last:pr-0">
                  {/* Vertical divider drawing in (desktop) */}
                  {i > 0 && (
                    <motion.span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-10 bottom-10 hidden w-px origin-top lg:block",
                        inverted ? "bg-primary-foreground/15" : "bg-foreground/[0.1]",
                      )}
                      initial={{ scaleY: reduce ? 1 : 0 }}
                      animate={inView ? { scaleY: 1 } : undefined}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
                    />
                  )}
                  {/* Horizontal divider on small screens */}
                  {i > 0 && (
                    <motion.span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 top-0 h-px origin-left lg:hidden",
                        i === 1 && "sm:hidden",
                        inverted ? "bg-primary-foreground/15" : "bg-foreground/[0.1]",
                      )}
                      initial={{ scaleX: reduce ? 1 : 0 }}
                      animate={inView ? { scaleX: 1 } : undefined}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: EASE }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: EASE }}
                    className="flex flex-col-reverse"
                  >
                    <p
                      className={cn(
                        "mt-3 min-h-[2.75rem] max-w-[15rem] text-[15px] leading-[1.45]",
                        inverted ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </p>
                    <p className="font-display text-[48px] font-semibold leading-none tracking-[-0.04em] sm:text-[56px]">
                      <AnimatedNumber item={s} delay={0.2 + i * 0.1} />
                    </p>
                  </motion.div>
                  {s.trend && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.6, delay: 1.4 + i * 0.1 }}
                      className={cn(
                        "mt-4 inline-flex items-center gap-1 text-[13px] font-medium",
                        positive ? "text-success" : "text-destructive",
                      )}
                    >
                      <TrendingUp
                        className={cn("size-3.5", s.trendDirection === "down" && "-scale-y-100")}
                        aria-hidden
                      />
                      {s.trend}
                    </motion.p>
                  )}
                </li>
              );
            })}
          </ul>
          <motion.div
            aria-hidden
            className={cn("absolute inset-x-0 bottom-0 h-px origin-right", inverted ? "bg-primary-foreground/15" : "bg-foreground/[0.1]")}
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          />
        </div>
      </div>
    </section>
  );
}

export default StatsBand;
