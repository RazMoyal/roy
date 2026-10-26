import type { HomeContent } from "@/types/content";
import { Reveal } from "@/components/jungle/Reveal";

type ContactSectionProps = {
  content: Pick<
    HomeContent,
    "contactTitle" | "contactText" | "phone" | "email"
  >;
};

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-section-bg py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl text-heading sm:text-4xl">
            {content.contactTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-stone-600">
            {content.contactText}
          </p>
        </Reveal>
        <ul className="mt-8 flex flex-col gap-3 text-stone-800 sm:flex-row sm:flex-wrap sm:gap-4">
          <li>
            <Reveal delay={80} className="flex items-center gap-3 rounded-3xl border border-gold/25 bg-white/60 py-2 ps-2 pe-5">
              <IconBadge>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </IconBadge>
              <span>
                <span className="text-stone-500">טלפון: </span>
                <a href={`tel:${content.phone.replace(/\D/g, "")}`} className="font-medium hover:text-amber-800">
                  {content.phone}
                </a>
              </span>
            </Reveal>
          </li>
          <li className="min-w-0">
            <Reveal delay={180} className="flex items-center gap-3 rounded-3xl border border-gold/25 bg-white/60 py-2 ps-2 pe-5">
              <IconBadge>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </IconBadge>
              <span className="min-w-0">
                <span className="text-stone-500">דוא&quot;ל: </span>
                <a href={`mailto:${content.email}`} className="font-medium break-all hover:text-amber-800">
                  {content.email}
                </a>
              </span>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}
