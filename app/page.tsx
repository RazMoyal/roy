import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { readSiteContent } from "@/lib/content";

export const instant = false;

export default async function Home() {
  const site = await readSiteContent();

  return (
    <SiteShell>
      <Hero content={site.home} />
      <AboutSection content={site.home} />
      <EventsSection
        sectionTitle={site.home.eventsSectionTitle}
        events={site.events}
      />
      <ContactSection content={site.home} />
    </SiteShell>
  );
}
