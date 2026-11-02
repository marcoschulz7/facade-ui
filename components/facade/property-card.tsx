"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bath, BedDouble, Heart, MapPin, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

export type PropertyStatus = "for-sale" | "pending" | "new";

export interface PropertyCardProps {
  /** Optional photo URL. When omitted, an illustrated architectural placeholder renders. */
  src?: string;
  alt?: string;
  status?: PropertyStatus;
  price?: number;
  /** Optional suffix such as "/mo" for rentals. */
  priceSuffix?: string;
  address?: string;
  city?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  /** Placeholder composition when no src is set. */
  placeholder?: "modern" | "bungalow" | "tower";
  href?: string;
  defaultFavorite?: boolean;
  onFavoriteChange?: (favorite: boolean) => void;
  className?: string;
}

const statusCopy: Record<PropertyStatus, { label: string; className: string }> = {
  "for-sale": { label: "For sale", className: "bg-background/90 text-foreground" },
  pending: { label: "Pending", className: "bg-background/90 text-muted-foreground" },
  new: { label: "New", className: "bg-brand text-brand-foreground" },
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/** Quiet monochrome architecture placeholder. Walls take the page background, everything else is tinted foreground. */
function PropertyPlaceholder({ variant }: { variant: "modern" | "bungalow" | "tower" }) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full text-foreground"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="var(--background)" />
      <rect width="400" height="260" fill={`url(#sky-${id})`} />
      {/* distant hills */}
      <path d="M0 190 Q 80 160 160 182 T 320 172 T 400 180 V260 H0Z" fill="currentColor" opacity="0.05" />
      {variant === "modern" && (
        <g>
          <rect x="88" y="118" width="150" height="86" fill="var(--background)" />
          <rect x="196" y="92" width="122" height="112" fill="var(--background)" />
          <rect x="188" y="86" width="138" height="8" fill="currentColor" opacity="0.7" />
          <rect x="80" y="112" width="166" height="7" fill="currentColor" opacity="0.6" />
          <rect x="208" y="106" width="98" height="64" fill="currentColor" opacity="0.22" />
          <path d="M257 106 V170 M208 138 H306" stroke="var(--background)" strokeWidth="2.5" />
          <rect x="102" y="134" width="56" height="40" fill="currentColor" opacity="0.22" />
          <rect x="172" y="146" width="18" height="58" fill="currentColor" opacity="0.65" />
          <rect x="96" y="186" width="70" height="18" fill="currentColor" opacity="0.08" />
        </g>
      )}
      {variant === "bungalow" && (
        <g>
          <path d="M92 132 L200 76 L308 132 Z" fill="currentColor" opacity="0.68" />
          <rect x="108" y="130" width="184" height="74" fill="var(--background)" />
          <rect x="124" y="146" width="44" height="34" fill="currentColor" opacity="0.22" />
          <rect x="232" y="146" width="44" height="34" fill="currentColor" opacity="0.22" />
          <rect x="186" y="150" width="28" height="54" fill="currentColor" opacity="0.65" />
          <path d="M146 146 V180 M254 146 V180" stroke="var(--background)" strokeWidth="2" />
          <rect x="100" y="196" width="200" height="8" fill="currentColor" opacity="0.12" />
          <circle cx="66" cy="178" r="22" fill="currentColor" opacity="0.1" />
          <circle cx="336" cy="174" r="26" fill="currentColor" opacity="0.08" />
        </g>
      )}
      {variant === "tower" && (
        <g>
          <rect x="150" y="40" width="100" height="164" fill="var(--background)" />
          {Array.from({ length: 7 }).map((_, row) => (
            <g key={row}>
              <rect x="160" y={52 + row * 20} width="38" height="12" fill="currentColor" opacity="0.22" />
              <rect x="202" y={52 + row * 20} width="38" height="12" fill="currentColor" opacity="0.22" />
              <rect x="150" y={66 + row * 20} width="100" height="2" fill="currentColor" opacity="0.35" />
            </g>
          ))}
          <rect x="70" y="120" width="70" height="84" fill="currentColor" opacity="0.1" />
          <rect x="262" y="100" width="72" height="104" fill="currentColor" opacity="0.08" />
        </g>
      )}
      <rect x="0" y="204" width="400" height="56" fill="currentColor" opacity="0.07" />
    </svg>
  );
}

export function PropertyCard({
  src,
  alt = "Property photo",
  status = "for-sale",
  price = 685000,
  priceSuffix,
  address = "2418 Travis Heights Blvd",
  city = "Austin, TX 78704",
  beds = 3,
  baths = 2.5,
  sqft = 2140,
  placeholder = "modern",
  href,
  defaultFavorite = false,
  onFavoriteChange,
  className,
}: PropertyCardProps) {
  const reduce = useReducedMotion();
  const [favorite, setFavorite] = React.useState(defaultFavorite);
  const s = statusCopy[status];

  const toggle = () => {
    const next = !favorite;
    setFavorite(next);
    onFavoriteChange?.(next);
  };

  const Title = href ? "a" : "span";

  return (
    <motion.article
      className={cn("group relative flex w-full flex-col overflow-hidden rounded-[28px] bg-muted text-foreground", className)}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <PropertyPlaceholder variant={placeholder} />
          )}
        </div>

        <span
          className={cn(
            "absolute left-4 top-4 inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium backdrop-blur",
            s.className,
          )}
        >
          {s.label}
        </span>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from saved homes" : "Save home"}
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <motion.span
            key={favorite ? "on" : "off"}
            initial={reduce ? false : { scale: favorite ? 0.6 : 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative grid place-items-center"
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "size-4 transition-colors",
                favorite ? "fill-destructive text-destructive" : "text-foreground",
              )}
            />
          </motion.span>
          <AnimatePresence>
            {favorite && !reduce && (
              <motion.span
                key="burst"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-destructive/50"
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-[24px] font-semibold tracking-[-0.02em] tabular-nums">
            {usd.format(price)}
          </span>
          {priceSuffix && <span className="text-[14px] text-muted-foreground">{priceSuffix}</span>}
        </div>
        <div className="mt-2 min-w-0">
          <Title
            {...(href ? { href } : {})}
            className={cn(
              "block truncate text-[15px] font-medium",
              href &&
                "rounded-sm after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {address}
          </Title>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[14px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {city}
          </p>
        </div>
        <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BedDouble className="size-4" aria-hidden="true" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>
              <span className="font-medium tabular-nums text-foreground">{beds}</span> bd
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="size-4" aria-hidden="true" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>
              <span className="font-medium tabular-nums text-foreground">{baths}</span> ba
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="size-4" aria-hidden="true" />
            <dt className="sr-only">Square feet</dt>
            <dd>
              <span className="font-medium tabular-nums text-foreground">{sqft.toLocaleString("en-US")}</span> sqft
            </dd>
          </div>
        </dl>
      </div>
    </motion.article>
  );
}

export default PropertyCard;
