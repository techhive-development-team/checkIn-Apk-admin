import type { ReactNode } from "react";
import {
  Home,
  Briefcase,
  FileUser
} from "lucide-react";

export interface SidebarRoute {
  path: string;
  name: string;
  icon: ReactNode;
}

export const sidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: <Home size={18} /> },
  { path: "/company", name: "Company Mangement", icon: <Briefcase size={18} /> },
  { path: "/employee", name: "Employee Mangement", icon: <FileUser size={18} /> },
  { path: "/attendance", name: "Attendance Mangement", icon: <FileUser size={18} /> },
  { path: "/user", name: "User Mangement", icon: <FileUser size={18} /> },
  { path: "/billing", name: "Billing Mangement", icon: <FileUser size={18} /> },
];

export const userSidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: <Home size={18} /> },
  { path: "/employee", name: "Employee Mangement", icon: <FileUser size={18} /> },  
  { path: "/attendance", name: "Attendance Mangement", icon: <FileUser size={18} /> },
  { path: "/billing", name: "Billing Mangement", icon: <FileUser size={18} /> },
]
