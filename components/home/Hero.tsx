import Link from "next/link";
import type { HomeContent, SiteContent } from "@/types/content";

type HeroProps = {
  content: Pick<HomeContent, "heroTitle" | "heroSubtitle">;
  categories: SiteContent["categories"];
  activeCategorySlug?: string | null;
};

export function Hero({ content, categories, activeCategorySlug }: HeroProps) {
  const categoryEntries = Object.entries(categories);

  return (
    <section className="relative overflow-hidden bg-hero-bg text-hero-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-hero-bg to-hero-bg" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-32">
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {content.heroTitle}
        </h1>
        <p className="mt-4 max-w-xl text-base sm:mt-6 sm:text-lg leading-relaxed text-hero-muted">
          {content.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
          <a
            href="#events"
            className="inline-flex items-center rounded-full bg-btn-primary px-6 py-3 text-sm font-semibold text-btn-primary-fg transition hover:opacity-85"
          >
            גלו את סוגי האירועים
          </a>
          {categoryEntries.map(([slug, category]) => {
            const active = slug === activeCategorySlug;
            const href =
              category.type === "gallery"
                ? `/categories/${slug}`
                : `/?category=${slug}#events`;
            return (
              <Link
                key={slug}
                href={href}
                className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-transparent bg-hero-fg text-hero-bg"
                    : "border-hero-fg/30 text-hero-fg hover:bg-hero-fg/10"
                }`}
              >
                {category.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
