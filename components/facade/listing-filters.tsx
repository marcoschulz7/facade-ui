"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListingFiltersValue {
  query: string;
  types: string[];
  /** Minimum bedrooms, 0 means any. */
  beds: number;
  /** Minimum bathrooms, 0 means any. */
  baths: number;
  price: [number, number];
}

export interface ListingFiltersProps {
  propertyTypes?: string[];
  priceMin?: number;
  priceMax?: number;
  priceStep?: number;
  defaultValue?: Partial<ListingFiltersValue>;
  /** Number of results for the current filters. Pass a function to compute it from the value. */
  resultCount?: number | ((value: ListingFiltersValue) => number);
  searchPlaceholder?: string;
  onChange?: (value: ListingFiltersValue) => void;
  className?: string;
}

const compactUsd = (n: number) => {
  // Number() drops trailing zeros without eating the digits of whole millions ($10M stays $10M).
  if (n >= 1_000_000) return `$${Number((n / 1_000_000).toFixed(2))}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
};

const bedOptions = [0, 1, 2, 3, 4];
const bathOptions = [0, 1, 2, 3];

function SegmentGroup({
  label,
  options,
  value,
  onChange,
  layoutId,
}: {
  label: string;
  options: number[];
  value: number;
  onChange: (v: number) => void;
  layoutId: string;
}) {
  const reduce = useReducedMotion();
  const labelId = `${layoutId}-label`;
  const groupRef = React.useRef<HTMLDivElement>(null);

  // Roving tabindex: one tab stop per group, arrow keys move the selection.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = options.indexOf(value);
    let next: number | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = options[(idx + 1) % options.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = options[(idx - 1 + options.length) % options.length];
    else if (e.key === "Home") next = options[0];
    else if (e.key === "End") next = options[options.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    onChange(next);
    groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[options.indexOf(next)]?.focus();
  };

  return (
    <div className="space-y-2">
      <p id={labelId} className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="flex rounded-xl bg-background p-1 dark:bg-foreground/[0.08]"
      >
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(o)}
              className={cn(
                "relative flex-1 rounded-[10px] px-2 py-1.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[10px] bg-foreground"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{o === 0 ? "Any" : `${o}+`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  id,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  id: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<0 | 1 | null>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));

  const setThumb = (thumb: 0 | 1, raw: number) => {
    const v = snap(raw);
    if (thumb === 0) onChange([Math.min(v, value[1] - step), value[1]]);
    else onChange([value[0], Math.max(v, value[0] + step)]);
  };

  const valueFromClient = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return min;
    return min + ((clientX - rect.left) / rect.width) * (max - min);
  };

  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = valueFromClient(e.clientX);
    const thumb: 0 | 1 = Math.abs(v - value[0]) <= Math.abs(v - value[1]) ? 0 : 1;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(thumb);
    setThumb(thumb, v);
    const btn = trackRef.current?.querySelectorAll<HTMLElement>("[role=slider]")[thumb];
    btn?.focus({ preventScroll: true });
  };

  const onKey = (thumb: 0 | 1) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const big = step * 10;
    const current = value[thumb];
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = current - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = current + step;
    else if (e.key === "PageDown") next = current - big;
    else if (e.key === "PageUp") next = current + big;
    else if (e.key === "Home") next = thumb === 0 ? min : value[0] + step;
    else if (e.key === "End") next = thumb === 0 ? value[1] - step : max;
    if (next !== null) {
      e.preventDefault();
      setThumb(thumb, next);
    }
  };

  const fmt = (v: number) => (v >= max ? `${compactUsd(v)}+` : compactUsd(v));

  return (
    <div
      ref={trackRef}
      className="relative h-6 touch-none select-none"
      onPointerDown={onTrackDown}
      onPointerMove={(e) => {
        if (dragging !== null) setThumb(dragging, valueFromClient(e.clientX));
      }}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
    >
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-background dark:bg-foreground/[0.08]" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
        style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
      />
      {([0, 1] as const).map((thumb) => (
        <div
          key={thumb}
          role="slider"
          tabIndex={0}
          id={thumb === 0 ? `${id}-min` : `${id}-max`}
          aria-label={thumb === 0 ? "Minimum price" : "Maximum price"}
          aria-valuemin={thumb === 0 ? min : value[0] + step}
          aria-valuemax={thumb === 0 ? value[1] - step : max}
          aria-valuenow={value[thumb]}
          aria-valuetext={fmt(value[thumb])}
          onKeyDown={onKey(thumb)}
          className={cn(
            "absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-background shadow-float ring-1 ring-foreground/[0.08] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-foreground dark:ring-0",
            dragging === thumb ? "scale-110 cursor-grabbing" : "hover:scale-110",
          )}
          style={{ left: `${pct(value[thumb])}%`, zIndex: dragging === thumb ? 2 : 1 }}
        />
      ))}
    </div>
  );
}

export function ListingFilters({
  propertyTypes = ["House", "Condo", "Townhome", "Multi-family", "Land"],
  priceMin = 0,
  priceMax = 2_000_000,
  priceStep = 25_000,
  defaultValue,
  resultCount,
  searchPlaceholder = "City, neighborhood, ZIP or address",
  onChange,
  className,
}: ListingFiltersProps) {
  const uid = React.useId();
  const reduce = useReducedMotion();
  const empty: ListingFiltersValue = { query: "", types: [], beds: 0, baths: 0, price: [priceMin, priceMax] };
  const [value, setValue] = React.useState<ListingFiltersValue>(() => ({
    query: "",
    types: [],
    beds: 0,
    baths: 0,
    price: [priceMin, priceMax],
    ...defaultValue,
  }));

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const update = (patch: Partial<ListingFiltersValue>) => {
    // Compute outside the updater so onChange is not called twice under StrictMode.
    const next = { ...value, ...patch };
    setValue(next);
    onChangeRef.current?.(next);
  };

  const activeCount =
    (value.query ? 1 : 0) +
    value.types.length +
    (value.beds ? 1 : 0) +
    (value.baths ? 1 : 0) +
    (value.price[0] !== priceMin || value.price[1] !== priceMax ? 1 : 0);

  const count = typeof resultCount === "function" ? resultCount(value) : resultCount;
  const priceLabel = `${compactUsd(value.price[0])} to ${value.price[1] >= priceMax ? `${compactUsd(priceMax)}+` : compactUsd(value.price[1])}`;

  return (
    <div className={cn("w-full rounded-[28px] bg-muted p-4 text-foreground sm:p-6", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search location"
          placeholder={searchPlaceholder}
          value={value.query}
          onChange={(e) => update({ query: e.target.value })}
          className="h-12 w-full rounded-xl bg-background pl-10 pr-10 text-[15px] text-foreground transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-foreground/[0.08] [&::-webkit-search-cancel-button]:hidden"
        />
        <AnimatePresence>
          {value.query && (
            <motion.button
              type="button"
              aria-label="Clear search"
              onClick={() => update({ query: "" })}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Home type</legend>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => {
            const on = value.types.includes(t);
            return (
              <motion.button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => update({ types: on ? value.types.filter((x) => x !== t) : [...value.types, t] })}
                layout={!reduce}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                  on
                    ? "bg-foreground text-background"
                    : "bg-background text-muted-foreground hover:text-foreground dark:bg-foreground/[0.08]",
                )}
              >
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-flex overflow-hidden"
                    >
                      <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {t}
              </motion.button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SegmentGroup label="Beds" options={bedOptions} value={value.beds} onChange={(beds) => update({ beds })} layoutId={`${uid}-beds`} />
        <SegmentGroup label="Baths" options={bathOptions} value={value.baths} onChange={(baths) => update({ baths })} layoutId={`${uid}-baths`} />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <p id={`${uid}-price`} className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Price
          </p>
          <p className="text-sm font-medium tabular-nums text-foreground">{priceLabel}</p>
        </div>
        <div role="group" aria-labelledby={`${uid}-price`} className="px-2.5">
          <RangeSlider
            id={uid}
            min={priceMin}
            max={priceMax}
            step={priceStep}
            value={value.price}
            onChange={(price) => update({ price })}
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setValue(empty);
            onChangeRef.current?.(empty);
          }}
          disabled={activeCount === 0}
          className="rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          Clear all{activeCount > 0 && <span className="tabular-nums"> ({activeCount})</span>}
        </button>
        {count !== undefined && (
          <p className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-brand-foreground" aria-live="polite">
            <span className="relative inline-flex overflow-hidden tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={reduce ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {count.toLocaleString("en-US")}
                </motion.span>
              </AnimatePresence>
            </span>
            &nbsp;{count === 1 ? "home" : "homes"}
          </p>
        )}
      </div>
    </div>
  );
}

export default ListingFilters;
