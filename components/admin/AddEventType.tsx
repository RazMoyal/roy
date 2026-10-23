"use client";

import { useState } from "react";
import { isSlugFormat, toSlug, uniqueSlug } from "@/lib/event-types";

type AddEventTypeProps = {
  existingSlugs: string[];
  onAdd: (slug: string, title: string) => void;
};

export function AddEventType({ existingSlugs, onAdd }: AddEventTypeProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const cleanSlug = toSlug(slug);
  const slugError =
    slug.trim() === ""
      ? null
      : !isSlugFormat(cleanSlug)
        ? "אותיות באנגלית, מספרים ומקפים בלבד"
        : existingSlugs.includes(cleanSlug)
          ? "הכתובת כבר בשימוש"
          : null;

  function reset() {
    setTitle("");
    setSlug("");
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || slugError) return;
    onAdd(uniqueSlug(cleanSlug, existingSlugs), title.trim());
    reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-stone-300 px-3 py-2 text-right text-sm text-stone-700 hover:border-amber-400 hover:bg-white"
      >
        + הוספת סוג אירוע
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full space-y-3 rounded-lg border border-stone-200 bg-white p-3"
    >
      <label className="block text-xs">
        <span className="font-medium text-stone-700">שם סוג האירוע</span>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: יום הולדת"
          className="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block text-xs">
        <span className="font-medium text-stone-700">
          כתובת באנגלית (לא חובה)
        </span>
        <input
          dir="ltr"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="birthday"
          className={`mt-1 w-full rounded-lg border px-2 py-1.5 text-sm ${
            slugError ? "border-red-400" : "border-stone-300"
          }`}
        />
        <span
          className={`mt-1 block ${slugError ? "text-red-600" : "text-stone-500"}`}
        >
          {slugError ??
            `הקישור יהיה /events/${uniqueSlug(cleanSlug, existingSlugs)}`}
        </span>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim() || !!slugError}
          className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40"
        >
          הוספה
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
