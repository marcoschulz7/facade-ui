import { Bath, BedDouble } from "lucide-react";
import { Reveal, RevealGroup } from "./reveal";

const listings = [
  { street: "1847 Alder Lane", city: "Portland, OR", price: "$689,000", beds: 3, baths: 2 },
  { street: "92 Larkspur Court", city: "Lake Oswego, OR", price: "$1,140,000", beds: 4, baths: 3 },
  { street: "530 NW Everett St, 4B", city: "Portland, OR", price: "$449,500", beds: 2, baths: 2 },
];

/* Simple house silhouette used as the photo placeholder. */
function HouseArt({ seed }: { seed: number }) {
  const roof = 26 + seed * 6;
  return (
    <svg viewBox="0 0 320 140" className="size-full text-foreground" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="320" height="140" fill="currentColor" fillOpacity="0.05" />
      <path d={`M60 ${140 - 60} L160 ${roof} L260 ${140 - 60} V140 H60 Z`} fill="currentColor" fillOpacity="0.1" />
      <rect x="96" y={140 - 46} width="22" height="46" rx="2" fill="currentColor" fillOpacity="0.22" />
      <rect x={140 + seed * 14} y={140 - 56} width="40" height="26" rx="2" fill="currentColor" fillOpacity="0.1" />
      <line x1="0" y1="140" x2="320" y2="140" stroke="currentColor" strokeOpacity="0.15" />
    </svg>
  );
}

export default function Demo() {
  return (
    <section className="w-full max-w-4xl">
      <Reveal preset="blur">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">New this week</p>
        <h3 className="mt-2 font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[34px]">
          Fresh listings in the Portland area
        </h3>
      </Reveal>
      <RevealGroup preset="scale" stagger={0.1} delay={0.15} className="mt-8 grid gap-4 sm:grid-cols-3">
        {listings.map((l, i) => (
          <article key={l.street} className="h-full overflow-hidden rounded-[24px] bg-muted text-foreground">
            <div className="h-32">
              <HouseArt seed={i} />
            </div>
            <div className="p-5">
              <p className="font-display text-lg font-semibold tracking-[-0.02em]">{l.price}</p>
              <p className="mt-0.5 text-sm">{l.street}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{l.city}</p>
              <div className="mt-4 flex gap-4 text-[13px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="size-3.5" aria-hidden />
                  {l.beds} beds
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="size-3.5" aria-hidden />
                  {l.baths} baths
                </span>
              </div>
            </div>
          </article>
        ))}
      </RevealGroup>
    </section>
  );
}
