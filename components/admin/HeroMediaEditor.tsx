"use client";

import { useState } from "react";
import { HOME_HERO_SLUG } from "@/lib/event-types";
import { SiteImage } from "@/components/common/SiteImage";

type HeroMediaEditorProps = {
  mediaUrl?: string;
  mediaType?: "image" | "video";
  onChange: (mediaUrl: string | undefined, mediaType: "image" | "video" | undefined) => void;
};

export function HeroMediaEditor({ mediaUrl, mediaType, onChange }: HeroMediaEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeCurrent() {
    if (!mediaUrl) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: HOME_HERO_SLUG, url: mediaUrl }),
    });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", HOME_HERO_SLUG);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          data?.error === "File must be an image or video"
            ? "סוג הקובץ לא נתמך — יש להעלות תמונה או סרטון"
            : "העלאת הקובץ נכשלה, נסו שוב",
        );
        return;
      }
      const { url, resourceType } = (await res.json()) as {
        url: string;
        resourceType: "image" | "video";
      };
      await removeCurrent();
      onChange(url, resourceType);
    } catch {
      setError("העלאת הקובץ נכשלה — בדקו את החיבור לאינטרנט ונסו שוב");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    await removeCurrent();
    onChange(undefined, undefined);
  }

  return (
    <div className="space-y-3">
      {mediaUrl ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-stone-100">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              className="h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <SiteImage src={mediaUrl} alt="" fill className="object-cover" quality="auto:eco" />
          )}
        </div>
      ) : (
        <p className="text-xs text-stone-500">
          לא נבחרה תמונה או סרטון — יוצג רקע צבעוני כברירת מחדל.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-center text-xs font-medium hover:bg-stone-100">
          {uploading
            ? "מעלה..."
            : mediaUrl
              ? "החלפת התמונה/סרטון"
              : "העלאת תמונה או סרטון"}
          <input
            type="file"
            accept="image/*,video/*"
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
        {mediaUrl && (
          <button
            type="button"
            onClick={() => void handleRemove()}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
          >
            הסרה
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
