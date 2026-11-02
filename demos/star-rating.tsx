"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";
import { StarRating, StarRatingInput } from "./star-rating";

const breakdown = [
  { stars: 5, pct: 86 },
  { stars: 4, pct: 9 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export default function Demo() {
  const [rating, setRating] = React.useState(0);

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <section className="rounded-[28px] bg-muted p-6 text-foreground sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Bright Smile Dental, Denver</p>
        <div className="mt-4 flex items-end gap-3">
          <span className="font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">4.8</span>
          <span className="pb-1 text-sm text-muted-foreground">out of 5</span>
        </div>
        <StarRating value={4.8} count={312} source="Google" className="mt-3" />
        <ul className="mt-6 space-y-2">
          {breakdown.map((b) => (
            <li key={b.stars} className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="w-3 tabular-nums">{b.stars}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <span className="block h-full rounded-full bg-star" style={{ width: `${b.pct}%` }} />
              </span>
              <span className="w-8 text-right tabular-nums">{b.pct}%</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col rounded-[28px] bg-muted p-6 text-foreground sm:p-7">
        <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em]">How was your cleaning with Dr. Patel?</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Your feedback helps neighbors in Cherry Creek find great care.</p>
        <StarRatingInput className="mt-6" value={rating} onChange={setRating} label="Rate your visit" />
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CircleCheck className="size-3.5 text-success" aria-hidden />
            Verified patient
          </span>
          <button
            type="button"
            disabled={rating === 0}
            className="h-10 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
