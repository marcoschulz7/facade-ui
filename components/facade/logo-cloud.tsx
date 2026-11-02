"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogoCloudItem {
  name: string;
  /** Short line revealed on hover, e.g. an outcome. */
  detail?: string;
  href?: string;
  /** Optional custom mark. Defaults to a typographic wordmark. */
  logo?: React.ReactNode;
}

export interface LogoCloudProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  logos?: LogoCloudItem[];
  /** "grid" shows a hover-reveal grid, "marquee" scrolls logos in two rows. */
  variant?: "grid" | "marquee";
  /** Marquee loop duration in seconds. */
  speed?: number;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* A few quiet sans treatments so wordmarks read like real logos without serif or mono fonts. */
const WORDMARK_STYLES = [
  "font-semibold tracking-[-0.02em]",
  "text-[0.8em] font-medium uppercase tracking-[0.16em]",
  "font-bold tracking-[-0.04em] lowercase",
  "text-[0.82em] font-semibold uppercase tracking-[0.06em]",
  "font-semibold tracking-[-0.02em]",
  "text-[0.85em] font-medium tracking-[0.02em]",
  "font-bold tracking-[-0.04em] lowercase",
  "text-[0.8em] font-semibold uppercase tracking-[0.12em]",
];

const DEFAULT_LOGOS: LogoCloudItem[] = [
  { name: "Summit Roofing", detail: "+212% booked jobs" },
  { name: "Bayside Dental", detail: "4.9 stars, 860 reviews" },
  { name: "Keller Homes", detail: "$48M listings sold" },
  { name: "Lone Star HVAC", detail: "3x inbound calls" },
  { name: "Alder & Vine", detail: "Rebrand + new site" },
  { name: "Copperline", detail: "Top 3 in Maps" },
  { name: "brightpaws", detail: "11 locations live" },
  { name: "Harbor Realty", detail: "-38% cost per lead" },
];

function Wordmark({ item, index }: { item: LogoCloudItem; index: number }) {
  if (item.logo) return <>{item.logo}</>;
  return (
    <span
      className={cn(
        "whitespace-nowrap text-base md:text-lg lg:text-[22px]",
        WORDMARK_STYLES[index % WORDMARK_STYLES.length],
      )}
    >
      {item.name}
    </span>
  );
}

function GridCell({ item, index }: { item: LogoCloudItem; index: number }) {
  const reduce = useReducedMotion();
  const Tag = item.href ? "a" : "div";
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.7, delay: reduce ? 0 : index * 0.05, ease: EASE }}
      className="relative overflow-hidden rounded-[20px] bg-muted"
    >
      <Tag
        {...(item.href ? { href: item.href, "aria-label": item.detail ? `${item.name}, ${item.detail}` : item.name } : {})}
        className="group relative flex h-28 items-center justify-center overflow-hidden px-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:h-32 sm:px-4"
      >
        <span className="text-foreground/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:text-foreground group-focus-visible:-translate-y-3 group-focus-visible:text-foreground">
          <Wordmark item={item} index={index} />
        </span>
        {item.detail && (
          <span className="absolute inset-x-0 bottom-4 flex translate-y-3 items-center justify-center gap-1 text-[13px] font-medium text-muted-foreground opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:bottom-5">
            {item.detail}
            {item.href && <ArrowUpRight className="size-3" aria-hidden />}
          </span>
        )}
      </Tag>
    </motion.li>
  );
}

function MarqueeRow({
  logos,
  reverse,
  speed,
  offset,
}: {
  logos: LogoCloudItem[];
  reverse?: boolean;
  speed: number;
  offset: number;
}) {
  return (
    <div
      // Decorative: the full client list is rendered once for screen readers below the rows.
      aria-hidden
      className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      style={{
        ["--marquee-gap" as string]: "1rem",
        ["--marquee-duration" as string]: `${speed}s`,
      }}
    >
      <ul
        className={cn(
          "flex w-max shrink-0 animate-marquee items-center gap-[var(--marquee-gap)] py-1 group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[...logos, ...logos].map((item, i) => (
          <li
            key={i}
            className="flex h-14 items-center justify-center rounded-full bg-muted px-7 text-foreground/45 transition-colors hover:text-foreground"
          >
            <Wordmark item={item} index={(i % logos.length) + offset} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoCloud({
  eyebrow = "Trusted locally",
  title = "The go-to partner for 140+ businesses across Texas",
  description = "From single-location shops to regional brokerages, owners stay with us for the results.",
  logos = DEFAULT_LOGOS,
  variant = "grid",
  speed = 40,
  className,
}: LogoCloudProps) {
  const half = Math.ceil(logos.length / 2);
  return (
    <section className={cn("bg-background py-20 text-foreground sm:py-28", className)}>
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mx-auto max-w-[640px] text-center">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-4 text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-5 text-pretty text-[17px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {variant === "grid" ? (
          <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {logos.map((item, i) => (
              <GridCell key={item.name} item={item} index={i} />
            ))}
          </ul>
        ) : (
          <div className="mt-14 flex flex-col gap-3">
            <MarqueeRow logos={logos.slice(0, half)} speed={speed} offset={0} />
            <MarqueeRow logos={logos.slice(half)} speed={speed * 1.15} offset={half} reverse />
            <ul className="sr-only">
              {logos.map((l) => (
                <li key={l.name}>{l.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default LogoCloud;
