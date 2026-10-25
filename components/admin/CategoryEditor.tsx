"use client";

import type { EventCategory, EventContent } from "@/types/content";
import { defaultCategory } from "@/lib/categories";
import { AddCategory } from "@/components/admin/AddCategory";
import { CategoryActions } from "@/components/admin/CategoryActions";
import { PriceTableEditor } from "@/components/admin/PriceTableEditor";

type CategoryEditorProps = {
  categories: Record<string, EventCategory>;
  events: Record<string, EventContent>;
  onChange: (categories: Record<string, EventCategory>) => void;
};

export function CategoryEditor({
  categories,
  events,
  onChange,
}: CategoryEditorProps) {
  const entries = Object.entries(categories);
  const eventEntries = Object.entries(events);

  function updateCategory(slug: string, category: EventCategory) {
    onChange({ ...categories, [slug]: category });
  }

  function toggleEventType(slug: string, eventSlug: string, checked: boolean) {
    const category = categories[slug];
    const eventTypeSlugs = checked
      ? [...category.eventTypeSlugs, eventSlug]
      : category.eventTypeSlugs.filter((s) => s !== eventSlug);
    updateCategory(slug, { ...category, eventTypeSlugs });
  }

  function moveCategory(slug: string, direction: -1 | 1) {
    const index = entries.findIndex(([s]) => s === slug);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= entries.length) return;
    const reordered = [...entries];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    onChange(Object.fromEntries(reordered));
  }

  function deleteCategory(slug: string) {
    onChange(Object.fromEntries(entries.filter(([s]) => s !== slug)));
  }

  function addCategory(slug: string, title: string) {
    onChange({ ...categories, [slug]: defaultCategory(title) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">קטגוריות אירועים</h2>
        <p className="mt-1 text-sm text-stone-500">
          כפתורי הקטגוריות מופיעים לצד הכפתור &quot;גלו את סוגי האירועים&quot;
          בעמוד הבית. קטגוריה מסוג &quot;רגיל&quot; מסננת את סוגי האירועים
          שמוצגים בעמוד הבית; קטגוריה מסוג &quot;גלריה&quot; פותחת דף נפרד שבו
          מוצגות כל התמונות של כל סוגי האירועים בקטגוריה, מתחת לשם כל סוג
          אירוע. ניתן לשייך סוג אירוע לכמה קטגוריות במקביל.
        </p>
      </div>

      <div className="space-y-4">
        {entries.map(([slug, category], index) => (
          <div
            key={slug}
            className="rounded-xl border border-stone-200 bg-stone-50/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <label className="min-w-0 flex-1 text-sm">
                <span className="font-medium text-stone-700">שם הקטגוריה</span>
                <input
                  value={category.title}
                  onChange={(e) =>
                    updateCategory(slug, { ...category, title: e.target.value })
                  }
                  className="mt-1 w-full max-w-sm rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900"
                />
                <span className="mt-1 block text-xs text-stone-500">
                  מזהה: <code className="rounded bg-stone-100 px-1">{slug}</code>
                </span>
              </label>
              <CategoryActions
                title={category.title || slug}
                canMoveUp={index > 0}
                canMoveDown={index < entries.length - 1}
                onMove={(direction) => moveCategory(slug, direction)}
                onDelete={() => deleteCategory(slug)}
              />
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-stone-700">
                סוג הקטגוריה
              </span>
              <div className="mt-2 flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800">
                  <input
                    type="radio"
                    name={`category-type-${slug}`}
                    checked={category.type !== "gallery"}
                    onChange={() =>
                      updateCategory(slug, { ...category, type: "regular" })
                    }
                    className="h-4 w-4 border-stone-300"
                  />
                  <span>
                    רגיל
                    <span className="mx-1 text-stone-400">·</span>
                    <span className="text-xs text-stone-500">
                      מסנן את רשימת סוגי האירועים בעמוד הבית
                    </span>
                  </span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800">
                  <input
                    type="radio"
                    name={`category-type-${slug}`}
                    checked={category.type === "gallery"}
                    onChange={() =>
                      updateCategory(slug, { ...category, type: "gallery" })
                    }
                    className="h-4 w-4 border-stone-300"
                  />
                  <span>
                    גלריה
                    <span className="mx-1 text-stone-400">·</span>
                    <span className="text-xs text-stone-500">
                      דף נפרד עם התמונות של כל סוגי האירועים בקטגוריה
                    </span>
                  </span>
                </label>
              </div>
              {category.type === "gallery" && (
                <a
                  href={`/categories/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-amber-800 hover:underline"
                >
                  צפייה בדף הגלריה ↗
                </a>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-stone-700">
                סוגי אירועים בקטגוריה
              </span>
              {eventEntries.length === 0 ? (
                <p className="mt-1 text-xs text-stone-500">
                  אין עדיין סוגי אירועים באתר.
                </p>
              ) : (
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {eventEntries.map(([eventSlug, event]) => (
                    <label
                      key={eventSlug}
                      className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                    >
                      <input
                        type="checkbox"
                        checked={category.eventTypeSlugs.includes(eventSlug)}
                        onChange={(e) =>
                          toggleEventType(slug, eventSlug, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      {event.title || eventSlug}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-stone-700">
                טבלאות מחירים לקטגוריה (מוצגות מעל רשימת סוגי האירועים בעמוד הבית)
              </span>
              <div className="mt-2">
                <PriceTableEditor
                  priceTables={category.priceTables}
                  onChange={(priceTables) =>
                    updateCategory(slug, { ...category, priceTables })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCategory existingSlugs={Object.keys(categories)} onAdd={addCategory} />
    </div>
  );
}
