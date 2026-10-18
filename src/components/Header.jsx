import {
  Menu,
  Search,
  Bell,
  Settings,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header className="top-header">
      {/* Left section */}
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search patients, doctors, departments..."
          />

          <span className="header-search-shortcut">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="header-right">
        {/* Date */}
        <div className="header-date">
          <div className="header-date-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Today</span>
            <strong>06 September 2026</strong>
          </div>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="header-icon-button notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="notification-count">
            5
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          className="header-icon-button"
          aria-label="Settings"
        >
          <Settings size={19} />
        </button>

        <div className="header-divider"></div>

        {/* Profile */}
        <button
          type="button"
          className="header-profile"
        >
          <div className="profile-avatar">
            <span>DA</span>
            <i></i>
          </div>

          <div className="profile-info">
            <strong>Dr. Arjun</strong>
            <span>Cardiologist</span>
          </div>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Header;