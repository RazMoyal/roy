import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { EventContent, SiteContent } from "@/types/content";
import {
  defaultEventContent,
  getSeedEventTypes,
  isSlugFormat,
} from "@/lib/event-types";
import { DEFAULT_THEME, normalizeTheme } from "@/lib/theme";

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

function createDefaultContent(): SiteContent {
  const events: Record<string, EventContent> = {};
  for (const [slug, label] of Object.entries(getSeedEventTypes())) {
    events[slug] = defaultEventContent(label);
  }
  return {
    home: {
      heroTitle: "אולם אירועים רוי",
      heroSubtitle: "חוויה בלתי נשכחת לכל סוגי האירועים - מחתונה ועד כנס עסקי",
      aboutTitle: "למה רוי?",
      aboutText:
        "אולם רוי מציע אווירה יוקרתית, שירות מקצועי וליווי צמוד מהרגע הראשון. אנחנו מתאימים את החלל, התפריט והעיצוב לכל אירוע - כדי שתוכלו לחגוג בראש שקט.",
      eventsSectionTitle: "סוגי אירועים",
      contactTitle: "יצירת קשר",
      contactText: "נשמח לשמוע על האירוע שלכם ולהציע הצעה מותאמת.",
      phone: "050-0000000",
      email: "info@roy-events.co.il",
    },
    theme: { ...DEFAULT_THEME },
    events,
  };
}

async function ensureContentFile(): Promise<void> {
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify(createDefaultContent(), null, 2),
      "utf-8",
    );
  }
}

function mergeWithDefaults(parsed: SiteContent): SiteContent {
  const defaults = createDefaultContent();
  // The saved list is authoritative: deleted event types stay deleted.
  const source = parsed.events ?? defaults.events;
  const events: Record<string, EventContent> = {};
  for (const [slug, event] of Object.entries(source)) {
    if (!isSlugFormat(slug)) continue;
    events[slug] = {
      ...defaultEventContent(event?.title || slug),
      ...event,
      images: event?.images ?? [],
    };
  }
  return {
    home: { ...defaults.home, ...parsed.home },
    theme: normalizeTheme(parsed.theme),
    events,
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  noStore();
  await ensureContentFile();
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  const parsed = JSON.parse(raw) as SiteContent;
  return mergeWithDefaults(parsed);
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export async function getEventContent(slug: string): Promise<EventContent | null> {
  const site = await readSiteContent();
  return site.events[slug] ?? null;
}

/**
 * Event slugs for generateStaticParams. Reads the file directly (no noStore),
 * since it runs at build time; types added later render on demand.
 */
export async function listEventSlugs(): Promise<string[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(CONTENT_PATH, "utf-8"));
    return Object.keys(parsed.events ?? {}).filter(isSlugFormat);
  } catch {
    return Object.keys(getSeedEventTypes());
  }
}
