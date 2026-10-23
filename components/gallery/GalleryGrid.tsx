"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/content";
import { Lightbox } from "@/components/gallery/Lightbox";

type GalleryGridProps = {
  images: GalleryImage[];
  title: string;
};

export function GalleryGrid({ images, title }: GalleryGridProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-500">
        עדיין לא הועלו תמונות ל{title}. התמונות יופיעו כאן לאחר העלאה מעמוד הניהול.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
        {sorted.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:rounded-xl"
            aria-label={`הגדלת תמונה ${index + 1} מתוך ${sorted.length}`}
          >
            <Image
              src={image.url}
              alt={`${title} — תמונה ${index + 1}`}
              fill
              className="object-cover transition group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 33vw"
              // First row is above the fold (and usually the LCP), so skip lazy loading.
              loading={index < 3 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={sorted}
          title={title}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
