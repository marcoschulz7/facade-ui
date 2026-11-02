"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export type MagneticButtonVariant = "brand" | "solid" | "outline";

export interface MagneticButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  /** How strongly the shell follows the cursor, 0 to 1. Defaults to 0.35. */
  strength?: number;
  /** Extra multiplier applied to the inner label. Defaults to 1.6. */
  labelStrength?: number;
  /** Distance in px outside the button where the pull starts. Defaults to 40. */
  radius?: number;
  variant?: MagneticButtonVariant;
  /** Pass `href` to render an `<a>` instead of a `<button>`. */
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

const variants: Record<MagneticButtonVariant, string> = {
  brand: "bg-brand text-brand-foreground hover:bg-[color-mix(in_srgb,var(--brand)_88%,black)]",
  solid: "bg-foreground text-background hover:opacity-90",
  outline: "bg-muted text-foreground hover:bg-foreground/10",
};

const spring = { stiffness: 320, damping: 32, mass: 0.6 };

export function MagneticButton({
  strength = 0.35,
  labelStrength = 1.6,
  radius = 40,
  variant = "brand",
  href,
  className,
  children,
  type = "button",
  ...rest
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const zoneRef = React.useRef<HTMLSpanElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const lx = useTransform(sx, (v) => v * labelStrength);
  const ly = useTransform(sy, (v) => v * labelStrength);

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const el = zoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const shellClass = cn(
    "relative z-[1] inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium tracking-[-0.01em] will-change-transform",
    "transition-[background-color,opacity] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );

  const label = (
    <motion.span style={{ x: lx, y: ly }} className="relative inline-flex items-center gap-2 [&_svg]:size-4">
      {children}
    </motion.span>
  );

  return (
    <span
      ref={zoneRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="relative inline-flex"
      style={{ padding: radius, margin: -radius }}
    >
      {href !== undefined ? (
        <motion.a
          href={href}
          style={{ x: sx, y: sy }}
          className={shellClass}
          onBlur={reset}
          {...(rest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd">)}
        >
          {label}
        </motion.a>
      ) : (
        <motion.button
          type={type}
          style={{ x: sx, y: sy }}
          className={shellClass}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          onBlur={reset}
          {...rest}
        >
          {label}
        </motion.button>
      )}
    </span>
  );
}

export default MagneticButton;
