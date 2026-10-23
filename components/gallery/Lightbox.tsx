"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/content";

type LightboxProps = {
  images: GalleryImage[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Minimum horizontal finger travel (px) that counts as a swipe. */
const SWIPE_THRESHOLD = 50;

export function Lightbox({
  images,
  title,
  index,
  onIndexChange,
  onClose,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const image = images[index];

  const next = () => onIndexChange((index + 1) % count);
  const prev = () => onIndexChange((index - 1 + count) % count);

  // Open as a modal (Esc closes it natively) and stop the page behind it
  // from scrolling while it is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      dialog?.close();
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    // The site is RTL: the next image sits to the left.
    if (e.key === "ArrowLeft") next();
    else if (e.key === "ArrowRight") prev();
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD || count < 2) return;
    // RTL: swiping right brings in the next image from the left.
    if (dx > 0) next();
    else prev();
  }

  const navButton =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/30 sm:h-14 sm:w-14";

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black"
      aria-label={`${title} — תמונה ${index + 1} מתוך ${count}`}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        onClick={(e) => {
          // Clicking the dark area around the image closes the view.
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[80dvh] w-[94vw] sm:h-[86dvh] sm:w-[86vw]">
          <Image
            key={image.id}
            src={image.url}
            alt={`${title} — תמונה ${index + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            loading="eager"
          />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-5">
          <span
            dir="ltr"
            className="rounded-full bg-white/15 px-3 py-1 text-sm tabular-nums"
          >
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl leading-none transition hover:bg-white/30 sm:h-12 sm:w-12"
            aria-label="סגירה"
          >
            ×
          </button>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={`${navButton} right-2 sm:right-5`}
              aria-label="התמונה הקודמת"
            >
              ›
            </button>
            <button
              type="button"
              onClick={next}
              className={`${navButton} left-2 sm:left-5`}
              aria-label="התמונה הבאה"
            >
              ‹
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
