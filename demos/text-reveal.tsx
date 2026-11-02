import { TextReveal } from "./text-reveal";

export default function Demo() {
  return (
    <div className="w-full max-w-2xl py-6">
      <TextReveal
        as="p"
        text="Hollis and Reed Realty"
        className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
        stagger={0.08}
      />
      <TextReveal
        as="h2"
        text="Find a home in Denver that feels like it was built around your life."
        delay={0.2}
        className="mt-4 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-[52px]"
      />
      <TextReveal
        as="p"
        text="Local agents, honest pricing, and off-market listings you will not see on the big portals."
        delay={0.75}
        stagger={0.025}
        className="mt-6 max-w-lg text-[17px] leading-[1.5] text-muted-foreground sm:text-[19px]"
      />
    </div>
  );
}
