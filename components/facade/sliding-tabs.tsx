"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SlidingTab {
  /** Unique value for the tab. */
  value: string;
  /** Label shown in the tab list. */
  label: React.ReactNode;
  /** Optional icon shown before the label. */
  icon?: React.ReactNode;
  /** Panel content. */
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface SlidingTabsProps {
  tabs: SlidingTab[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. Defaults to the first tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible label for the tab list. */
  label?: string;
  /** Stretch tabs to fill the width. */
  fullWidth?: boolean;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}

export function SlidingTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  label = "Tabs",
  fullWidth = false,
  className,
  listClassName,
  panelClassName,
}: SlidingTabsProps) {
  const reduce = useReducedMotion();
  const id = React.useId();
  const [internal, setInternal] = React.useState(defaultValue ?? tabs[0]?.value ?? "");
  const active = value ?? internal;
  const refs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const select = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.value === active);
    let next: SlidingTab | undefined;
    if (e.key === "ArrowRight") next = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    refs.current.get(next.value)?.focus();
  };

  const current = tabs.find((t) => t.value === active);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-full bg-muted p-1",
          fullWidth && "flex w-full",
          listClassName,
        )}
      >
        {tabs.map((t) => {
          const selected = t.value === active;
          return (
            <button
              key={t.value}
              ref={(el) => {
                if (el) refs.current.set(t.value, el);
                else refs.current.delete(t.value);
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${t.value}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${t.value}`}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              onClick={() => select(t.value)}
              className={cn(
                "relative inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted",
                "disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
                fullWidth && "flex-1",
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${id}-pill`}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-background shadow-sm shadow-foreground/[0.08] dark:bg-foreground/[0.12] dark:shadow-none"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className={cn("relative mt-4", panelClassName)}>
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.value}
              role="tabpanel"
              id={`${id}-panel-${current.value}`}
              aria-labelledby={`${id}-tab-${current.value}`}
              tabIndex={0}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {current.content}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SlidingTabs;
