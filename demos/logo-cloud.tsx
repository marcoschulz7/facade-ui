import { LogoCloud } from "./logo-cloud";

export default function Demo() {
  return (
    <div>
      <LogoCloud />
      <LogoCloud
        variant="marquee"
        eyebrow="Featured partners"
        title="Austin brands that grow with us"
        description="Hover a row to pause it."
        className="pt-0 sm:pt-0"
      />
    </div>
  );
}
