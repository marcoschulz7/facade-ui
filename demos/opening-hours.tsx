"use client";

import { OpeningHours, type WeeklyHours } from "./opening-hours";

const hours: WeeklyHours = {
  mon: null,
  tue: [{ open: "11:30", close: "14:30" }, { open: "17:00", close: "22:00" }],
  wed: [{ open: "11:30", close: "14:30" }, { open: "17:00", close: "22:00" }],
  thu: [{ open: "11:30", close: "14:30" }, { open: "17:00", close: "22:00" }],
  fri: [{ open: "11:30", close: "14:30" }, { open: "17:00", close: "23:30" }],
  sat: [{ open: "10:00", close: "23:30" }],
  sun: [{ open: "10:00", close: "15:00" }],
};

export default function Demo() {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <OpeningHours
        title="Alder & Vine"
        hours={hours}
        timeZone="America/Los_Angeles"
        note="Pearl District, Portland. Brunch served Saturday and Sunday until 2 PM. Kitchen closes 30 minutes before close. Closed Thanksgiving Day."
      />
    </div>
  );
}
