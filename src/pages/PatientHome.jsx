
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Hospital,
  UserRound,
  CalendarDays,
  Stethoscope,
  FileText,
  Pill,
  Bell,
  LogOut,
  HeartPulse,
  BedDouble,
  ShieldCheck,
} from "lucide-react";

const API = "http://localhost:5000/api";

const ACTIVE_APPOINTMENT_STATUSES = [
  "Scheduled",
  "Confirmed",
  "Waiting",
  "In Progress",
  "Urgent",
];

function PatientHome() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [assignedDoctor, setAssignedDoctor] = useState("Not assigned");
  const [assignedRoom, setAssignedRoom] = useState("Not assigned");
  const [appointmentLoading, setAppointmentLoading] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");

  // ==========================================
  // LOAD THE LATEST ACTIVE APPOINTMENT
  // ==========================================
  const loadLatestAppointment = async (patientData) => {
    setAppointmentLoading(true);
    setAppointmentError("");

    try {
      const patientId = patientData.patientId;

      const response = await fetch(
        `${API}/appointments/patient/${encodeURIComponent(patientId)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load appointments."
        );
      }

      const appointments = Array.isArray(data.appointments)
        ? data.appointments
        : [];

      // Find the newest appointment that is still active.
      // The backend sorts appointments by createdAt descending.
      const latestAppointment = appointments.find((appointment) =>
        ACTIVE_APPOINTMENT_STATUSES.includes(
          appointment.status
        )
      );

      if (latestAppointment) {
        // Use the doctor selected for this appointment.
        setAssignedDoctor(
          latestAppointment.doctorName &&
            latestAppointment.doctorName !== "Doctor not found"
            ? latestAppointment.doctorName
            : "Not assigned"
        );

        setAssignedRoom(
          latestAppointment.doctorRoom ||
            latestAppointment.room ||
            "Not assigned"
        );
      } else {
        // No active appointment: use the registered assignment.
        setAssignedDoctor(
          patientData.doctor || "Not assigned"
        );

        setAssignedRoom(
          patientData.room || "Not assigned"
        );
      }
    } catch (error) {
      console.error(
        "Unable to load patient appointments:",
        error.message
      );

      // Keep the page usable if the appointment API fails.
      setAppointmentError(
        "Unable to refresh appointment details. Showing your registered doctor if available."
      );

      setAssignedDoctor(
        patientData.doctor || "Not assigned"
      );

      setAssignedRoom(
        patientData.room || "Not assigned"
      );
    } finally {
      setAppointmentLoading(false);
    }
  };

  // ==========================================
  // CHECK LOGIN AND LOAD PATIENT INFORMATION
  // ==========================================
  useEffect(() => {
    const loggedIn = localStorage.getItem("patientLoggedIn");
    const storedPatient = localStorage.getItem("patientUser");

    if (loggedIn !== "true" || !storedPatient) {
      navigate("/patient-login");
      return;
    }

    try {
      const patientData = JSON.parse(storedPatient);

      if (!patientData?.patientId) {
        throw new Error("Patient ID is missing.");
      }

      setPatient(patientData);
      loadLatestAppointment(patientData);
    } catch (error) {
      console.error(
        "Unable to read patient information:",
        error.message
      );

      localStorage.removeItem("patientLoggedIn");
      localStorage.removeItem("patientUser");
      localStorage.removeItem("patientRememberMe");

      navigate("/patient-login");
    }
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("patientLoggedIn");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("patientRememberMe");

    navigate("/patient-login");
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (!patient) {
    return (
      <div className="patient-home-loading">
        Loading patient information...
      </div>
    );
  }

  // ==========================================
  // PATIENT DASHBOARD
  // ==========================================
  return (
    <div className="patient-home-page">
      <header className="patient-home-header">
        <div className="patient-home-brand">
          <div className="patient-home-logo">
            <Hospital size={24} />
          </div>

          <div className="patient-home-brand-text">
            <strong>AI POWERED</strong>
            <span>HOSPITAL PATIENT SERVICES</span>
          </div>
        </div>

        <div className="patient-home-header-right">
          <div className="patient-home-user">
            <div className="patient-home-user-avatar">
              <UserRound size={17} />
            </div>

            <div>
              <strong>{patient.name}</strong>
              <span>Patient</span>
            </div>
          </div>

          <button
            className="patient-home-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="patient-home-main">
        {/* WELCOME */}
        <section className="patient-home-welcome">
          <div>
            <div className="patient-home-eyebrow">
              PATIENT DASHBOARD
            </div>

            <h1>
              Welcome back, <span>{patient.name}</span>
            </h1>

            <p>
              Access your healthcare information, appointments and
              hospital services.
            </p>
          </div>

          <div className="patient-home-id-card">
            <span>Patient ID</span>
            <strong>{patient.patientId}</strong>
            <small>Authorized Patient</small>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="patient-home-summary-grid">
          <div className="patient-home-summary-card">
            <div className="patient-home-summary-icon blue">
              <HeartPulse size={20} />
            </div>

            <div>
              <span>Department</span>
              <strong>
                {patient.department || "Not assigned"}
              </strong>
            </div>
          </div>

          <div className="patient-home-summary-card">
            <div className="patient-home-summary-icon green">
              <Stethoscope size={20} />
            </div>

            <div>
              <span>Doctor</span>
              <strong>
                {appointmentLoading
                  ? "Loading..."
                  : assignedDoctor}
              </strong>
            </div>
          </div>

          <div className="patient-home-summary-card">
            <div className="patient-home-summary-icon purple">
              <BedDouble size={20} />
            </div>

            <div>
              <span>Room</span>
              <strong>
                {appointmentLoading
                  ? "Loading..."
                  : assignedRoom}
              </strong>
            </div>
          </div>

          <div className="patient-home-summary-card">
            <div className="patient-home-summary-icon cyan">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>Account</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>

        {appointmentError && (
          <div className="patient-home-appointment-error">
            <span>{appointmentError}</span>

            <button
              type="button"
              onClick={() => loadLatestAppointment(patient)}
            >
              Retry
            </button>
          </div>
        )}

        {/* PATIENT INFORMATION */}
        <section className="patient-home-section">
          <div className="patient-home-section-heading">
            <div>
              <h2>My Information</h2>
              <p>Your registered hospital information</p>
            </div>
          </div>

          <div className="patient-home-info-card">
            <div className="patient-home-info-grid">
              <div className="patient-home-info-item">
                <span>Full Name</span>
                <strong>{patient.name}</strong>
              </div>

              <div className="patient-home-info-item">
                <span>Patient ID</span>
                <strong>{patient.patientId}</strong>
              </div>

              <div className="patient-home-info-item">
                <span>Age</span>
                <strong>{patient.age} years</strong>
              </div>

              <div className="patient-home-info-item">
                <span>Gender</span>
                <strong>{patient.gender || "Not specified"}</strong>
              </div>

              <div className="patient-home-info-item">
                <span>Department</span>
                <strong>
                  {patient.department || "Not assigned"}
                </strong>
              </div>

              <div className="patient-home-info-item">
                <span>Room</span>
                <strong>
                  {appointmentLoading ? "Loading..." : assignedRoom}
                </strong>
              </div>

              <div className="patient-home-info-item">
                <span>Assigned Doctor</span>
                <strong>
                  {appointmentLoading ? "Loading..." : assignedDoctor}
                </strong>
              </div>

              <div className="patient-home-info-item">
                <span>Username</span>
                <strong>{patient.username || "Not available"}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* HEALTHCARE SERVICES */}
        <section className="patient-home-section">
          <div className="patient-home-section-heading">
            <div>
              <h2>Healthcare Services</h2>
              <p>Access your hospital services</p>
            </div>
          </div>

          <div className="patient-home-services">
            <button
              className="patient-home-service-card"
              onClick={() => navigate("/appointments")}
              type="button"
            >
              <div className="patient-home-service-icon blue">
                <CalendarDays size={21} />
              </div>

              <div>
                <strong>Appointments</strong>
                <span>View and manage your appointments</span>
              </div>
            </button>

            <button
              className="patient-home-service-card"
              onClick={() => navigate("/patient-doctor")}
              type="button"
            >
              <div className="patient-home-service-icon green">
                <Stethoscope size={21} />
              </div>

              <div>
                <strong>My Doctor</strong>
                <span>View your currently assigned appointment doctor</span>
              </div>
            </button>

            <button
              className="patient-home-service-card"
              onClick={() => navigate("/patient-medical-reports")}
              type="button"
            >
              <div className="patient-home-service-icon purple">
                <FileText size={21} />
              </div>

              <div>
                <strong>Medical Reports</strong>
                <span>View your medical reports</span>
              </div>
            </button>

            <button
              className="patient-home-service-card"
              onClick={() => navigate("/patient-prescriptions")}
              type="button"
            >
              <div className="patient-home-service-icon orange">
                <Pill size={21} />
              </div>

              <div>
                <strong>Prescriptions</strong>
                <span>View your prescribed medicines</span>
              </div>
            </button>

            <button
              className="patient-home-service-card"
              onClick={() =>
                alert("Patient notifications will be available here.")
              }
              type="button"
            >
              <div className="patient-home-service-icon cyan">
                <Bell size={21} />
              </div>

              <div>
                <strong>Notifications</strong>
                <span>View hospital notifications</span>
              </div>
            </button>
          </div>
        </section>

        {/* SECURITY NOTICE */}
        <div className="patient-home-security">
          <ShieldCheck size={16} />

          <div>
            <strong>Secure Patient Access</strong>
            <span>
              You are signed in as an authorized hospital patient.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientHome;