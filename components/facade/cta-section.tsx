"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CtaSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Short reassurance points shown below the buttons. */
  reassurance?: string[];
  /** "inverted" is a dark panel on light pages (light on dark pages). "muted" is a soft grey tile. */
  tone?: "inverted" | "muted";
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CtaSection({
  eyebrow = "Booking now for this week",
  title = "Your neighbors already switched. Your turn.",
  description = "Get a written, flat-rate quote in under 10 minutes. If we can't beat your last invoice, the first service call is on us.",
  primaryCta = { label: "Get my free quote", href: "#quote" },
  secondaryCta = { label: "(303) 555-0187", href: "tel:+13035550187" },
  reassurance = ["No obligation", "Licensed and insured in Colorado", "Same day slots open"],
  tone = "inverted",
  className,
}: CtaSectionProps) {
  const reduce = useReducedMotion();
  const inverted = tone === "inverted";

  return (
    <section className={cn("bg-background px-6 py-20 text-foreground sm:py-28", className)}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className={cn(
          "mx-auto max-w-[1120px] rounded-[28px] px-6 py-16 text-center sm:px-12 sm:py-24",
          inverted ? "bg-foreground text-background" : "bg-muted text-foreground",
        )}
      >
        <div className="mx-auto max-w-[720px]">
          {eyebrow && (
            <p className={cn("text-[13px] font-medium uppercase tracking-[0.08em]", inverted ? "text-background/60" : "text-muted-foreground")}>
              {eyebrow}
            </p>
          )}

          <h2 className="mt-5 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-[56px]">
            {title}
          </h2>

          <p
            className={cn(
              "mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-pretty sm:text-[19px]",
              inverted ? "text-background/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={primaryCta.href}
              className={cn(
                "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                inverted ? "focus-visible:ring-offset-foreground" : "focus-visible:ring-offset-muted",
              )}
            >
              {primaryCta.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href={secondaryCta.href}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                inverted
                  ? "bg-background/10 text-background hover:bg-background/15 focus-visible:ring-offset-foreground"
                  : "bg-background text-foreground hover:bg-background/70 focus-visible:ring-offset-muted",
              )}
            >
              <Phone className="size-4" aria-hidden />
              {secondaryCta.label}
            </a>
          </div>

          {reassurance.length > 0 && (
            <ul
              className={cn(
                "mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px]",
                inverted ? "text-background/60" : "text-muted-foreground",
              )}
            >
              {reassurance.map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <Check className="size-3.5" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default CtaSection;
