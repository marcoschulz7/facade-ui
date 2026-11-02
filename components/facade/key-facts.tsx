"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { Bath, BedDouble, Calendar, DollarSign, Ruler, Trees, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KeyFact {
  label: string;
  value: number;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  /** Decimal places to show. */
  decimals?: number;
  /** Disable thousands separators (useful for years). */
  noGrouping?: boolean;
  /** Use compact notation, e.g. 1.25M. */
  compact?: boolean;
}

export interface KeyFactsProps {
  facts?: KeyFact[];
  /** Duration of the count-up in seconds. */
  duration?: number;
  className?: string;
}

const defaultFacts: KeyFact[] = [
  { label: "List price", value: 1250000, icon: DollarSign, prefix: "$", compact: true, decimals: 2 },
  { label: "Bedrooms", value: 4, icon: BedDouble },
  { label: "Bathrooms", value: 3.5, icon: Bath, decimals: 1 },
  { label: "Interior", value: 3120, icon: Ruler, suffix: " sqft" },
  { label: "Lot size", value: 0.34, icon: Trees, suffix: " ac", decimals: 2 },
  { label: "Year built", value: 2019, icon: Calendar, noGrouping: true },
];

type FormatOptions = Pick<KeyFact, "value" | "decimals" | "compact" | "noGrouping">;

function format(fact: FormatOptions, n: number) {
  if (fact.compact && Math.abs(fact.value) >= 1000) {
    const abs = Math.abs(fact.value);
    const div = abs >= 1_000_000 ? 1_000_000 : 1000;
    const unit = abs >= 1_000_000 ? "M" : "K";
    const scaled = n / div;
    return `${scaled.toLocaleString("en-US", {
      minimumFractionDigits: fact.decimals ?? 0,
      maximumFractionDigits: fact.decimals ?? 0,
    })}${unit}`;
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: fact.decimals ?? 0,
    maximumFractionDigits: fact.decimals ?? 0,
    useGrouping: !fact.noGrouping,
  });
}

function CountUp({ fact, start, duration }: { fact: KeyFact; start: boolean; duration: number }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const { value, decimals, compact, noGrouping } = fact;
  const from = noGrouping ? Math.round(value * 0.97) : 0;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const opts: FormatOptions = { value, decimals, compact, noGrouping };
    if (!start) {
      el.textContent = format(opts, from);
      return;
    }
    if (reduce) {
      el.textContent = format(opts, value);
      return;
    }
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const factor = Math.pow(10, decimals ?? 0);
        el.textContent = format(opts, compact ? v : Math.round(v * factor) / factor);
      },
    });
    return () => controls.stop();
  }, [start, reduce, value, decimals, compact, noGrouping, from, duration]);

  return (
    <span className="whitespace-nowrap tabular-nums">
      {fact.prefix}
      <span ref={ref}>{format(fact, from)}</span>
      {fact.suffix && <span className="text-[0.55em] font-medium text-muted-foreground">{fact.suffix}</span>}
    </span>
  );
}

export function KeyFacts({ facts = defaultFacts, duration = 1.4, className }: KeyFactsProps) {
  const ref = React.useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <dl
      ref={ref}
      className={cn(
        "grid w-full grid-cols-2 gap-x-4 gap-y-8 rounded-[28px] bg-muted px-6 py-7 text-foreground sm:grid-cols-3 sm:px-8 sm:py-8 lg:grid-cols-6",
        className,
      )}
    >
      {facts.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.label} className="flex min-w-0 flex-col gap-2">
            <dt className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
              <span className="truncate">{f.label}</span>
            </dt>
            <dd className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-foreground">
              <CountUp fact={f} start={inView} duration={duration} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export default KeyFacts;
