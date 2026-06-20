import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ClientSidebar from "./ClientSidebar.jsx";


export default async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || 'tenant';

  const dashboardItems = {
    tenant: [
      { icon: "BookOpen", label: "My Bookings", link: "/dashboard/tenant/bookings" },
      { icon: "Heart", label: "Favorites", link: "/dashboard/tenant/favorites" },
      { icon: "UserCircle2", label: "Profile", link: "/dashboard/tenant/profile" },
    ],
    owner: [
      { icon: "LayoutDashboard", label: "Home", link: "/dashboard/owner/home" },
      { icon: "PlusSquare", label: "Add Property", link: "/dashboard/owner/add-property" },
      { icon: "Home", label: "My Properties", link: "/dashboard/owner/my-properties" },
      { icon: "InboxIcon", label: "Booking Requests", link: "/dashboard/owner/booking-requests" },
      { icon: "UserCircle2", label: "Profile", link: "/dashboard/owner/profile" },
    ],
    admin: [
      { icon: "Users", label: "All Users", link: "/dashboard/admin/all-users" },
      { icon: "Building2Icon", label: "All Properties", link: "/dashboard/admin/all-properties" },
      { icon: "BookOpen", label: "All Bookings", link: "/dashboard/admin/all-bookings" },
      { icon: "Receipt", label: "Transactions", link: "/dashboard/admin/transactions" },
      { icon: "UserCircle2", label: "Profile", link: "/dashboard/admin/profile" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  return <ClientSidebar navItems={navItems} />;
}