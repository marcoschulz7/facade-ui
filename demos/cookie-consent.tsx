"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";
import { CookieConsent, type ConsentState } from "./cookie-consent";

const listings = [
  { price: "$685,000", meta: "3 bd, 2 ba, Mount Pleasant" },
  { price: "$1,240,000", meta: "4 bd, 3.5 ba, South of Broad" },
  { price: "$449,900", meta: "2 bd, 2 ba, Daniel Island" },
];

export default function Demo() {
  const [run, setRun] = React.useState(0);
  const [result, setResult] = React.useState<ConsentState | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative h-[500px] overflow-hidden rounded-[28px] bg-muted">
        {/* Page behind the card */}
        <header className="flex h-14 items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-[-0.01em] text-foreground">Harbor & Pine Realty</span>
          <span className="hidden text-xs text-muted-foreground sm:block">Buy, sell and rent in Charleston, SC</span>
        </header>
        <div className="grid gap-3 px-6 pt-1 sm:grid-cols-3">
          {listings.map((l) => (
            <div key={l.price} className="rounded-2xl bg-background p-3 dark:bg-secondary">
              <div className="aspect-[4/3] rounded-xl bg-foreground/[0.06]" />
              <p className="mt-3 text-sm font-semibold tracking-[-0.01em] text-foreground">{l.price}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{l.meta}</p>
            </div>
          ))}
        </div>

        {result && (
          <div className="absolute right-5 top-16 flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs text-foreground shadow-float dark:bg-secondary">
            <CircleCheck className="size-3.5 text-success" aria-hidden />
            Analytics {result.analytics ? "on" : "off"}, marketing {result.marketing ? "on" : "off"}
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setRun((r) => r + 1);
              }}
              className="ml-1 rounded font-medium text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Reset
            </button>
          </div>
        )}

        <CookieConsent key={run} contained storageKey={null} delay={400} onChange={(c) => setResult(c)} />
      </div>
    </div>
  );
}
