import { useMemo, useState } from "react";
import {
  Bell,
  AlertTriangle,
  Siren,
  Pill,
  BedDouble,
  CalendarDays,
  UserRound,
  UserPlus,
  CheckCircle2,
  Activity,
  FileText,
  Search,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  X,
  Clock3,
  ArrowRight,
} from "lucide-react";


import notificationsData from "../data/notifications";

function Notifications() {
  const [notifications, setNotifications] =
    useState(notificationsData);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [readFilter, setReadFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  /* =========================
     NOTIFICATION TYPES
  ========================= */

  const notificationTypes = [
    "All",
    ...new Set(
      notificationsData.map(
        (notification) => notification.type
      )
    ),
  ];

  /* =========================
     FILTER NOTIFICATIONS
  ========================= */

  const filteredNotifications = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(search) ||
        notification.message
          .toLowerCase()
          .includes(search) ||
        notification.category
          .toLowerCase()
          .includes(search) ||
        notification.relatedId
          .toLowerCase()
          .includes(search);

      const matchesType =
        typeFilter === "All" ||
        notification.type === typeFilter;

      const matchesRead =
        readFilter === "All" ||
        (readFilter === "Unread" &&
          !notification.read) ||
        (readFilter === "Read" &&
          notification.read);

      return (
        matchesSearch &&
        matchesType &&
        matchesRead
      );
    });
  }, [
    notifications,
    searchTerm,
    typeFilter,
    readFilter,
  ]);

  /* =========================
     COUNTS
  ========================= */

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  const criticalNotifications =
    notifications.filter(
      (notification) =>
        notification.type === "Critical" ||
        notification.type === "Emergency"
    ).length;

  const pharmacyAlerts =
    notifications.filter(
      (notification) =>
        notification.category === "Pharmacy"
    ).length;

  /* =========================
     ICON
  ========================= */

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Critical":
        return AlertTriangle;

      case "Emergency":
        return Siren;

      case "Warning":
        return Pill;

      case "Bed":
        return BedDouble;

      case "Appointment":
        return CalendarDays;

      case "Doctor":
        return UserRound;

      case "Patient":
        return UserPlus;

      case "Success":
        return CheckCircle2;

      case "System":
        return Activity;

      default:
        return Bell;
    }
  };

  /* =========================
     MARK AS READ
  ========================= */

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  /* =========================
     MARK ALL READ
  ========================= */

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /* =========================
     DELETE
  ========================= */

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          notification.id !== id
      )
    );

    if (
      selectedNotification &&
      selectedNotification.id === id
    ) {
      setSelectedNotification(null);
    }
  };

  /* =========================
     VIEW DETAILS
  ========================= */

  const openNotification = (notification) => {
    setSelectedNotification(notification);

    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="notifications-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="notifications-page-header">

        <div className="notifications-title-row">

          <div className="notifications-title-icon">
            <Bell size={25} />
          </div>

          <div>

            <h1>
              Notifications
            </h1>

            <p>
              Monitor alerts, updates and hospital system activity
            </p>

          </div>

        </div>

        <div className="notifications-live-status">
          <span></span>
          LIVE ALERTS
        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="notifications-summary-grid">

        {/* TOTAL */}

        <div className="notifications-stat-card">

          <div className="notifications-stat-icon blue">
            <Bell size={22} />
          </div>

          <div>

            <span>
              Total Notifications
            </span>

            <strong>
              {totalNotifications}
            </strong>

            <small>
              All system notifications
            </small>

          </div>

        </div>

        {/* UNREAD */}

        <div className="notifications-stat-card">

          <div className="notifications-stat-icon orange">
            <Clock3 size={22} />
          </div>

          <div>

            <span>
              Unread
            </span>

            <strong>
              {unreadNotifications}
            </strong>

            <small>
              Require your attention
            </small>

          </div>

        </div>

        {/* CRITICAL */}

        <div className="notifications-stat-card">

          <div className="notifications-stat-icon red">
            <Siren size={22} />
          </div>

          <div>

            <span>
              Critical Alerts
            </span>

            <strong>
              {criticalNotifications}
            </strong>

            <small>
              Emergency priority alerts
            </small>

          </div>

        </div>

        {/* PHARMACY */}

        <div className="notifications-stat-card">

          <div className="notifications-stat-icon purple">
            <Pill size={22} />
          </div>

          <div>

            <span>
              Pharmacy Alerts
            </span>

            <strong>
              {pharmacyAlerts}
            </strong>

            <small>
              Inventory notifications
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          NOTIFICATION CENTRE
      ================================================= */}

      <section className="notifications-panel">

        <div className="notifications-panel-header">

          <div>

            <h2>
              Notification Centre
            </h2>

            <p>
              Review recent hospital alerts and updates
            </p>

          </div>

          {unreadNotifications > 0 && (

            <button
              type="button"
              className="notifications-mark-all"
              onClick={markAllAsRead}
            >

              <CheckCheck size={15} />

              Mark all as read

            </button>

          )}

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="notifications-filter-bar">

          <div className="notifications-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
          >

            {notificationTypes.map(
              (type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type === "All"
                    ? "All Types"
                    : type}
                </option>

              )
            )}

          </select>

          <select
            value={readFilter}
            onChange={(event) =>
              setReadFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Notifications
            </option>

            <option value="Unread">
              Unread
            </option>

            <option value="Read">
              Read
            </option>

          </select>

        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        <div className="notifications-list">

          {filteredNotifications.map(
            (notification) => {

              const Icon =
                getNotificationIcon(
                  notification.type
                );

              return (

                <div
                  className={`notification-item ${
                    notification.read
                      ? "read"
                      : "unread"
                  }`}
                  key={notification.id}
                >

                  {/* ICON */}

                  <div
                    className={`notification-icon ${notification.type
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <Icon size={17} />
                  </div>

                  {/* CONTENT */}

                  <div className="notification-content">

                    <div className="notification-top-row">

                      <strong>
                        {notification.title}
                      </strong>

                      {!notification.read && (
                        <span className="notification-new">
                          NEW
                        </span>
                      )}

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <div className="notification-meta">

                      <span>
                        {notification.category}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {notification.time}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {notification.relatedId}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="notification-actions">

                    <button
                      type="button"
                      title="View notification"
                      onClick={() =>
                        openNotification(
                          notification
                        )
                      }
                    >
                      <Eye size={15} />
                    </button>

                    {!notification.read && (

                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                      >
                        <Check size={15} />
                      </button>

                    )}

                    <button
                      type="button"
                      title="Delete notification"
                      className="delete"
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

        {/* EMPTY */}

        {filteredNotifications.length === 0 && (

          <div className="notifications-empty">

            <Bell size={32} />

            <h3>
              No notifications found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </section>

      {/* =================================================
          ALERT OVERVIEW
      ================================================= */}

      <div className="notifications-overview-grid">

        <section className="notifications-overview-card">

          <div className="notifications-overview-header">

            <div className="notifications-overview-icon red">
              <Siren size={18} />
            </div>

            <div>

              <h2>
                Priority Alerts
              </h2>

              <p>
                High-priority notifications requiring attention
              </p>

            </div>

          </div>

          <div className="notifications-priority-list">

            {notifications
              .filter(
                (notification) =>
                  notification.priority ===
                  "High"
              )
              .slice(0, 4)
              .map((notification) => {

                const Icon =
                  getNotificationIcon(
                    notification.type
                  );

                return (

                  <div
                    key={notification.id}
                    className="notifications-priority-item"
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >

                    <div className="priority-icon">
                      <Icon size={14} />
                    </div>

                    <div>

                      <strong>
                        {notification.title}
                      </strong>

                      <small>
                        {notification.time}
                      </small>

                    </div>

                    <ArrowRight size={14} />

                  </div>

                );
              })}

          </div>

        </section>

        <section className="notifications-overview-card">

          <div className="notifications-overview-header">

            <div className="notifications-overview-icon green">
              <Activity size={18} />
            </div>

            <div>

              <h2>
                System Activity
              </h2>

              <p>
                Current command centre notification status
              </p>

            </div>

          </div>

          <div className="notifications-system-list">

            <div>

              <span>
                Unread notifications
              </span>

              <strong>
                {unreadNotifications}
              </strong>

            </div>

            <div>

              <span>
                Read notifications
              </span>

              <strong>
                {totalNotifications -
                  unreadNotifications}
              </strong>

            </div>

            <div>

              <span>
                High priority
              </span>

              <strong className="critical">
                {criticalNotifications}
              </strong>

            </div>

            <div>

              <span>
                System status
              </span>

              <strong className="online">
                Online
              </strong>

            </div>

          </div>

        </section>

      </div>

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedNotification && (

        <div
          className="notifications-modal-overlay"
          onClick={() =>
            setSelectedNotification(null)
          }
        >

          <div
            className="notifications-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="notifications-modal-close"
              onClick={() =>
                setSelectedNotification(null)
              }
            >
              <X size={18} />
            </button>

            {/* HEADER */}

            <div className="notifications-modal-header">

              <div
                className={`notifications-modal-icon ${selectedNotification.type
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >

                {(() => {

                  const Icon =
                    getNotificationIcon(
                      selectedNotification.type
                    );

                  return <Icon size={23} />;

                })()}

              </div>

              <div>

                <span>
                  {selectedNotification.id}
                </span>

                <h2>
                  {selectedNotification.title}
                </h2>

                <p>
                  {selectedNotification.category}
                </p>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="notifications-modal-message">

              <span>
                Notification
              </span>

              <p>
                {selectedNotification.message}
              </p>

            </div>

            {/* DETAILS */}

            <div className="notifications-modal-grid">

              <div>

                <Clock3 size={16} />

                <span>

                  <small>
                    Time
                  </small>

                  <strong>
                    {selectedNotification.timestamp}
                  </strong>

                </span>

              </div>

              <div>

                <CalendarDays size={16} />

                <span>

                  <small>
                    Date
                  </small>

                  <strong>
                    {selectedNotification.date}
                  </strong>

                </span>

              </div>

              <div>

                <Activity size={16} />

                <span>

                  <small>
                    Priority
                  </small>

                  <strong>
                    {selectedNotification.priority}
                  </strong>

                </span>

              </div>

              <div>

                <FileTextIcon />

                <span>

                  <small>
                    Related ID
                  </small>

                  <strong>
                    {selectedNotification.relatedId}
                  </strong>

                </span>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="notifications-modal-actions">

              <button
                type="button"
                onClick={() => {
                  markAsRead(
                    selectedNotification.id
                  );

                  setSelectedNotification(
                    null
                  );
                }}
              >

                <Check size={16} />

                Mark as Read

              </button>

              <button
                type="button"
                className="danger"
                onClick={() =>
                  deleteNotification(
                    selectedNotification.id
                  )
                }
              >

                <Trash2 size={16} />

                Delete

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SMALL ICON COMPONENT
========================================================= */

function FileTextIcon() {
  return <FileText size={16} />;
}

export default Notifications;