"use client";

import * as React from "react";
import { Menu, Wrench } from "lucide-react";
import { AnnouncementBar, type Announcement } from "./announcement-bar";

const messages: Announcement[] = [
  {
    badge: "Fall special",
    text: "$79 furnace tune-up through November 30.",
    href: "#book",
    linkLabel: "Book now",
  },
  {
    badge: "24/7",
    text: "No heat? Emergency service across Denver metro, no overtime fees.",
    href: "tel:+13035550133",
    linkLabel: "Call (303) 555-0133",
  },
  {
    badge: "Financing",
    text: "0% APR for 18 months on new systems, approval in minutes.",
    href: "#financing",
    linkLabel: "Check rates",
  },
];

export default function Demo() {
  const [key, setKey] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-[22px] bg-background shadow-float">
        <AnnouncementBar key={key} messages={messages} onDismiss={() => setDismissed(true)} />
        <header className="flex h-14 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
              <Wrench className="size-3.5" aria-hidden />
            </span>
            Front Range Heating & Air
          </div>
          <nav className="hidden items-center gap-7 text-[14px] text-muted-foreground sm:flex">
            <span>Services</span>
            <span>Maintenance plans</span>
            <span>Reviews</span>
            <span className="rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background">Get a quote</span>
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
              onClick={() => {
                setDismissed(false);
                setKey((k) => k + 1);
              }}
              className="mt-6 rounded-full bg-muted px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Show announcement again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
