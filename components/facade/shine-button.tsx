import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShineButtonVariant = "brand" | "solid" | "outline";
export type ShineButtonSize = "sm" | "md" | "lg";

export interface ShineButtonBaseProps {
  /** Visual style. Defaults to "brand". */
  variant?: ShineButtonVariant;
  /** Height and padding scale. Defaults to "md". */
  size?: ShineButtonSize;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Show a trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ShineButtonAsButton = ShineButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ShineButtonBaseProps> & {
    href?: undefined;
  };

type ShineButtonAsAnchor = ShineButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ShineButtonBaseProps> & {
    href: string;
  };

/** Pass `href` to render an `<a>`, otherwise a `<button>` is rendered. */
export type ShineButtonProps = ShineButtonAsButton | ShineButtonAsAnchor;

const variantClasses: Record<ShineButtonVariant, string> = {
  brand: "bg-brand text-brand-foreground hover:bg-[color-mix(in_srgb,var(--brand)_88%,black)]",
  solid: "bg-foreground text-background hover:opacity-90",
  outline: "bg-muted text-foreground hover:bg-foreground/10",
};

const shineClasses: Record<ShineButtonVariant, string> = {
  brand: "via-brand-foreground/30",
  solid: "via-background/20",
  outline: "via-foreground/[0.07]",
};

const sizeClasses: Record<ShineButtonSize, string> = {
  sm: "h-9 gap-1.5 px-4 text-[13px] [&_svg]:size-3.5",
  md: "h-11 gap-2 px-5 text-sm [&_svg]:size-4",
  lg: "h-12 gap-2.5 px-6 text-[15px] [&_svg]:size-[18px]",
};

export function ShineButton(props: ShineButtonProps) {
  const { variant = "brand", size = "md", icon, arrow = false, className, children } = props;

  const classes = cn(
    "group relative isolate inline-flex shrink-0 select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-medium tracking-[-0.01em]",
    "transition-[background-color,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
        <span
          className={cn(
            "absolute inset-y-0 -left-1/2 w-1/2 -skew-x-[20deg] bg-linear-to-r from-transparent to-transparent opacity-0",
            "transition-none group-hover:translate-x-[320%] group-hover:opacity-100 group-hover:transition-[transform,opacity] group-hover:duration-[900ms] group-hover:ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-focus-visible:translate-x-[320%] group-focus-visible:opacity-100 group-focus-visible:transition-[transform,opacity] group-focus-visible:duration-[900ms]",
            shineClasses[variant],
          )}
        />
      </span>
      {icon ? <span className="inline-flex shrink-0 items-center">{icon}</span> : null}
      {children ? <span className="relative">{children}</span> : null}
      {arrow ? (
        <ArrowRight
          aria-hidden
          className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const {
      variant: _variant,
      size: _size,
      icon: _icon,
      arrow: _arrow,
      className: _className,
      children: _children,
      ...anchorProps
    } = props;
    return (
      <a {...anchorProps} className={classes}>
        {inner}
      </a>
    );
  }

  const {
    variant: _variant,
    size: _size,
    icon: _icon,
    arrow: _arrow,
    className: _className,
    children: _children,
    href: _href,
    type = "button",
    ...buttonProps
  } = props;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {inner}
    </button>
  );
}

export default ShineButton;
