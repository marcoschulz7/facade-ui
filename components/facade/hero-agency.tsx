"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroAgencyProps {
  eyebrow?: string;
  /** Headline lines. Wrap a word in *asterisks* to render it in the secondary color. */
  headline?: string[];
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  availability?: string;
  clientsLabel?: string;
  clients?: string[];
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* Two quiet wordmark treatments so the row reads like real logos without any serif or mono fonts. */
const WORDMARK_STYLES = [
  "font-semibold tracking-[-0.02em]",
  "text-[0.8em] font-medium uppercase tracking-[0.16em]",
  "font-semibold tracking-[-0.04em] lowercase",
  "text-[0.82em] font-semibold uppercase tracking-[0.06em]",
];

function renderLine(line: string) {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith("*") && p.endsWith("*") ? (
      <span key={i} className="text-muted-foreground">
        {p.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

export function HeroAgency({
  eyebrow = "Northline Studio, Denver",
  headline = ["We build brands", "people *remember*."],
  description = "Strategy, identity and conversion first websites for ambitious local businesses and real estate teams. Senior people only. Live in six weeks, not six months.",
  primaryCta = { label: "Book a call", href: "#book" },
  secondaryCta = { label: "See our work", href: "#work" },
  availability = "Two project openings for Q1",
  clientsLabel = "Trusted by",
  clients = [
    "Summit Roofing",
    "Mile High Dental",
    "Alder & Vine",
    "Compass Ridge",
    "Peak Realty",
    "Ironwood",
    "Redline Auto",
    "Larimer Coffee",
  ],
  className,
}: HeroAgencyProps) {
  const reduce = useReducedMotion();

  return (
    <section className={cn("relative isolate overflow-hidden bg-background text-foreground", className)}>
      <div className="mx-auto flex max-w-[1120px] flex-col items-center px-6 pb-16 pt-20 text-center sm:pb-20 sm:pt-28 lg:pt-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
        >
          {eyebrow}
        </motion.p>

        <h1 className="mt-6 max-w-[14ch] text-balance text-[44px] font-semibold leading-[1] tracking-[-0.045em] sm:text-[72px] lg:text-[96px]">
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={reduce ? { opacity: 0 } : { y: "100%" }}
                animate={reduce ? { opacity: 1 } : { y: "0%" }}
                transition={{ duration: 0.9, delay: 0.05 + i * 0.1, ease: EASE }}
              >
                {renderLine(line)}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="mt-6 max-w-[640px] text-pretty text-[17px] leading-[1.5] text-muted-foreground sm:text-[21px] sm:leading-[1.4]"
        >
          {description}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={primaryCta.href}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryCta.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href={secondaryCta.href}
              className="inline-flex h-12 items-center rounded-full bg-muted px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-foreground/[0.12]"
            >
              {secondaryCta.label}
            </a>
          </div>
          {availability && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex size-1.5 rounded-full bg-success" aria-hidden />
              {availability}
            </span>
          )}
        </motion.div>
      </div>

      {/* Client marquee */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 pb-20 sm:pb-24 md:flex-row md:items-center md:gap-10"
      >
        <p className="shrink-0 text-center text-[13px] font-medium text-muted-foreground md:text-left">{clientsLabel}</p>
        <div
          className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          style={{ ["--marquee-gap" as string]: "3.5rem", ["--marquee-duration" as string]: "44s" }}
        >
          <ul className="flex w-max shrink-0 animate-marquee items-center gap-[var(--marquee-gap)] group-hover:[animation-play-state:paused]">
            {[...clients, ...clients].map((c, i) => (
              <li
                key={i}
                aria-hidden={i >= clients.length}
                className={cn(
                  "whitespace-nowrap text-xl text-foreground/40 transition-colors hover:text-foreground",
                  WORDMARK_STYLES[i % clients.length % WORDMARK_STYLES.length],
                )}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroAgency;
