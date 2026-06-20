import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Remove <Navbar /> from here */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-zinc-950/20">
          {children}
        </main>
      </div>
    </div>
  );
}