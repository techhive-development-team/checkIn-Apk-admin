import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../../assets/profile.jpg";
import { baseUrl } from "../../../enum/urls";
import { useAuthStore } from "../../../stores/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutModalRef = useRef<HTMLDialogElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const openLogoutModal = () => logoutModalRef.current?.showModal();
  const handleLogout = () => {
    logoutModalRef.current?.close();
    logout();
    window.location.href = "/login";
  };

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const displayName = user?.name || "User";
  const displayImage = user?.logo
    ? `${baseUrl.replace(/\/$/, "")}${user?.logo}`
    : profile;

  return (
    <>
      <div className="h-19 w-full navbar app-navbar px-6 py-4 border-b app-border">
        <label
          htmlFor="my-drawer"
          className="btn btn-square btn-ghost lg:hidden hover:bg-base-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

        <div className="flex flex-1 items-center">
          <img
            src="/checkin-logo.png"
            alt="CheckIn logo"
            className="h-8 w-auto -translate-y-1.5 object-contain md:h-8"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <label
            className="toggle text-base-content app-theme-toggle"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            <input
              type="checkbox"
              value="dark"
              className="theme-controller"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>
            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>

          <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost flex items-center gap-3 px-3 app-profile-trigger"
          >
            <div className="w-10 h-10 overflow-hidden border border-base-300 rounded-full">
              <img
                src={displayImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base-content/80 app-profile-text">
              {displayName}
            </span>
          </div>

          <ul className="menu menu-lg dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow">
            <li>
              <button
                className="justify-between w-full text-left"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button onClick={openLogoutModal} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
        </div>
      </div>

      <dialog className="modal" ref={logoutModalRef}>
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-4">Confirm Logout</h3>
          <p className="text-base-content/70">
            Are you sure you want to logout?
          </p>
          <div className="modal-action flex gap-3">
            <button
              className="btn btn-ghost"
              onClick={() => logoutModalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-error"
            >
              Yes, Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Navbar;
