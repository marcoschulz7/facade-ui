"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GradientHeadingProps {
  /** Heading copy. */
  children?: string;
  /** Element to render. Defaults to "h1". */
  as?: "h1" | "h2" | "h3";
  /**
   * Words (or phrases) that get the brand gradient. When omitted a soft
   * brand pass moves slowly through the otherwise monochrome heading.
   */
  highlight?: string[];
  /** Seconds for one full sweep. Defaults to 9. */
  duration?: number;
  className?: string;
  /** Class applied to highlighted segments. */
  highlightClassName?: string;
}

/** Highlighted words: ultramarine with a slightly deeper band drifting through. */
const accent =
  "linear-gradient(100deg, var(--brand) 0%, color-mix(in oklch, var(--brand) 72%, var(--foreground)) 50%, var(--brand) 100%)";

/** Whole heading: monochrome with one soft ultramarine pass. */
const monochromeToAccent =
  "linear-gradient(100deg, var(--foreground) 0%, var(--foreground) 38%, var(--brand) 62%, var(--foreground) 100%)";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Sweep({
  gradient,
  duration,
  reduce,
  className,
  children,
}: {
  gradient: string;
  duration: number;
  reduce: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      className={cn("bg-clip-text text-transparent [-webkit-background-clip:text] [box-decoration-break:clone]", className)}
      style={{ backgroundImage: gradient, backgroundSize: "200% 100%", backgroundPosition: "0% 50%" }}
      animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%"] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
    >
      {children}
    </motion.span>
  );
}

export function GradientHeading({
  children = "Websites that make the phone ring.",
  as = "h1",
  highlight,
  duration = 9,
  className,
  highlightClassName,
}: GradientHeadingProps) {
  const reduce = useReducedMotion() ?? false;
  const Tag = as;

  const parts = React.useMemo(() => {
    if (!highlight || highlight.length === 0) return null;
    const re = new RegExp(`(${highlight.map(escapeRegExp).join("|")})`, "g");
    return children.split(re).filter((p) => p.length > 0);
  }, [children, highlight]);

  return (
    <Tag
      className={cn(
        "font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-foreground sm:text-[56px] md:text-[64px]",
        className,
      )}
    >
      {parts ? (
        parts.map((part, i) =>
          highlight?.includes(part) ? (
            <Sweep key={i} gradient={accent} duration={duration} reduce={reduce} className={highlightClassName}>
              {part}
            </Sweep>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )
      ) : (
        <Sweep gradient={monochromeToAccent} duration={duration} reduce={reduce}>
          {children}
        </Sweep>
      )}
    </Tag>
  );
}

export default GradientHeading;
