import type { HomeContent, SiteContent } from "@/types/content";
import { EventCard } from "@/components/home/EventCard";

type EventsSectionProps = {
  sectionTitle: HomeContent["eventsSectionTitle"];
  events: SiteContent["events"];
};

export function EventsSection({ sectionTitle, events }: EventsSectionProps) {
  return (
    <section id="events" className="bg-page-bg py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl text-heading">{sectionTitle}</h2>
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
