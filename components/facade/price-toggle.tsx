"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   PriceToggle
------------------------------------------------------------------- */

export type BillingPeriod = "monthly" | "yearly";

export interface PriceToggleProps {
  value?: BillingPeriod;
  defaultValue?: BillingPeriod;
  onChange?: (value: BillingPeriod) => void;
  /** Badge next to the yearly option. Set to null to hide. */
  badge?: string | null;
  labels?: { monthly: string; yearly: string };
  className?: string;
}

export function PriceToggle({
  value: valueProp,
  defaultValue = "monthly",
  onChange,
  badge = "Save 20%",
  labels = { monthly: "Monthly", yearly: "Yearly" },
  className,
}: PriceToggleProps) {
  const reduce = useReducedMotion();
  const [inner, setInner] = React.useState<BillingPeriod>(defaultValue);
  const value = valueProp ?? inner;
  const uid = React.useId();
  const refs = React.useRef<Record<BillingPeriod, HTMLButtonElement | null>>({ monthly: null, yearly: null });

  const select = (v: BillingPeriod) => {
    if (valueProp === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const next: BillingPeriod = value === "monthly" ? "yearly" : "monthly";
      select(next);
      refs.current[next]?.focus();
    }
  };

  const options: BillingPeriod[] = ["monthly", "yearly"];

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="relative inline-grid grid-cols-2 rounded-full bg-muted p-1"
      >
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              ref={(el) => {
                refs.current[o] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => select(o)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative h-9 min-w-24 rounded-full px-4 text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${uid}-thumb`}
                  className="absolute inset-0 rounded-full bg-background shadow-sm shadow-foreground/[0.08] dark:bg-foreground/[0.12] dark:shadow-none"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 36 }}
                  aria-hidden
                />
              )}
              <span className="relative">{labels[o]}</span>
            </button>
          );
        })}
      </div>
      {badge && (
        <motion.span
          animate={
            value === "yearly"
              ? { opacity: 1, scale: 1 }
              : { opacity: 0.75, scale: reduce ? 1 : 0.96 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
          className={cn(
            "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium transition-colors",
            value === "yearly" ? "bg-success/12 text-success" : "bg-muted text-muted-foreground",
          )}
        >
          {badge}
        </motion.span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   AnimatedPrice: rolls each digit when the value changes
------------------------------------------------------------------- */

export interface AnimatedPriceProps {
  value: number;
  currency?: string;
  /** Decimal places. Defaults to 0 for whole numbers, 2 otherwise. */
  fractionDigits?: number;
  locale?: string;
  className?: string;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Digit({ digit, reduce }: { digit: number; reduce: boolean | null }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none tabular-nums" aria-hidden>
      <span className="invisible">0</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 34, mass: 0.9 }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function AnimatedPrice({
  value,
  currency = "USD",
  fractionDigits,
  locale = "en-US",
  className,
}: AnimatedPriceProps) {
  const reduce = useReducedMotion();
  const digits = fractionDigits ?? (Number.isInteger(value) ? 0 : 2);
  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }),
    [locale, currency, digits],
  );
  const parts = formatter.formatToParts(value);
  const full = formatter.format(value);

  // Key digits from the right so the ones place stays the same element as the number grows.
  const chars: Array<{ ch: string; isDigit: boolean }> = [];
  for (const p of parts) {
    for (const ch of p.value) chars.push({ ch, isDigit: /\d/.test(ch) });
  }
  let digitIndexFromRight = chars.filter((c) => c.isDigit).length;

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{full}</span>
      <span className="inline-flex items-baseline" aria-hidden>
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((c, i) => {
            if (c.isDigit) {
              digitIndexFromRight -= 1;
              return (
                <motion.span
                  key={`d-${digitIndexFromRight}`}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: "-0.3em" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: "0.3em" }}
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                  className="inline-block"
                >
                  <Digit digit={Number(c.ch)} reduce={reduce} />
                </motion.span>
              );
            }
            return (
              <motion.span
                key={`s-${c.ch}-${i - chars.length}`}
                layout={!reduce}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="inline-block"
              >
                {c.ch}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </span>
    </span>
  );
}

export default PriceToggle;
