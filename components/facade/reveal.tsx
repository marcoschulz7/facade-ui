"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { cn } from "@/lib/utils";

export type RevealPreset = "fade" | "rise" | "blur" | "scale";

const presets: Record<RevealPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

const reduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ease = [0.16, 1, 0.3, 1] as const;

interface RevealContextValue {
  preset: RevealPreset;
  duration: number;
}

const RevealGroupContext = React.createContext<RevealContextValue | null>(null);

export interface RevealProps {
  children?: React.ReactNode;
  /** Animation preset. Inherits from a parent RevealGroup, otherwise "rise". */
  preset?: RevealPreset;
  /** Delay in seconds (standalone use only). Defaults to 0. */
  delay?: number;
  /** Duration in seconds. Defaults to 0.7. */
  duration?: number;
  /** Animate only the first time it enters view. Defaults to true. */
  once?: boolean;
  /** Fraction of the element that must be visible. Defaults to 0.25. */
  amount?: number;
  className?: string;
}

/**
 * Animates its children into view. Inside a RevealGroup it becomes a
 * staggered child and follows the group's timing.
 */
export function Reveal({
  children,
  preset,
  delay = 0,
  duration,
  once = true,
  amount = 0.25,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const group = React.useContext(RevealGroupContext);
  const p = preset ?? group?.preset ?? "rise";
  const d = duration ?? group?.duration ?? 0.7;
  const variants = reduce ? reduced : presets[p];

  if (group) {
    return (
      <motion.div variants={variants} transition={{ duration: d, ease }} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration: d, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface RevealGroupProps {
  children?: React.ReactNode;
  /** Preset for every Reveal inside. Defaults to "rise". */
  preset?: RevealPreset;
  /** Seconds between each child. Defaults to 0.08. */
  stagger?: number;
  /** Delay before the first child. Defaults to 0. */
  delay?: number;
  /** Duration for each child. Defaults to 0.7. */
  duration?: number;
  once?: boolean;
  amount?: number;
  /**
   * Wrap every direct child in a Reveal automatically. Defaults to true.
   * Set false when you place Reveal elements yourself (for nested layouts).
   */
  wrapChildren?: boolean;
  /** Class applied to the auto-created child wrappers. */
  itemClassName?: string;
  className?: string;
}

export function RevealGroup({
  children,
  preset = "rise",
  stagger = 0.08,
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
  wrapChildren = true,
  itemClassName,
  className,
}: RevealGroupProps) {
  const reduce = useReducedMotion();
  const ctx = React.useMemo(() => ({ preset, duration }), [preset, duration]);

  return (
    <RevealGroupContext.Provider value={ctx}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
        }}
        className={cn(className)}
      >
        {wrapChildren
          ? React.Children.map(children, (child) =>
              child === null || child === undefined || typeof child === "boolean" ? null : (
                <Reveal className={itemClassName}>{child}</Reveal>
              ),
            )
          : children}
      </motion.div>
    </RevealGroupContext.Provider>
  );
}

export default Reveal;
