import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Seconds for one full loop. Lower is faster. Defaults to 30. */
  speed?: number;
  /** Scroll direction. In vertical mode "left" scrolls up and "right" scrolls down. Defaults to "left". */
  direction?: "left" | "right";
  /** Pause the animation while hovered. Defaults to true. */
  pauseOnHover?: boolean;
  /** Fade the edges with a mask-image. Defaults to true. */
  fade?: boolean;
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean;
  /** Gap between items as a CSS length. Defaults to "3rem". */
  gap?: string;
  /**
   * How many times children are repeated inside each copy of the track.
   * Raise it when your content is narrower than the container. Defaults to 1.
   */
  repeat?: number;
  /** Class applied to each copy of the content. */
  trackClassName?: string;
}

const VERTICAL_KEYFRAMES =
  "@keyframes facade-marquee-y{from{transform:translateY(0)}to{transform:translateY(calc(-50% - var(--marquee-gap, 1rem) / 2))}}";

/**
 * Infinite marquee. Children are rendered in two identical copies inside one
 * track, which `animate-marquee` (globals.css) shifts by exactly one copy.
 */
export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  vertical = false,
  gap = "3rem",
  repeat = 1,
  className,
  trackClassName,
  style,
  ...rest
}: MarqueeProps) {
  const mask = vertical
    ? "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)"
    : "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

  const rootStyle = {
    "--marquee-duration": `${speed}s`,
    "--marquee-gap": gap,
    ...(fade ? { maskImage: mask, WebkitMaskImage: mask } : {}),
    ...style,
  } as React.CSSProperties;

  const trackStyle: React.CSSProperties = {
    gap: "var(--marquee-gap)",
    animationDirection: direction === "right" ? "reverse" : "normal",
    ...(vertical ? { animation: "facade-marquee-y var(--marquee-duration, 30s) linear infinite" } : {}),
  };

  const copy = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className={cn("flex shrink-0 items-center", vertical ? "flex-col" : "flex-row", trackClassName)}
      style={{ gap: "var(--marquee-gap)" }}
    >
      {Array.from({ length: Math.max(1, repeat) }, (_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      {...rest}
      style={rootStyle}
      className={cn("group/marquee relative flex overflow-hidden", vertical ? "flex-col" : "flex-row", className)}
    >
      {vertical ? <style>{VERTICAL_KEYFRAMES}</style> : null}
      <div
        style={trackStyle}
        className={cn(
          "flex shrink-0",
          vertical ? "h-max flex-col" : "w-max flex-row animate-marquee",
          "motion-reduce:[animation-play-state:paused]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]",
        )}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

export default Marquee;
