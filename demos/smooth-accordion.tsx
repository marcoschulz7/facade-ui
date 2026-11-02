import { MessageCircle } from "lucide-react";
import { SmoothAccordion } from "./smooth-accordion";

const faqs = [
  {
    value: "supplies",
    title: "Do I need to provide cleaning supplies?",
    content:
      "No. Our team arrives with everything, including HEPA vacuums and plant based products. If you prefer a specific brand, leave it out and we will use it.",
  },
  {
    value: "home",
    title: "Do I have to be home during the cleaning?",
    content:
      "Most clients are not. You can leave a key, share a door code or use a lockbox. Every cleaner is background checked, bonded and insured up to $1M.",
  },
  {
    value: "price",
    title: "How is pricing calculated?",
    content:
      "Flat rates based on bedrooms and bathrooms, starting at $129 for a one bedroom apartment. You see the exact price before you book, no hourly surprises.",
  },
  {
    value: "guarantee",
    title: "What if I am not happy with the clean?",
    content:
      "Tell us within 24 hours and we will come back to re-clean the missed areas for free. If it is still not right, we refund the visit.",
  },
  {
    value: "reschedule",
    title: "Can I reschedule or skip a visit?",
    content: "Yes, anytime up to 24 hours before your appointment from your account or by text. No fees.",
  },
];

export default function Demo() {
  return (
    <section className="mx-auto grid w-full max-w-4xl gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Tidy Nest, Denver</p>
        <h3 className="mt-3 font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
          Questions, answered
        </h3>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Everything you need to know before your first clean. Still unsure? Our Denver team replies in minutes.
        </p>
        <a
          href="#"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-muted px-5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageCircle className="size-4" aria-hidden />
          Text us a question
        </a>
      </div>
      <SmoothAccordion items={faqs} defaultValue={["supplies"]} />
    </section>
  );
}
