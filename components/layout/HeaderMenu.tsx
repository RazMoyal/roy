"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HeaderMenuProps = {
  /** The about section only renders when it has text — don't link to nothing. */
  showAbout: boolean;
};

export function HeaderMenu({ showAbout }: HeaderMenuProps) {
  const links = [
    ...(showAbout ? [{ href: "/#about", label: "אודות" }] : []),
    { href: "/#events", label: "אירועים" },
    { href: "/#contact", label: "צור קשר" },
  ];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-gold transition hover:bg-gold/10"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <nav
        id="site-menu"
        hidden={!open}
        className="absolute start-0 top-full mt-3 w-56 rounded-2xl border border-gold/30 bg-header-bg p-2 shadow-xl"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-base font-medium text-header-fg transition hover:bg-gold/10 hover:text-gold"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
