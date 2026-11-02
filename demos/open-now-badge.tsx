"use client";

import { MapPin, Star } from "lucide-react";
import { OpenNowBadge, type WeeklyHours } from "./open-now-badge";

const coffee: WeeklyHours = {
  mon: [{ open: "06:30", close: "19:00" }],
  tue: [{ open: "06:30", close: "19:00" }],
  wed: [{ open: "06:30", close: "19:00" }],
  thu: [{ open: "06:30", close: "19:00" }],
  fri: [{ open: "06:30", close: "20:00" }],
  sat: [{ open: "07:30", close: "20:00" }],
  sun: [{ open: "07:30", close: "16:00" }],
};

const dental: WeeklyHours = {
  mon: [{ open: "08:00", close: "17:00" }],
  tue: [{ open: "08:00", close: "17:00" }],
  wed: [{ open: "08:00", close: "12:00" }, { open: "13:00", close: "19:00" }],
  thu: [{ open: "08:00", close: "17:00" }],
  fri: [{ open: "08:00", close: "14:00" }],
};

const tacos: WeeklyHours = {
  mon: [{ open: "11:00", close: "23:00" }],
  tue: [{ open: "11:00", close: "23:00" }],
  wed: [{ open: "11:00", close: "23:00" }],
  thu: [{ open: "11:00", close: "01:00" }],
  fri: [{ open: "11:00", close: "03:00" }],
  sat: [{ open: "10:00", close: "03:00" }],
  sun: [{ open: "10:00", close: "22:00" }],
};

const places = [
  {
    name: "Ember & Rye Coffee",
    kind: "Coffee shop",
    where: "South Congress, Austin",
    rating: "4.8",
    hours: coffee,
    tz: "America/Chicago",
    initials: "ER",
  },
  {
    name: "Cherry Creek Family Dental",
    kind: "Dentist",
    where: "Cherry Creek, Denver",
    rating: "4.9",
    hours: dental,
    tz: "America/Denver",
    initials: "CC",
  },
  {
    name: "La Pequeña Taquería",
    kind: "Mexican restaurant",
    where: "Wynwood, Miami",
    rating: "4.7",
    hours: tacos,
    tz: "America/New_York",
    initials: "LP",
  },
];

export default function Demo() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-muted p-2">
      {places.map((p) => (
        <article
          key={p.name}
          className="flex flex-col gap-4 rounded-[22px] p-4 transition-colors hover:bg-foreground/[0.03] sm:flex-row sm:items-center sm:px-5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-background font-display text-sm font-semibold text-foreground dark:bg-foreground/[0.1]">
              {p.initials}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-medium tracking-[-0.01em]">{p.name}</h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-muted-foreground">
                <Star className="size-3 fill-star text-star" aria-hidden />
                <span className="font-medium tabular-nums text-foreground">{p.rating}</span>
                <span aria-hidden>·</span>
                <span>{p.kind}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3" aria-hidden />{p.where}</span>
              </p>
            </div>
          </div>
          <OpenNowBadge hours={p.hours} timeZone={p.tz} size="sm" className="bg-background dark:bg-foreground/[0.1]" />
        </article>
      ))}
    </div>
  );
}
