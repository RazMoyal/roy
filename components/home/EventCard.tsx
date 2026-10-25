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
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md"
    >
      {coverUrl && (
        <div className="relative aspect-[16/10] bg-stone-200">
          <SiteImage
            src={coverUrl}
            alt={labelHe}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            quality="auto:eco"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-heading group-hover:text-amber-900">
          {labelHe}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">
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
