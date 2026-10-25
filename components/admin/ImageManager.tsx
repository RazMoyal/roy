"use client";

import { useState } from "react";
import type { GalleryImage } from "@/types/content";
import { SiteImage } from "@/components/common/SiteImage";
import { UploadProgressModal, type UploadItem } from "@/components/admin/UploadProgressModal";

type ImageManagerProps = {
  slug: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
};

/** Uploads one file via XHR (not fetch) so we get real upload-progress events. */
function uploadWithProgress(
  file: File,
  slug: string,
  onProgress: (percent: number) => void,
): Promise<{ id: string; url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as { id: string; url: string });
        } catch {
          reject(new Error("העלאת התמונה נכשלה, נסו שוב"));
        }
        return;
      }
      let message = "העלאת התמונה נכשלה, נסו שוב";
      try {
        const data = JSON.parse(xhr.responseText) as { error?: string };
        if (data.error === "File must be an image") {
          message = "סוג הקובץ לא נתמך — יש להעלות תמונה (JPG, PNG, WebP וכו׳)";
        }
      } catch {
        /* keep the generic message */
      }
      reject(new Error(message));
    };
    xhr.onerror = () =>
      reject(new Error("העלאת התמונה נכשלה — בדקו את החיבור לאינטרנט ונסו שוב"));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);
    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

export function ImageManager({ slug, images, onChange }: ImageManagerProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const uploading = uploadItems.some((item) => item.status === "uploading");

  async function handleUploadMany(files: File[]) {
    const items: UploadItem[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      progress: 0,
      status: "uploading",
    }));
    setUploadItems(items);
    setShowModal(true);

    function updateItem(index: number, patch: Partial<UploadItem>) {
      setUploadItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      );
    }

    const results = await Promise.all(
      files.map((file, i) =>
        uploadWithProgress(file, slug, (progress) => updateItem(i, { progress }))
          .then((result) => {
            updateItem(i, { status: "done", progress: 100 });
            return result;
          })
          .catch((err: Error) => {
            updateItem(i, { status: "error", error: err.message });
            return null;
          }),
      ),
    );

    const uploaded = results.filter(
      (r): r is { id: string; url: string } => r !== null,
    );
    if (uploaded.length > 0) {
      const maxOrder = images.reduce((m, i) => Math.max(m, i.order), -1);
      onChange([
        ...images,
        ...uploaded.map((u, i) => ({ id: u.id, url: u.url, order: maxOrder + 1 + i })),
      ]);
    }
  }

  async function handleDelete(image: GalleryImage) {
    setConfirmingId(null);
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
        <span className="font-medium text-stone-800">
          {uploading ? "מעלה תמונות..." : "העלאת תמונות"}
        </span>
        <span className="mt-1 text-xs">אפשר לבחור כמה תמונות בבת אחת — PNG, JPG, WebP, HEIC</span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length > 0) void handleUploadMany(files);
          }}
        />
      </label>

      {showModal && (
        <UploadProgressModal
          items={uploadItems}
          onClose={() => {
            setShowModal(false);
            setUploadItems([]);
          }}
        />
      )}

      <ul className="space-y-3">
        {sorted.map((image, index) => (
          <li
            key={image.id}
            className="flex items-center gap-3 rounded-xl sm:gap-4 border border-stone-200 bg-white p-3"
          >
            <div className="relative h-14 w-20 shrink-0 sm:h-16 sm:w-24 overflow-hidden rounded-lg bg-stone-100">
              <SiteImage
                src={image.url}
                alt=""
                fill
                className="object-cover"
                loading="lazy"
                quality="auto:eco"
              />
            </div>
            <span className="min-w-0 flex-1 truncate text-xs text-stone-500">
              {image.url}
            </span>
            {confirmingId === image.id ? (
              <div className="flex shrink-0 items-center gap-2 rounded-lg bg-red-50 px-2 py-1">
                <span className="text-xs text-red-800">למחוק את התמונה?</span>
                <button
                  type="button"
                  onClick={() => void handleDelete(image)}
                  className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
                >
                  מחיקה
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="rounded-md px-2 py-1 text-xs text-stone-600 hover:bg-white"
                >
                  ביטול
                </button>
              </div>
            ) : (
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
                  onClick={() => setConfirmingId(image.id)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  מחק
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
