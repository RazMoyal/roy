"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { HomeContent, ThemeColors } from "@/types/content";
import {
  DEFAULT_THEME,
  hexBase,
  hexOpacity,
  isHexColor,
  textOn,
  withOpacity,
} from "@/lib/theme";

type HeroText = Pick<HomeContent, "heroTitle" | "heroSubtitle">;

type ThemeEditorProps = {
  theme: ThemeColors;
  /** The home page's hero text, so the preview shows the real wording. */
  heroText: HeroText;
  onChange: (theme: ThemeColors) => void;
};

type PreviewProps = { t: ThemeColors; heroText: HeroText };

type Key = keyof ThemeColors;

type Field = {
  key: Key;
  label: string;
  hint?: string;
  /** Backgrounds get an opacity slider; text and lines don't need one. */
  alpha?: boolean;
};

type Group = {
  title: string;
  note?: string;
  fields: Field[];
  Preview: (props: PreviewProps) => React.ReactNode;
};

/*
 * Spotlight: the color being hovered or picked with "איפה זה?" marks every
 * preview element tagged with its key (see [data-spot-on] in globals.css).
 */
const SpotContext = createContext<Key | null>(null);

function useSpot() {
  const active = useContext(SpotContext);
  return (keys: Key | Key[], inset = false) => {
    const list = Array.isArray(keys) ? keys : [keys];
    return {
      "data-spot": list.join(" "),
      "data-spot-on": active && list.includes(active) ? (inset ? "inset" : "outset") : undefined,
    };
  };
}

/** A token at partial strength, like Tailwind's `border-gold/25`. */
function fade(color: string, percent: number) {
  return `color-mix(in oklab, ${color} ${percent}%, transparent)`;
}

function HeaderPreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  const fg = textOn(t.headerBg, "header");
  return (
    <div className="pb-2">
      <div
        {...spot("headerBg", true)}
        className="flex items-center justify-between px-4 py-3"
        style={{ background: t.headerBg, borderBottom: `1px solid ${fade(t.gold, 25)}` }}
      >
        <span {...spot("gold")} style={{ color: t.gold }}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
        <span className="font-display text-xl" style={{ color: t.gold }}>
          ROY
        </span>
      </div>
      <div
        {...spot(["headerBg", "gold"], true)}
        className="ms-3 mt-2 w-40 rounded-xl p-1.5 text-sm shadow-lg"
        style={{ background: t.headerBg, color: fg, border: `1px solid ${fade(t.gold, 30)}` }}
      >
        <p className="rounded-lg px-3 py-1.5">אירועים</p>
        <p className="rounded-lg px-3 py-1.5">צור קשר</p>
      </div>
    </div>
  );
}

function HeroPreview({ t, heroText }: PreviewProps) {
  const spot = useSpot();
  // Same rule as the site: a line left empty in the admin isn't shown.
  const title = heroText.heroTitle?.trim();
  const subtitle = heroText.heroSubtitle?.trim();
  return (
    <div>
      <div
        {...spot("heroBg", true)}
        className="flex h-36 flex-col items-center justify-center px-4 text-center [text-shadow:0_2px_12px_rgb(0_0_0/0.5)]"
        style={{ background: t.heroBg }}
      >
        {title && (
          <p {...spot("heroTitle")} className="font-display text-2xl" style={{ color: t.heroTitle }}>
            {title}
          </p>
        )}
        {subtitle && (
          <p {...spot("heroSubtitle")} className="mt-1 text-xs" style={{ color: t.heroSubtitle }}>
            {subtitle}
          </p>
        )}
      </div>
      <div
        {...spot(["heroCardBg", "heroCardBorder"], true)}
        className="flex justify-center gap-1 overflow-hidden px-2 text-sm font-medium"
        style={{
          background: t.heroCardBg,
          borderTop: `1px solid ${fade(t.heroCardBorder, 40)}`,
          borderBottom: `1px solid ${fade(t.heroCardBorder, 40)}`,
        }}
      >
        <span {...spot("heroChipActiveBg")} className="relative px-3 py-3" style={{ color: t.heroChipActiveBg }}>
          כל האירועים
          <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full" style={{ background: t.heroChipActiveBg }} />
        </span>
        <span {...spot("heroChipText")} className="px-3 py-3" style={{ color: fade(t.heroChipText, 80) }}>
          גלריות
        </span>
        <span {...spot("heroChipBorder")} className="relative px-3 py-3" style={{ color: t.heroChipText }}>
          אירועים פרטיים
          <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full" style={{ background: fade(t.heroChipBorder, 50) }} />
        </span>
      </div>
      <p className="px-3 py-2 text-xs text-stone-500">״אירועים פרטיים״ מוצג כאן במצב של מעבר עכבר.</p>
    </div>
  );
}

function PagePreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  const link = `color-mix(in oklab, ${t.accent}, black 35%)`;
  return (
    <div>
      <div {...spot("sectionBg", true)} className="px-5 py-5" style={{ background: t.sectionBg }}>
        <p {...spot("headings")} className="inline-block font-display text-2xl" style={{ color: t.headings }}>
          צור קשר
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm text-stone-800">
          <span
            {...spot("gold")}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ border: `1px solid ${fade(t.gold, 40)}`, color: t.gold }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
          </span>
          050-0000000
        </div>
      </div>
      <div {...spot("pageBg", true)} className="flex flex-wrap items-end justify-between gap-2 px-5 py-5" style={{ background: t.pageBg }}>
        <p {...spot("headings")} className="font-display text-2xl" style={{ color: t.headings }}>
          אירועים פרטיים
        </p>
        <span {...spot("accent")} className="text-sm font-medium" style={{ color: link }}>
          הצגת כל סוגי האירועים
        </span>
      </div>
    </div>
  );
}

function EventCardPreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  return (
    <div className="p-5" style={{ background: t.pageBg }}>
      <div
        {...spot(["eventCardBg", "gold"], true)}
        className="mx-auto max-w-64 overflow-hidden rounded-2xl"
        style={{ background: t.eventCardBg, border: `1px solid ${fade(t.gold, 25)}` }}
      >
        <div className="aspect-[16/9] bg-gradient-to-br from-stone-300 to-stone-400" />
        <div className="p-4">
          <p {...spot("headings")} className="inline-block font-display text-xl" style={{ color: t.headings }}>
            חתונה
          </p>
          <p className="mt-1 text-xs" style={{ color: textOn(t.eventCardBg, "muted") }}>
            ערב מושלם בגן ירוק, עם קייטרינג ועיצוב לבחירתכם.
          </p>
          <span
            {...spot(["secondaryButton", "secondaryButtonText"])}
            className="mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: t.secondaryButton, color: t.secondaryButtonText }}
          >
            פרטים נוספים
          </span>
        </div>
      </div>
    </div>
  );
}

function FloatingPreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  return (
    <div className="flex items-center justify-center gap-4 bg-stone-100 p-6">
      <span
        {...spot(["primaryButton", "primaryButtonText"])}
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        style={{ background: t.primaryButton, color: t.primaryButtonText }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.17-1.52a9.86 9.86 0 0 0 4.87 1.28h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
        </svg>
      </span>
      <span
        {...spot(["secondaryButton", "secondaryButtonText"])}
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        style={{ background: t.secondaryButton, color: t.secondaryButtonText }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2Z" />
        </svg>
      </span>
    </div>
  );
}

function PriceTablePreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  const line = `1px solid ${t.priceTableBorder}`;
  return (
    <div className="p-5" style={{ background: t.pageBg }}>
      <div
        {...spot(["priceTableBg", "priceTableBorder"], true)}
        className="overflow-hidden rounded-2xl text-sm"
        style={{ background: t.priceTableBg, border: line }}
      >
        <div {...spot("priceTableHeaderBg", true)} className="px-4 py-3" style={{ background: t.priceTableHeaderBg, borderBottom: line }}>
          <span {...spot("priceTableHeaderText")} className="text-base font-semibold" style={{ color: t.priceTableHeaderText }}>
            מחירון
          </span>
        </div>
        {[
          ["אולם + קייטרינג", "180 ₪ לאדם"],
          ["הגברה ותאורה", "2,500 ₪"],
        ].map(([item, price], index) => (
          <div key={item} className="flex justify-between px-4 py-3" style={index ? { borderTop: line } : undefined}>
            <span {...spot("priceTableRowText")} style={{ color: t.priceTableRowText }}>
              {item}
            </span>
            <span {...spot("priceTablePriceText")} className="font-semibold" style={{ color: t.priceTablePriceText }}>
              {price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterPreview({ t }: { t: ThemeColors }) {
  const spot = useSpot();
  return (
    <div
      {...spot("footerBg", true)}
      className="flex items-center justify-between px-5 py-5 text-xs"
      style={{ background: t.footerBg, color: textOn(t.footerBg, "footerMuted") }}
    >
      <span className="font-display text-lg" style={{ color: t.gold }}>
        ROY
      </span>
      <span>© אולם אירועים רוי</span>
    </div>
  );
}

const GROUPS: Group[] = [
  {
    title: "סרגל עליון ותפריט",
    Preview: HeaderPreview,
    fields: [
      { key: "headerBg", label: "רקע הסרגל והתפריט", hint: "צבע הטקסט בתפריט נבחר אוטומטית", alpha: true },
      { key: "gold", label: "זהב", hint: "כפתור התפריט וקווים עדינים. משמש גם במסגרות הקארדים, באייקוני יצירת הקשר ובעלים שברקע" },
    ],
  },
  {
    title: "תמונה ראשית וטאבים",
    note: "על התמונה עצמה יש הכהיה עדינה, כך שטקסט בהיר נשאר קריא על כל תמונה.",
    Preview: HeroPreview,
    fields: [
      { key: "heroTitle", label: "צבע הכותרת", hint: "הכותרת הגדולה במרכז התמונה" },
      { key: "heroSubtitle", label: "צבע תת-הכותרת", hint: "השורה שמתחת לכותרת", alpha: true },
      { key: "heroBg", label: "רקע מאחורי התמונה", hint: "נראה רק כשלא הועלו תמונה או סרטון" },
      { key: "heroCardBg", label: "רקע פס הטאבים", alpha: true },
      { key: "heroCardBorder", label: "קווי פס הטאבים", hint: "הקו מעל ומתחת לפס" },
      { key: "heroChipText", label: "טקסט הטאבים", hint: "שמות הקטגוריות" },
      { key: "heroChipActiveBg", label: "טאב נבחר", hint: "הטקסט והקו של הטאב הפעיל" },
      { key: "heroChipBorder", label: "קו במעבר עכבר", hint: "הקו שמופיע מתחת לטאב כשמצביעים עליו" },
    ],
  },
  {
    title: "רקעים, כותרות וקישורים",
    Preview: PagePreview,
    fields: [
      { key: "sectionBg", label: "רקע מקטעי תוכן", hint: "אודות וצור קשר", alpha: true },
      { key: "pageBg", label: "רקע כללי", hint: "מקטע סוגי האירועים ועמודי האירועים" },
      { key: "headings", label: "כותרות", hint: "כותרות המקטעים והקארדים בכל האתר" },
      { key: "accent", label: "קישורים", hint: "קישורים כמו ״הצגת כל סוגי האירועים״, ומעבר עכבר על הטלפון והמייל" },
    ],
  },
  {
    title: "קארד סוג אירוע",
    Preview: EventCardPreview,
    fields: [
      { key: "eventCardBg", label: "רקע הקארד", hint: "צבע התיאור נבחר אוטומטית", alpha: true },
      { key: "secondaryButton", label: "כפתור ״פרטים נוספים״ - רקע", hint: "גם כפתור הטלפון הצף" },
      { key: "secondaryButtonText", label: "כפתור ״פרטים נוספים״ - טקסט", hint: "גם האייקון בכפתור הטלפון הצף" },
    ],
  },
  {
    title: "כפתורים צפים",
    note: "הכפתורים העגולים בפינת המסך. כפתור הטלפון משתמש בצבעי ״פרטים נוספים״ מהקארד.",
    Preview: FloatingPreview,
    fields: [
      { key: "primaryButton", label: "כפתור וואטסאפ - רקע" },
      { key: "primaryButtonText", label: "כפתור וואטסאפ - אייקון" },
    ],
  },
  {
    title: "טבלת מחירים",
    Preview: PriceTablePreview,
    fields: [
      { key: "priceTableHeaderBg", label: "רקע הכותרת", alpha: true },
      { key: "priceTableHeaderText", label: "טקסט הכותרת" },
      { key: "priceTableBg", label: "רקע השורות", alpha: true },
      { key: "priceTableRowText", label: "טקסט השורות" },
      { key: "priceTablePriceText", label: "המחיר" },
      { key: "priceTableBorder", label: "מסגרת וקווים" },
    ],
  },
  {
    title: "פוטר",
    Preview: FooterPreview,
    fields: [{ key: "footerBg", label: "רקע הפוטר", hint: "צבע הטקסט נבחר אוטומטית" }],
  },
];

function ColorRow({
  field,
  value,
  pinned,
  onChange,
  onHover,
  onLocate,
}: {
  field: Field;
  value: string;
  pinned: boolean;
  onChange: (v: string) => void;
  onHover: (on: boolean) => void;
  onLocate: () => void;
}) {
  const defaultValue = DEFAULT_THEME[field.key];
  const valid = isHexColor(value);
  const base = valid ? hexBase(value) : defaultValue;
  const opacity = valid ? hexOpacity(value) : 100;

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className={`rounded-xl border p-3 transition ${
        pinned ? "border-pink-400 bg-pink-50/60" : "border-stone-200 hover:border-stone-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={base}
          onChange={(e) => onChange(withOpacity(e.target.value, opacity))}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-stone-300 bg-white p-0.5"
          aria-label={field.label}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-800">{field.label}</p>
          {field.hint && <p className="text-xs text-stone-500">{field.hint}</p>}
        </div>
        <button
          type="button"
          onClick={onLocate}
          aria-pressed={pinned}
          className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            pinned
              ? "border-pink-500 bg-pink-500 text-white"
              : "border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="7" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          איפה זה?
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 ps-[3.25rem]">
        <input
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          aria-label={`${field.label} - קוד צבע`}
          className={`w-24 rounded-lg border px-2 py-1 font-mono text-xs ${valid ? "border-stone-300" : "border-red-400"}`}
        />
        {field.alpha && (
          <label className="flex flex-1 items-center gap-2 text-xs text-stone-500">
            שקיפות
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => onChange(withOpacity(base, Number(e.target.value)))}
              className="h-1.5 min-w-16 flex-1 cursor-pointer accent-pink-500"
            />
            <span className="w-9 text-left" dir="ltr">
              {opacity}%
            </span>
          </label>
        )}
        {value !== defaultValue && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="rounded-lg px-2 py-1 text-xs text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
          >
            ברירת מחדל
          </button>
        )}
      </div>
    </div>
  );
}

export function ThemeEditor({ theme, heroText, onChange }: ThemeEditorProps) {
  const [hovered, setHovered] = useState<Key | null>(null);
  const [pinned, setPinned] = useState<Key | null>(null);
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]);

  // While a hex code is half-typed, preview the color the site would fall back to.
  const shown = Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      key,
      isHexColor(value) ? value : DEFAULT_THEME[key as Key],
    ]),
  ) as ThemeColors;

  function locate(key: Key, groupIndex: number) {
    const next = pinned === key ? null : key;
    setPinned(next);
    if (next) {
      const target = previewRefs.current[groupIndex]?.querySelector(`[data-spot~="${key}"]`);
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return (
    <SpotContext.Provider value={hovered ?? pinned}>
      <div className="space-y-6">
        <p className="text-sm text-stone-500">
          כל רכיב באתר מוצג כאן עם הצבעים שלו, והשינויים מופיעים בתצוגה מיד.
          הצביעו על צבע או לחצו ״איפה זה?״ כדי לראות מה הוא צובע. האתר עצמו
          יתעדכן אחרי שמירה.
        </p>

        {GROUPS.map(({ title, note, fields, Preview }, groupIndex) => (
          <section key={title} className="rounded-2xl border border-stone-200 p-4 sm:p-5">
            <h3 className="text-base font-semibold text-stone-900">{title}</h3>
            {note && <p className="mt-0.5 text-xs text-stone-500">{note}</p>}
            <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
              <div
                ref={(el) => {
                  previewRefs.current[groupIndex] = el;
                }}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white lg:sticky lg:top-4"
              >
                <Preview t={shown} heroText={heroText} />
              </div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <ColorRow
                    key={field.key}
                    field={field}
                    value={theme[field.key]}
                    pinned={pinned === field.key}
                    onChange={(v) => onChange({ ...theme, [field.key]: v })}
                    onHover={(on) =>
                      setHovered((current) => (on ? field.key : current === field.key ? null : current))
                    }
                    onLocate={() => locate(field.key, groupIndex)}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </SpotContext.Provider>
  );
}
