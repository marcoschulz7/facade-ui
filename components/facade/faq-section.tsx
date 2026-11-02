"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  /** Plain-text answer. Also used verbatim for the JSON-LD output. */
  answer: string;
}

export interface FaqSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: FaqItem[];
  contactHeading?: string;
  contactText?: string;
  phone?: string;
  email?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Index of the item open on first render. Use -1 for none. */
  defaultOpen?: number;
  /** Allow several answers to be open at the same time. */
  multiple?: boolean;
  /** Render a schema.org FAQPage JSON-LD script tag. */
  jsonLd?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "How quickly can you get someone out to my house?",
    answer:
      "Most Denver metro calls get a technician the same day if you reach us before 2 PM. For no-heat or no-cooling emergencies we run a 24/7 on-call crew, and the average arrival time last winter was 74 minutes.",
  },
  {
    question: "Do you charge for estimates?",
    answer:
      "Estimates for new system installs and replacements are always free. Diagnostic visits for repairs are a flat $89, and that fee is waived if you approve the repair while the technician is on site.",
  },
  {
    question: "Which brands do you install and service?",
    answer:
      "We are a Carrier Factory Authorized Dealer and also install Trane, Lennox and Mitsubishi ductless systems. Our technicians service every major brand, including older units that are no longer in production.",
  },
  {
    question: "Is financing available for a new furnace or AC?",
    answer:
      "Yes. We offer 0% APR for 18 months and low monthly payment plans up to 120 months through our lending partners, subject to credit approval. Most customers get a decision in under five minutes.",
  },
  {
    question: "Are your technicians licensed and insured?",
    answer:
      "Every technician is NATE certified, background checked and drug tested. We are fully licensed in the City and County of Denver and carry $2M in general liability insurance.",
  },
  {
    question: "What does your warranty cover?",
    answer:
      "New installations include a 10-year parts and labor warranty and our 1-year no-questions satisfaction guarantee. Repairs are covered for 12 months on both parts and workmanship.",
  },
];

export function FaqSection({
  eyebrow = "FAQ",
  heading = "Questions Denver homeowners ask us",
  description = "Straight answers about pricing, scheduling and warranties. Can't find what you need? Our team is one call away.",
  items = DEFAULT_ITEMS,
  contactHeading = "Still have questions?",
  contactText = "Talk to a real person at our Englewood office, Monday to Saturday.",
  phone = "(303) 555-0148",
  email = "hello@frontrangeair.com",
  ctaLabel = "Schedule a visit",
  ctaHref = "#",
  defaultOpen = 0,
  multiple = false,
  jsonLd = true,
  className,
}: FaqSectionProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = React.useId();
  const [open, setOpen] = React.useState<number[]>(defaultOpen >= 0 ? [defaultOpen] : []);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = (i: number) => {
    setOpen((prev) => {
      const isOpen = prev.includes(i);
      if (multiple) return isOpen ? prev.filter((x) => x !== i) : [...prev, i];
      return isOpen ? [] : [i];
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % items.length;
    else if (e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      buttonRefs.current[next]?.focus();
    }
  };

  const schema = React.useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: { "@type": "Answer", text: it.answer },
        })),
      }).replace(/</g, "\\u003c"),
    [items],
  );

  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className={cn("relative bg-background py-20 sm:py-28", className)}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />}
      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-4 text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[48px]">
            {heading}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:text-lg">{description}</p>

          <div className="mt-10 rounded-[28px] bg-muted p-6 sm:p-7">
            <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">{contactHeading}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{contactText}</p>
            <div className="mt-5 grid gap-1 text-[15px]">
              {phone && (
                <a
                  href={telHref}
                  className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-foreground/[0.06]"
                >
                  <Phone className="size-4 text-muted-foreground" aria-hidden />
                  <span className="tabular-nums">{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-foreground/[0.06]"
                >
                  <Mail className="size-4 text-muted-foreground" aria-hidden />
                  <span className="truncate">{email}</span>
                </a>
              )}
            </div>
            {ctaLabel && (
              <a
                href={ctaHref}
                className="group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
              >
                {ctaLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item, i) => {
            const isOpen = open.includes(i);
            const btnId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <div
                key={item.question}
                className={cn(
                  "rounded-[20px] px-5 transition-colors sm:px-6",
                  isOpen ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <h3>
                  <button
                    ref={(el) => {
                      buttonRefs.current[i] = el;
                    }}
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[20px]"
                  >
                    <span
                      className={cn(
                        "text-[17px] font-medium tracking-[-0.01em] transition-colors",
                        isOpen ? "text-foreground" : "text-foreground/80 group-hover:text-foreground",
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                        isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                        className="flex"
                      >
                        <Plus className="size-4" aria-hidden />
                      </motion.span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
