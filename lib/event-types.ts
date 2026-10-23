import seedEventTypes from "@/data/event-types.json";
import type { EventContent } from "@/types/content";

/**
 * Event types live in site-content.json (`events`, in display order) and are
 * added / removed from the admin. data/event-types.json only seeds a fresh
 * content file.
 */
export function getSeedEventTypes(): Record<string, string> {
  return seedEventTypes as Record<string, string>;
}

export function defaultEventContent(label: string): EventContent {
  return {
    title: label,
    description: `גלריית תמונות ופרטים לאירועי ${label} באולם רוי.`,
    images: [],
  };
}

/** Lowercase English letters, digits and dashes; must start with a letter. */
const SLUG_PATTERN = /^[a-z][a-z0-9-]{0,59}$/;

export function isSlugFormat(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/** Turns free text into a slug candidate ("Bar Mitzvah 2" -> "bar-mitzvah-2"). */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^[^a-z]+/, "")
    .replace(/-+$/, "")
    .slice(0, 60);
}

/** A free slug for a new event type, based on `base` when it is usable. */
export function uniqueSlug(base: string, existing: string[]): string {
  const taken = new Set(existing);
  const root = isSlugFormat(base) ? base : "event";
  if (root !== "event" && !taken.has(root)) return root;
  for (let n = 2; ; n++) {
    const candidate = `${root}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
