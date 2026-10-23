"use client";

import { useState, useSyncExternalStore } from "react";

type PageLinkProps = {
  pagePath: string;
};

const subscribe = () => () => {};

export function PageLink({ pagePath }: PageLinkProps) {
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => "",
  );
  const pageUrl = `${origin}${pagePath}`;
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
      <span className="font-medium text-stone-700">קישור לעמוד:</span>
      <a
        href={pagePath}
        target="_blank"
        rel="noreferrer"
        dir="ltr"
        className="min-w-0 flex-1 truncate text-amber-800 hover:underline"
      >
        {pageUrl}
      </a>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-stone-100"
      >
        {copied ? "הועתק ✓" : "העתקת קישור"}
      </button>
    </div>
  );
}
