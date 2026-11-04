import { Logo } from "@/components/layout/Logo";
import { HeaderMenu } from "@/components/layout/HeaderMenu";

type HeaderProps = {
  showAbout: boolean;
};

export function Header({ showAbout }: HeaderProps) {
  // RTL: the first child sits on the right — menu on the right, logo on the left.
  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-header-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <HeaderMenu showAbout={showAbout} />
        <Logo />
      </div>
    </header>
  );
}
