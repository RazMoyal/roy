import Link from "next/link";
import type { HomeContent, SiteContent } from "@/types/content";
import { SiteImage } from "@/components/common/SiteImage";

type HeroProps = {
  content: Pick<HomeContent, "heroTitle" | "heroSubtitle" | "heroMediaUrl" | "heroMediaType">;
  categories: SiteContent["categories"];
  activeCategorySlug?: string | null;
};

export function Hero({ content, categories, activeCategorySlug }: HeroProps) {
  const categoryEntries = Object.entries(categories);
  const { heroMediaUrl, heroMediaType } = content;

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-hero-bg sm:min-h-[780px]">
      {heroMediaUrl ? (
        heroMediaType === "video" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroMediaUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <SiteImage
            src={heroMediaUrl}
            alt=""
            fill
            className="object-cover"
            quality="auto:good"
          />
        )
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-hero-bg to-hero-bg" />
      )}
      {heroMediaUrl && <div className="absolute inset-0 bg-black/10" />}

      {/* The card is lifted above the photo. */}
      <div className="relative z-30 flex min-h-[640px] items-center justify-center px-4 py-24 sm:min-h-[780px] sm:px-6 sm:py-40">
        <div className="hero-card-enter relative w-full max-w-2xl rounded-[2rem] border border-hero-card-border/50 bg-hero-card p-7 text-center shadow-[0_2px_6px_rgb(0_0_0/0.25),0_24px_48px_-12px_rgb(0_0_0/0.55),0_60px_120px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.15),0_0_70px_-10px_color-mix(in_oklab,var(--color-hero-card-border)_35%,transparent)] backdrop-blur-md sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[1.6rem] border border-hero-card-border/15 sm:inset-3" />
          <h1 className="font-display text-4xl leading-[1.15] text-hero-card-title sm:text-6xl">
            {content.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-hero-card-text sm:mt-6 sm:text-lg">
            {content.heroSubtitle}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            <a
              href="#events"
              className="inline-flex items-center rounded-full border border-hero-chip-border/40 px-5 py-2.5 text-sm font-medium text-hero-chip-fg transition hover:border-hero-chip-border hover:bg-hero-chip-border/15"
            >
              גלו את סוגי האירועים
            </a>
            {categoryEntries.map(([slug, category]) => {
              const active = slug === activeCategorySlug;
              const directSlug = category.eventTypeSlugs[0];
              const href =
                category.type === "gallery"
                  ? `/categories/${slug}`
                  : category.type === "direct" && directSlug
                    ? `/events/${directSlug}`
                    : `/?category=${slug}#events`;
              return (
                <Link
                  key={slug}
                  href={href}
                  className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-transparent bg-hero-chip-active text-hero-chip-active-fg"
                      : "border-hero-chip-border/40 text-hero-chip-fg hover:border-hero-chip-border hover:bg-hero-chip-border/15"
                  }`}
                >
                  {category.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
