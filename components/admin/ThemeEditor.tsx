"use client";

import type { ThemeColors } from "@/types/content";
import {
  DEFAULT_THEME,
  hexBase,
  hexOpacity,
  isHexColor,
  isLightColor,
  withOpacity,
} from "@/lib/theme";

type ThemeEditorProps = {
  theme: ThemeColors;
  onChange: (theme: ThemeColors) => void;
};

type Field = { key: keyof ThemeColors; label: string; hint: string };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "כפתורים",
    fields: [
      {
        key: "primaryButton",
        label: "כפתור ראשי - רקע",
        hint: "כפתור הוואטסאפ הצף",
      },
      {
        key: "primaryButtonText",
        label: "כפתור ראשי - טקסט",
        hint: "צבע האייקון על כפתור הוואטסאפ הצף",
      },
      {
        key: "secondaryButton",
        label: "כפתורי קארדים - רקע",
        hint: "״פרטים נוספים״ בקארדים של סוגי האירועים",
      },
      {
        key: "secondaryButtonText",
        label: "כפתורי קארדים - טקסט",
        hint: "צבע הטקסט על כפתורי הקארדים",
      },
    ],
  },
  {
    title: "רקעים",
    fields: [
      { key: "headerBg", label: "סרגל עליון", hint: "הפס עם הלוגו והתפריט" },
      { key: "heroBg", label: "כותרת ראשית", hint: "האזור הגדול בראש דף הבית" },
      {
        key: "pageBg",
        label: "רקע כללי",
        hint: "מקטע סוגי האירועים ועמודי האירועים",
      },
      {
        key: "eventCardBg",
        label: "קארדי סוגי אירועים",
        hint: "רקע הקארדים בדף הבית (מתחת לתמונה). טקסט התיאור מתאים את עצמו אוטומטית",
      },
      { key: "sectionBg", label: "מקטעי תוכן", hint: "אודות ויצירת קשר" },
      { key: "footerBg", label: "פוטר", hint: "הפס התחתון של האתר" },
    ],
  },
  {
    title: "טקסט והדגשות",
    fields: [
      { key: "headings", label: "כותרות", hint: "כותרות המקטעים והקארדים" },
      {
        key: "accent",
        label: "צבע מבטא",
        hint: "קישורים, ״אירועים בלבד״ ומסגרות מודגשות",
      },
      {
        key: "gold",
        label: "זהב",
        hint: "העלים העדינים ברקע סוגי האירועים, מסגרות קארדי האירועים, אייקוני יצירת הקשר והקו בתפריט",
      },
    ],
  },
  {
    title: "קארד בכותרת הראשית",
    fields: [
      {
        key: "heroCardBg",
        label: "רקע הקארד",
        hint: "הקארד מעל התמונה/סרטון בהירו. אטום כברירת מחדל - סרגל השקיפות מראה דרכו את הרקע",
      },
      { key: "heroCardTitle", label: "כותרת", hint: "הכותרת הגדולה בקארד" },
      { key: "heroCardText", label: "טקסט משנה", hint: "השורה שמתחת לכותרת" },
      {
        key: "heroCardBorder",
        label: "מסגרת",
        hint: "המסגרת הכפולה של הקארד",
      },
      {
        key: "heroChipText",
        label: "כפתורים בקארד - טקסט",
        hint: "״גלו את סוגי האירועים״, גלריות, אירועים פרטיים וכו׳",
      },
      {
        key: "heroChipBorder",
        label: "כפתורים בקארד - מסגרת",
        hint: "המסגרת והרקע במעבר עכבר",
      },
      {
        key: "heroChipActiveBg",
        label: "קטגוריה נבחרת - רקע",
        hint: "הכפתור של הקטגוריה המסוננת כרגע",
      },
      {
        key: "heroChipActiveText",
        label: "קטגוריה נבחרת - טקסט",
        hint: "צבע הטקסט על הקטגוריה הנבחרת",
      },
    ],
  },
  {
    title: "טבלת מחירים",
    fields: [
      {
        key: "priceTableHeaderBg",
        label: "רקע הכותרת",
        hint: "האזור העליון עם שם הטבלה",
      },
      {
        key: "priceTableHeaderText",
        label: "צבע הכותרת",
        hint: "הטקסט של שם הטבלה",
      },
      {
        key: "priceTableBg",
        label: "רקע הטבלה",
        hint: "רקע שורות הטבלה",
      },
      {
        key: "priceTableRowText",
        label: "צבע שם הפריט",
        hint: "השורות בטבלה (שם הפריט)",
      },
      {
        key: "priceTablePriceText",
        label: "צבע המחיר",
        hint: "המחיר המודגש בכל שורה",
      },
      {
        key: "priceTableBorder",
        label: "מסגרת וקווים",
        hint: "המסגרת החיצונית והקווים בין השורות",
      },
    ],
  },
];

/** Same contrast rule the site uses for text on a colored background. */
function textOn(bg: string, light = "#1c1917", dark = "#ffffff") {
  return isHexColor(bg) && isLightColor(bg) ? light : dark;
}

function ColorField({
  label,
  hint,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
}) {
  const valid = isHexColor(value);
  const base = valid ? hexBase(value) : defaultValue;
  const opacity = valid ? hexOpacity(value) : 100;

  return (
    <div className="rounded-xl border border-stone-200 p-4">
      <p className="text-sm font-medium text-stone-700">{label}</p>
      <p className="mt-0.5 text-xs text-stone-500">{hint}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={base}
          onChange={(e) => onChange(withOpacity(e.target.value, opacity))}
          className="h-10 w-14 cursor-pointer rounded border border-stone-300 bg-white p-1"
          aria-label={label}
        />
        <input
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          className={`w-28 rounded-lg border px-3 py-2 font-mono text-sm ${
            valid ? "border-stone-300" : "border-red-400"
          }`}
        />
        {value !== defaultValue && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-600 hover:bg-stone-50"
          >
            ברירת מחדל
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <label className="text-xs text-stone-500" htmlFor={`${label}-opacity`}>
          שקיפות
        </label>
        <input
          id={`${label}-opacity`}
          type="range"
          min={0}
          max={100}
          value={opacity}
          onChange={(e) => onChange(withOpacity(base, Number(e.target.value)))}
          className="h-1.5 flex-1 cursor-pointer accent-amber-600"
        />
        <span className="w-10 text-left text-xs text-stone-500" dir="ltr">
          {opacity}%
        </span>
      </div>
    </div>
  );
}

function Preview({ theme }: { theme: ThemeColors }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <div
        className="border-b border-stone-200/80 px-6 py-3 text-sm font-medium"
        style={{ background: theme.headerBg, color: textOn(theme.headerBg) }}
      >
        לוגו · אודות · אירועים · צור קשר
      </div>
      <div
        className="px-6 py-8"
        style={{ background: theme.heroBg, color: textOn(theme.heroBg) }}
      >
        <div
          className="mx-auto max-w-sm rounded-2xl border p-5 text-center"
          style={{
            background: theme.heroCardBg,
            borderColor: theme.heroCardBorder,
          }}
        >
          <p className="font-display text-xl" style={{ color: theme.heroCardTitle }}>
            אולם אירועים רוי
          </p>
          <p className="mt-1 text-xs" style={{ color: theme.heroCardText }}>
            חוויה בלתי נשכחת לכל סוגי האירועים
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span
              className="inline-flex rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                color: theme.heroChipText,
                borderColor: theme.heroChipBorder,
              }}
            >
              גלו את סוגי האירועים
            </span>
            <span
              className="inline-flex rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                background: theme.heroChipActiveBg,
                color: theme.heroChipActiveText,
                borderColor: "transparent",
              }}
            >
              קטגוריה נבחרת
            </span>
            <span
              className="inline-flex rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                color: theme.heroChipText,
                borderColor: theme.heroChipBorder,
              }}
            >
              גלריות
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 py-6" style={{ background: theme.sectionBg }}>
        <p className="text-lg font-semibold" style={{ color: theme.headings }}>
          למה רוי?
        </p>
      </div>
      <div className="px-6 py-6" style={{ background: theme.pageBg }}>
        <p className="text-lg font-semibold" style={{ color: theme.headings }}>
          סוגי אירועים
        </p>
        <p className="mt-1 text-xs font-medium" style={{ color: theme.accent }}>
          אירועים בלבד
        </p>
        <div
          className="mt-3 inline-block rounded-xl border border-stone-200 p-4"
          style={{ background: theme.eventCardBg }}
        >
          <p className="font-semibold" style={{ color: theme.headings }}>
            חתונה
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: textOn(theme.eventCardBg, "#57534e", "#d6d3d1") }}
          >
            גלריית תמונות ופרטים
          </p>
          <span
            className="mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: theme.secondaryButton,
              color: theme.secondaryButtonText,
            }}
          >
            פרטים נוספים
          </span>
        </div>
      </div>
      <div className="px-6 py-6" style={{ background: theme.pageBg }}>
        <div
          className="overflow-hidden rounded-xl"
          style={{
            background: theme.priceTableBg,
            border: `1px solid ${theme.priceTableBorder}`,
          }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: theme.priceTableHeaderBg,
              borderBottom: `1px solid ${theme.priceTableBorder}`,
            }}
          >
            <p
              className="text-sm font-semibold"
              style={{ color: theme.priceTableHeaderText }}
            >
              מחירון
            </p>
          </div>
          <div
            className="flex items-baseline justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${theme.priceTableBorder}` }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: theme.priceTableRowText }}
            >
              אולם + קייטרינג
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: theme.priceTablePriceText }}
            >
              180 ₪ לאדם
            </span>
          </div>
        </div>
      </div>
      <div
        className="px-6 py-4 text-xs"
        style={{
          background: theme.footerBg,
          color: textOn(theme.footerBg, "#44403c", "#d6d3d1"),
        }}
      >
        © אולם אירועים רוי
      </div>
    </div>
  );
}

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-stone-500">
        הצבעים חלים על כל עמודי האתר (לא על עמוד הניהול). צבע הטקסט על כפתורים
        ורקעים נבחר אוטומטית (בהיר או כהה) כדי שיהיה קריא - חוץ מהקארד בכותרת
        הראשית, שבו כל צבע נבחר בקבוצה שלו. השינוי ייראה באתר אחרי שמירה.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="mb-3 text-sm font-semibold text-stone-800">
            {group.title}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.fields.map(({ key, label, hint }) => (
              <ColorField
                key={key}
                label={label}
                hint={hint}
                value={theme[key]}
                defaultValue={DEFAULT_THEME[key]}
                onChange={(v) => onChange({ ...theme, [key]: v })}
              />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          תצוגה מקדימה
        </h3>
        <Preview theme={theme} />
      </section>
    </div>
  );
}
