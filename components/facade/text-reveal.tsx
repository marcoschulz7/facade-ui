"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  /** The text to reveal, split on whitespace. */
  text: string;
  /** Element to render. Defaults to "h2". */
  as?: "h1" | "h2" | "h3" | "p";
  /** Delay in seconds before the first word. Defaults to 0. */
  delay?: number;
  /** Seconds between each word. Defaults to 0.06. */
  stagger?: number;
  /** Reveal only once. Defaults to true. */
  once?: boolean;
  className?: string;
  /** Class applied to every word span. */
  wordClassName?: string;
}

const word: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const wordReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export function TextReveal({
  text,
  as = "h2",
  delay = 0,
  stagger = 0.06,
  once = true,
  className,
  wordClassName,
}: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const Tag = as;

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement>} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
        className="inline"
      >
        {words.map((w, i) => (
          <React.Fragment key={`${w}-${i}`}>
            <motion.span
              variants={reduce ? wordReduced : word}
              className={cn("inline-block will-change-[transform,filter,opacity]", wordClassName)}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

export default TextReveal;
