import { Phone, Shield, Star } from "lucide-react";
import { ShineButton } from "./shine-button";

export default function Demo() {
  return (
    <div className="w-full max-w-2xl rounded-[28px] bg-muted p-7 text-foreground sm:p-10">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Summit Roofing, Denver</p>
      <h3 className="mt-3 max-w-md font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
        Get a free roof inspection before hail season hits.
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        A licensed inspector on your roof within 48 hours, with photos and a written report you can send to your insurer.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ShineButton size="lg" arrow>
          Book my free inspection
        </ShineButton>
        <ShineButton size="lg" variant="outline" href="tel:+13035550142" icon={<Phone aria-hidden />} className="bg-background dark:bg-secondary">
          (303) 555-0142
        </ShineButton>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3.5 fill-star text-star" aria-hidden />
          4.9 from 812 Google reviews
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="size-3.5" aria-hidden />
          Licensed and insured in Colorado
        </span>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <ShineButton size="sm" variant="solid">
            Solid
          </ShineButton>
          <ShineButton size="sm" variant="outline" className="bg-background dark:bg-secondary">
            Outline
          </ShineButton>
        </div>
      </div>
    </div>
  );
}
