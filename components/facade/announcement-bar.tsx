"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Announcement {
  text: string;
  /** Optional short lead, rendered bold, e.g. "New". */
  badge?: string;
  href?: string;
  linkLabel?: string;
}

export interface AnnouncementBarProps {
  /** Messages to rotate through. Defaults to a small local-business example set. */
  messages?: Announcement[];
  /** Milliseconds per message. */
  interval?: number;
  dismissible?: boolean;
  /** Called after the bar has collapsed. */
  onDismiss?: () => void;
  /** Visual style. */
  tone?: "brand" | "dark" | "subtle";
  className?: string;
}

const TONES = {
  brand: "bg-brand text-brand-foreground",
  dark: "bg-primary text-primary-foreground",
  subtle: "bg-muted text-foreground",
} as const;

const DEFAULT_MESSAGES: Announcement[] = [
  { badge: "New", text: "Now booking spring appointments across Austin.", href: "#book", linkLabel: "Book now" },
  { badge: "Offer", text: "Free estimates on every project through March 31.", href: "#quote", linkLabel: "Get a quote" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function AnnouncementBar({
  messages = DEFAULT_MESSAGES,
  interval = 4500,
  dismissible = true,
  onDismiss,
  tone = "dark",
  className,
}: AnnouncementBarProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (messages.length < 2 || paused || !open) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), interval);
    return () => window.clearInterval(id);
  }, [messages.length, interval, paused, open]);

  const msg = messages[index % Math.max(1, messages.length)];
  if (!msg) return null;

  return (
    <AnimatePresence initial={false} onExitComplete={onDismiss}>
      {open && (
        <motion.div
          key="bar"
          role="region"
          aria-label="Announcements"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0, transition: { duration: reduce ? 0 : 0.4, ease: EASE } }}
          className={cn("relative w-full overflow-hidden", TONES[tone], className)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-auto flex min-h-11 max-w-[1120px] items-center gap-3 px-4 py-2 sm:px-6"
          >
            {/* Spacer keeps the text centered against the dismiss button */}
            {dismissible && <span className="w-7 shrink-0" aria-hidden />}

            <div className="relative flex min-w-0 flex-1 items-center justify-center" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={index}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-w-0 flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[13px] leading-snug sm:flex-nowrap"
                >
                  {msg.badge && (
                    <span className="hidden shrink-0 font-semibold sm:inline">{msg.badge}</span>
                  )}
                  <span className="min-w-0 text-center opacity-90 sm:truncate">{msg.text}</span>
                  {msg.href && (
                    <a
                      href={msg.href}
                      className="group inline-flex shrink-0 items-center gap-1 rounded font-medium underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
                    >
                      {msg.linkLabel ?? "Learn more"}
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </a>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            {dismissible && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Dismiss announcement"
                className="grid size-7 shrink-0 place-items-center rounded-full opacity-60 transition hover:bg-current/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementBar;
