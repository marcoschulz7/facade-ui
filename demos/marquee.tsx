import { Coffee, Dumbbell, Home, Key, Scissors, Sun, Trees, Utensils, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Marquee } from "./marquee";

interface Brand {
  name: string;
  icon: LucideIcon;
  style: string;
}

const row1: Brand[] = [
  { name: "Juniper & Co.", icon: Trees, style: "font-display font-semibold tracking-[-0.02em]" },
  { name: "HEARTH HOMES", icon: Home, style: "font-semibold tracking-[0.18em] text-[13px]" },
  { name: "Copperline", icon: Wrench, style: "font-medium tracking-[-0.01em]" },
  { name: "Saltwater Coffee", icon: Coffee, style: "font-display italic font-medium" },
  { name: "Ironside Gym", icon: Dumbbell, style: "font-bold uppercase tracking-[-0.02em]" },
];

const row2: Brand[] = [
  { name: "Mesa Realty", icon: Key, style: "font-display font-semibold tracking-[-0.02em]" },
  { name: "Golden Hour Solar", icon: Sun, style: "font-medium tracking-[-0.01em]" },
  { name: "Fade Society", icon: Scissors, style: "font-bold uppercase tracking-[0.12em] text-[13px]" },
  { name: "Olive & Ember", icon: Utensils, style: "font-display italic font-semibold" },
  { name: "Northline Builders", icon: Home, style: "font-semibold uppercase tracking-[0.06em] text-[13px]" },
];

function Wordmark({ brand }: { brand: Brand }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-lg text-muted-foreground transition-colors duration-300 hover:text-foreground">
      <brand.icon className="size-5" strokeWidth={1.75} />
      <span className={brand.style}>{brand.name}</span>
    </span>
  );
}

export default function Demo() {
  return (
    <section className="w-full max-w-3xl">
      <p className="text-center text-[15px] text-muted-foreground">
        Trusted by <span className="font-medium text-foreground">340+ local businesses</span> across Texas and Colorado
      </p>
      <div className="mt-8 space-y-6">
        <Marquee speed={36} repeat={2}>
          {row1.map((b) => (
            <Wordmark key={b.name} brand={b} />
          ))}
        </Marquee>
        <Marquee speed={42} direction="right" repeat={2}>
          {row2.map((b) => (
            <Wordmark key={b.name} brand={b} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
