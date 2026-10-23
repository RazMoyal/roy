import seedEventTypes from "@/data/event-types.json";
import type { EventContent, PriceTable, PriceTableRow } from "@/types/content";

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

/** Sanitizes a possibly-malformed price table loaded from disk; `undefined` when absent or invalid. */
export function normalizePriceTable(value: unknown): PriceTable | undefined {
  if (!value || typeof value !== "object" || !("rows" in value)) return undefined;
  const pt = value as { title?: unknown; note?: unknown; rows?: unknown };
  if (!Array.isArray(pt.rows)) return undefined;

  const rows: PriceTableRow[] = (pt.rows as unknown[])
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row, index) => ({
      id: typeof row.id === "string" && row.id ? row.id : `row-${index}`,
      label: typeof row.label === "string" ? row.label : "",
      price: typeof row.price === "string" ? row.price : "",
      note: typeof row.note === "string" && row.note ? row.note : undefined,
      priceNote:
        typeof row.priceNote === "string" && row.priceNote
          ? row.priceNote
          : undefined,
    }));

  return {
    title: typeof pt.title === "string" ? pt.title : "",
    note: typeof pt.note === "string" ? pt.note : "",
    rows,
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
