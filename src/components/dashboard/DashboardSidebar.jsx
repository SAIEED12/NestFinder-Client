import { auth } from "@/lib/auth";
import {
    Bars,
    BookOpen,
    Heart,
    Receipt
} from "@gravity-ui/icons"; // 👈 Removed Users from here
import { Button, Drawer } from "@heroui/react";
import { Building2Icon, Home, InboxIcon, UserCircle2, LayoutDashboard, PlusSquare, Users } from "lucide-react"; // 👈 Added Users here
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardSidebar() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user
    const role = user?.role

    const dashboardItems = {
    'tenant': [
        { icon: BookOpen, label: "My Bookings", link: "/dashboard/tenant/bookings" },
        { icon: Heart, label: "Favorites", link: "/dashboard/tenant/favorites" },
        { icon: UserCircle2, label: "Profile", link: "/dashboard/tenant/profile" }
    ],
    'owner': [
        { icon: LayoutDashboard, label: "Home", link: "/dashboard/owner/home" },
        { icon: PlusSquare, label: "Add Property", link: "/dashboard/owner/add-property" },
        { icon: Home, label: "My Properties", link: "/dashboard/owner/my-properties" },
        { icon: InboxIcon, label: "Booking Requests", link: "/dashboard/owner/booking-requests" },
        { icon: UserCircle2, label: "Profile", link: "/dashboard/owner/profile" }
    ],
    'admin': [
        { icon: Users, label: "All Users", link: "/dashboard/admin/all-users" },
        { icon: Building2Icon, label: "All Properties", link: "/dashboard/admin/all-properties" },
        { icon: BookOpen, label: "All Bookings", link: "/dashboard/admin/all-bookings" },
        { icon: Receipt, label: "Transactions", link: "/dashboard/admin/transactions" },
        { icon: UserCircle2, label: "Profile", link: "/dashboard/admin/profile" }
    ]
    };

    const navItems = dashboardItems[role] || [];
  
  return (
    <Drawer>
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>

      <nav className="flex flex-col gap-1 border-r border-divider w-[220px] h-screen p-4 bg-background">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 px-3 py-4 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E05638] text-white shadow-sm shrink-0">
            <Home size={18} strokeWidth={2.5} />
          </div>
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            NestFinder
          </Link>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Link
            href={item.link}
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-default-100 dark:hover:bg-zinc-800"
            type="button"
          >
            <item.icon className="size-5 text-default-500" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    type="button"
                  >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}