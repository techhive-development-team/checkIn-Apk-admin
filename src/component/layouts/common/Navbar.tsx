import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../../assets/profile.jpg";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../../enum/urls";
import { useGetUserById } from "../../../hooks/useGetUser";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutModalRef = useRef<HTMLDialogElement>(null);

  const openLogoutModal = () => logoutModalRef.current?.showModal();
  const handleLogout = () => {
    logoutModalRef.current?.close();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode<{
    user: { userId: string };
  }>(token);

  const userId = decodedToken.user.userId;

  const { data: user } = useGetUserById(userId);

  const displayName = user?.name || "User";
  const displayImage = user?.logo
    ? `${baseUrl.replace(/\/$/, "")}${user.logo}`
    : profile;

  return (
    <>
      <div className="h-19 w-full navbar bg-base-100 px-6 py-4 border-b border-base-300">
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

        <div className="flex-1 hidden md:block">
          <h1 className="text-2xl font-semibold text-base-content">CheckIn+</h1>
        </div>
        <div className="flex-1 md:hidden">
          <h1 className="text-base font-semibold text-base-content truncate">
            CheckIn+
          </h1>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost flex items-center gap-3 px-3"
          >
            <div className="w-10 h-10 overflow-hidden border border-base-300 rounded-md">
              <img
                src={displayImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base-content/80">
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
