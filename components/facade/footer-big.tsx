"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterBigLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterBigColumn {
  title: string;
  links: FooterBigLink[];
}

export type FooterBigSocialNetwork = "facebook" | "instagram" | "linkedin" | "youtube" | "x" | "yelp";

export interface FooterBigSocial {
  network: FooterBigSocialNetwork;
  href: string;
}

export interface FooterBigHours {
  days: string;
  hours: string;
}

export interface FooterBigProps {
  businessName?: string;
  tagline?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  /** Called with the email on submit. Return a promise to show a loading state. Without a handler the form only simulates success, for previews. */
  onSubscribe?: (email: string) => void | Promise<void>;
  columns?: FooterBigColumn[];
  address?: { street: string; city: string; mapHref?: string };
  phone?: { label: string; href: string };
  email?: string;
  hours?: FooterBigHours[];
  socials?: FooterBigSocial[];
  /** Oversized faded wordmark. Defaults to businessName. */
  wordmark?: string;
  legal?: FooterBigLink[];
  license?: string;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function SocialIcon({ network }: { network: FooterBigSocialNetwork }) {
  const common = { className: "size-4", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (network) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.45-1.43h1.55V4.63A20.6 20.6 0 0 0 14.24 4.5c-2.24 0-3.77 1.37-3.77 3.88v2.18H7.94v2.94h2.53V21h3.03Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M6.94 8.75H3.88V20h3.06V8.75ZM5.41 4a1.78 1.78 0 1 0 0 3.56 1.78 1.78 0 0 0 0-3.56ZM20.12 13.6c0-3.03-1.62-4.44-3.78-4.44a3.27 3.27 0 0 0-2.96 1.63V8.75h-3.06c.04.86 0 11.25 0 11.25h3.06v-6.28c0-.34.02-.67.12-.91.27-.67.88-1.37 1.92-1.37 1.35 0 1.89 1.03 1.89 2.54V20h3.06l-.25-6.4Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
        </svg>
      );
    case "yelp":
      return (
        <svg {...common}>
          <path d="M12.3 2.2c-.5-.3-3.9.6-4.6 1.3-.3.3-.4.6-.3.9l3.9 6.4c.6.9 1.9.6 1.9-.5L13 3c0-.4-.3-.7-.7-.8Zm-1.9 11.5-6 1.7c-.5.2-.8.6-.7 1.1.1 1 1.2 3.2 1.9 3.6.3.2.7.2 1 0l4.6-4.7c.7-.7.1-2-.8-1.7Zm3.2 1.6c-.6-.8-1.9-.4-1.8.6l.4 6.3c0 .5.4.8.9.8 1 0 3.3-.8 3.9-1.4.3-.3.3-.7.1-1l-3.5-5.3Zm6.5-4.5c-.4-.9-2.4-3.2-3.2-3.5-.4-.1-.7 0-1 .3l-3.4 5.4c-.5.9.4 1.9 1.3 1.5l5.8-2.4c.4-.2.6-.7.5-1.3Zm-.2 5.3-5.9-1.6c-1-.3-1.7.9-1 1.6l4.2 4.5c.3.3.8.4 1.1.1.8-.6 2.2-2.6 2.3-3.6.1-.5-.2-.9-.7-1Z" />
        </svg>
      );
  }
}

const SOCIAL_LABELS: Record<FooterBigSocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
  yelp: "Yelp",
};

type Status = "idle" | "loading" | "success" | "error";

function Newsletter({
  title,
  description,
  onSubscribe,
}: {
  title: string;
  description: string;
  onSubscribe?: (email: string) => void | Promise<void>;
}) {
  const id = React.useId();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md">
      <h3 className="font-display text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>

      <div className="relative mt-6 h-14">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-0 flex items-center gap-3 rounded-full bg-background px-2 pr-5 dark:bg-foreground/[0.08]"
            >
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 360, damping: 32, delay: 0.1 }}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success text-background"
              >
                <Check className="size-5" strokeWidth={2.5} />
              </motion.span>
              <span className="min-w-0 text-sm">
                <span className="font-semibold text-foreground">You&apos;re on the list.</span>{" "}
                <span className="text-muted-foreground">Check {email} to confirm.</span>
              </span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              noValidate
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "absolute inset-0 flex items-center rounded-full bg-background p-1.5 pl-5 transition-shadow focus-within:ring-2 focus-within:ring-ring dark:bg-foreground/[0.08]",
                status === "error" && "ring-2 ring-destructive/60",
              )}
            >
              <label htmlFor={`${id}-email`} className="sr-only">
                Email address
              </label>
              <Mail className="mr-3 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                id={`${id}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? `${id}-err` : undefined}
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex h-full shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-5"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-1" aria-label="Subscribing">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-brand-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <p
        id={`${id}-err`}
        role={status === "error" ? "alert" : undefined}
        className={cn("mt-2 h-4 pl-5 text-xs text-destructive", status !== "error" && "invisible")}
      >
        {error || " "}
      </p>
    </div>
  );
}

export function FooterBig({
  businessName = "Ridgeline Home Services",
  tagline = "Plumbing, heating and electrical for Austin homeowners since 2009. Family owned, locally loved.",
  newsletterTitle = "Seasonal tips, zero spam.",
  newsletterDescription = "One email a month with maintenance checklists and members-only discounts. Unsubscribe anytime.",
  onSubscribe,
  columns = [
    {
      title: "Services",
      links: [
        { label: "Plumbing repair", href: "#" },
        { label: "Water heaters", href: "#" },
        { label: "AC & heating", href: "#" },
        { label: "Electrical", href: "#" },
        { label: "Drain cleaning", href: "#" },
      ],
    },
    {
      title: "Service areas",
      links: [
        { label: "Austin", href: "#" },
        { label: "Round Rock", href: "#" },
        { label: "Cedar Park", href: "#" },
        { label: "Pflugerville", href: "#" },
        { label: "Georgetown", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "#" },
        { label: "Reviews", href: "#" },
        { label: "Careers", href: "#", badge: "Hiring" },
        { label: "Financing", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Book online", href: "#" },
        { label: "Membership plan", href: "#" },
        { label: "Warranty", href: "#" },
        { label: "Pay an invoice", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  address = {
    street: "4210 Burnet Rd, Suite 120",
    city: "Austin, TX 78756",
    mapHref: "https://maps.google.com/?q=4210+Burnet+Rd+Austin+TX",
  },
  phone = { label: "(512) 555-0142", href: "tel:+15125550142" },
  email = "hello@ridgelinehome.com",
  hours = [
    { days: "Mon to Fri", hours: "7:00 AM to 7:00 PM" },
    { days: "Saturday", hours: "8:00 AM to 4:00 PM" },
    { days: "Emergency", hours: "24/7" },
  ],
  socials = [
    { network: "facebook", href: "#" },
    { network: "instagram", href: "#" },
    { network: "yelp", href: "#" },
    { network: "youtube", href: "#" },
    { network: "linkedin", href: "#" },
  ],
  wordmark,
  legal = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
  license = "TX License M-41872, TECL 33019",
  className,
}: FooterBigProps) {
  const reduce = useReducedMotion();
  const markRef = React.useRef<HTMLDivElement>(null);
  const markInView = useInView(markRef, { once: true, margin: "-40px 0px" });
  const year = new Date().getFullYear();
  const mark = wordmark ?? businessName.split(" ")[0];

  return (
    <footer className={cn("relative overflow-hidden bg-muted text-foreground", className)}>
      <div className="mx-auto max-w-[1120px] px-6 pt-16 sm:pt-20">
        {/* Top: newsletter + NAP */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Newsletter
            title={newsletterTitle}
            description={newsletterDescription}
            onSubscribe={onSubscribe}
          />

          <div className="grid gap-8 sm:grid-cols-2">
            <address className="not-italic" itemScope itemType="https://schema.org/LocalBusiness">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Visit or call</p>
              <p itemProp="name" className="mt-3 font-semibold">{businessName}</p>
              <a
                href={address.mapHref ?? "#"}
                target={address.mapHref ? "_blank" : undefined}
                rel={address.mapHref ? "noreferrer" : undefined}
                className="group mt-2 flex items-start gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span itemProp="address">
                  {address.street}
                  <br />
                  {address.city}
                </span>
              </a>
              <a
                href={phone.href}
                itemProp="telephone"
                className="mt-3 flex items-center gap-2 rounded-md text-lg font-semibold tabular-nums tracking-[-0.01em] transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Phone className="size-4 text-muted-foreground" />
                {phone.label}
              </a>
              <a
                href={`mailto:${email}`}
                itemProp="email"
                className="mt-1.5 flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4 text-muted-foreground" />
                {email}
              </a>
            </address>

            <div>
              <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                <Clock className="size-3.5" /> Hours
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                {hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium tabular-nums">{h.hours}</dd>
                  </div>
                ))}
              </dl>
              {socials.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.network}>
                      <a
                        href={s.href}
                        aria-label={SOCIAL_LABELS[s.network]}
                        className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-foreground/[0.08]"
                      >
                        <SocialIcon network={s.network} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <p className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-xs font-semibold text-background">
                {businessName.charAt(0)}
              </span>
              {businessName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground/40 transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      {l.badge && (
                        <span className="rounded-full bg-accent px-1.5 py-px text-[10px] font-semibold text-accent-foreground">
                          {l.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-foreground/[0.08] py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {businessName}. All rights reserved.
            {license && <span className="ml-1 hidden sm:inline">{license}.</span>}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Back to top <ArrowUpRight className="size-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Oversized faded wordmark */}
      <div ref={markRef} aria-hidden className="pointer-events-none relative -mt-2 select-none overflow-hidden">
        <motion.p
          initial={reduce ? { opacity: 1 } : { y: "35%", opacity: 0 }}
          animate={markInView ? { y: "18%", opacity: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE }}
          className="whitespace-nowrap text-center font-display font-semibold leading-[0.8] tracking-[-0.05em] text-foreground/[0.06]"
          style={{
            fontSize: `clamp(4rem, ${Math.max(8, 150 / Math.max(mark.length, 1))}vw, 22rem)`,
          }}
        >
          {mark}
        </motion.p>
      </div>
    </footer>
  );
}

export default FooterBig;
