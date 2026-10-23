export type GalleryImage = {
  id: string;
  url: string;
  order: number;
};

export type PriceTableRow = {
  id: string;
  label: string;
  price: string;
  /** Optional small print under the item label, e.g. "מינימום 50 אורחים". */
  note?: string;
  /** Optional small print next to the price, e.g. "לא כולל מע״מ" or "לאדם". */
  priceNote?: string;
};

export type PriceTable = {
  title: string;
  rows: PriceTableRow[];
  /** Optional small print under the table, e.g. "המחירים אינם כוללים מע״מ". */
  note: string;
};

export type EventContent = {
  title: string;
  description: string;
  /** Card image on the home page; falls back to the first gallery image. */
  coverUrl?: string;
  images: GalleryImage[];
  /** Not every event type has one — only present when the admin added it. */
  priceTable?: PriceTable;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  eventsSectionTitle: string;
  contactTitle: string;
  contactText: string;
  phone: string;
  email: string;
  /** International-friendly phone used for the WhatsApp contact button on event pages. */
  whatsappPhone: string;
};

/**
 * "regular" filters the home page's event type grid in place.
 * "gallery" links to a dedicated page stacking every event type's photos
 * under its name, instead of filtering the home page.
 */
export type CategoryDisplayType = "regular" | "gallery";

export type EventCategory = {
  title: string;
  /** Event type slugs in this category; an event type may appear in several categories. */
  eventTypeSlugs: string[];
  /** Not every category has one — only present when the admin added it. Shown above the event type list when this category is selected. */
  priceTable?: PriceTable;
  type: CategoryDisplayType;
};

export type ThemeColors = {
  accent: string;
  headings: string;
  primaryButton: string;
  secondaryButton: string;
  headerBg: string;
  heroBg: string;
  pageBg: string;
  sectionBg: string;
  footerBg: string;
  priceTableHeaderBg: string;
  priceTableHeaderText: string;
  priceTableBg: string;
  priceTableRowText: string;
  priceTablePriceText: string;
  priceTableBorder: string;
};

export type SiteContent = {
  home: HomeContent;
  theme: ThemeColors;
  events: Record<string, EventContent>;
  categories: Record<string, EventCategory>;
};
