import { cookies } from "next/headers";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

export const instant = false;

export const metadata = {
  title: "ניהול | אולם רוי",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <div className="min-h-screen bg-stone-100" dir="rtl">
      {authed ? <AdminPanel /> : <AdminLogin />}
    </div>
  );
}
