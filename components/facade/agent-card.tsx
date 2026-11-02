"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Calendar, Mail, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AgentCardProps {
  name?: string;
  title?: string;
  brokerage?: string;
  license?: string;
  /** Optional headshot URL. Falls back to an initials avatar. */
  photoSrc?: string;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  phone?: string;
  email?: string;
  /** Link or handler for the schedule tour action. */
  scheduleHref?: string;
  onSchedule?: () => void;
  /** Optional stats shown under the header, e.g. homes sold. */
  stats?: Array<{ label: string; value: string }>;
  /** Show the online status dot on the avatar. */
  available?: boolean;
  className?: string;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Rating({ value, count }: { value: number; count?: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ""}`}>
      <div className="flex gap-px" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rounded - i));
          return (
            <span key={i} className="relative size-3.5">
              <Star className="absolute inset-0 size-3.5 text-foreground/15" fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-3.5 text-star" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-sm font-medium tabular-nums text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  );
}

export function AgentCard({
  name = "Danielle Ortiz",
  title = "Realtor",
  brokerage = "Summit Peak Realty",
  license = "CO FA.100082417",
  photoSrc,
  rating = 4.9,
  reviewCount = 128,
  languages = ["English", "Spanish"],
  phone = "(303) 555-0148",
  email = "danielle@summitpeakrealty.com",
  scheduleHref = "#schedule",
  onSchedule,
  stats,
  available = true,
  className,
}: AgentCardProps) {
  const reduce = useReducedMotion();
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  const btnBase =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted";
  const btnSecondary = cn(btnBase, "bg-background text-foreground hover:bg-background/70 dark:bg-secondary dark:hover:bg-secondary/70");
  const btnPrimary = cn(btnBase, "col-span-2 bg-brand text-brand-foreground hover:bg-[color-mix(in_srgb,var(--brand)_88%,black)]");

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 36 }}
      className={cn("w-full max-w-sm rounded-[28px] bg-muted p-6 text-foreground", className)}
    >
      <header className="flex items-start gap-4">
        <div className="relative shrink-0">
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoSrc} alt={name} className="size-16 rounded-full object-cover" />
          ) : (
            <div
              className="grid size-16 place-items-center rounded-full bg-foreground font-display text-lg font-semibold tracking-[-0.02em] text-background"
              aria-hidden="true"
            >
              {initialsOf(name)}
            </div>
          )}
          {available && (
            <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-muted bg-success" aria-label="Available now" role="img" />
          )}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate font-display text-[17px] font-semibold leading-tight tracking-[-0.02em]">{name}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {title}, {brokerage}
          </p>
          <div className="mt-2">
            <Rating value={rating} count={reviewCount} />
          </div>
        </div>
      </header>

      {stats && stats.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-2">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-background px-2 py-3 text-center dark:bg-secondary">
              <dt className="mt-0.5 text-[12px] text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-lg font-semibold tracking-[-0.02em] tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] text-muted-foreground">
        <span>{languages.join(", ")}</span>
        <span className="ml-auto tabular-nums">Lic. {license}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a href={tel} className={btnSecondary}>
          <Phone className="size-4" aria-hidden="true" />
          Call
        </a>
        <a href={`mailto:${email}`} className={btnSecondary}>
          <Mail className="size-4" aria-hidden="true" />
          Email
        </a>
        {onSchedule ? (
          <button type="button" onClick={onSchedule} className={btnPrimary}>
            <Calendar className="size-4" aria-hidden="true" />
            Schedule a tour
          </button>
        ) : (
          <a href={scheduleHref} className={btnPrimary}>
            <Calendar className="size-4" aria-hidden="true" />
            Schedule a tour
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default AgentCard;
