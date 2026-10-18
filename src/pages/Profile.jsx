import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  BriefcaseMedical,
  ShieldCheck,
  Bell,
  Settings,
  LockKeyhole,
  Monitor,
  Smartphone,
  Clock3,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  Activity,
  KeyRound,
  LogOut,
} from "lucide-react";

import profileData from "../data/profile";

function Profile() {
  const [profile, setProfile] = useState(profileData);

  const [activeTab, setActiveTab] = useState("Profile");

  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: profileData.personal.fullName,
    email: profileData.personal.email,
    phone: profileData.personal.phone,
    location: profileData.personal.location,
    specialization: profileData.professional.specialization,
    shift: profileData.professional.shift,
  });

  const tabs = [
    {
      label: "Profile",
      icon: UserRound,
    },
    {
      label: "Preferences",
      icon: Settings,
    },
    {
      label: "Security",
      icon: ShieldCheck,
    },
  ];

  const updateNotification = (key) => {
    setProfile((previous) => ({
      ...previous,
      notifications: {
        ...previous.notifications,
        [key]: !previous.notifications[key],
      },
    }));
  };

  const updatePreference = (key) => {
    setProfile((previous) => ({
      ...previous,
      preferences: {
        ...previous.preferences,
        [key]: !previous.preferences[key],
      },
    }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveProfile = () => {
    setProfile((previous) => ({
      ...previous,
      personal: {
        ...previous.personal,
        fullName: editForm.fullName,
        shortName: editForm.fullName.replace(" Sharma", ""),
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
      },
      professional: {
        ...previous.professional,
        specialization: editForm.specialization,
        shift: editForm.shift,
      },
    }));

    setShowEditModal(false);
  };

  const getActivityIcon = (action) => {
    if (action.toLowerCase().includes("login")) {
      return LogOut;
    }

    if (action.toLowerCase().includes("security")) {
      return ShieldCheck;
    }

    if (action.toLowerCase().includes("emergency")) {
      return AlertTriangle;
    }

    return Activity;
  };

  return (
    <div className="profile-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="profile-page-header">

        <div className="profile-title-row">

          <div className="profile-title-icon">
            <UserRound size={25} />
          </div>

          <div>
            <h1>Profile & Settings</h1>

            <p>
              Manage your profile, preferences and account security
            </p>
          </div>

        </div>

        <div className="profile-system-status">
          <span></span>
          ACCOUNT SECURE
        </div>

      </div>

      {/* =====================================================
          PROFILE HERO
          ===================================================== */}

      <section className="profile-hero-card">

        <div className="profile-avatar-large">
          <span>
            {profile.personal.fullName
              .replace("Dr. ", "")
              .split(" ")
              .map((name) => name.charAt(0))
              .join("")
              .slice(0, 2)}
          </span>

          <div className="profile-avatar-online"></div>
        </div>

        <div className="profile-hero-info">

          <div className="profile-name-row">

            <h2>
              {profile.personal.fullName}
            </h2>

            <span className="profile-online-badge">
              <span></span>
              Online
            </span>

          </div>

          <p className="profile-role">
            {profile.personal.role}
          </p>

          <div className="profile-hero-meta">

            <span>
              <Stethoscope size={13} />
              {profile.personal.department}
            </span>

            <span>
              <BriefcaseMedical size={13} />
              {profile.professional.experience}
            </span>

            <span>
              <MapPin size={13} />
              {profile.personal.location}
            </span>

          </div>

        </div>

        <button
          type="button"
          className="profile-edit-button"
          onClick={() => setShowEditModal(true)}
        >
          <Edit3 size={15} />
          Edit Profile
        </button>

      </section>

      {/* =====================================================
          TABS
          ===================================================== */}

      <div className="profile-tabs">

        {tabs.map((tab) => {

          const Icon = tab.icon;

          return (
            <button
              type="button"
              key={tab.label}
              className={
                activeTab === tab.label
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(tab.label)
              }
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}

      </div>

      {/* =====================================================
          PROFILE TAB
          ===================================================== */}

      {activeTab === "Profile" && (

        <>

          {/* Personal + Professional */}

          <div className="profile-main-grid">

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon blue">
                  <UserRound size={17} />
                </div>

                <div>
                  <h2>Personal Information</h2>
                  <p>
                    Your basic account information
                  </p>
                </div>

              </div>

              <div className="profile-info-grid">

                <div>
                  <label>Full Name</label>
                  <strong>
                    {profile.personal.fullName}
                  </strong>
                </div>

                <div>
                  <label>Employee ID</label>
                  <strong className="cyan">
                    {profile.personal.employeeId}
                  </strong>
                </div>

                <div>
                  <label>Email Address</label>
                  <strong>
                    {profile.personal.email}
                  </strong>
                </div>

                <div>
                  <label>Phone Number</label>
                  <strong>
                    {profile.personal.phone}
                  </strong>
                </div>

                <div>
                  <label>Department</label>
                  <strong>
                    {profile.personal.department}
                  </strong>
                </div>

                <div>
                  <label>Location</label>
                  <strong>
                    {profile.personal.location}
                  </strong>
                </div>

              </div>

            </section>

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon purple">
                  <BriefcaseMedical size={17} />
                </div>

                <div>
                  <h2>Professional Information</h2>
                  <p>
                    Medical and employment details
                  </p>
                </div>

              </div>

              <div className="profile-info-grid">

                <div>
                  <label>Specialization</label>
                  <strong>
                    {profile.professional.specialization}
                  </strong>
                </div>

                <div>
                  <label>Qualification</label>
                  <strong>
                    {profile.professional.qualification}
                  </strong>
                </div>

                <div>
                  <label>Experience</label>
                  <strong>
                    {profile.professional.experience}
                  </strong>
                </div>

                <div>
                  <label>Registration No.</label>
                  <strong>
                    {profile.professional.registrationNumber}
                  </strong>
                </div>

                <div>
                  <label>Current Shift</label>
                  <strong>
                    {profile.professional.shift}
                  </strong>
                </div>

                <div>
                  <label>Joining Date</label>
                  <strong>
                    {profile.professional.joiningDate}
                  </strong>
                </div>

              </div>

            </section>

          </div>

          {/* Performance */}

          <section className="profile-panel">

            <div className="profile-panel-header">

              <div className="profile-panel-icon green">
                <Activity size={17} />
              </div>

              <div>
                <h2>Today's Activity</h2>
                <p>
                  Current workload and command centre activity
                </p>
              </div>

            </div>

            <div className="profile-metrics-grid">

              <div className="profile-metric">
                <span>Patients Assigned</span>
                <strong>
                  {profile.professional.patientsAssigned}
                </strong>
                <small>Active patients</small>
              </div>

              <div className="profile-metric">
                <span>Appointments</span>
                <strong>
                  {profile.professional.appointmentsToday}
                </strong>
                <small>Today's schedule</small>
              </div>

              <div className="profile-metric">
                <span>Department</span>
                <strong>
                  {profile.personal.department}
                </strong>
                <small>Primary department</small>
              </div>

              <div className="profile-metric">
                <span>Shift</span>
                <strong>
                  {profile.professional.shift}
                </strong>
                <small>Current duty schedule</small>
              </div>

            </div>

          </section>

          {/* Account */}

          <div className="profile-main-grid">

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon blue">
                  <Mail size={17} />
                </div>

                <div>
                  <h2>Account Verification</h2>
                  <p>
                    Verification status of your account
                  </p>
                </div>

              </div>

              <div className="profile-verification-list">

                <div>
                  <div className="profile-verification-icon">
                    <Mail size={15} />
                  </div>

                  <div>
                    <strong>Email Address</strong>
                    <small>
                      {profile.personal.email}
                    </small>
                  </div>

                  {profile.account.emailVerified && (
                    <span className="verified">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  )}
                </div>

                <div>
                  <div className="profile-verification-icon">
                    <Phone size={15} />
                  </div>

                  <div>
                    <strong>Phone Number</strong>
                    <small>
                      {profile.personal.phone}
                    </small>
                  </div>

                  {profile.account.phoneVerified && (
                    <span className="verified">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  )}
                </div>

              </div>

            </section>

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon green">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h2>Security Status</h2>
                  <p>
                    Current account protection
                  </p>
                </div>

              </div>

              <div className="profile-security-status">

                <div className="profile-security-main">

                  <div className="profile-security-check">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <strong>
                      Account Protected
                    </strong>

                    <small>
                      Two-factor authentication is enabled
                    </small>
                  </div>

                </div>

                <span className="profile-protected">
                  Protected
                </span>

              </div>

            </section>

          </div>

        </>

      )}

      {/* =====================================================
          PREFERENCES TAB
          ===================================================== */}

      {activeTab === "Preferences" && (

        <div className="profile-preferences-grid">

          {/* Notifications */}

          <section className="profile-panel">

            <div className="profile-panel-header">

              <div className="profile-panel-icon blue">
                <Bell size={17} />
              </div>

              <div>
                <h2>Notification Preferences</h2>
                <p>
                  Choose which alerts you want to receive
                </p>
              </div>

            </div>

            <div className="profile-toggle-list">

              <PreferenceToggle
                label="Critical Patient Alerts"
                description="Receive immediate alerts for critical patients"
                enabled={profile.notifications.criticalAlerts}
                onChange={() =>
                  updateNotification("criticalAlerts")
                }
                danger
              />

              <PreferenceToggle
                label="Emergency Alerts"
                description="Receive emergency command centre notifications"
                enabled={profile.notifications.emergencyAlerts}
                onChange={() =>
                  updateNotification("emergencyAlerts")
                }
                danger
              />

              <PreferenceToggle
                label="Appointment Alerts"
                description="Receive upcoming appointment notifications"
                enabled={profile.notifications.appointmentAlerts}
                onChange={() =>
                  updateNotification("appointmentAlerts")
                }
              />

              <PreferenceToggle
                label="Pharmacy Alerts"
                description="Receive medicine inventory notifications"
                enabled={profile.notifications.pharmacyAlerts}
                onChange={() =>
                  updateNotification("pharmacyAlerts")
                }
              />

              <PreferenceToggle
                label="Laboratory Alerts"
                description="Receive laboratory result notifications"
                enabled={profile.notifications.laboratoryAlerts}
                onChange={() =>
                  updateNotification("laboratoryAlerts")
                }
              />

              <PreferenceToggle
                label="System Updates"
                description="Receive command centre system updates"
                enabled={profile.notifications.systemUpdates}
                onChange={() =>
                  updateNotification("systemUpdates")
                }
              />

              <PreferenceToggle
                label="Email Notifications"
                description="Receive important notifications by email"
                enabled={profile.notifications.emailNotifications}
                onChange={() =>
                  updateNotification("emailNotifications")
                }
              />

              <PreferenceToggle
                label="Sound Alerts"
                description="Play sound for high-priority notifications"
                enabled={profile.notifications.soundAlerts}
                onChange={() =>
                  updateNotification("soundAlerts")
                }
              />

            </div>

          </section>

          {/* System Preferences */}

          <section className="profile-panel">

            <div className="profile-panel-header">

              <div className="profile-panel-icon purple">
                <Settings size={17} />
              </div>

              <div>
                <h2>System Preferences</h2>
                <p>
                  Customize your command centre workspace
                </p>
              </div>

            </div>

            <div className="profile-toggle-list">

              <PreferenceToggle
                label="Live Monitoring"
                description="Show real-time hospital monitoring information"
                enabled={profile.preferences.liveMonitoring}
                onChange={() =>
                  updatePreference("liveMonitoring")
                }
              />

              <PreferenceToggle
                label="Auto Refresh"
                description="Automatically refresh dashboard information"
                enabled={profile.preferences.autoRefresh}
                onChange={() =>
                  updatePreference("autoRefresh")
                }
              />

              <PreferenceToggle
                label="Compact View"
                description="Use a more compact information layout"
                enabled={profile.preferences.compactView}
                onChange={() =>
                  updatePreference("compactView")
                }
              />

              <PreferenceToggle
                label="Patient Risk Indicators"
                description="Show AI-supported patient risk indicators"
                enabled={profile.preferences.showPatientRisk}
                onChange={() =>
                  updatePreference("showPatientRisk")
                }
              />

              <PreferenceToggle
                label="Emergency Map"
                description="Display emergency location information"
                enabled={profile.preferences.showEmergencyMap}
                onChange={() =>
                  updatePreference("showEmergencyMap")
                }
              />

            </div>

          </section>

        </div>

      )}

      {/* =====================================================
          SECURITY TAB
          ===================================================== */}

      {activeTab === "Security" && (

        <>

          <div className="profile-security-grid">

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon green">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h2>Security Overview</h2>
                  <p>
                    Protect your command centre account
                  </p>
                </div>

              </div>

              <div className="profile-security-overview">

                <div className="security-score">

                  <div className="security-score-circle">
                    <ShieldCheck size={25} />
                  </div>

                  <div>
                    <strong>Strong Security</strong>
                    <small>
                      Your account is well protected
                    </small>
                  </div>

                </div>

                <div className="security-check-list">

                  <SecurityCheck
                    label="Two-factor authentication"
                    value={
                      profile.account.twoFactorEnabled
                        ? "Enabled"
                        : "Disabled"
                    }
                    active={
                      profile.account.twoFactorEnabled
                    }
                  />

                  <SecurityCheck
                    label="Email verification"
                    value={
                      profile.account.emailVerified
                        ? "Verified"
                        : "Pending"
                    }
                    active={
                      profile.account.emailVerified
                    }
                  />

                  <SecurityCheck
                    label="Phone verification"
                    value={
                      profile.account.phoneVerified
                        ? "Verified"
                        : "Pending"
                    }
                    active={
                      profile.account.phoneVerified
                    }
                  />

                </div>

              </div>

            </section>

            <section className="profile-panel">

              <div className="profile-panel-header">

                <div className="profile-panel-icon orange">
                  <LockKeyhole size={17} />
                </div>

                <div>
                  <h2>Password & Access</h2>
                  <p>
                    Manage your account access
                  </p>
                </div>

              </div>

              <div className="profile-security-details">

                <div>
                  <span>Password Last Changed</span>
                  <strong>
                    {profile.security.passwordLastChanged}
                  </strong>
                </div>

                <div>
                  <span>Two-Factor Method</span>
                  <strong>
                    {profile.security.twoFactorMethod}
                  </strong>
                </div>

                <div>
                  <span>Session Timeout</span>
                  <strong>
                    {profile.security.sessionTimeout}
                  </strong>
                </div>

                <button
                  type="button"
                  className="profile-change-password"
                >
                  <KeyRound size={15} />
                  Change Password
                </button>

              </div>

            </section>

          </div>

          {/* Login Activity */}

          <section className="profile-panel">

            <div className="profile-panel-header">

              <div className="profile-panel-icon blue">
                <Clock3 size={17} />
              </div>

              <div>
                <h2>Login & Account Activity</h2>
                <p>
                  Recent activity on your account
                </p>
              </div>

            </div>

            <div className="profile-activity-list">

              {profile.activity.map((activity) => {

                const Icon =
                  getActivityIcon(activity.action);

                return (
                  <div
                    className="profile-activity-item"
                    key={activity.id}
                  >

                    <div className="profile-activity-icon">
                      <Icon size={15} />
                    </div>

                    <div className="profile-activity-content">

                      <strong>
                        {activity.action}
                      </strong>

                      <small>
                        {activity.device} •{" "}
                        {activity.location}
                      </small>

                    </div>

                    <div className="profile-activity-time">

                      <strong>
                        {activity.time}
                      </strong>

                      <small>
                        {activity.date}
                      </small>

                    </div>

                    <span className="profile-activity-status">
                      <CheckCircle2 size={12} />
                      {activity.status}
                    </span>

                  </div>
                );
              })}

            </div>

          </section>

          {/* Active Sessions */}

          <section className="profile-panel">

            <div className="profile-panel-header">

              <div className="profile-panel-icon purple">
                <Monitor size={17} />
              </div>

              <div>
                <h2>Active Sessions</h2>
                <p>
                  Devices currently signed into your account
                </p>
              </div>

            </div>

            <div className="profile-sessions-grid">

              <div className="profile-session-card">

                <div className="profile-session-device">
                  <Monitor size={20} />
                </div>

                <div>
                  <strong>
                    Windows • Chrome
                  </strong>

                  <small>
                    Main Hospital • Current Session
                  </small>
                </div>

                <span className="current">
                  Current
                </span>

              </div>

              <div className="profile-session-card">

                <div className="profile-session-device">
                  <Smartphone size={20} />
                </div>

                <div>
                  <strong>
                    iPhone • Safari
                  </strong>

                  <small>
                    Secure Mobile Session
                  </small>
                </div>

                <button
                  type="button"
                  className="profile-session-end"
                >
                  End
                </button>

              </div>

            </div>

          </section>

        </>

      )}

      {/* =====================================================
          EDIT PROFILE MODAL
          ===================================================== */}

      {showEditModal && (

        <div
          className="profile-modal-overlay"
          onClick={() =>
            setShowEditModal(false)
          }
        >

          <div
            className="profile-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="profile-modal-close"
              onClick={() =>
                setShowEditModal(false)
              }
            >
              <X size={18} />
            </button>

            <div className="profile-modal-header">

              <div className="profile-modal-icon">
                <Edit3 size={20} />
              </div>

              <div>
                <h2>Edit Profile</h2>
                <p>
                  Update your professional profile information
                </p>
              </div>

            </div>

            <div className="profile-form">

              <div className="profile-form-grid">

                <div className="profile-form-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label>Specialization</label>

                  <input
                    type="text"
                    name="specialization"
                    value={editForm.specialization}
                    onChange={handleEditChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label>Current Shift</label>

                  <input
                    type="text"
                    name="shift"
                    value={editForm.shift}
                    onChange={handleEditChange}
                  />

                </div>

              </div>

            </div>

            <div className="profile-modal-actions">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={saveProfile}
              >
                <Save size={15} />
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   REUSABLE TOGGLE
   ========================================================= */

function PreferenceToggle({
  label,
  description,
  enabled,
  onChange,
  danger = false,
}) {
  return (
    <div className="profile-toggle-item">

      <div className="profile-toggle-content">

        <strong>{label}</strong>

        <small>{description}</small>

      </div>

      <button
        type="button"
        className={`profile-toggle ${
          enabled ? "enabled" : ""
        } ${danger ? "danger" : ""}`}
        onClick={onChange}
        aria-pressed={enabled}
      >
        <span></span>
      </button>

    </div>
  );
}

/* =========================================================
   SECURITY CHECK
   ========================================================= */

function SecurityCheck({
  label,
  value,
  active,
}) {
  return (
    <div className="profile-security-check-item">

      <div>
        <CheckCircle2 size={15} />
      </div>

      <span>{label}</span>

      <strong className={active ? "active" : ""}>
        {value}
      </strong>

    </div>
  );
}

export default Profile;