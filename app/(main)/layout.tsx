import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh min-h-0 overflow-hidden md:flex-row">
      <Sidebar />
      <TopNav />

      <main className="min-h-0 min-w-0 flex-1 scrollbar-none overflow-y-auto px-4 py-16 md:p-4">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}