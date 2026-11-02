"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeamSocials {
  linkedin?: string;
  x?: string;
  instagram?: string;
  email?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  location?: string;
  socials?: TeamSocials;
  /** Optional photo URL. Falls back to a gradient initials avatar. */
  imageSrc?: string;
}

export interface TeamGridProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  members?: TeamMember[];
  showHiringCard?: boolean;
  hiringHeading?: string;
  hiringText?: string;
  hiringCtaLabel?: string;
  hiringHref?: string;
  openRoles?: number;
  className?: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    name: "Jessica Moreno",
    role: "Founder and Managing Broker",
    location: "Miami, FL",
    bio: "Fifteen years selling waterfront homes in Coconut Grove and Coral Gables. Over $480M in closed sales and still answers her own phone.",
    socials: { linkedin: "#", instagram: "#", email: "jessica@baysiderealty.com" },
  },
  {
    name: "Andre Thompson",
    role: "Senior Listing Agent",
    location: "Coral Gables, FL",
    bio: "Former architect who reads floor plans like novels. Andre leads our luxury listings and staging strategy.",
    socials: { linkedin: "#", x: "#", email: "andre@baysiderealty.com" },
  },
  {
    name: "Mei Chen",
    role: "Buyer Specialist",
    location: "Brickell, FL",
    bio: "Helps first-time buyers and relocating families find the right condo, from pre-approval to the keys. Fluent in Mandarin.",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Carlos Ruiz",
    role: "Investment Advisor",
    location: "Wynwood, FL",
    bio: "Runs the numbers on multifamily and short-term rentals. Carlos has helped 60+ clients build Miami rental portfolios.",
    socials: { linkedin: "#", x: "#", email: "carlos@baysiderealty.com" },
  },
  {
    name: "Hannah Brooks",
    role: "Marketing Director",
    location: "Miami Beach, FL",
    bio: "Produces the photography, video and campaigns that sell our listings 19 days faster than the county average.",
    socials: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Samuel Okoye",
    role: "Transaction Coordinator",
    location: "Miami, FL",
    bio: "Keeps every deadline, inspection and closing on track so our clients never have to chase paperwork.",
    socials: { linkedin: "#", email: "samuel@baysiderealty.com" },
  },
  {
    name: "Olivia Park",
    role: "Leasing Agent",
    location: "Edgewater, FL",
    bio: "Matches renters with the right building in under a week on average. Knows every concierge on Biscayne by name.",
    socials: { instagram: "#", email: "olivia@baysiderealty.com" },
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function hue(name: string) {
  let h = 11;
  for (let i = 0; i < name.length; i++) h = (h * 29 + name.charCodeAt(i)) % 360;
  return h;
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SocialLinks({ member }: { member: TeamMember }) {
  const s = member.socials;
  if (!s) return null;
  const items: { key: string; href: string; label: string; icon: React.ReactNode }[] = [];
  if (s.linkedin) items.push({ key: "li", href: s.linkedin, label: `${member.name} on LinkedIn`, icon: <LinkedinIcon /> });
  if (s.x) items.push({ key: "x", href: s.x, label: `${member.name} on X`, icon: <XIcon /> });
  if (s.instagram) items.push({ key: "ig", href: s.instagram, label: `${member.name} on Instagram`, icon: <InstagramIcon /> });
  if (s.email) items.push({ key: "em", href: `mailto:${s.email}`, label: `Email ${member.name}`, icon: <Mail className="size-4" aria-hidden /> });
  return (
    <div className="flex gap-1">
      {items.map((it) => (
        <a
          key={it.key}
          href={it.href}
          aria-label={it.label}
          className="flex size-7 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-foreground/[0.08]"
        >
          {it.icon}
        </a>
      ))}
    </div>
  );
}

function MemberCard({ member, index, reduce }: { member: TeamMember; index: number; reduce: boolean }) {
  const h = hue(member.name);
  const [open, setOpen] = React.useState(false);
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-muted"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className="relative aspect-[4/4] overflow-hidden">
        {member.imageSrc ? (
          <img src={member.imageSrc} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <div
            className="relative flex size-full items-center justify-center"
            style={{
              backgroundImage: `radial-gradient(120% 90% at 20% 0%, oklch(0.93 0.02 ${h}), transparent 60%), radial-gradient(100% 90% at 100% 100%, oklch(0.78 0.035 ${(h + 50) % 360}), transparent 65%), linear-gradient(160deg, oklch(0.88 0.025 ${(h + 20) % 360}), oklch(0.74 0.035 ${(h + 70) % 360}))`,
            }}
          >
            <svg viewBox="0 0 200 210" className="absolute inset-x-0 bottom-0 h-[78%] w-full" aria-hidden>
              <circle cx="100" cy="78" r="38" fill="oklch(1 0 0 / 0.45)" />
              <path d="M28 210 C 32 150, 66 126, 100 126 C 134 126, 168 150, 172 210 Z" fill="oklch(1 0 0 / 0.45)" />
            </svg>
            <span className="relative text-[44px] font-semibold tracking-[-0.03em]" style={{ color: "oklch(0.3 0.02 260)" }}>
              {initials(member.name)}
            </span>
          </div>
        )}

        <motion.div
          initial={false}
          animate={open ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 36 }}
          className="absolute inset-x-0 bottom-0 hidden bg-background/90 p-4 backdrop-blur-md sm:block dark:bg-muted/90"
        >
          <p className="text-[13px] leading-relaxed text-foreground">{member.bio}</p>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-foreground">{member.name}</h3>
          <p className="truncate text-[14px] text-muted-foreground">{member.role}</p>
        </div>
        {/* Bio is always visible on touch screens */}
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:hidden">{member.bio}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {member.location ? <span className="truncate text-[13px] text-muted-foreground">{member.location}</span> : <span />}
          <SocialLinks member={member} />
        </div>
      </div>
    </motion.li>
  );
}

export function TeamGrid({
  eyebrow = "Our team",
  heading = "Local experts who know every street",
  description = "Bayside Realty is a boutique brokerage of agents who live in the neighborhoods they sell.",
  members = DEFAULT_MEMBERS,
  showHiringCard = true,
  hiringHeading = "We're hiring",
  hiringText = "Licensed in Florida and hungry to build something? We offer mentorship, real leads and an 80/20 split.",
  hiringCtaLabel = "See open roles",
  hiringHref = "#",
  openRoles = 3,
  className,
}: TeamGridProps) {
  const reduce = useReducedMotion() ?? false;
  return (
    <section className={cn("relative bg-background py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-4 text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[48px] lg:text-[56px]">{heading}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:text-xl sm:leading-[1.4]">{description}</p>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i} reduce={reduce} />
          ))}

          {showHiringCard && (
            <motion.li
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.7, delay: (members.length % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[320px] overflow-hidden rounded-[28px] bg-foreground text-background"
            >
              <a
                href={hiringHref}
                className="relative flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-background/15 text-background transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
                  <Plus className="size-5" aria-hidden />
                </span>
                <span className="mt-8 text-xs font-medium uppercase tracking-[0.08em] text-background/60">
                  {openRoles} open {openRoles === 1 ? "role" : "roles"}
                </span>
                <span className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">{hiringHeading}</span>
                <span className="mt-2 text-[14px] leading-relaxed text-background/70">{hiringText}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[15px] font-medium">
                  {hiringCtaLabel}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </a>
            </motion.li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default TeamGrid;
