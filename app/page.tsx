import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { readSiteContent } from "@/lib/content";

export const instant = false;

type HomeProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const site = await readSiteContent();
  const { category } = await searchParams;
  const requestedCategory = category ? site.categories[category] : null;
  // Gallery-type categories always open their own page — never an inline filter here.
  const activeCategory =
    requestedCategory?.type === "regular" ? requestedCategory : null;

  const events = activeCategory
    ? Object.fromEntries(
        Object.entries(site.events).filter(([slug]) =>
          activeCategory.eventTypeSlugs.includes(slug),
        ),
      )
    : site.events;

  return (
    <SiteShell>
      <Hero
        content={site.home}
        categories={site.categories}
        activeCategorySlug={activeCategory ? category : null}
      />
      <AboutSection content={site.home} />
      <EventsSection
        sectionTitle={site.home.eventsSectionTitle}
        events={events}
        activeCategoryTitle={activeCategory?.title}
        activeCategoryPriceTable={activeCategory?.priceTable}
      />
      <ContactSection content={site.home} />
    </SiteShell>
  );
}
