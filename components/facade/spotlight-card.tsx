"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight radius in px. Defaults to 360. */
  size?: number;
  /** Border glow radius in px. Defaults to 220. */
  borderSize?: number;
  /** Spotlight strength as a percentage of brand color. Defaults to 10. */
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function SpotlightCard({
  size = 360,
  borderSize = 220,
  intensity = 10,
  className,
  children,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: SpotlightCardProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const [active, setActive] = React.useState(false);

  const spot = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, color-mix(in oklch, var(--brand) ${intensity}%, transparent), transparent 70%)`;
  const ring = useMotionTemplate`radial-gradient(${borderSize}px circle at ${x}px ${y}px, color-mix(in oklch, var(--brand) 55%, transparent), transparent 65%)`;

  return (
    <div
      {...rest}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        onPointerMove?.(e);
      }}
      onPointerEnter={(e) => {
        setActive(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setActive(false);
        onPointerLeave?.(e);
      }}
      className={cn(
        "group/spotlight relative isolate overflow-hidden rounded-[28px] bg-muted text-foreground",
        className,
      )}
    >
      {!reduce ? (
        <>
          {/* Border glow: a masked layer that only paints the 1px border ring. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] p-px transition-opacity duration-500"
            style={{
              background: ring,
              opacity: active ? 1 : 0,
              WebkitMask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
            style={{ background: spot, opacity: active ? 1 : 0 }}
          />
        </>
      ) : null}
      {children}
    </div>
  );
}

export default SpotlightCard;
