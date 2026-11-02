"use client";

import * as React from "react";
import { ArrowRight, Scissors, Star } from "lucide-react";
import { StickyContactBar } from "./sticky-contact-bar";

const services = [
  { name: "Signature cut", price: "$48", time: "45 min" },
  { name: "Skin fade", price: "$42", time: "40 min" },
  { name: "Beard sculpt and hot towel", price: "$30", time: "30 min" },
  { name: "Cut and beard combo", price: "$70", time: "75 min" },
  { name: "Kids cut (under 12)", price: "$28", time: "30 min" },
  { name: "Gray blending", price: "$35", time: "30 min" },
];

export default function Demo() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full items-center justify-center py-4">
      {/* Phone frame */}
      <div className="relative h-[420px] w-[250px] overflow-hidden rounded-[2.5rem] bg-foreground p-[6px] shadow-device">
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">
          <div className="absolute left-1/2 top-2 z-50 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground" aria-hidden />
          <div ref={scrollRef} className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Hero */}
            <header className="px-5 pb-6 pt-10">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
                  <Scissors className="size-3.5" aria-hidden />
                </span>
                <span className="text-[12px] font-semibold tracking-[-0.01em]">Fifth & Main Barbers</span>
              </div>
              <h1 className="mt-5 font-display text-[24px] font-semibold leading-[1.1] tracking-[-0.03em]">
                Sharp cuts in East Nashville.
              </h1>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                Walk-ins welcome. Most appointments open same day.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="size-3 fill-star text-star" aria-hidden />
                <span className="font-medium text-foreground">4.9</span> · 860 Google reviews
              </div>
              <p className="mt-6 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                Scroll down <ArrowRight className="size-3 rotate-90" aria-hidden />
              </p>
            </header>

            {/* Services */}
            <section className="px-5 pb-28">
              <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Services</h2>
              <ul className="rounded-2xl bg-muted px-3.5 py-1.5">
                {services.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-2 py-2.5">
                    <span>
                      <span className="block text-[12px] font-medium">{s.name}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{s.time}</span>
                    </span>
                    <span className="text-[12px] font-medium tabular-nums">{s.price}</span>
                  </li>
                ))}
              </ul>
              <h2 className="mb-2 mt-6 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Visit us</h2>
              <div className="rounded-2xl bg-muted p-3.5 text-[12px] leading-relaxed text-muted-foreground">
                1008 Woodland St, Nashville, TN 37206
                <br />
                Tue to Sat, 9 AM to 7 PM
              </div>
              <div className="mt-4 h-24 rounded-2xl bg-muted" />
            </section>
          </div>

          <StickyContactBar
            contained
            scrollContainerRef={scrollRef}
            threshold={120}
            hideAfter={80}
            phone="(615) 555-0187"
            address="1008 Woodland St, Nashville, TN 37206"
            bookingUrl="#book"
            className="px-2 pb-2"
          />
        </div>
      </div>
    </div>
  );
}
