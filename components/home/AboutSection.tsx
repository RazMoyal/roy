import type { HomeContent } from "@/types/content";

type AboutSectionProps = {
  content: Pick<HomeContent, "aboutTitle" | "aboutText">;
};

export function AboutSection({ content }: AboutSectionProps) {
  if (!content.aboutText?.trim()) {
    return null;
  }

  return (
    <section id="about" className="bg-section-bg py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl text-heading">
          {content.aboutTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-base sm:mt-6 sm:text-lg leading-relaxed text-stone-600">
          {content.aboutText}
        </p>
      </div>
    </section>
  );
}
