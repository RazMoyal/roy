import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-header-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Logo />
        <nav className="flex items-center gap-3 text-sm font-medium sm:gap-6 text-header-fg">
          <Link href="/#about" className="nav-link transition hover:text-amber-800">
            אודות
          </Link>
          <Link href="/#events" className="nav-link transition hover:text-amber-800">
            אירועים
          </Link>
          <Link href="/#contact" className="nav-link transition hover:text-amber-800">
            צור קשר
          </Link>
        </nav>
      </div>
    </header>
  );
}
