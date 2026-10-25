import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactButtons } from "@/components/layout/FloatingContactButtons";
import { readSiteContent } from "@/lib/content";
import { buildThemeCss } from "@/lib/theme";

type SiteShellProps = {
  children: React.ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const { theme, home } = await readSiteContent();
  const themeCss = buildThemeCss(theme);

  return (
    <>
      {themeCss && <style>{themeCss}</style>}
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingContactButtons phone={home.phone} whatsappPhone={home.whatsappPhone} />
    </>
  );
}
