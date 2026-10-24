"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/content";

type CoverImageEditorProps = {
  slug: string;
  coverUrl?: string;
  images: GalleryImage[];
  onChange: (coverUrl: string | undefined) => void;
};

export function CoverImageEditor({
  slug,
  coverUrl,
  images,
  onChange,
}: CoverImageEditorProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const shownUrl = coverUrl || sorted[0]?.url;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A cover uploaded just for the card (not part of the gallery) is removed
  // from disk once it is replaced, so it doesn't linger in uploads.
  async function removeOldCover() {
    if (!coverUrl || images.some((i) => i.url === coverUrl)) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, url: coverUrl }),
    });
  }

  async function select(url: string | undefined) {
    if (url === coverUrl) return;
    await removeOldCover();
    onChange(url);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", slug);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          data?.error === "File must be an image"
            ? "סוג הקובץ לא נתמך — יש להעלות תמונה (JPG, PNG, WebP וכו׳)"
            : "העלאת התמונה נכשלה, נסו שוב",
        );
        return;
      }
      const { url } = (await res.json()) as { url: string };
      await select(url);
    } catch {
      setError("העלאת התמונה נכשלה — בדקו את החיבור לאינטרנט ונסו שוב");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:w-64">
          {shownUrl ? (
            <Image src={shownUrl} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-stone-500">
              אין תמונה
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs text-stone-500">
            {coverUrl
              ? "נבחרה תמונה ראשית ידנית."
              : "לא נבחרה תמונה — מוצגת התמונה הראשונה בגלריה."}
          </p>
          <label className="cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-center text-xs font-medium hover:bg-stone-100">
            {uploading ? "מעלה תמונה..." : "העלאת תמונה ראשית חדשה"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          {error && <p className="text-xs text-red-700">{error}</p>}
          {coverUrl && (
            <button
              type="button"
              onClick={() => void select(undefined)}
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
            >
              חזרה לתמונה הראשונה בגלריה
            </button>
          )}
        </div>
      </div>

      {sorted.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-stone-500">או בחירה מתוך הגלריה:</p>
          <ul className="flex flex-wrap gap-2">
            {sorted.map((image) => {
              const active = image.url === shownUrl;
              return (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => void select(image.url)}
                    className={`relative block h-14 w-20 overflow-hidden rounded-lg border-2 ${
                      active
                        ? "border-amber-500"
                        : "border-transparent hover:border-stone-300"
                    }`}
                    aria-label="בחירה כתמונה ראשית"
                  >
                    <Image src={image.url} alt="" fill className="object-cover" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
