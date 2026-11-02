import { Bath, BedDouble, Calendar, DollarSign, Ruler, Trees } from "lucide-react";
import { KeyFacts } from "./key-facts";

export default function Demo() {
  return (
    <div className="w-full max-w-[880px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Just listed</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-foreground">4417 Wildflower Ridge</p>
          <p className="text-sm text-muted-foreground">Boulder, CO 80301, single family home</p>
        </div>
        <p className="text-sm text-muted-foreground">MLS 1048327</p>
      </div>
      <KeyFacts
        facts={[
          { label: "List price", value: 1_485_000, icon: DollarSign, prefix: "$", compact: true, decimals: 2 },
          { label: "Bedrooms", value: 4, icon: BedDouble },
          { label: "Bathrooms", value: 3.5, icon: Bath, decimals: 1 },
          { label: "Interior", value: 3_264, icon: Ruler, suffix: " sqft" },
          { label: "Lot size", value: 0.42, icon: Trees, suffix: " ac", decimals: 2 },
          { label: "Year built", value: 2021, icon: Calendar, noGrouping: true },
        ]}
      />
    </div>
  );
}
