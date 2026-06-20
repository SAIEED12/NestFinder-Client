"use client";

import React from "react";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import { 
  BookOpen, Heart, UserCircle2, LayoutDashboard, 
  PlusSquare, Home, InboxIcon, Users, Building2Icon, Receipt,
  Menu // ← use lucide Menu icon instead of Bars from gravity-ui
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMap = {
  BookOpen, Heart, UserCircle2, LayoutDashboard,
  PlusSquare, Home, InboxIcon, Users, Building2Icon, Receipt
};

export default function ClientSidebar({ navItems }) {
  const state = useOverlayState();
  const pathname = usePathname();

  return (
    <>
      {/* 1. MOBILE RESPONSIVE LAYER CONTAINER */}
      <div className="lg:hidden">

        {/* A. FIXED MOBILE TRIGGER HEADER BAR */}
        <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 border-b border-divider bg-background h-16 shrink-0">
          <Button
            variant="bordered"
            className="flex items-center gap-2 text-foreground border-divider"
            onPress={state.open}
          >
            <Menu size={18} />
            Menu
          </Button>
          <span className="font-bold text-sm tracking-tight text-foreground">NestFinder</span>
        </div>

        {/* B. DRAWER */}
        <Drawer state={state}>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header className="border-b border-divider px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E05638] text-white">
                      <Home size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold tracking-tight text-foreground">NestFinder</span>
                  </div>
                </Drawer.Header>
                <Drawer.Body className="p-4">
                  <nav className="flex flex-col gap-1 w-full">
                    {navItems.map((item) => {
                      const isActive = pathname === item.link;
                      const IconComponent = iconMap[item.icon];
                      return (
                        <Link
                          key={item.label}
                          href={item.link}
                          onClick={state.close}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors w-full no-underline ${
                            isActive
                              ? "bg-[#E05638] text-white"
                              : "text-foreground hover:bg-default-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {IconComponent && (
                            <IconComponent className={`size-5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                          )}
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>

      {/* 2. PERMANENT DESKTOP SIDEBAR PANEL */}
      <aside className="hidden lg:flex flex-col gap-1 border-r border-divider w-[240px] h-screen p-4 bg-background shrink-0 sticky top-0">
        <div className="flex items-center gap-2.5 px-3 py-4 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E05638] text-white shadow-sm shrink-0">
            <Home size={18} strokeWidth={2.5} />
          </div>
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground no-underline">
            NestFinder
          </Link>
        </div>

        <nav className="flex flex-col gap-1 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            const IconComponent = iconMap[item.icon];
            return (
              <Link
                key={item.label}
                href={item.link}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors w-full no-underline ${
                  isActive
                    ? "bg-[#E05638] text-white"
                    : "text-foreground hover:bg-default-100 dark:hover:bg-zinc-800"
                }`}
              >
                {IconComponent && (
                  <IconComponent className={`size-5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}