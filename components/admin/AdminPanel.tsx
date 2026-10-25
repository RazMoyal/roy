"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { EventCategory, EventContent, SiteContent } from "@/types/content";
import { defaultEventContent } from "@/lib/event-types";
import { HomeEditor } from "@/components/admin/HomeEditor";
import { EventEditor } from "@/components/admin/EventEditor";
import { PageLink } from "@/components/admin/PageLink";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { AddEventType } from "@/components/admin/AddEventType";
import { EventTypeActions } from "@/components/admin/EventTypeActions";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

type Tab = "home" | string;

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("home");
  const [content, setContentState] = useState<SiteContent | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "saving" | "saved" | "error"
  >("loading");

  function setContent(next: SiteContent) {
    setContentState(next);
    setDirty(true);
  }

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to load content");
      const data = (await res.json()) as SiteContent;
      setContentState(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!content) return;
    setStatus("saving");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setDirty(false);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  function setEvents(events: Record<string, EventContent>) {
    if (content) setContent({ ...content, events });
  }

  function setCategories(categories: Record<string, EventCategory>) {
    if (content) setContent({ ...content, categories });
  }

  function addEventType(slug: string, title: string) {
    if (!content) return;
    setEvents({ ...content.events, [slug]: defaultEventContent(title) });
    setTab(slug);
  }

  function deleteEventType(slug: string) {
    if (!content) return;
    const events = Object.fromEntries(
      Object.entries(content.events).filter(([s]) => s !== slug),
    );
    const categories = Object.fromEntries(
      Object.entries(content.categories).map(([catSlug, category]) => [
        catSlug,
        {
          ...category,
          eventTypeSlugs: category.eventTypeSlugs.filter((s) => s !== slug),
        },
      ]),
    );
    setContent({ ...content, events, categories });
    setTab("home");
  }

  function moveEventType(slug: string, direction: -1 | 1) {
    if (!content) return;
    const entries = Object.entries(content.events);
    const index = entries.findIndex(([s]) => s === slug);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= entries.length) return;
    [entries[index], entries[target]] = [entries[target], entries[index]];
    setEvents(Object.fromEntries(entries));
  }

  if (!content) {
    return (
      <p className="p-8 text-center text-stone-500">
        {status === "loading" ? "טוען..." : "שגיאה בטעינת התוכן"}
      </p>
    );
  }

  const slugs = Object.keys(content.events);
  const eventIndex = slugs.indexOf(tab);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/uploads/ROY-Gold-logo-1.png"
            alt="רוי — אולם אירועים"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">ניהול אתר רוי</h1>
            <p className="mt-1 text-sm text-stone-500">
              שינויים נשמרים לקובץ התוכן ומשתקפים באתר מיד.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {status === "error" ? (
            <span className="text-sm text-red-700">השמירה נכשלה, נסו שוב</span>
          ) : (
            dirty && (
              <span className="text-sm text-amber-700">
                יש שינויים שלא נשמרו
              </span>
            )
          )}
          <Link
            href="/"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            צפייה באתר
          </Link>
          <button
            type="button"
            onClick={() => void save()}
            disabled={status === "saving"}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-60"
          >
            {status === "saving"
              ? "שומר..."
              : status === "saved"
                ? "נשמר ✓"
                : "שמירה"}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 shrink-0">
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            <button
              type="button"
              onClick={() => setTab("home")}
              className={`rounded-lg px-3 py-2 text-right text-sm ${
                tab === "home"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-800 hover:bg-stone-200"
              }`}
            >
              דף הבית
            </button>
            <button
              type="button"
              onClick={() => setTab("theme")}
              className={`rounded-lg px-3 py-2 text-right text-sm ${
                tab === "theme"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-800 hover:bg-stone-200"
              }`}
            >
              צבעי האתר
            </button>
            <button
              type="button"
              onClick={() => setTab("categories")}
              className={`rounded-lg px-3 py-2 text-right text-sm ${
                tab === "categories"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-800 hover:bg-stone-200"
              }`}
            >
              קטגוריות
            </button>
            {slugs.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setTab(slug)}
                className={`rounded-lg px-3 py-2 text-right text-sm ${
                  tab === slug
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                }`}
              >
                {content.events[slug].title || slug}
              </button>
            ))}
            <AddEventType existingSlugs={slugs} onAdd={addEventType} />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6">
          <PageLink
            key={tab}
            pagePath={
              tab === "home" || tab === "theme" || tab === "categories"
                ? "/"
                : `/events/${tab}`
            }
          />
          {tab === "home" ? (
            <HomeEditor
              home={content.home}
              onChange={(home) => setContent({ ...content, home })}
            />
          ) : tab === "theme" ? (
            <ThemeEditor
              theme={content.theme}
              onChange={(theme) => setContent({ ...content, theme })}
            />
          ) : tab === "categories" ? (
            <CategoryEditor
              categories={content.categories}
              events={content.events}
              onChange={setCategories}
            />
          ) : eventIndex >= 0 ? (
            <>
              <EventTypeActions
                key={tab}
                slug={tab}
                title={content.events[tab].title || tab}
                canMoveUp={eventIndex > 0}
                canMoveDown={eventIndex < slugs.length - 1}
                onMove={(direction) => moveEventType(tab, direction)}
                onDelete={() => deleteEventType(tab)}
              />
              <EventEditor
                slug={tab}
                event={content.events[tab]}
                onChange={(event) =>
                  setEvents({ ...content.events, [tab]: event })
                }
              />
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
