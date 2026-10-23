import type { ThemeColors } from "@/types/content";

/** Must match the defaults in app/globals.css (@theme). */
export const DEFAULT_THEME: ThemeColors = {
  accent: "#d97706",
  headings: "#1c1917",
  primaryButton: "#d97706",
  secondaryButton: "#1c1917",
  headerBg: "#ffffff",
  heroBg: "#0c0a09",
  pageBg: "#fafaf9",
  sectionBg: "#ffffff",
  footerBg: "#0c0a09",
};

export const THEME_KEYS = Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[];

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
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
  const l = luminance(hex);
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
  if (changed("primaryButton")) {
    const c = theme.primaryButton;
    vars.push(
      `--color-btn-primary: ${c};`,
      `--color-btn-primary-fg: ${textOn(c, "fg")};`,
    );
  }
  if (changed("secondaryButton")) {
    const c = theme.secondaryButton;
    vars.push(
      `--color-btn-secondary: ${c};`,
      `--color-btn-secondary-fg: ${textOn(c, "fg")};`,
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

  return vars.length ? `:root { ${vars.join(" ")} }` : "";
}

/** Keeps only known theme keys, filling the rest from the defaults. */
export function normalizeTheme(
  theme: Partial<ThemeColors> | undefined,
): ThemeColors {
  const result = { ...DEFAULT_THEME };
  for (const key of THEME_KEYS) {
    const value = theme?.[key];
    if (typeof value === "string") result[key] = value;
  }
  return result;
}
