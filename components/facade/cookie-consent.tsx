"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentAction = "accept-all" | "reject" | "save";

export interface CookieConsentProps {
  /** Called whenever the visitor makes a choice. */
  onChange?: (consent: ConsentState, action: ConsentAction) => void;
  /** Show the card. Uncontrolled default: shown after `delay` unless a stored choice exists. */
  open?: boolean;
  /** Delay before the card appears, in ms. */
  delay?: number;
  /** localStorage key to remember the choice. Set to null to disable persistence. */
  storageKey?: string | null;
  title?: string;
  description?: string;
  policyHref?: string;
  /** Position absolute inside the nearest positioned parent instead of fixed to the viewport. */
  contained?: boolean;
  className?: string;
}

const CATEGORIES = [
  {
    key: "necessary",
    label: "Strictly necessary",
    description: "Required for booking, forms and security. Always on.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Helps us understand which pages are useful so we can improve them.",
    locked: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Lets us measure ads and show you relevant offers on other sites.",
    locked: false,
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function Toggle({
  checked,
  onChange,
  disabled,
  labelledBy,
  describedBy,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  labelledBy: string;
  describedBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        checked ? "bg-brand" : "bg-foreground/15",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <motion.span
        className="size-[18px] rounded-full bg-brand-foreground"
        animate={{ x: checked ? 14 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
      />
    </button>
  );
}

export function CookieConsent({
  onChange,
  open: openProp,
  delay = 600,
  storageKey = "facade-cookie-consent",
  title = "We value your privacy",
  description = "We use cookies to run this site, understand traffic and personalize offers. You can change your choice anytime.",
  policyHref = "#privacy",
  contained = false,
  className,
}: CookieConsentProps) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [prefs, setPrefs] = React.useState({ analytics: false, marketing: false });
  const uid = React.useId();
  const open = openProp ?? shown;

  React.useEffect(() => {
    if (openProp !== undefined) return;
    let stored = false;
    if (storageKey) {
      try {
        stored = window.localStorage.getItem(storageKey) !== null;
      } catch {
        stored = false;
      }
    }
    if (stored) return;
    const id = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(id);
  }, [openProp, delay, storageKey]);

  const decide = (consent: ConsentState, action: ConsentAction) => {
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(consent));
      } catch {
        /* storage unavailable, keep going */
      }
    }
    onChange?.(consent, action);
    setShown(false);
  };

  const acceptAll = () => decide({ necessary: true, analytics: true, marketing: true }, "accept-all");
  const reject = () => decide({ necessary: true, analytics: false, marketing: false }, "reject");
  const save = () => decide({ necessary: true, ...prefs }, "save");

  const btnBase =
    "h-10 rounded-full text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";
  const btnSecondary = cn(btnBase, "bg-muted text-foreground hover:bg-foreground/10");
  const btnPrimary = cn(btnBase, "bg-foreground text-background hover:opacity-90");

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-desc`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: EASE }}
          className={cn(
            contained ? "absolute" : "fixed",
            "bottom-4 left-4 right-4 z-50 sm:right-auto sm:w-[380px]",
            "rounded-[24px] bg-card p-6 text-card-foreground shadow-float dark:bg-secondary dark:ring-1 dark:ring-border",
            className,
          )}
        >
          <h2 id={`${uid}-title`} className="text-[15px] font-semibold tracking-[-0.01em]">
            {title}
          </h2>
          <p id={`${uid}-desc`} className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {description}{" "}
            <a
              href={policyHref}
              className="rounded font-medium text-brand hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Privacy policy
            </a>
          </p>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`${uid}-prefs`}
            className="mt-4 flex w-full items-center justify-between rounded-lg py-1 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Customize preferences
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }}>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id={`${uid}-prefs`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <ul className="mt-2 grid gap-1.5">
                  {CATEGORIES.map((c) => {
                    const checked = c.key === "necessary" ? true : prefs[c.key];
                    return (
                      <li key={c.key} className="flex items-start justify-between gap-4 rounded-2xl bg-muted p-3.5">
                        <div className="min-w-0">
                          <p id={`${uid}-${c.key}-l`} className="text-[13px] font-medium">
                            {c.label}
                          </p>
                          <p id={`${uid}-${c.key}-d`} className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {c.description}
                          </p>
                        </div>
                        <Toggle
                          checked={checked}
                          disabled={c.locked}
                          labelledBy={`${uid}-${c.key}-l`}
                          describedBy={`${uid}-${c.key}-d`}
                          onChange={
                            c.key === "necessary"
                              ? undefined
                              : (v) => setPrefs((p) => ({ ...p, [c.key]: v }))
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {expanded ? (
              <>
                <button type="button" onClick={save} className={btnSecondary}>
                  Save choices
                </button>
                <button type="button" onClick={acceptAll} className={btnPrimary}>
                  Accept all
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={reject} className={btnSecondary}>
                  Reject
                </button>
                <button type="button" onClick={acceptAll} className={btnPrimary}>
                  Accept all
                </button>
              </>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default CookieConsent;
