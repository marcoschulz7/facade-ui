"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  Calendar,
  Car,
  Check,
  Clock,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroLocalBusinessAppointment {
  service: string;
  date: string;
  time: string;
  address: string;
}

export interface HeroLocalBusinessReview {
  name: string;
  neighborhood: string;
  quote: string;
}

export interface HeroLocalBusinessTechnician {
  name: string;
  eta: string;
  vehicle: string;
}

export interface HeroLocalBusinessProps {
  rating?: number;
  reviewCount?: string;
  eyebrowSuffix?: string;
  headlinePrefix?: string;
  rotatingWords?: string[];
  headlineSuffix?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  phone?: { label: string; href: string };
  trustItems?: string[];
  appointment?: HeroLocalBusinessAppointment;
  review?: HeroLocalBusinessReview;
  technician?: HeroLocalBusinessTechnician;
  /** Interval in ms between word swaps. */
  interval?: number;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function WordSwap({ words, interval }: { words: string[]; interval: number }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const longest = React.useMemo(
    () => words.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [words],
  );

  React.useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* Reserve width of the longest word so layout never jumps */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          className="col-start-1 row-start-1"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-px", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < Math.round(value) ? "fill-star text-star" : "fill-foreground/15 text-foreground/15")}
        />
      ))}
    </span>
  );
}

function FloatingCard({
  children,
  className,
  mx,
  my,
  depth,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={cn("absolute", className)}
    >
      <div className="rounded-[20px] bg-background p-4 text-foreground shadow-float dark:bg-secondary dark:ring-1 dark:ring-border">
        {children}
      </div>
    </motion.div>
  );
}

export function HeroLocalBusiness({
  rating = 4.9,
  reviewCount = "1,200+",
  eyebrowSuffix = "reviews on Google",
  headlinePrefix = "Austin's most trusted",
  rotatingWords = ["plumbers", "electricians", "HVAC pros", "handymen"],
  headlineSuffix = "on call today.",
  description = "Upfront flat rate pricing, background checked technicians and a workmanship guarantee that means something. Book online in 60 seconds.",
  primaryCta = { label: "Get a free quote", href: "#quote" },
  phone = { label: "Call (512) 555-0142", href: "tel:+15125550142" },
  trustItems = ["Licensed and insured", "Same day service", "5 year warranty"],
  appointment = {
    service: "Water heater install",
    date: "Thu, Mar 14",
    time: "9:00 to 11:00 AM",
    address: "2104 Travis Heights Blvd",
  },
  review = {
    name: "Jessica Moreno",
    neighborhood: "South Congress",
    quote:
      "Showed up in under two hours, explained everything and cleaned up after. Easily the best service call we've had.",
  },
  technician = {
    name: "Marcus Bell",
    eta: "12 min",
    vehicle: "White Ford Transit",
  },
  interval = 2400,
  className,
}: HeroLocalBusinessProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 120, damping: 30 });
  const my = useSpring(rawY, { stiffness: 120, damping: 30 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className={cn("relative overflow-hidden bg-background text-foreground", className)}>
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Copy */}
        <div className="max-w-[640px]">
          <motion.a
            {...fadeUp(0)}
            href="#reviews"
            className="group inline-flex items-center gap-2 rounded-full text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Stars value={rating} />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            <span>
              from {reviewCount} {eyebrowSuffix}
            </span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </motion.a>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 font-display text-[44px] font-semibold leading-[1] tracking-[-0.045em] text-balance sm:text-[64px] lg:text-[76px]"
          >
            {headlinePrefix} <WordSwap words={rotatingWords} interval={interval} />
            <br className="hidden sm:block" /> {headlineSuffix}
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 max-w-[560px] text-[19px] leading-[1.4] text-muted-foreground text-pretty sm:text-xl">
            {description}
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={primaryCta.href}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-foreground transition-colors hover:bg-[color-mix(in_srgb,var(--brand)_88%,black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryCta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href={phone.href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-muted px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Phone className="size-4" aria-hidden />
              {phone.label}
            </a>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-foreground" strokeWidth={2.25} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Card composition */}
        <div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mx-auto h-[460px] w-full max-w-[520px] sm:h-[500px]"
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-x-6 inset-y-8 rounded-[28px] bg-muted"
          />

          {/* Appointment card */}
          <FloatingCard mx={mx} my={my} depth={8} delay={0.35} className="left-0 top-0 w-[78%] max-w-[300px] sm:top-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Upcoming visit</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">Confirmed</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Calendar className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">{appointment.service}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden />
                  {appointment.date}, {appointment.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{appointment.address}</span>
                </p>
              </div>
            </div>
          </FloatingCard>

          {/* Review card */}
          <FloatingCard mx={mx} my={my} depth={-14} delay={0.5} className="right-0 top-[34%] w-[82%] max-w-[320px]">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                {initials(review.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{review.name}</p>
                <p className="truncate text-xs text-muted-foreground">{review.neighborhood}, verified customer</p>
              </div>
              <Stars value={5} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">&ldquo;{review.quote}&rdquo;</p>
          </FloatingCard>

          {/* Technician card */}
          <FloatingCard mx={mx} my={my} depth={18} delay={0.65} className="bottom-0 left-[4%] w-[80%] max-w-[300px] sm:bottom-2">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                {initials(technician.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Technician on the way</p>
                <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">{technician.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold leading-none tracking-[-0.02em] tabular-nums">{technician.eta}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">ETA</p>
              </div>
            </div>
            <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={{ width: "15%" }}
                animate={{ width: "72%" }}
                transition={{ duration: 2.4, delay: 1, ease: EASE }}
              />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Car className="size-3.5" aria-hidden />
              {technician.vehicle}
            </p>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

export default HeroLocalBusiness;
