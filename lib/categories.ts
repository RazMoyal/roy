import type { EventCategory } from "@/types/content";

export function defaultCategory(title: string): EventCategory {
  return { title, eventTypeSlugs: [], type: "regular" };
}

/**
 * Seed categories for a fresh install, matching the event type slugs seeded
 * in data/event-types.json. Purely a starting point — fully editable from
 * the admin afterwards.
 */
export const SEED_CATEGORIES: Record<string, EventCategory> = {
  galleries: {
    title: "גלריות",
    type: "gallery",
    eventTypeSlugs: [
      "brit",
      "brita",
      "bar-mitzvah",
      "aliyah-latorah",
      "bat-mitzvah",
      "china",
      "wedding",
      "challah-separation",
      "venue-rental",
      "corporate-events",
      "conference",
      "toast",
      "prom",
      "corporate-concept",
      "dinner",
      "morning-seminar",
    ],
  },
  "private-events": {
    title: "אירועים פרטיים",
    type: "regular",
    eventTypeSlugs: [
      "brit",
      "brita",
      "bar-mitzvah",
      "aliyah-latorah",
      "bat-mitzvah",
      "china",
      "wedding",
      "challah-separation",
      "toast",
      "prom",
      "dinner",
    ],
  },
  corporate: {
    title: "אירועי חברה",
    type: "regular",
    eventTypeSlugs: [
      "corporate-events",
      "conference",
      "corporate-concept",
      "morning-seminar",
    ],
  },
  "equipment-rental": {
    title: "השכרת ציוד",
    type: "regular",
    eventTypeSlugs: ["venue-rental"],
  },
};
