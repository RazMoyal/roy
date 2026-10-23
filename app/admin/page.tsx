import { AdminPanel } from "@/components/admin/AdminPanel";

export const instant = false;

export const metadata = {
  title: "ניהול | אולם רוי",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-100" dir="rtl">
      <AdminPanel />
    </div>
  );
}
