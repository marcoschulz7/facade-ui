"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedPrice, PriceToggle, type BillingPeriod } from "./price-toggle";

const features = [
  "Two professional cleanings per year",
  "Annual exam and digital X-rays",
  "20% off fillings, crowns and whitening",
  "Same week emergency visits",
  "No insurance, no deductibles, no waiting periods",
];

export default function Demo() {
  const [period, setPeriod] = React.useState<BillingPeriod>("monthly");
  const monthly = 39;
  const yearlyPerMonth = 31;
  const price = period === "monthly" ? monthly : yearlyPerMonth;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4">
      <PriceToggle value={period} onChange={setPeriod} />

      <article className="w-full rounded-[28px] bg-muted p-7 text-foreground sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Most popular</p>
        <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">Smile Club Membership</h3>
        <p className="mt-1 text-[15px] text-muted-foreground">Bayside Family Dental, San Diego</p>

        <div className="mt-7 flex items-baseline gap-1.5">
          <AnimatedPrice value={price} className="text-[56px] font-semibold leading-none tracking-[-0.04em]" />
          <span className="text-[15px] text-muted-foreground">per month</span>
        </div>
        <p className="mt-2 h-5 text-[13px] text-muted-foreground">
          {period === "yearly" ? (
            <>
              Billed <span className="tabular-nums text-foreground">$372</span> yearly. You save{" "}
              <span className="tabular-nums text-foreground">$96</span>.
            </>
          ) : (
            "Billed monthly. Cancel anytime."
          )}
        </p>

        <ul className="mt-7 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[15px]">
              <Check className="mt-1 size-4 shrink-0 text-foreground" strokeWidth={2.5} aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <a
          href="#join"
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
        >
          Join Smile Club
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </article>
    </div>
  );
}
