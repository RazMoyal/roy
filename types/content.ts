export type GalleryImage = {
  id: string;
  url: string;
  order: number;
};

export type PriceTableRow = {
  id: string;
  /** One cell per column, aligned by index with the table's `columns`. */
  cells: string[];
};

export type PriceTable = {
  id: string;
  title: string;
  /** Column headers; a table can have any number of columns. */
  columns: string[];
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
  /** Empty unless the admin added tables. */
  priceTables: PriceTable[];
  /** Optional full-width image shown below the price tables on the event type page. */
  bannerUrl?: string;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  /** Background media for the hero section; absent falls back to the theme's gradient background. */
  heroMediaUrl?: string;
  heroMediaType?: "image" | "video";
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
  /** Empty unless the admin added tables. Shown above the event type list when this category is selected. */
  priceTables: PriceTable[];
  type: CategoryDisplayType;
};

export type ThemeColors = {
  accent: string;
  headings: string;
  primaryButton: string;
  primaryButtonText: string;
  secondaryButton: string;
  secondaryButtonText: string;
  headerBg: string;
  heroBg: string;
  heroCardBg: string;
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
