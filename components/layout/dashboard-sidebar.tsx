"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Package,
  FileText,
  Users,
  Settings,
  GraduationCap,
  Menu,
  ChevronDown,
  ChevronRight,
  Clock,
  FlaskConical,
  BookOpenText,
  LayoutGrid,
  Layers,
  Calendar,
  UserCheck,
  User,
  Building2,
  UserCog,
  AlarmClock,
  CalendarDays,
  DoorClosed,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

interface DashboardSidebarProps {
  user: User;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const filterItems = (items: SidebarItem[]) =>
    user.role === "admin" ? items : items.filter((item) => !item.adminOnly);

  const praktikumItems = filterItems([
    { title: "Mata Kuliah", href: "/dashboard/subjects", icon: BookOpenText },
    { title: "Program Studi", href: "/dashboard/study-program", icon: LayoutGrid },
    { title: "Kelas", href: "/dashboard/classes", icon: Layers },
    { title: "Data Semester", href: "/dashboard/data-semester", icon: Calendar },
    { title: "Pengampu Praktikum", href: "/dashboard/pengampu", icon: UserCheck },
    { title: "Waktu", href: "/dashboard/waktu", icon: AlarmClock },
    { title: "Hari", href: "/dashboard/days", icon: CalendarDays },
    { title: "Ruang Laboratorium", href: "/dashboard/labs", icon: FlaskConical }, // <- dipindah & diubah nama
    { title: "Jadwal Praktikum", href: "/dashboard/jadwal-praktikum", icon: DoorClosed },
  ]);

  const sdmItems = filterItems([
    { title: "Data Dosen", href: "/dashboard/lecturers", icon: GraduationCap },
    { title: "Data PLP", href: "/dashboard/plps", icon: User },
    { title: "Data UPT-LT", href: "/dashboard/upt-lts", icon: Building2 },
    { title: "Data Pengguna", href: "/dashboard/users", icon: UserCog, adminOnly: true },
  ]);

  const inventarisItems = filterItems([
    { title: "Daftar Barang", href: "/dashboard/items", icon: Package, adminOnly: true },
    { title: "Daftar Peminjaman", href: "/dashboard/borrowing", icon: FileText },
    { title: "Status Peminjaman", href: "/dashboard/borrowing-status", icon: Clock },
    // "Daftar Laboratorium" dihapus dari sini
  ]);

  const [open, setOpen] = useState({
    praktikum: true,
    sdm: true,
    inventaris: true,
  });

  const toggle = (section: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  const SidebarSection = (
    label: string,
    key: keyof typeof open,
    items: SidebarItem[]
  ) => (
    <div>
      <button
        onClick={() => toggle(key)}
        className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100 text-sm"
      >
        <div className="flex items-center space-x-2">
          <span>{label}</span>
        </div>
        {open[key] ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {open[key] && (
        <div className="ml-3 mt-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100",
                    isActive && "bg-blue-50 text-blue-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="/logo-ummi.png"
              alt="Logo TI"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-xl text-gray-900">LT - UMMI</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4 space-y-3">
        <nav className="space-y-2">
          {SidebarSection("🧪 Manajemen Praktikum", "praktikum", praktikumItems)}
          {SidebarSection("👥 Manajemen SDM", "sdm", sdmItems)}
          {SidebarSection("🧰 Inventaris Laboratorium", "inventaris", inventarisItems)}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <div className="fixed top-0 left-0 z-50 hidden h-screen w-64 flex-col border-r bg-white lg:flex">
        <SidebarContent />
      </div>

      {/* Sidebar mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
