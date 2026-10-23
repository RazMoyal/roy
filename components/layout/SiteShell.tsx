import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { readSiteContent } from "@/lib/content";
import { buildThemeCss } from "@/lib/theme";

type SiteShellProps = {
  children: React.ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const { theme } = await readSiteContent();
  const themeCss = buildThemeCss(theme);

  return (
    <>
      {themeCss && <style>{themeCss}</style>}
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
