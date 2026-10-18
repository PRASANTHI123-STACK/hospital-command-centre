import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout({
  children,
  activePage = "Dashboard",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleMenuClick = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <div
        className={
          sidebarOpen
            ? "sidebar-wrapper open"
            : "sidebar-wrapper"
        }
      >
        <Sidebar
          activePage={activePage}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="dashboard-main">

        <Header
          onMenuClick={handleMenuClick}
        />

        <main className="dashboard-content">
          {children}
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;