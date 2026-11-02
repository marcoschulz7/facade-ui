import { ArrowRight } from "lucide-react";
import { GradientHeading } from "./gradient-heading";

export default function Demo() {
  return (
    <div className="mx-auto w-full max-w-3xl py-6 text-center">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        Now serving Miami and Fort Lauderdale
      </p>
      <GradientHeading highlight={["calls you back"]} className="mx-auto mt-5 max-w-2xl">
        The roofing crew that actually calls you back.
      </GradientHeading>
      <p className="mx-auto mt-6 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
        Same day quotes, fixed pricing and a 10 year workmanship warranty on every job.
      </p>
      <a
        href="#"
        className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Get a same day quote
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
      </a>
    </div>
  );
}
