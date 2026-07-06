import { NavLink, useLocation } from "react-router-dom";
import { employeeSidebarRoutes, type SidebarRoute, sidebarRoutes, userSidebarRoutes } from "./sidebarRoutes.tsx";
import { useEffect, useState } from "react";
import { useGetUserById } from "../../../hooks/useGetUser";
import { useAuthStore } from "../../../stores/authStore";

const Sidebar = () => {
  const location = useLocation();
  const role = useAuthStore((state) => state.user?.role);
  const userId = useAuthStore((state) => state.user?.userId);
  const token = useAuthStore((state) => state.token);

  const [sideBar, setSideBar] = useState<SidebarRoute[]>([]);
  const { data: userData } = useGetUserById(userId || "");

  useEffect(() => {
    if (!token || !role) return;

    if (role === "ADMIN") {
      setSideBar(sidebarRoutes);
    } else if (role === "CLIENT") {
      const isCompanyType = userData?.company?.type === "Company";
      const clientRoutes = isCompanyType
        ? userSidebarRoutes.filter((route) => route.path !== "/student")
        : userSidebarRoutes;
      setSideBar(clientRoutes);
    } else {
      setSideBar(employeeSidebarRoutes);
    }
  }, [location.pathname, role, token, userData?.company?.type]);

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer") as HTMLInputElement;
    if (drawer && drawer.checked) drawer.checked = false;
  };

  const isRouteActive = (routePath: string) => {
    if (routePath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(routePath);
  };

  return (
    <aside className="w-64 app-sidebar h-full min-h-screen border-r app-border">
      <div className="px-6 py-6 border-b app-border">
        <h2 className="text-lg font-semibold text-base-content">Navigation</h2>
      </div>

      <nav className="py-4">
        <ul className="menu px-3 space-y-1">
          {sideBar.map((route, index) => {
            const isActive = isRouteActive(route.path);

            return (
              <li key={index}>
                <NavLink
                  to={route.path}
                  onClick={closeDrawer}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center shrink-0">
                    {route.icon}
                  </span>

                  <span className="text-base font-semibold">{route.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
