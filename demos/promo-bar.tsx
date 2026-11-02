"use client";

import * as React from "react";
import { Flame, Menu } from "lucide-react";
import { PromoBar } from "./promo-bar";

const KEY = "facade-demo-promo-bar";

/** End of the current month at 11:59 pm, so the demo countdown is always running. */
function endOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 0);
}

export default function Demo() {
  const [run, setRun] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const end = React.useMemo(endOfMonth, []);
  const day = end.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  function showAgain() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    const d = document.documentElement;
    const v = (d.getAttribute("data-promo-bar-dismissed") ?? "").split(" ").filter((k) => k && k !== KEY);
    d.setAttribute("data-promo-bar-dismissed", v.join(" "));
    setDismissed(false);
    setRun((r) => r + 1);
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-[22px] bg-background shadow-float">
        <PromoBar
          key={run}
          storageKey={KEY}
          badge="Tune-up special"
          text={`$89 furnace or AC tune-up, through ${day}.`}
          mobileText="$89 furnace or AC tune-up."
          href="#book"
          linkLabel="Book a visit"
          countdownTo={end.toISOString()}
          onDismiss={() => setDismissed(true)}
        />
        <header className="flex h-14 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
              <Flame className="size-3.5" aria-hidden />
            </span>
            Blue Ridge Comfort Co.
          </div>
          <nav className="hidden items-center gap-7 text-[14px] text-muted-foreground sm:flex">
            <span>Heating</span>
            <span>Cooling</span>
            <span>Service plans</span>
            <span className="rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background">Book service</span>
          </nav>
          <Menu className="size-5 text-muted-foreground sm:hidden" aria-hidden />
        </header>
        <div className="px-5 py-10">
          <div className="h-3 w-24 rounded-full bg-muted" />
          <div className="mt-4 h-7 w-3/4 max-w-md rounded-lg bg-muted" />
          <div className="mt-2 h-7 w-1/2 max-w-xs rounded-lg bg-muted" />
          {dismissed && (
            <button
              type="button"
              onClick={showAgain}
              className="mt-6 rounded-full bg-muted px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Show the bar again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
