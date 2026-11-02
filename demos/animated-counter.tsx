import { Star } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note: string;
  star?: boolean;
}

const stats: Stat[] = [
  { value: 2.4, prefix: "$", suffix: "M", decimals: 1, label: "Saved for homeowners", note: "Since 2019" },
  { value: 1240, suffix: "+", label: "Homes serviced", note: "Across the Austin metro" },
  { value: 4.9, decimals: 1, label: "Average rating", note: "386 Google reviews", star: true },
  { value: 45, suffix: " min", label: "Average response", note: "Seven days a week" },
];

export default function Demo() {
  return (
    <section className="w-full max-w-3xl">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Lone Star Plumbing Co.</p>
      <h3 className="mt-2 font-display text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">Numbers our neighbors trust</h3>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col rounded-[24px] bg-muted p-5 sm:p-6">
            <span className="flex items-baseline gap-1.5">
              <AnimatedCounter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                className="font-display text-[32px] font-semibold tracking-[-0.03em] sm:text-[36px]"
              />
              {s.star && <Star className="size-4 translate-y-[-2px] fill-star text-star" aria-hidden />}
            </span>
            <span className="mt-4 text-sm font-medium">{s.label}</span>
            <span className="mt-0.5 text-[13px] text-muted-foreground">{s.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
