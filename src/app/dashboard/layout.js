import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex bg-background">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />
        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {/* Navbar */}
          <div className="border border-gray-300">Navbar</div>
          <main className="p-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}