export type GalleryImage = {
  id: string;
  url: string;
  order: number;
};

export type EventContent = {
  title: string;
  description: string;
  /** Card image on the home page; falls back to the first gallery image. */
  coverUrl?: string;
  images: GalleryImage[];
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
};

export type SiteContent = {
  home: HomeContent;
  theme: ThemeColors;
  events: Record<string, EventContent>;
};
