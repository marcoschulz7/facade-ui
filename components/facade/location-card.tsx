"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationCardProps {
  name?: string;
  /** Single line street address, used for display and the directions link. */
  address?: string;
  phone?: string;
  /** Short hours line, e.g. "Mon to Fri 8 AM to 6 PM". */
  hours?: string;
  /** Small label above the name, e.g. "Downtown". */
  label?: string;
  /** Extra note under the address, e.g. parking info. */
  note?: string;
  /** Map layout seed so multiple cards look different. */
  variant?: 0 | 1 | 2;
  className?: string;
}

export function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const LAYOUTS = [
  {
    pin: { x: 58, y: 52 },
    park: { x: 12, y: 14, w: 24, h: 20 },
    water: "M -5 78 C 20 70, 38 92, 62 84 S 96 74, 110 82 L 110 110 L -5 110 Z",
    diag: "M -5 40 L 110 4",
  },
  {
    pin: { x: 44, y: 46 },
    park: { x: 64, y: 62, w: 26, h: 18 },
    water: "M 78 -5 C 70 18, 92 30, 84 52 S 96 80, 110 92 L 110 -5 Z",
    diag: "M -5 88 L 104 -5",
  },
  {
    pin: { x: 52, y: 40 },
    park: { x: 8, y: 64, w: 22, h: 26 },
    water: "M -5 -5 L 46 -5 C 40 6, 22 10, 18 22 S -2 32, -5 30 Z",
    diag: "M 20 110 L 110 30",
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function MapArt({ variant, reduce }: { variant: 0 | 1 | 2; reduce: boolean | null }) {
  const l = LAYOUTS[variant];
  const p = l.park;
  const minor = [8, 24, 31, 46, 54, 70, 86, 93];
  const major = [16, 39, 62, 78];
  const trees = [
    [0.25, 0.3, 1.7],
    [0.6, 0.45, 2.2],
    [0.35, 0.72, 1.5],
    [0.78, 0.75, 1.8],
  ] as const;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full text-foreground"
        aria-hidden
      >
        {/* Blocks tint */}
        <rect width="100" height="100" fill="currentColor" opacity="0.03" />
        {/* Park */}
        <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="1.5" className="fill-success/15" />
        <g className="fill-success/25">
          {trees.map(([tx, ty, r], i) => (
            <circle key={i} cx={p.x + p.w * tx} cy={p.y + p.h * ty} r={r} />
          ))}
        </g>
        {/* Water */}
        <path d={l.water} fill="currentColor" opacity="0.06" />
        {/* Minor streets */}
        <g stroke="var(--background)" strokeOpacity="0.7" strokeWidth="0.6">
          {minor.map((v) => (
            <React.Fragment key={v}>
              <line x1={v} y1="-5" x2={v} y2="105" />
              <line x1="-5" y1={v} x2="105" y2={v} />
            </React.Fragment>
          ))}
        </g>
        {/* Major streets */}
        <g stroke="var(--background)" strokeWidth="2.2" strokeLinecap="round">
          {major.map((v) => (
            <React.Fragment key={v}>
              <line x1={v} y1="-5" x2={v} y2="105" />
              <line x1="-5" y1={v} x2="105" y2={v} />
            </React.Fragment>
          ))}
          <path d={l.diag} fill="none" strokeWidth="3.2" />
        </g>
        {/* Route to pin */}
        <motion.path
          d={`M ${l.pin.x - 30} 105 L ${l.pin.x - 30} ${l.pin.y + 14} L ${l.pin.x} ${l.pin.y + 14} L ${l.pin.x} ${l.pin.y + 1}`}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1"
          strokeDasharray="2 1.6"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        />
      </svg>

      {/* Pin */}
      <div className="absolute" style={{ left: `${l.pin.x}%`, top: `${l.pin.y}%` }}>
        <span className="absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40" aria-hidden />
        <motion.span
          initial={reduce ? false : { y: -12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="absolute bottom-1 left-0 block -translate-x-1/2"
        >
          <span className="grid size-9 rotate-45 place-items-center rounded-full rounded-br-none bg-brand text-brand-foreground shadow-float ring-[3px] ring-background">
            <MapPin className="size-4 -rotate-45" aria-hidden />
          </span>
        </motion.span>
      </div>
    </div>
  );
}

export function LocationCard({
  name = "Riverside Family Dental",
  address = "2150 S Broadway, Denver, CO 80210",
  phone = "(303) 555-0119",
  hours = "Mon to Fri, 8 AM to 6 PM",
  label,
  note,
  variant = 0,
  className,
}: LocationCardProps) {
  const reduce = useReducedMotion();
  return (
    <article className={cn("w-full overflow-hidden rounded-[28px] bg-muted text-foreground", className)}>
      <a
        href={directionsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${name} in Google Maps`}
        className="group relative block aspect-[16/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <MapArt variant={variant} reduce={reduce} />
        <span className="absolute bottom-3 right-3 inline-flex h-7 items-center gap-1 rounded-full bg-background px-3 text-[12px] font-medium text-foreground shadow-float transition-transform duration-300 group-hover:-translate-y-0.5">
          Open map <ArrowUpRight className="size-3" aria-hidden />
        </span>
      </a>
      <div className="p-6">
        {label && <p className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p>}
        <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em]">{name}</h3>
        <address className="mt-1 text-[15px] not-italic leading-relaxed text-muted-foreground">{address}</address>
        {note && <p className="mt-1 text-[13px] text-muted-foreground">{note}</p>}

        <dl className="mt-4 space-y-2 text-[15px]">
          {hours && (
            <div className="flex items-center gap-2.5">
              <dt className="sr-only">Hours</dt>
              <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <dd>{hours}</dd>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2.5">
              <dt className="sr-only">Phone</dt>
              <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <dd>
                <a
                  href={telHref(phone)}
                  className="rounded tabular-nums underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {phone}
                </a>
              </dd>
            </div>
          )}
        </dl>

        <a
          href={directionsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
        >
          Get directions
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}

export default LocationCard;
