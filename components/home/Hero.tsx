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
  const heroTitle = content.heroTitle?.trim();
  const heroSubtitle = content.heroSubtitle?.trim();

  const tabs = [
    { key: "all", title: "כל האירועים", href: "/#events", active: !activeCategorySlug },
    ...categoryEntries.map(([slug, category]) => {
      const directSlug = category.eventTypeSlugs[0];
      const href =
        category.type === "gallery"
          ? `/categories/${slug}`
          : category.type === "direct" && directSlug
            ? `/events/${directSlug}`
            : `/?category=${slug}#events`;
      return { key: slug, title: category.title, href, active: slug === activeCategorySlug };
    }),
  ];

  return (
    <section>
      <div className="relative isolate h-[55svh] min-h-[320px] overflow-hidden bg-hero-bg sm:h-[70svh] sm:max-h-[760px]">
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
              loading="eager"
              className="object-cover"
              quality="auto:good"
            />
          )
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-hero-bg to-hero-bg" />
        )}

        {/* Text over a soft dark wash so it reads on any photo. Each line
         * shows only if set; colors come from the admin (white by default). */}
        {(heroTitle || heroSubtitle) && (
          <>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.45),rgb(0_0_0/0.15)_70%)]" />
            <div className="relative flex h-full flex-col items-center justify-center px-4 text-center [text-shadow:0_2px_16px_rgb(0_0_0/0.5)] sm:px-6">
              {heroTitle && (
                <h1 className="font-display text-4xl leading-[1.15] text-hero-title sm:text-6xl">{heroTitle}</h1>
              )}
              {heroSubtitle && (
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-hero-subtitle sm:mt-6 sm:text-lg">
                  {heroSubtitle}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <nav aria-label="קטגוריות אירועים" className="border-y border-hero-card-border/40 bg-hero-card">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:justify-center sm:px-6 [scrollbar-width:none]">
          {tabs.map((tab) => (
            <li key={tab.key} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={`relative block px-4 py-4 text-sm font-medium whitespace-nowrap transition sm:px-5 sm:text-base after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition ${
                  tab.active
                    ? "text-hero-chip-active after:bg-hero-chip-active"
                    : "text-hero-chip-fg/80 after:bg-transparent hover:text-hero-chip-fg hover:after:bg-hero-chip-border/50"
                }`}
              >
                {tab.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
