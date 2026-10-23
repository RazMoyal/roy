import type { HomeContent } from "@/types/content";

type ContactSectionProps = {
  content: Pick<
    HomeContent,
    "contactTitle" | "contactText" | "phone" | "email"
  >;
};

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-section-bg py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl text-heading">
          {content.contactTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-stone-600">
          {content.contactText}
        </p>
        <ul className="mt-8 space-y-2 text-stone-800">
          <li>
            <span className="text-stone-500">טלפון: </span>
            <a href={`tel:${content.phone.replace(/\D/g, "")}`} className="font-medium hover:text-amber-800">
              {content.phone}
            </a>
          </li>
          <li>
            <span className="text-stone-500">דוא&quot;ל: </span>
            <a href={`mailto:${content.email}`} className="font-medium break-all hover:text-amber-800">
              {content.email}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
