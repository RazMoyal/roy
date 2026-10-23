import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { EventPageHeader } from "@/components/events/EventPageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { listEventSlugs, readSiteContent } from "@/lib/content";

export const instant = false;

export async function generateStaticParams() {
  return (await listEventSlugs()).map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const site = await readSiteContent();
  if (!site.events[slug]) return {};
  const title = site.events[slug].title || slug;
  return { title: `${title} | אולם רוי` };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await readSiteContent();
  const event = site.events[slug];
  if (!event) notFound();
  const title = event.title || slug;

  return (
    <SiteShell>
      <EventPageHeader title={title} />
      <article className="mx-auto max-w-6xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6">
        <p className="max-w-3xl text-base leading-relaxed sm:text-lg text-stone-600">
          {event?.description}
        </p>
        <h2 className="mt-10 text-xl font-semibold sm:mt-12 sm:text-2xl text-heading">
          תמונות מהאירוע
        </h2>
        <div className="mt-6">
          <GalleryGrid images={event?.images ?? []} title={title} />
        </div>
      </article>
    </SiteShell>
  );
}
