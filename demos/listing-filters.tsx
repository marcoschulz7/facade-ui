"use client";

import { ListingFilters, type ListingFiltersValue } from "./listing-filters";

// Deterministic mock count so the demo feels live without a backend.
function estimateResults(v: ListingFiltersValue) {
  let n = 1284;
  if (v.query.trim()) n *= 0.18;
  if (v.types.length) n *= Math.min(1, 0.22 * v.types.length + 0.15);
  n *= [1, 0.92, 0.74, 0.46, 0.21][v.beds] ?? 1;
  n *= [1, 0.95, 0.62, 0.28][v.baths] ?? 1;
  const span = (v.price[1] - v.price[0]) / 2_000_000;
  n *= Math.max(0.04, span);
  return Math.max(0, Math.round(n));
}

export default function Demo() {
  return (
    <div className="w-full max-w-[560px]">
      <ListingFilters
        defaultValue={{ query: "Austin, TX", types: ["House", "Townhome"], beds: 3, price: [450_000, 1_250_000] }}
        resultCount={estimateResults}
      />
    </div>
  );
}
