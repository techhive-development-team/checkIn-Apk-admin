import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  UserCog
} from "lucide-react";

export interface SidebarRoute {
  path: string;
  name: string;
  icon: ReactNode;
}

export const sidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { path: "/company", name: "Company", icon: <Building2 size={18} /> },
  { path: "/employee", name: "Employee", icon: <Users size={18} /> },
  { path: "/attendance", name: "Attendance", icon: <CalendarCheck size={18} /> },
  { path: "/user", name: "User", icon: <UserCog size={18} /> },
];

export const userSidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { path: "/employee", name: "Employee", icon: <Users size={18} /> },
  { path: "/attendance", name: "Attendance", icon: <CalendarCheck size={18} /> },
];
