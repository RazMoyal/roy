import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { EventPriceTable } from "@/components/events/EventPriceTable";
import { readSiteContent, reconcileEventImages } from "@/lib/content";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const site = await readSiteContent();
  const category = site.categories[slug];
  if (!category || category.type !== "gallery") return {};
  return { title: `${category.title} | אולם רוי` };
}

export default async function CategoryGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await readSiteContent();
  const category = site.categories[slug];
  if (!category || category.type !== "gallery") notFound();

  const sections = await Promise.all(
    category.eventTypeSlugs.map(async (eventSlug) => {
      const event = site.events[eventSlug];
      if (!event) return null;
      return {
        eventSlug,
        title: event.title || eventSlug,
        images: await reconcileEventImages(eventSlug, event.images),
      };
    }),
  );

  return (
    <SiteShell>
      <div className="border-b border-stone-200 bg-page-bg">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Link
            href="/"
            className="text-sm font-medium text-amber-800 hover:underline"
          >
            → חזרה לעמוד הבית
          </Link>
          <h1 className="mt-3 text-3xl font-semibold sm:mt-4 sm:text-4xl text-heading">
            {category.title}
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {category.priceTables.length > 0 && (
          <div className="mb-14 space-y-8">
            {category.priceTables.map((priceTable) => (
              <EventPriceTable key={priceTable.id} priceTable={priceTable} />
            ))}
          </div>
        )}
        <div className="space-y-14">
          {sections.map((section) => {
            if (!section) return null;
            const { eventSlug, title, images } = section;
            return (
              <section key={eventSlug}>
                <h2 className="text-xl font-semibold sm:text-2xl text-heading">
                  {title}
                </h2>
                <div className="mt-6">
                  <GalleryGrid images={images} title={title} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
