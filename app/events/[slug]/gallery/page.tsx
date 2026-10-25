import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { WhatsAppContactButton } from "@/components/events/WhatsAppContactButton";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { listEventSlugs, readSiteContent, reconcileEventImages } from "@/lib/content";

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
  return { title: `גלריה — ${title} | אולם רוי` };
}

export default async function EventGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await readSiteContent();
  const event = site.events[slug];
  if (!event) notFound();
  const title = event.title || slug;
  const images = await reconcileEventImages(slug, event.images);

  return (
    <SiteShell>
      <div className="border-b border-stone-200 bg-page-bg">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Link
            href={`/events/${slug}`}
            className="text-sm font-medium text-amber-800 hover:underline"
          >
            → חזרה לעמוד האירוע
          </Link>
          <h1 className="mt-3 text-3xl font-semibold sm:mt-4 sm:text-4xl text-heading">
            גלריה — {title}
          </h1>
          {event?.description && (
            <p className="mt-4 max-w-3xl text-stone-600">{event.description}</p>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <GalleryGrid images={images} title={title} />
        <WhatsAppContactButton phone={site.home.whatsappPhone} eventTitle={title} />
      </div>
    </SiteShell>
  );
}
