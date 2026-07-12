import React from "react";
import Navbar from "./common/Navbar";
import Sidebar from "./common/Sidebar";
import ChatWidget from "../chat/ChatWidget";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen app-main-bg">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
        <ChatWidget />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
