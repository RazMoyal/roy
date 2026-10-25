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

/**
 * Reserved Cloudinary folder slug for the home page's hero media — not an
 * event type, but shares the same upload/delete API and folder scheme.
 */
export const HOME_HERO_SLUG = "home-hero";

export function defaultEventContent(label: string): EventContent {
  return {
    title: label,
    description: `גלריית תמונות ופרטים לאירועי ${label} באולם רוי.`,
    images: [],
    priceTables: [],
  };
}

function normalizeOnePriceTable(value: unknown, index: number): PriceTable | null {
  if (!value || typeof value !== "object") return null;
  const pt = value as { id?: unknown; title?: unknown; note?: unknown; columns?: unknown; rows?: unknown };

  const columns = Array.isArray(pt.columns)
    ? pt.columns.filter((c): c is string => typeof c === "string")
    : [];

  const rows: PriceTableRow[] = (Array.isArray(pt.rows) ? pt.rows : [])
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row, rowIndex) => {
      const cellsRaw = Array.isArray(row.cells) ? row.cells : [];
      return {
        id: typeof row.id === "string" && row.id ? row.id : `row-${rowIndex}`,
        cells: columns.map((_, ci) =>
          typeof cellsRaw[ci] === "string" ? (cellsRaw[ci] as string) : "",
        ),
      };
    });

  return {
    id: typeof pt.id === "string" && pt.id ? pt.id : `table-${index}`,
    title: typeof pt.title === "string" ? pt.title : "",
    note: typeof pt.note === "string" ? pt.note : "",
    columns,
    rows,
  };
}

/**
 * Converts the old single-table shape (fixed label/price/note/priceNote
 * columns) into the current flexible-columns shape, so sites saved before
 * custom columns existed keep their data.
 */
function normalizeLegacyPriceTable(value: unknown): PriceTable | null {
  if (!value || typeof value !== "object") return null;
  const pt = value as { title?: unknown; note?: unknown; rows?: unknown };
  if (!Array.isArray(pt.rows)) return null;

  const columns = ["פריט", "הערה", "מחיר", "הערת מחיר"];
  const rows: PriceTableRow[] = (pt.rows as unknown[])
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row, index) => ({
      id: typeof row.id === "string" && row.id ? row.id : `row-${index}`,
      cells: [
        typeof row.label === "string" ? row.label : "",
        typeof row.note === "string" ? row.note : "",
        typeof row.price === "string" ? row.price : "",
        typeof row.priceNote === "string" ? row.priceNote : "",
      ],
    }));

  return {
    id: "table-0",
    title: typeof pt.title === "string" ? pt.title : "",
    note: typeof pt.note === "string" ? pt.note : "",
    columns,
    rows,
  };
}

/**
 * Sanitizes possibly-malformed price tables loaded from disk. Accepts either
 * the current array of multi-column tables (`priceTables`) or the legacy
 * single fixed-column table (`priceTable`), migrating the latter.
 */
export function normalizePriceTables(
  priceTables: unknown,
  legacyPriceTable?: unknown,
): PriceTable[] {
  if (Array.isArray(priceTables)) {
    return priceTables
      .map((item, index) => normalizeOnePriceTable(item, index))
      .filter((t): t is PriceTable => t !== null);
  }
  const legacy = normalizeLegacyPriceTable(legacyPriceTable);
  return legacy ? [legacy] : [];
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
