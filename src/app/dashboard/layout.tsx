import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen md:flex bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar email={user?.email} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
