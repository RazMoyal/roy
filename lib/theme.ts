import type { ThemeColors } from "@/types/content";

/** Must match the defaults in app/globals.css (@theme). */
export const DEFAULT_THEME: ThemeColors = {
  accent: "#d97706",
  headings: "#1c1917",
  primaryButton: "#d97706",
  primaryButtonText: "#ffffff",
  secondaryButton: "#1c1917",
  secondaryButtonText: "#ffffff",
  headerBg: "#ffffff",
  heroBg: "#0c0a09",
  heroCardBg: "#0b241b",
  heroCardTitle: "#f6efdc",
  heroCardText: "#c8d2c4",
  heroCardBorder: "#c9a35b",
  heroChipText: "#f6efdc",
  heroChipBorder: "#c9a35b",
  heroChipActiveBg: "#c9a35b",
  heroChipActiveText: "#0b241b",
  pageBg: "#fafaf9",
  eventCardBg: "#ffffff",
  sectionBg: "#ffffff",
  footerBg: "#0c0a09",
  priceTableHeaderBg: "#fdf6e3",
  priceTableHeaderText: "#1c1917",
  priceTableBg: "#ffffff",
  priceTableRowText: "#292524",
  priceTablePriceText: "#92400e",
  priceTableBorder: "#e7e5e4",
  gold: "#c9a35b",
};

export const THEME_KEYS = Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[];

/**
 * Defaults from before the jungle redesign. A saved color still equal to its
 * old default was never customized, so it follows the new default instead.
 */
const LEGACY_DEFAULTS: Partial<ThemeColors> = {
  heroCardBg: "#ffffff",
};

/** 6-digit hex, optionally followed by a 2-digit alpha channel (CSS #RRGGBBAA). */
const HEX_COLOR_ALPHA = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;

export function isHexColor(value: string): boolean {
  return HEX_COLOR_ALPHA.test(value);
}

/** The opaque RGB part of a color, stripping any alpha channel. */
export function hexBase(hex: string): string {
  return hex.slice(0, 7);
}

/** Alpha channel as 0-100, defaulting to fully opaque when absent. */
export function hexOpacity(hex: string): number {
  if (hex.length !== 9) return 100;
  return Math.round((parseInt(hex.slice(7, 9), 16) / 255) * 100);
}

/** Sets the alpha channel (0-100) on a 6- or 8-digit hex color. */
export function withOpacity(hex: string, opacity: number): string {
  const base = hexBase(hex);
  const clamped = Math.max(0, Math.min(100, opacity));
  if (clamped >= 100) return base;
  const alpha = Math.round((clamped / 100) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${base}${alpha}`;
}

function mix(color: string, other: "white" | "black", percent: number) {
  return `color-mix(in oklab, ${color}, ${other} ${percent}%)`;
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** Whether dark text reads better than white text on this background. */
export function isLightColor(hex: string): boolean {
  const l = luminance(hexBase(hex));
  // Contrast against near-black text (#1c1917) vs. against white text.
  return (l + 0.05) / 0.06 > 1.05 / (l + 0.05);
}

/** Text colors per background, as [on a light background, on a dark one]. */
const TEXT_ON = {
  fg: ["#1c1917", "#ffffff"],
  muted: ["#57534e", "#d6d3d1"],
  header: ["#44403c", "#e7e5e4"],
  footer: ["#44403c", "#d6d3d1"],
  footerMuted: ["#78716c", "#a8a29e"],
} as const;

function textOn(bg: string, kind: keyof typeof TEXT_ON): string {
  return TEXT_ON[kind][isLightColor(bg) ? 0 : 1];
}

/**
 * Colors that map one-to-one onto a CSS token (--color-<token>), with no
 * derived text color.
 */
const DIRECT_TOKENS: Partial<Record<keyof ThemeColors, string>> = {
  heroCardBg: "hero-card",
  heroCardTitle: "hero-card-title",
  heroCardText: "hero-card-text",
  heroCardBorder: "hero-card-border",
  heroChipText: "hero-chip-fg",
  heroChipBorder: "hero-chip-border",
  heroChipActiveBg: "hero-chip-active",
  heroChipActiveText: "hero-chip-active-fg",
  gold: "gold",
};

/**
 * CSS overriding the site color tokens for every color changed from the
 * default. Unchanged colors are left to the stylesheet as designed.
 */
export function buildThemeCss(theme: ThemeColors): string {
  const vars: string[] = [];
  const changed = (key: keyof ThemeColors) =>
    isHexColor(theme[key]) && theme[key] !== DEFAULT_THEME[key];

  if (changed("accent")) {
    // Links and highlights use Tailwind's amber shades.
    const a = theme.accent;
    vars.push(
      `--color-amber-200: ${mix(a, "white", 75)};`,
      `--color-amber-400: ${mix(a, "white", 30)};`,
      `--color-amber-500: ${mix(a, "white", 15)};`,
      `--color-amber-600: ${a};`,
      `--color-amber-800: ${mix(a, "black", 35)};`,
      `--color-amber-900: ${mix(a, "black", 50)};`,
    );
  }
  if (changed("headings")) {
    vars.push(`--color-heading: ${theme.headings};`);
  }
  if (changed("primaryButton") || changed("primaryButtonText")) {
    vars.push(
      `--color-btn-primary: ${theme.primaryButton};`,
      `--color-btn-primary-fg: ${theme.primaryButtonText};`,
    );
  }
  if (changed("secondaryButton") || changed("secondaryButtonText")) {
    vars.push(
      `--color-btn-secondary: ${theme.secondaryButton};`,
      `--color-btn-secondary-fg: ${theme.secondaryButtonText};`,
    );
  }
  if (changed("headerBg")) {
    const c = theme.headerBg;
    vars.push(
      `--color-header-bg: ${c};`,
      `--color-header-fg: ${textOn(c, "header")};`,
    );
  }
  if (changed("heroBg")) {
    const c = theme.heroBg;
    vars.push(
      `--color-hero-bg: ${c};`,
      `--color-hero-fg: ${textOn(c, "fg")};`,
      `--color-hero-muted: ${textOn(c, "muted")};`,
    );
  }
  if (changed("pageBg")) {
    vars.push(`--color-page-bg: ${theme.pageBg};`);
  }
  if (changed("eventCardBg")) {
    const c = theme.eventCardBg;
    vars.push(
      `--color-event-card: ${c};`,
      `--color-event-card-muted: ${textOn(c, "muted")};`,
    );
  }
  if (changed("sectionBg")) {
    vars.push(`--color-section-bg: ${theme.sectionBg};`);
  }
  if (changed("footerBg")) {
    const c = theme.footerBg;
    vars.push(
      `--color-footer-bg: ${c};`,
      `--color-footer-fg: ${textOn(c, "footer")};`,
      `--color-footer-muted: ${textOn(c, "footerMuted")};`,
    );
  }
  if (changed("priceTableHeaderBg")) {
    vars.push(`--color-price-header-bg: ${theme.priceTableHeaderBg};`);
  }
  if (changed("priceTableHeaderText")) {
    vars.push(`--color-price-header-fg: ${theme.priceTableHeaderText};`);
  }
  if (changed("priceTableBg")) {
    vars.push(`--color-price-bg: ${theme.priceTableBg};`);
  }
  if (changed("priceTableRowText")) {
    vars.push(`--color-price-row-fg: ${theme.priceTableRowText};`);
  }
  if (changed("priceTablePriceText")) {
    vars.push(`--color-price-amount-fg: ${theme.priceTablePriceText};`);
  }
  if (changed("priceTableBorder")) {
    vars.push(`--color-price-border: ${theme.priceTableBorder};`);
  }
  for (const [key, token] of Object.entries(DIRECT_TOKENS)) {
    if (changed(key as keyof ThemeColors)) {
      vars.push(`--color-${token}: ${theme[key as keyof ThemeColors]};`);
    }
  }

  return vars.length ? `:root { ${vars.join(" ")} }` : "";
}

/** Keeps only known theme keys, filling the rest from the defaults. */
export function normalizeTheme(
  theme: Partial<ThemeColors> | undefined,
): ThemeColors {
  const result = { ...DEFAULT_THEME };
  for (const key of THEME_KEYS) {
    const value = theme?.[key];
    if (typeof value === "string" && value !== LEGACY_DEFAULTS[key]) {
      result[key] = value;
    }
  }
  return result;
}
