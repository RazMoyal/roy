"use client";

import Image from "next/image";
import type { GalleryImage } from "@/types/content";

type ImageManagerProps = {
  slug: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
};

export function ImageManager({ slug, images, onChange }: ImageManagerProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return;
    const { id, url } = (await res.json()) as { id: string; url: string };
    const maxOrder = images.reduce((m, i) => Math.max(m, i.order), -1);
    onChange([...images, { id, url, order: maxOrder + 1 }]);
  }

  async function handleDelete(image: GalleryImage) {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, url: image.url }),
    });
    onChange(images.filter((i) => i.id !== image.id));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...sorted];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-sm text-stone-600 hover:border-amber-400">
        <span className="font-medium text-stone-800">העלאת תמונה</span>
        <span className="mt-1 text-xs">PNG, JPG, WebP</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
      </label>

      <ul className="space-y-3">
        {sorted.map((image, index) => (
          <li
            key={image.id}
            className="flex items-center gap-3 rounded-xl sm:gap-4 border border-stone-200 bg-white p-3"
          >
            <div className="relative h-14 w-20 shrink-0 sm:h-16 sm:w-24 overflow-hidden rounded-lg bg-stone-100">
              <Image src={image.url} alt="" fill className="object-cover" />
            </div>
            <span className="min-w-0 flex-1 truncate text-xs text-stone-500">
              {image.url}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sorted.length - 1}
                className="rounded border border-stone-200 px-2 py-1 text-xs disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(image)}
                className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
              >
                מחק
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
