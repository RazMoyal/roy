import Link from "next/link";
import { SiteImage } from "@/components/common/SiteImage";

type EventCardProps = {
  slug: string;
  labelHe: string;
  description: string;
  coverUrl?: string;
};

export function EventCard({
  slug,
  labelHe,
  description,
  coverUrl,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/25 bg-event-card shadow-[0_10px_30px_-18px_rgb(10_34_25/0.35)] transition duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_22px_45px_-20px_rgb(10_34_25/0.45)]"
    >
      {coverUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
          <SiteImage
            src={coverUrl}
            alt={labelHe}
            fill
            className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            quality="auto:eco"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold/70 to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-heading transition-colors group-hover:text-amber-900">
          {labelHe}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-event-card-muted">
          {description}
        </p>
        <div className="mt-6">
          <span className="inline-flex rounded-full bg-btn-secondary px-4 py-2 text-sm font-medium text-btn-secondary-fg transition group-hover:opacity-85">
            פרטים נוספים
          </span>
        </div>
      </div>
    </Link>
  );
}
