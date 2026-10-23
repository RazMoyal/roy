import Link from "next/link";
import type { HomeContent, PriceTable, SiteContent } from "@/types/content";
import { EventCard } from "@/components/home/EventCard";
import { EventPriceTable } from "@/components/events/EventPriceTable";

type EventsSectionProps = {
  sectionTitle: HomeContent["eventsSectionTitle"];
  events: SiteContent["events"];
  /** Set when a category filter from the Hero buttons is active. */
  activeCategoryTitle?: string | null;
  /** The active category's price table, if it has one with rows. */
  activeCategoryPriceTable?: PriceTable | null;
};

export function EventsSection({
  sectionTitle,
  events,
  activeCategoryTitle,
  activeCategoryPriceTable,
}: EventsSectionProps) {
  return (
    <section id="events" className="bg-page-bg py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-semibold sm:text-3xl text-heading">
            {activeCategoryTitle || sectionTitle}
          </h2>
          {activeCategoryTitle && (
            <Link
              href="/#events"
              className="text-sm font-medium text-amber-800 hover:underline"
            >
              הצגת כל סוגי האירועים
            </Link>
          )}
        </div>
        {activeCategoryPriceTable && activeCategoryPriceTable.rows.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <EventPriceTable priceTable={activeCategoryPriceTable} />
          </div>
        )}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(events).map(([slug, event]) => (
            <EventCard
              key={slug}
              slug={slug}
              labelHe={event.title || slug}
              description={event.description}
              coverUrl={
                event.coverUrl ||
                [...event.images].sort((a, b) => a.order - b.order)[0]?.url
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
