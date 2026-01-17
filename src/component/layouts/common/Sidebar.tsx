import { NavLink, useLocation } from "react-router-dom";
import { sidebarRoutes } from "./sidebarRoutes.tsx";

const Sidebar = () => {
  const location = useLocation();

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
    <aside className="w-64 bg-base-100 h-full min-h-screen border-r border-base-300">
      <div className="px-6 py-6 border-b border-base-300">
        <h2 className="text-lg font-semibold text-base-content">Navigation</h2>
      </div>

      <nav className="py-4">
        <ul className="menu px-3 space-y-1">
          {sidebarRoutes.map((route, index) => {
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
                  <span className="text-xl">{route.icon}</span>

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
