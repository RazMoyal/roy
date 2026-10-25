import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-stone-900 transition hover:opacity-90"
    >
      <Image
        src="/uploads/ROY-Gold-logo-1.png"
        alt="רוי — אולם אירועים"
        width={compact ? 120 : 160}
        height={48}
        className="h-10 w-auto object-contain sm:h-11"
      />
    </Link>
  );
}
