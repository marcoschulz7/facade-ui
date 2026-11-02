"use client";

import { LocationCard } from "./location-card";

export default function Demo() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-5 sm:grid-cols-2">
      <LocationCard
        label="Pearl District"
        name="Stumptown Physical Therapy"
        address="1120 NW Couch St, Portland, OR 97209"
        phone="(503) 555-0164"
        hours="Mon to Fri, 7 AM to 7 PM"
        note="Free validated parking in the Couch Street garage."
        variant={0}
      />
      <LocationCard
        label="Sellwood"
        name="Stumptown Physical Therapy"
        address="7905 SE 13th Ave, Portland, OR 97202"
        phone="(503) 555-0178"
        hours="Mon to Sat, 8 AM to 5 PM"
        note="Street parking on SE Tenino St."
        variant={1}
      />
    </div>
  );
}
