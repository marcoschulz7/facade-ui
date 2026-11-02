import { ArrowUpRight, Calendar } from "lucide-react";
import { MagneticButton } from "./magnetic-button";

export default function Demo() {
  return (
    <div className="w-full max-w-2xl rounded-[28px] bg-muted px-6 py-14 text-center text-foreground sm:px-12 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Studio Juniper, Portland</p>
      <h3 className="mx-auto mt-4 max-w-md font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
        Have a space that deserves better light?
      </h3>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        Interior design for homes and boutique hospitality. Taking four new projects this fall.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <MagneticButton>
          Start a project
          <ArrowUpRight aria-hidden />
        </MagneticButton>
        <MagneticButton variant="outline" className="bg-background dark:bg-secondary">
          <Calendar aria-hidden />
          Book a 20 min call
        </MagneticButton>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Move your cursor near the buttons</p>
    </div>
  );
}
