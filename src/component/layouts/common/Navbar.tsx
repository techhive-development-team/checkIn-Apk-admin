import { useRef } from "react";

const Navbar = () => {
  const logoutModalRef = useRef<HTMLDialogElement>(null);

  const openLogoutModal = () => {
    logoutModalRef.current?.showModal();
  };

  const handleLogout = () => {
    logoutModalRef.current?.close();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="h-19 w-full navbar bg-base-100 px-6 py-4 border-b border-base-300">
        <label
          htmlFor="my-drawer"
          className="btn btn-square btn-ghost lg:hidden hover:bg-base-200"
          aria-label="Toggle menu"
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
          <h1 className="text-2xl font-semibold text-base-content">
            CheckIn+
          </h1>
        </div>

        <div className="flex-1 md:hidden">
          <h1 className="text-base font-semibold text-base-content truncate">
            CheckIn+
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openLogoutModal}
            className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content transition-colors"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <dialog className="modal" ref={logoutModalRef}>
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-4">Confirm Logout</h3>
          <p className="text-base-content/70">
            Are you sure you want to logout?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn btn-ghost">Cancel</button>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-error"
              >
                Yes, Logout
              </button>
            </form>
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