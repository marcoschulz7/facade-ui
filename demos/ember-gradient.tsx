import { ArrowRight, Phone } from "lucide-react";
import { EmberGradient, type EmberPreset } from "./ember-gradient";

const presets: { name: EmberPreset; note: string }[] = [
  { name: "ember", note: "Copper, forest, rust" },
  { name: "moss", note: "Olive, pine, amber" },
  { name: "dusk", note: "Clay, slate, plum" },
];

export default function Demo() {
  return (
    <div className="w-full space-y-3">
      <EmberGradient
        cycle
        cycleDuration={14}
        className="rounded-[28px]"
        contentClassName="px-6 py-14 sm:px-12 sm:py-20"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/65">Cedar Hollow Landscaping, Asheville</p>
        <h2 className="mt-4 max-w-xl text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[52px]">
          Fall cleanup crews are booking into December.
        </h2>
        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
          Leaf removal, bed mulching and a last mow, done in one visit with a written price before we start.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#quote"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[#17130F] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17130F]"
          >
            Get a cleanup quote
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a
            href="tel:+18285550142"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium text-white ring-1 ring-white/30 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Phone className="size-4" aria-hidden />
            (828) 555-0142
          </a>
        </div>
      </EmberGradient>

      <div className="grid grid-cols-3 gap-3">
        {presets.map((p) => (
          <EmberGradient key={p.name} palette={p.name} className="rounded-[20px]" contentClassName="px-4 pb-4 pt-14 sm:px-5 sm:pt-20">
            <p className="text-[14px] font-semibold capitalize">{p.name}</p>
            <p className="mt-0.5 hidden text-[12px] text-white/70 sm:block">{p.note}</p>
          </EmberGradient>
        ))}
      </div>
    </div>
  );
}
