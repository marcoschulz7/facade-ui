import { PropertyCard } from "./property-card";

export default function Demo() {
  return (
    <div className="mx-auto grid w-full max-w-[720px] gap-5 sm:grid-cols-2">
      <PropertyCard
        status="new"
        price={685000}
        address="2418 Travis Heights Blvd"
        city="Austin, TX 78704"
        beds={3}
        baths={2.5}
        sqft={2140}
        placeholder="modern"
        defaultFavorite
      />
      <PropertyCard
        status="pending"
        price={1249000}
        address="3150 Bluebird Ln"
        city="Denver, CO 80211"
        beds={4}
        baths={3}
        sqft={2865}
        placeholder="bungalow"
      />
    </div>
  );
}
