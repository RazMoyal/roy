"use client";

import type { EventContent } from "@/types/content";
import { ImageManager } from "@/components/admin/ImageManager";
import { CoverImageEditor } from "@/components/admin/CoverImageEditor";

type EventEditorProps = {
  slug: string;
  event: EventContent;
  onChange: (event: EventContent) => void;
};

export function EventEditor({ slug, event, onChange }: EventEditorProps) {
  return (
    <div className="space-y-6">
      <label className="block text-sm">
        <span className="font-medium text-stone-700">כותרת בעמוד</span>
        <input
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          value={event.title}
          onChange={(e) => onChange({ ...event, title: e.target.value })}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-stone-700">טקסט / תיאור</span>
        <textarea
          rows={5}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          value={event.description}
          onChange={(e) => onChange({ ...event, description: e.target.value })}
        />
      </label>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          תמונה ראשית (בקארד בעמוד הבית)
        </h3>
        <CoverImageEditor
          slug={slug}
          coverUrl={event.coverUrl}
          images={event.images}
          onChange={(coverUrl) => onChange({ ...event, coverUrl })}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          גלריית תמונות (סדר התצוגה באתר)
        </h3>
        <ImageManager
          slug={slug}
          images={event.images}
          onChange={(images) => onChange({ ...event, images })}
        />
      </div>
    </div>
  );
}
