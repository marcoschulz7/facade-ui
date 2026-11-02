import { ArrowRight, Building2, Home, Key, MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import { SlidingTabs } from "./sliding-tabs";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex h-14 min-w-0 flex-1 flex-col justify-center rounded-xl bg-background px-4 transition-shadow focus-within:ring-2 focus-within:ring-ring dark:bg-foreground/[0.08]">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-0.5 w-full bg-transparent text-[15px] font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none";

function SearchPane({ cta, priceLabel, pricePlaceholder }: { cta: string; priceLabel: string; pricePlaceholder: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-[24px] bg-muted p-3 sm:flex-row sm:items-center">
      <Field label="Location">
        <span className="mt-0.5 flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <input className="w-full bg-transparent text-[15px] font-medium text-foreground focus:outline-none" defaultValue="Austin, TX" aria-label="Location" />
        </span>
      </Field>
      <Field label={priceLabel}>
        <input className={inputCls} placeholder={pricePlaceholder} aria-label={priceLabel} />
      </Field>
      <Field label="Beds">
        <input className={inputCls} placeholder="Any" aria-label="Beds" />
      </Field>
      <button
        type="button"
        className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        <Search className="size-4" />
        {cta}
      </button>
    </div>
  );
}

function SellPane() {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] bg-muted p-6 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="text-[15px] font-semibold tracking-[-0.01em]">Homes in 78704 sold for 3.2% over asking last quarter</p>
        <p className="mt-1 text-[15px] text-muted-foreground">Get a free valuation from a local agent within 24 hours.</p>
      </div>
      <button
        type="button"
        className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        Value my home
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="w-full max-w-2xl">
      <h3 className="mb-6 font-display text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">Your next move, in Austin</h3>
      <SlidingTabs
        label="Search mode"
        tabs={[
          {
            value: "buy",
            label: "Buy",
            icon: <Home />,
            content: <SearchPane cta="Search" priceLabel="Max price" pricePlaceholder="$750,000" />,
          },
          {
            value: "rent",
            label: "Rent",
            icon: <Key />,
            content: <SearchPane cta="Search" priceLabel="Monthly budget" pricePlaceholder="$2,800 / mo" />,
          },
          { value: "sell", label: "Sell", icon: <Building2 />, content: <SellPane /> },
        ]}
      />
      <p className="mt-4 text-[13px] text-muted-foreground">Use the arrow keys to switch tabs.</p>
    </div>
  );
}
