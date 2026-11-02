"use client";

import * as React from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Calendar, Check, CircleCheck, Phone, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  title: string;
  description: string;
  /** Small meta label, e.g. "Takes 2 minutes". */
  meta?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ProcessStepsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: ProcessStep[];
  cta?: { label: string; href: string };
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const DEFAULT_STEPS: ProcessStep[] = [
  {
    title: "Tell us what's going on",
    description: "Call, text or book online. Share a few photos and we'll confirm the issue before anyone rolls a truck.",
    meta: "Takes 2 minutes",
    icon: Phone,
  },
  {
    title: "Get a flat-rate quote",
    description: "You'll see the full price upfront, in writing. No overtime fees, no surprises on the invoice.",
    meta: "Same day",
    icon: Calendar,
  },
  {
    title: "We do the work right",
    description: "A licensed, background-checked tech arrives in a stocked van and treats your home like their own.",
    meta: "Most jobs in one visit",
    icon: Wrench,
  },
  {
    title: "Backed for five years",
    description: "Every repair is covered by our 5-year workmanship warranty. If it's not right, we come back free.",
    meta: "In writing",
    icon: CircleCheck,
  },
];

export function ProcessSteps({
  eyebrow = "How it works",
  title = "From first call to fixed, in four simple steps",
  description = "We've refined this process over 9,000 jobs in Denver. It's built around one idea: you should never have to chase us.",
  steps = DEFAULT_STEPS,
  cta = { label: "Start with step one", href: "#quote" },
  className,
}: ProcessStepsProps) {
  const reduce = useReducedMotion();
  const listRef = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const [progressIndex, setProgressIndex] = React.useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = steps.length;
    // Marker i sits at fraction i / (n - 1) of the line; activate slightly before the line reaches it.
    const idx = v < 0.01 ? -1 : Math.min(n - 1, Math.floor(v * Math.max(n - 1, 1) + 0.25));
    setProgressIndex(idx);
  });
  const active = reduce ? steps.length - 1 : progressIndex;

  return (
    <section className={cn("relative bg-background py-20 text-foreground sm:py-28", className)}>
      <div className="mx-auto grid max-w-[1120px] gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance sm:text-[48px]">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.5] text-muted-foreground text-pretty">
            {description}
          </p>

          {/* Mini progress indicator */}
          <div className="mt-8 hidden items-center gap-2 lg:flex" aria-hidden>
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i <= active ? "w-10 bg-foreground" : "w-5 bg-foreground/[0.12]",
                )}
              />
            ))}
            <span className="ml-2 text-xs tabular-nums text-muted-foreground">
              {Math.max(active + 1, 0)} of {steps.length}
            </span>
          </div>

          {cta && (
            <a
              href={cta.href}
              className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>

        {/* Steps */}
        <ol ref={listRef} className="relative">
          {/* Track */}
          <span aria-hidden className="absolute bottom-8 left-[21px] top-8 w-px bg-foreground/[0.1] sm:left-[23px]" />
          {/* Progress line */}
          <motion.span
            aria-hidden
            className="absolute bottom-8 left-[21px] top-8 w-px origin-top bg-foreground sm:left-[23px]"
            style={{ scaleY: reduce ? 1 : scaleY }}
          />

          {steps.map((step, i) => {
            const isActive = i <= active;
            const Icon = step.icon ?? Check;
            return (
              <li key={step.title} className="relative flex gap-5 pb-4 last:pb-0 sm:gap-6">
                {/* Marker */}
                <div className="relative z-10 shrink-0 pt-6">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full transition-colors duration-500 sm:size-12",
                      isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>

                {/* Card */}
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="relative flex-1 rounded-[24px] bg-muted p-6 sm:p-7"
                >
                  <p className="text-[13px] text-muted-foreground">
                    Step {i + 1}
                    {step.meta && <span>, {step.meta.toLowerCase()}</span>}
                  </p>
                  <h3
                    className={cn(
                      "mt-2 font-display text-[20px] font-semibold tracking-[-0.02em] transition-colors duration-500 sm:text-[22px]",
                      !isActive && "text-foreground/60",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-[1.5] text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default ProcessSteps;
