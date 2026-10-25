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

      <div className="relative flex min-h-[640px] items-center justify-center px-4 py-20 sm:min-h-[780px] sm:px-6 sm:py-40">
        <div className="w-full max-w-2xl rounded-3xl bg-hero-card/65 p-6 text-center shadow-xl backdrop-blur-sm sm:p-10">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-hero-card-fg sm:text-5xl">
            {content.heroTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-hero-card-muted sm:mt-6 sm:text-lg">
            {content.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            <a
              href="#events"
              className="inline-flex items-center rounded-full border border-btn-primary/30 px-6 py-3 text-sm font-semibold text-btn-primary transition hover:bg-btn-primary/10"
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
                      ? "border-transparent bg-btn-secondary text-btn-secondary-fg"
                      : "border-btn-secondary/30 text-btn-secondary hover:bg-btn-secondary/10"
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
