import { getStore } from "@netlify/blobs";
import { unstable_noStore as noStore } from "next/cache";
import type { EventCategory, EventContent, GalleryImage, SiteContent } from "@/types/content";
import {
  defaultEventContent,
  getSeedEventTypes,
  isSlugFormat,
  normalizePriceTable,
} from "@/lib/event-types";
import { SEED_CATEGORIES } from "@/lib/categories";
import { DEFAULT_THEME, normalizeTheme } from "@/lib/theme";
import { listEventImages } from "@/lib/cloudinary";

const CONTENT_KEY = "site-content.json";

/**
 * The site's content lives in Netlify Blobs, not on the local disk — Netlify
 * Functions run on a read-only, per-invocation filesystem, so a plain JSON
 * file on disk can't survive a write there. Blobs give local dev and the
 * deployed site the same persistent store. Netlify injects store access
 * automatically during its own Build/Functions/Edge runtime; BLOBS_SITE_ID +
 * BLOBS_TOKEN let `next dev`/`next build` running on a developer's machine
 * reach that same remote store explicitly.
 */
function contentStore() {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  return siteID && token
    ? getStore({ name: "site-content", siteID, token })
    : getStore("site-content");
}

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
      whatsappPhone: "",
    },
    theme: { ...DEFAULT_THEME },
    events,
    categories: structuredClone(SEED_CATEGORIES),
  };
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
      priceTable: normalizePriceTable(event?.priceTable),
    };
  }
  // Categories are authoritative like events, but event type references are
  // pruned to whatever still exists (e.g. after an event type is deleted).
  const categorySource = parsed.categories ?? defaults.categories;
  const categories: Record<string, EventCategory> = {};
  for (const [slug, category] of Object.entries(categorySource)) {
    if (!isSlugFormat(slug)) continue;
    categories[slug] = {
      title: category?.title || slug,
      eventTypeSlugs: (category?.eventTypeSlugs ?? []).filter(
        (s) => s in events,
      ),
      priceTable: normalizePriceTable(category?.priceTable),
      type: category?.type === "gallery" ? "gallery" : "regular",
    };
  }

  return {
    home: { ...defaults.home, ...parsed.home },
    theme: normalizeTheme(parsed.theme),
    events,
    categories,
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  noStore();
  const stored = await contentStore().get(CONTENT_KEY, { type: "json" });
  const parsed = (stored ?? createDefaultContent()) as SiteContent;
  return mergeWithDefaults(parsed);
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await contentStore().setJSON(CONTENT_KEY, content);
}

export async function getEventContent(slug: string): Promise<EventContent | null> {
  const site = await readSiteContent();
  return site.events[slug] ?? null;
}

/**
 * Cloudinary's folder for the event type is the source of truth for which
 * images exist — `stored` only supplies the admin's manual order preference.
 * An image deleted directly in Cloudinary drops out here even if a stale
 * entry lingers in `stored`; one uploaded outside the admin flow shows up
 * automatically. Falls back to `stored` as-is if Cloudinary can't be reached,
 * so a transient API error doesn't blank out a gallery.
 */
export async function reconcileEventImages(
  slug: string,
  stored: GalleryImage[],
): Promise<GalleryImage[]> {
  let cloud;
  try {
    cloud = await listEventImages(slug);
  } catch {
    return stored;
  }

  const cloudById = new Map(cloud.map((image) => [image.id, image]));
  const kept = [...stored]
    .filter((image) => cloudById.has(image.id))
    .sort((a, b) => a.order - b.order);
  const keptIds = new Set(kept.map((image) => image.id));

  const added = cloud
    .filter((image) => !keptIds.has(image.id))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return [...kept, ...added].map((image, index) => ({
    id: image.id,
    url: cloudById.get(image.id)?.url ?? image.url,
    order: index,
  }));
}

/** Reconciles every event type's images against Cloudinary in parallel. */
export async function reconcileAllEventImages(
  events: Record<string, EventContent>,
): Promise<Record<string, EventContent>> {
  const entries = await Promise.all(
    Object.entries(events).map(async ([slug, event]) => [
      slug,
      { ...event, images: await reconcileEventImages(slug, event.images) },
    ] as const),
  );
  return Object.fromEntries(entries);
}

/** Event slugs for generateStaticParams; types added later still render on demand. */
export async function listEventSlugs(): Promise<string[]> {
  try {
    const stored = await contentStore().get(CONTENT_KEY, { type: "json" });
    const events = (stored as SiteContent | null)?.events ?? {};
    return Object.keys(events).filter(isSlugFormat);
  } catch {
    return Object.keys(getSeedEventTypes());
  }
}
