import type { Metadata } from "next";
import { Bellefair, Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

const bellefair = Bellefair({
  variable: "--font-bellefair",
  subsets: ["hebrew", "latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "אולם אירועים רוי",
  description: "אולם אירועים רוי לחתונות, בר/בת מצווה, אירועי חברה ועוד.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${bellefair.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-page-bg font-sans antialiased text-stone-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
