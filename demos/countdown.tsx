"use client";

import * as React from "react";
import { Countdown } from "./countdown";

export default function Demo() {
  // Target is computed after mount so the preview always shows a live countdown.
  const [target, setTarget] = React.useState<number | undefined>(undefined);
  React.useEffect(() => {
    setTarget(Date.now() + ((2 * 24 + 14) * 3600 + 27 * 60 + 45) * 1000);
  }, []);

  return (
    <div className="w-full max-w-[600px] rounded-[28px] bg-muted px-6 py-10 text-center sm:px-10 sm:py-12">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Grand opening open house</p>
      <h3 className="mt-2 font-display text-[28px] font-semibold tracking-[-0.03em] text-foreground sm:text-[32px]">The Residences at Old Town</h3>
      <p className="mt-2 text-[15px] text-muted-foreground">Saturday, 11 AM to 3 PM. 7135 E Main St, Scottsdale.</p>
      <div className="mt-8 flex justify-center">
        <Countdown
          key={target === undefined ? "pending" : "live"}
          target={target}
          completeContent={<p className="font-display text-xl font-semibold text-foreground">Doors are open. Come on in.</p>}
        />
      </div>
      <a
        href="#rsvp"
        className="mt-9 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        RSVP for a private preview
      </a>
    </div>
  );
}
