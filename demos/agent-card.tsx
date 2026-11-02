import { AgentCard } from "./agent-card";

export default function Demo() {
  return (
    <div className="grid w-full max-w-[780px] grid-cols-1 justify-items-center gap-4 sm:grid-cols-2">
      <AgentCard
        name="Danielle Ortiz"
        title="Realtor"
        brokerage="Summit Peak Realty"
        license="CO FA.100082417"
        rating={4.9}
        reviewCount={128}
        languages={["English", "Spanish"]}
        phone="(303) 555-0148"
        email="danielle@summitpeakrealty.com"
        stats={[
          { label: "Homes sold", value: "214" },
          { label: "Avg. days", value: "11" },
          { label: "Sale to list", value: "101%" },
        ]}
      />
      <AgentCard
        name="Marcus Bell"
        title="Broker associate"
        brokerage="Coastline Partners"
        license="FL BK3318842"
        rating={4.8}
        reviewCount={86}
        languages={["English", "Portuguese"]}
        phone="(305) 555-0192"
        email="marcus@coastlinepartners.com"
        available={false}
        stats={[
          { label: "Homes sold", value: "167" },
          { label: "Volume", value: "$142M" },
          { label: "Years", value: "12" },
        ]}
      />
    </div>
  );
}
