"use client";

import type { HomeContent } from "@/types/content";

type HomeEditorProps = {
  home: HomeContent;
  onChange: (home: HomeContent) => void;
};

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const className =
    "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900";
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-700">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function HomeEditor({ home, onChange }: HomeEditorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="כותרת ראשית (Hero)"
        value={home.heroTitle}
        onChange={(heroTitle) => onChange({ ...home, heroTitle })}
      />
      <Field
        label="תת-כותרת (Hero)"
        value={home.heroSubtitle}
        onChange={(heroSubtitle) => onChange({ ...home, heroSubtitle })}
      />
      <Field
        label="כותרת אודות"
        value={home.aboutTitle}
        onChange={(aboutTitle) => onChange({ ...home, aboutTitle })}
      />
      <Field
        label="כותרת מקטע אירועים"
        value={home.eventsSectionTitle}
        onChange={(eventsSectionTitle) =>
          onChange({ ...home, eventsSectionTitle })
        }
      />
      <div className="sm:col-span-2">
        <Field
          label="טקסט אודות"
          value={home.aboutText}
          multiline
          onChange={(aboutText) => onChange({ ...home, aboutText })}
        />
      </div>
      <Field
        label="כותרת יצירת קשר"
        value={home.contactTitle}
        onChange={(contactTitle) => onChange({ ...home, contactTitle })}
      />
      <Field
        label="טלפון"
        value={home.phone}
        onChange={(phone) => onChange({ ...home, phone })}
      />
      <Field
        label="דוא״ל"
        value={home.email}
        onChange={(email) => onChange({ ...home, email })}
      />
      <div className="sm:col-span-2">
        <Field
          label="טקסט יצירת קשר"
          value={home.contactText}
          multiline
          onChange={(contactText) => onChange({ ...home, contactText })}
        />
      </div>
    </div>
  );
}
