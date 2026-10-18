import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UsersRound,
  Siren,
  UserRound,
  CalendarDays,
  BedDouble,
  BrainCircuit,
  Pill,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  HeartPulse,
  ChevronRight,
  Search,
  FlaskConical,
  ClipboardList,
} from "lucide-react";

function Sidebar({ activePage = "Dashboard" }) {
  const navigate = useNavigate();

  // LOGOUT FUNCTION
  const handleLogout = () => {
    // Clear staff authentication state
    localStorage.removeItem("hospitalLoggedIn");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("hospitalRememberMe");
    localStorage.removeItem("hospitalToken");

    sessionStorage.removeItem("hospitalLoggedIn");
    sessionStorage.removeItem("hospitalUser");
    sessionStorage.removeItem("hospitalToken");

    // Return to login page
    navigate("/login");
  };

  const menuSections = [
    {
      title: "PATIENT CARE",
      items: [
        {
          name: "Patient Monitoring",
          path: "/patients",
          icon: UsersRound,
        },
        {
          name: "Emergency",
          path: "/emergency",
          icon: Siren,
          emergency: true,
        },
        {
          name: "Doctors",
          path: "/doctors",
          icon: UserRound,
        },
        {
          name: "Appointments",
          path: "/appointments",
          icon: CalendarDays,
        },
        {
          name: "Doctor Examination",
          path: "/doctor-examination",
          icon: ClipboardList,
        },
        {
          name: "Beds & ICU",
          path: "/beds-icu",
          icon: BedDouble,
        },
      ],
    },

    {
      title: "AI & ANALYTICS",
      items: [
        {
          name: "AI Disease Prediction",
          path: "/ai-prediction",
          icon: BrainCircuit,
        },
        {
          name: "Pharmacy",
          path: "/pharmacy",
          icon: Pill,
        },
        {
          name: "Reports & Analytics",
          path: "/reports",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "COMMUNICATION",
      items: [
        {
          name: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },

    {
      title: "SYSTEM",
      items: [
        {
          name: "Laboratory",
          path: "/laboratory",
          icon: FlaskConical,
        },
        {
          name: "Profile & Settings",
          path: "/profile",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <HeartPulse size={30} strokeWidth={2.2} />
        </div>

        <div className="sidebar-brand-text">
          <span>AI POWERED</span>
          <strong>HOSPITAL</strong>
          <strong>COMMAND CENTRE</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="sidebar-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search menu..."
          aria-label="Search menu"
        />

        <span className="search-shortcut">Ctrl K</span>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-navigation">
        {/* DASHBOARD */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-menu-item dashboard-menu ${
              isActive ? "active" : ""
            }`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        {/* SECTIONS */}
        {menuSections.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <p className="sidebar-section-title">
              {section.title}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-menu-item ${
                      isActive ? "active" : ""
                    } ${
                      item.emergency ? "emergency-item" : ""
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  <ChevronRight
                    className="menu-arrow"
                    size={16}
                  />
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        {/* SYSTEM STATUS */}
        <div className="sidebar-system-status">
          <div className="system-status-icon">
            <span></span>
          </div>

          <div className="system-status-text">
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>

          <ChevronRight
            size={16}
            className="status-arrow"
          />
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;