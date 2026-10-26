import Link from "next/link";
import type { HomeContent, PriceTable, SiteContent } from "@/types/content";
import { EventCard } from "@/components/home/EventCard";
import { EventPriceTable } from "@/components/events/EventPriceTable";
import { ParallaxSection } from "@/components/jungle/ParallaxSection";
import { SectionLeaves } from "@/components/jungle/Decor";
import { Reveal } from "@/components/jungle/Reveal";

type EventsSectionProps = {
  sectionTitle: HomeContent["eventsSectionTitle"];
  events: SiteContent["events"];
  /** Set when a category filter from the Hero buttons is active. */
  activeCategoryTitle?: string | null;
  /** The active category's price tables, if it has any. */
  activeCategoryPriceTables?: PriceTable[];
};

export function EventsSection({
  sectionTitle,
  events,
  activeCategoryTitle,
  activeCategoryPriceTables,
}: EventsSectionProps) {
  return (
    <ParallaxSection
      id="events"
      origin="center"
      className="relative isolate bg-page-bg py-14 sm:py-24"
    >
      <SectionLeaves side="start" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-heading sm:text-4xl">
              {activeCategoryTitle || sectionTitle}
            </h2>
          </div>
          {activeCategoryTitle && (
            <Link
              href="/#events"
              className="text-sm font-medium text-amber-800 hover:underline"
            >
              הצגת כל סוגי האירועים
            </Link>
          )}
        </Reveal>
        {activeCategoryPriceTables && activeCategoryPriceTables.length > 0 && (
          <div className="mt-6 space-y-8 sm:mt-8">
            {activeCategoryPriceTables.map((priceTable) => (
              <Reveal key={priceTable.id}>
                <EventPriceTable priceTable={priceTable} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(events).map(([slug, event], i) => (
            <Reveal key={slug} delay={(i % 3) * 110}>
              <EventCard
                slug={slug}
                labelHe={event.title || slug}
                description={event.description}
                coverUrl={
                  event.coverUrl ||
                  [...event.images].sort((a, b) => a.order - b.order)[0]?.url
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
}
