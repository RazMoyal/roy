import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-footer-bg text-footer-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo compact />
        <p className="text-sm text-footer-muted">
          © {new Date().getFullYear()} אולם אירועים רוי. כל הזכויות שמורות.
        </p>
        <Link
          href="/admin"
          className="text-xs text-footer-muted transition hover:text-footer-fg"
        >
          ניהול
        </Link>
      </div>
    </footer>
  );
}
