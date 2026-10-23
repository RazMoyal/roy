import Link from "next/link";

type EventPageHeaderProps = {
  title: string;
};

export function EventPageHeader({ title }: EventPageHeaderProps) {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <Link
          href="/#events"
          className="text-sm font-medium text-amber-800 hover:underline"
        >
          → חזרה לכל האירועים
        </Link>
        <h1 className="mt-3 text-3xl font-semibold sm:mt-4 sm:text-4xl text-heading">{title}</h1>
      </div>
    </div>
  );
}
