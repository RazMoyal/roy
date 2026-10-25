"use client";

import { useState } from "react";
import { SiteImage } from "@/components/common/SiteImage";

type BannerImageEditorProps = {
  slug: string;
  bannerUrl?: string;
  onChange: (bannerUrl: string | undefined) => void;
};

export function BannerImageEditor({
  slug,
  bannerUrl,
  onChange,
}: BannerImageEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeCurrent() {
    if (!bannerUrl) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, url: bannerUrl }),
    });
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
      await removeCurrent();
      onChange(url);
    } catch {
      setError("העלאת התמונה נכשלה — בדקו את החיבור לאינטרנט ונסו שוב");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    await removeCurrent();
    onChange(undefined);
  }

  return (
    <div className="space-y-3">
      {bannerUrl ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-stone-100">
          <SiteImage src={bannerUrl} alt="" fill className="object-cover" quality="auto:eco" />
        </div>
      ) : (
        <p className="text-xs text-stone-500">
          לא נבחרה תמונה — התמונה לא תוצג בעמוד.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-center text-xs font-medium hover:bg-stone-100">
          {uploading
            ? "מעלה תמונה..."
            : bannerUrl
              ? "החלפת התמונה"
              : "העלאת תמונה"}
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
        {bannerUrl && (
          <button
            type="button"
            onClick={() => void handleRemove()}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
          >
            הסרת התמונה
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
