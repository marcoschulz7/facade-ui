"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  /** Unique id. */
  value: string;
  /** Question or header text. */
  title: React.ReactNode;
  /** Answer or body content. */
  content: React.ReactNode;
}

export interface SmoothAccordionProps {
  /** Accordion entries. Defaults to a short FAQ example. */
  items?: AccordionItem[];
  /** "single" keeps one item open at a time. Defaults to "single". */
  type?: "single" | "multiple";
  /** Items open on first render. */
  defaultValue?: string[];
  /** Controlled open items. */
  value?: string[];
  onValueChange?: (value: string[]) => void;
  /** Heading level used for each header. Defaults to 3. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  itemClassName?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function PlusMinus({ open, reduce }: { open: boolean; reduce: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        open ? "bg-muted text-foreground" : "bg-background text-muted-foreground group-hover/item:text-foreground",
      )}
    >
      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
      <motion.span
        className="absolute h-3.5 w-[1.5px] rounded-full bg-current"
        initial={false}
        animate={{ rotate: open ? 90 : 0, scaleY: open ? 0 : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
      />
    </span>
  );
}

const DEFAULT_ITEMS: AccordionItem[] = [
  {
    value: "estimate",
    title: "How fast can I get an estimate?",
    content: "Most estimates go out the same day. Send a few photos and your ZIP code and we will reply with a written, flat-rate quote.",
  },
  {
    value: "insured",
    title: "Are you licensed and insured?",
    content: "Yes. We are fully licensed, bonded and insured, and we are happy to share certificates before any work starts.",
  },
  {
    value: "warranty",
    title: "What does the warranty cover?",
    content: "Labor is covered for two years and materials carry the manufacturer warranty. If something is not right, we come back and fix it.",
  },
];

export function SmoothAccordion({
  items = DEFAULT_ITEMS,
  type = "single",
  defaultValue = [],
  value,
  onValueChange,
  headingLevel = 3,
  className,
  itemClassName,
}: SmoothAccordionProps) {
  const reduce = useReducedMotion() ?? false;
  const id = React.useId();
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const open = value ?? internal;
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  const toggle = (v: string) => {
    const isOpen = open.includes(v);
    const next = type === "single" ? (isOpen ? [] : [v]) : isOpen ? open.filter((x) => x !== v) : [...open, v];
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn("flex flex-col gap-1 rounded-[28px] bg-muted p-2 text-foreground", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        const triggerId = `${id}-trigger-${item.value}`;
        const panelId = `${id}-panel-${item.value}`;
        return (
          <div
            key={item.value}
            className={cn(
              "group/item rounded-[20px] transition-colors duration-300",
              isOpen ? "bg-background" : "bg-transparent",
              itemClassName,
            )}
          >
            <Heading className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => toggle(item.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-6 rounded-[20px] px-5 py-4 text-left text-[16px] font-medium tracking-[-0.01em] transition-colors sm:px-6 sm:py-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  isOpen ? "text-foreground" : "text-foreground/85 hover:text-foreground",
                )}
              >
                <span>{item.title}</span>
                <PlusMinus open={isOpen} reduce={reduce} />
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { height: { duration: 0.5, ease: EASE }, opacity: { duration: 0.3, ease: EASE } }
                  }
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pr-16 text-[15px] leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:pr-20">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default SmoothAccordion;
