import type { ReactNode } from "react";
import { Briefcase } from "lucide-react";
import EmployeeAnimatedIcon from "../../icons/EmployeeAnimatedIcon";
import AttendanceAnimatedIcon from "../../icons/AttendanceAnimatedIcon";
import HomeAnimatedIcon from "../../icons/HomeAnimatedIcon";
import LeaveAnimatedIcon from "../../icons/LeaveAnimatedIcon";
import StudentAnimatedIcon from "../../icons/StudentAnimatedIcon";
import UserAnimatedIcon from "../../icons/UserAnimatedIcon";

export interface SidebarRoute {
  path: string;
  name: string;
  icon: ReactNode;
}

const dashboardIcon = <HomeAnimatedIcon size={50} />;
const employeeIcon = <EmployeeAnimatedIcon size={50} />;
const attendanceIcon = <AttendanceAnimatedIcon size={50} />;
const studentIcon = <StudentAnimatedIcon size={50} />;
const leaveIcon = <LeaveAnimatedIcon size={50} />;
const userManagementIcon = <UserAnimatedIcon size={50} />;

export const sidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: dashboardIcon },
  { path: "/company", name: "Company Management", icon: <Briefcase size={18} /> },
  { path: "/employee", name: "Employee Management", icon: employeeIcon },
  { path: "/student", name: "Student Management", icon: studentIcon },
  { path: "/attendance", name: "Attendance Management", icon: attendanceIcon },
  { path: "/leave", name: "Leave Management", icon: leaveIcon },
  { path: "/user", name: "User Management", icon: userManagementIcon },
];

export const userSidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: dashboardIcon },
  { path: "/employee", name: "Employee Management", icon: employeeIcon },
  { path: "/student", name: "Student Management", icon: studentIcon },
  { path: "/attendance", name: "Attendance Management", icon: attendanceIcon },
  { path: "/leave", name: "Leave Management", icon: leaveIcon }
]

export const employeeSidebarRoutes: SidebarRoute[] = [
  { path: "/", name: "Dashboard", icon: dashboardIcon },
  { path: "/attendance", name: "Attendance Management", icon: attendanceIcon },
  { path: "/leave", name: "Leave Management", icon: leaveIcon }
]