"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Calendar, MapPin, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactAction {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Render as the filled, emphasized action. */
  primary?: boolean;
  /** Open in a new tab (e.g. maps, external booking). */
  external?: boolean;
}

export interface StickyContactBarProps {
  /** Phone number in any format, used for tel: and sms: links. */
  phone?: string;
  /** Street address for the directions link. */
  address?: string;
  /** Booking URL. */
  bookingUrl?: string;
  /** Override the default four actions. */
  actions?: ContactAction[];
  /** Pixels scrolled before the bar first appears. */
  threshold?: number;
  /** Pixels of continued downward scrolling before the bar tucks away. Scrolling up brings it back. */
  hideAfter?: number;
  /** Render absolute inside the nearest positioned parent instead of fixed to the viewport. */
  contained?: boolean;
  /** Element to watch for scroll. Defaults to window. Useful with `contained`. */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  /** Hide on md screens and up. Ignored when `contained`. */
  mobileOnly?: boolean;
  className?: string;
}

function digits(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function buildDefaultActions(phone?: string, address?: string, bookingUrl?: string): ContactAction[] {
  const out: ContactAction[] = [];
  if (phone) {
    out.push({ key: "call", label: "Call", href: `tel:${digits(phone)}`, icon: Phone });
    out.push({ key: "text", label: "Text", href: `sms:${digits(phone)}`, icon: MessageCircle });
  }
  if (address) {
    out.push({
      key: "directions",
      label: "Directions",
      href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
      icon: MapPin,
      external: true,
    });
  }
  if (bookingUrl) {
    out.push({ key: "book", label: "Book", href: bookingUrl, icon: Calendar, primary: true });
  }
  return out;
}

export function StickyContactBar({
  phone = "(512) 555-0142",
  address = "1200 S Congress Ave, Austin, TX 78704",
  bookingUrl = "#book",
  actions,
  threshold = 240,
  hideAfter = 120,
  contained = false,
  scrollContainerRef,
  mobileOnly = true,
  className,
}: StickyContactBarProps) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const items = actions ?? buildDefaultActions(phone, address, bookingUrl);

  React.useEffect(() => {
    const target: HTMLElement | Window = scrollContainerRef?.current ?? window;
    const read = () => (target instanceof Window ? target.scrollY : target.scrollTop);
    let last = read();
    // Distance scrolled down since the bar was last shown.
    let downRun = 0;
    let shown = false;
    let frame = 0;

    const set = (v: boolean) => {
      if (v !== shown) {
        shown = v;
        setVisible(v);
      }
    };

    const update = () => {
      const y = read();
      const delta = y - last;
      last = y;
      if (y < threshold) {
        downRun = 0;
        set(false);
        return;
      }
      if (delta < -4) {
        // Scrolling up: always bring the bar back.
        downRun = 0;
        set(true);
      } else if (delta > 0) {
        if (!shown && downRun === 0 && y - delta < threshold) {
          // Just crossed the threshold: reveal once.
          set(true);
        } else {
          downRun += delta;
          if (downRun > hideAfter) set(false);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // Already past the threshold on mount (e.g. restored scroll position): show right away.
    if (last >= threshold) set(true);
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
    };
  }, [threshold, hideAfter, scrollContainerRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Quick contact"
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className={cn(
            contained ? "absolute" : "fixed",
            "inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2",
            !contained && mobileOnly && "md:hidden",
            className,
          )}
        >
          <ul className="glass mx-auto flex max-w-md items-stretch gap-1 rounded-[22px] p-1.5 text-foreground shadow-float">
            {items.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.key} className={cn(a.primary ? "flex-[1.4]" : "flex-1")}>
                  <a
                    href={a.href}
                    target={a.external ? "_blank" : undefined}
                    rel={a.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      a.primary
                        ? "bg-brand text-brand-foreground hover:bg-brand/90"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground active:bg-muted",
                    )}
                  >
                    <Icon className="size-[18px]" aria-hidden />
                    {a.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default StickyContactBar;
