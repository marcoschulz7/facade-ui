"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Hours model (same shape as open-now-badge, duplicated so this
   item installs on its own)
------------------------------------------------------------------- */

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

/** 24h "HH:mm". A close time earlier than (or equal to) open runs past midnight. */
export interface TimeRange {
  open: string;
  close: string;
}

/** Missing day, `null` or an empty array means closed. Multiple ranges = split hours. */
export type WeeklyHours = Partial<Record<DayKey, TimeRange[] | null>>;

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMinutes(t: string): number {
  const [h, m = "0"] = t.split(":");
  return Number(h) * 60 + Number(m);
}

function formatClock(total: number): string {
  const mins = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0 && m === 0) return "12 AM";
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${period}` : `${h12} ${period}`;
}

function zonedNow(date: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    day: Math.max(0, SHORT_DAYS.indexOf(get("weekday"))),
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

function isOpenAt(hours: WeeklyHours, day: number, minutes: number): boolean {
  const today = hours[DAY_KEYS[day]] ?? [];
  for (const r of today) {
    const s = toMinutes(r.open);
    let e = toMinutes(r.close);
    if (e <= s) e += 1440;
    if (minutes >= s && minutes < e) return true;
  }
  // Overnight spill from yesterday.
  const yesterday = hours[DAY_KEYS[(day + 6) % 7]] ?? [];
  for (const r of yesterday) {
    const s = toMinutes(r.open);
    const e = toMinutes(r.close);
    if (e <= s && minutes < e) return true;
  }
  return false;
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */

export interface OpeningHoursProps {
  /** Weekly schedule. Defaults to a Monday to Saturday storefront example. */
  hours?: WeeklyHours;
  /** IANA time zone of the business, e.g. "America/Los_Angeles". Defaults to "America/New_York". */
  timeZone?: string;
  /** First row of the list. US convention is Monday or Sunday. */
  weekStartsOn?: "mon" | "sun";
  title?: string;
  /** Optional footnote, e.g. holiday hours. */
  note?: string;
  className?: string;
}

const WEEKDAY_HOURS: TimeRange[] = [{ open: "09:00", close: "18:00" }];
const DEFAULT_HOURS: WeeklyHours = {
  mon: WEEKDAY_HOURS,
  tue: WEEKDAY_HOURS,
  wed: WEEKDAY_HOURS,
  thu: WEEKDAY_HOURS,
  fri: WEEKDAY_HOURS,
  sat: [{ open: "10:00", close: "16:00" }],
  sun: null,
};

export function OpeningHours({
  hours = DEFAULT_HOURS,
  timeZone = "America/New_York",
  weekStartsOn = "mon",
  title = "Hours",
  note,
  className,
}: OpeningHoursProps) {
  const uid = React.useId();
  const [now, setNow] = React.useState<{ day: number; minutes: number } | null>(null);

  React.useEffect(() => {
    const tick = () => setNow(zonedNow(new Date(), timeZone));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  const order = weekStartsOn === "mon" ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  const open = now ? isOpenAt(hours, now.day, now.minutes) : null;
  const tzLabel = React.useMemo(() => {
    try {
      const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName");
      return part?.value ?? "";
    } catch {
      return "";
    }
  }, [timeZone]);

  return (
    <section aria-label={title} className={cn("w-full rounded-[28px] bg-muted p-6 text-foreground", className)}>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em]">{title}</h3>
          {tzLabel && <p className="mt-0.5 text-[13px] text-muted-foreground">Times in {tzLabel}</p>}
        </div>
        <span
          className={cn(
            "inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-background px-3 text-[13px] font-medium transition-colors",
            open === null && "text-transparent",
            open === true && "text-success",
            open === false && "text-muted-foreground",
          )}
          aria-live="polite"
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              open ? "bg-success" : "bg-muted-foreground/50",
              open === null && "bg-transparent",
            )}
            aria-hidden
          />
          {open === null ? "Loading" : open ? "Open now" : "Closed now"}
        </span>
      </header>

      <ul className="relative -mx-3">
        {order.map((d) => {
          const ranges = hours[DAY_KEYS[d]] ?? [];
          const isToday = now?.day === d;
          return (
            <li
              key={d}
              aria-current={isToday ? "date" : undefined}
              className="relative flex items-start justify-between gap-4 px-3 py-2.5 text-[15px]"
            >
              {isToday && (
                <motion.span
                  layoutId={`${uid}-today`}
                  className="absolute inset-0 rounded-xl bg-background"
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "relative flex items-baseline gap-2",
                  isToday ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="sm:hidden">{SHORT_DAYS[d]}</span>
                <span className="hidden sm:inline">{DAY_NAMES[d]}</span>
                {isToday && <span className="text-[12px] font-medium text-brand">Today</span>}
              </span>
              <span className="relative flex flex-col items-end gap-0.5 text-right">
                {ranges.length === 0 ? (
                  <span className={cn(isToday ? "text-destructive" : "text-muted-foreground/70")}>Closed</span>
                ) : (
                  ranges.map((r) => {
                    const s = toMinutes(r.open);
                    const e = toMinutes(r.close);
                    const allDay = s === e;
                    return (
                      <span
                        key={`${r.open}-${r.close}`}
                        className={cn("tabular-nums", isToday ? "font-medium text-foreground" : "text-foreground/85")}
                      >
                        {allDay ? "Open 24 hours" : `${formatClock(s)} to ${formatClock(e)}`}
                      </span>
                    );
                  })
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {note && <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">{note}</p>}
    </section>
  );
}

export default OpeningHours;
