import { ArrowUpRight, Calendar, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";

interface Feature {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  meta: string;
}

const features: Feature[] = [
  {
    icon: Calendar,
    eyebrow: "Same week",
    title: "Book online in 60 seconds",
    body: "Pick a time that works, including early mornings and Saturdays. Reminders by text.",
    meta: "Open 7 AM to 7 PM",
  },
  {
    icon: Shield,
    eyebrow: "No surprises",
    title: "Upfront pricing, every visit",
    body: "We confirm your insurance and share the exact cost before any treatment starts.",
    meta: "In network with 20 plans",
  },
  {
    icon: Sparkles,
    eyebrow: "Modern care",
    title: "Whitening and Invisalign",
    body: "Digital scans instead of molds, and a custom plan you can preview before you commit.",
    meta: "Free smile consult",
  },
];

export default function Demo() {
  return (
    <section className="w-full max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Bright Oak Dental, Austin</p>
          <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">Dentistry without the dread</h3>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1 rounded-md text-[15px] font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          All services
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <SpotlightCard key={f.title} className="p-7">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-background text-foreground dark:bg-foreground/[0.08]">
                <f.icon className="size-[18px]" aria-hidden />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{f.eyebrow}</span>
            </div>
            <h4 className="mt-7 text-[19px] font-semibold tracking-[-0.02em]">{f.title}</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
            <p className="mt-7 text-[13px] text-muted-foreground">{f.meta}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
