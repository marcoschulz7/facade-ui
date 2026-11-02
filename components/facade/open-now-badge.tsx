"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Hours model
------------------------------------------------------------------- */

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

/** 24h "HH:mm". A close time earlier than (or equal to) open runs past midnight. Use "24:00" for midnight. */
export interface TimeRange {
  open: string;
  close: string;
}

/** Missing day, `null` or an empty array means closed. Multiple ranges = split hours. */
export type WeeklyHours = Partial<Record<DayKey, TimeRange[] | null>>;

export interface OpenStatus {
  isOpen: boolean;
  /** True when open and closing within `closingSoonMinutes`. */
  closingSoon: boolean;
  /** Short label for the next change, e.g. "closes 6 PM" or "opens 9 AM tomorrow". */
  detail: string;
  /** Minutes until the next open/close change, null if never. */
  minutesUntilChange: number | null;
}

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK = 7 * 1440;

function toMinutes(t: string): number {
  const [h, m = "0"] = t.split(":");
  return Number(h) * 60 + Number(m);
}

export function formatClock(totalMinutes: number): string {
  const mins = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0 && m === 0) return "midnight";
  if (h === 12 && m === 0) return "noon";
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${period}` : `${h12} ${period}`;
}

/** Weekday index (0 = Sunday) and minutes since midnight in the given IANA time zone. */
export function getZonedNow(date: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "0";
  const day = Math.max(0, SHORT_DAYS.indexOf(get("weekday")));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { day, minutes };
}

function weekIntervals(hours: WeeklyHours): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  DAY_KEYS.forEach((key, d) => {
    for (const r of hours[key] ?? []) {
      const s = toMinutes(r.open);
      let e = toMinutes(r.close);
      if (e <= s) e += 1440;
      out.push([d * 1440 + s, d * 1440 + e]);
    }
  });
  return out.sort((a, b) => a[0] - b[0]);
}

export function getOpenStatus(
  hours: WeeklyHours,
  timeZone: string,
  date: Date = new Date(),
  closingSoonMinutes = 60,
): OpenStatus {
  const intervals = weekIntervals(hours);
  if (intervals.length === 0) {
    return { isOpen: false, closingSoon: false, detail: "temporarily closed", minutesUntilChange: null };
  }
  const { day, minutes } = getZonedNow(date, timeZone);
  const now = day * 1440 + minutes;

  /** Remaining minutes of the interval covering week-minute `t`, or null. */
  const remainingAt = (t: number): number | null => {
    for (const [s, e] of intervals) {
      if (t >= s && t < e) return e - t;
      // Saturday night ranges that spill into Sunday morning.
      if (t + WEEK >= s && t + WEEK < e) return e - (t + WEEK);
    }
    return null;
  };

  const first = remainingAt(now);
  if (first !== null) {
    // Follow back-to-back ranges (e.g. 24h days) to find the real close time.
    let end = now + first;
    for (let i = 0; i < 14; i++) {
      const more = remainingAt(end % WEEK);
      if (more === null || more <= 0) break;
      end += more;
      if (end - now >= WEEK) {
        return { isOpen: true, closingSoon: false, detail: "open 24 hours", minutesUntilChange: null };
      }
    }
    const until = end - now;
    const dayDiff = Math.floor(end / 1440) - day;
    const when = formatClock(end);
    const detail =
      dayDiff <= 0 || (dayDiff === 1 && end % 1440 <= 360)
        ? `closes ${when}`
        : `closes ${SHORT_DAYS[(day + dayDiff) % 7]} ${when}`;
    return { isOpen: true, closingSoon: until <= closingSoonMinutes, detail, minutesUntilChange: until };
  }

  let best: number | null = null;
  for (const [s] of intervals) {
    const delta = (((s - now) % WEEK) + WEEK) % WEEK || WEEK;
    if (best === null || delta < best) best = delta;
  }
  const opensAt = now + (best ?? 0);
  const dayDiff = Math.floor(opensAt / 1440) - day;
  const when = formatClock(opensAt);
  const detail =
    dayDiff === 0
      ? `opens ${when}`
      : dayDiff === 1
        ? `opens ${when} tomorrow`
        : `opens ${SHORT_DAYS[(day + dayDiff) % 7]} ${when}`;
  return { isOpen: false, closingSoon: false, detail, minutesUntilChange: best };
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */

export interface OpenNowBadgeProps {
  hours: WeeklyHours;
  /** IANA time zone of the business, e.g. "America/Chicago". */
  timeZone: string;
  /** Show the amber "Closing soon" state this many minutes before close. */
  closingSoonMinutes?: number;
  size?: "sm" | "md";
  className?: string;
}

export function OpenNowBadge({
  hours,
  timeZone,
  closingSoonMinutes = 60,
  size = "md",
  className,
}: OpenNowBadgeProps) {
  // Time depends on the visitor's clock, so only compute after mount.
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const status = React.useMemo(
    () => (now ? getOpenStatus(hours, timeZone, now, closingSoonMinutes) : null),
    [now, hours, timeZone, closingSoonMinutes],
  );

  const tone = !status ? "idle" : status.isOpen ? (status.closingSoon ? "soon" : "open") : "closed";
  const headline = !status ? "" : status.isOpen ? (status.closingSoon ? "Closing soon" : "Open now") : "Closed";

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-muted text-foreground",
        size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-sm",
        className,
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden>
        {(tone === "open" || tone === "soon") && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping-slow motion-reduce:animate-none",
              tone === "open" ? "bg-success/70" : "bg-warning/70",
            )}
          />
        )}
        <span
          className={cn(
            "relative size-2 rounded-full transition-colors duration-500",
            tone === "open" && "bg-success",
            tone === "soon" && "bg-warning",
            tone === "closed" && "bg-muted-foreground/50",
            tone === "idle" && "bg-muted-foreground/25",
          )}
        />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {status ? (
          <motion.span
            key={`${headline}-${status.detail}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span
              className={cn(
                "font-medium",
                tone === "open" && "text-success",
                tone === "soon" && "text-warning",
                tone === "closed" && "text-foreground",
              )}
            >
              {headline}
            </span>
            <span className="text-muted-foreground/60" aria-hidden>
              ·
            </span>
            <span className="text-muted-foreground">{status.detail}</span>
          </motion.span>
        ) : (
          <span key="placeholder" className="flex items-center">
            <span
              aria-hidden
              className="h-3 w-36 rounded-full bg-foreground/[0.06]"
            />
            <span className="sr-only">Checking hours</span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default OpenNowBadge;
