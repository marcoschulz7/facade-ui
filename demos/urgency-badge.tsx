import { UrgencyBadge } from "./urgency-badge";

export default function Demo() {
  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <UrgencyBadge variant="brand" label="Only 3 homes left" />
        <UrgencyBadge variant="neutral" label="12 tours booked this week" />
        <UrgencyBadge variant="warning" label="Open house Saturday" detail="11 AM to 2 PM" />
      </div>
      <div className="flex flex-wrap items-start justify-center gap-4">
        <UrgencyBadge variant="brand" label="Only 3 homes left in Phase 2" progress={88} detail="Mueller, Austin" />
        <UrgencyBadge variant="neutral" label="Final release now open" progress={64} detail="42 of 66 residences" />
      </div>
    </div>
  );
}
