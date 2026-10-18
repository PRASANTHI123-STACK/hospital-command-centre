
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Hospital,
  Stethoscope,
  UserRound,
  MapPin,
  Clock,
  Phone,
  Mail,
  CalendarDays,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api";

const ACTIVE_APPOINTMENT_STATUSES = [
  "Scheduled",
  "Confirmed",
  "Waiting",
  "In Progress",
  "Urgent",
];

function PatientDoctor() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD THE LATEST ACTIVE APPOINTMENT
  // ==========================================
  const fetchDoctorDetails = async (patientData) => {
    setLoading(true);
    setError("");
    setDoctor(null);
    setAppointment(null);

    try {
      // 1. Load the patient's appointments.
      const appointmentResponse = await fetch(
        `${API}/appointments/patient/${encodeURIComponent(
          patientData.patientId
        )}`
      );

      const appointmentData = await appointmentResponse.json();

      if (!appointmentResponse.ok || !appointmentData.success) {
        throw new Error(
          appointmentData.message ||
            "Unable to load your appointments."
        );
      }

      const appointments = Array.isArray(
        appointmentData.appointments
      )
        ? appointmentData.appointments
        : [];

      // The backend sorts appointments by createdAt descending.
      const latestActiveAppointment = appointments.find((item) =>
        ACTIVE_APPOINTMENT_STATUSES.includes(item.status)
      );

      let selectedDoctorId = "";
      let selectedDoctorName = "";

      if (latestActiveAppointment) {
        setAppointment(latestActiveAppointment);

        selectedDoctorId =
          latestActiveAppointment.doctorId || "";

        selectedDoctorName =
          latestActiveAppointment.doctorName || "";
      } else {
        // No active appointment: use the registered doctor.
        selectedDoctorName = patientData.doctor || "";
        selectedDoctorId = patientData.doctorId || "";
      }

      // 2. Load the doctors from the hospital API.
      const doctorResponse = await fetch(`${API}/doctors`);
      const doctorData = await doctorResponse.json();

      if (!doctorResponse.ok) {
        throw new Error(
          doctorData.message ||
            "Unable to retrieve doctor information."
        );
      }

      // Support either { doctors: [...] } or a direct array response.
      const doctors = Array.isArray(doctorData)
        ? doctorData
        : Array.isArray(doctorData.doctors)
          ? doctorData.doctors
          : [];

      // 3. Match by doctor ID first. Names are a fallback.
      let matchedDoctor = null;

      if (selectedDoctorId) {
        matchedDoctor = doctors.find(
          (item) =>
            String(item.doctorId || "").trim().toLowerCase() ===
            String(selectedDoctorId).trim().toLowerCase()
        );
      }

      if (!matchedDoctor && selectedDoctorName) {
        const assignedName = selectedDoctorName
          .trim()
          .toLowerCase();

        matchedDoctor = doctors.find((item) => {
          const doctorName = String(item.name || "")
            .trim()
            .toLowerCase();

          return doctorName === assignedName;
        });
      }

      // 4. Use the appointment's doctor information if available.
      // This also works if the appointment API returned a doctor name
      // but the doctor list does not contain a matching record.
      if (matchedDoctor) {
        setDoctor(matchedDoctor);
      } else if (
        latestActiveAppointment?.doctorName &&
        latestActiveAppointment.doctorName !== "Doctor not found"
      ) {
        setDoctor({
          doctorId: latestActiveAppointment.doctorId,
          name: latestActiveAppointment.doctorName,
          department:
            latestActiveAppointment.doctorDepartment ||
            latestActiveAppointment.department ||
            patientData.department,
          room:
            latestActiveAppointment.doctorRoom ||
            latestActiveAppointment.room ||
            "",
        });
      } else {
        setError(
          selectedDoctorName
            ? `We couldn't find a doctor record for "${selectedDoctorName}". Please verify the doctor ID linked to your appointment.`
            : "No active appointment or assigned doctor was found. Please book an appointment or contact hospital reception."
        );
      }
    } catch (err) {
      console.error("Doctor loading error:", err);

      setError(
        err.message ||
          "Unable to load doctor information. Please check that the hospital backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK PATIENT LOGIN
  // ==========================================
  useEffect(() => {
    const storedPatient = localStorage.getItem("patientUser");
    const loggedIn = localStorage.getItem("patientLoggedIn");

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
      fetchDoctorDetails(patientData);
    } catch (err) {
      console.error("Unable to read patient information:", err);

      localStorage.removeItem("patientLoggedIn");
      localStorage.removeItem("patientUser");
      localStorage.removeItem("patientRememberMe");

      navigate("/patient-login");
    }
  }, [navigate]);

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (!patient) {
    return (
      <div className="patient-doctor-loading">
        Checking patient login...
      </div>
    );
  }

  // ==========================================
  // MY DOCTOR PAGE
  // ==========================================
  return (
    <div className="patient-doctor-page">
      {/* HEADER */}
      <header className="patient-doctor-header">
        <div className="patient-doctor-brand">
          <div className="patient-doctor-logo">
            <Hospital size={23} />
          </div>

          <div>
            <strong>AI POWERED</strong>
            <span>HOSPITAL PATIENT SERVICES</span>
          </div>
        </div>

        <button
          className="patient-doctor-back"
          type="button"
          onClick={() => navigate("/patient-home")}
        >
          <ArrowLeft size={16} />
          Back to Patient Home
        </button>
      </header>

      <main className="patient-doctor-main">
        {/* PAGE HEADING */}
        <div className="patient-doctor-heading">
          <div className="patient-doctor-heading-icon">
            <Stethoscope size={23} />
          </div>

          <div>
            <p>YOUR HEALTHCARE TEAM</p>
            <h1>My Doctor</h1>
            <span>
              View the doctor assigned to your latest active appointment.
            </span>
          </div>
        </div>

        {/* PATIENT DETAILS */}
        <section className="patient-doctor-patient-card">
          <div className="patient-doctor-patient-avatar">
            <UserRound size={22} />
          </div>

          <div>
            <span>Patient</span>
            <strong>{patient.name}</strong>
            <small>Patient ID: {patient.patientId}</small>
          </div>
        </section>

        {/* REFRESH */}
        {!loading && (
          <button
            type="button"
            className="patient-doctor-back"
            onClick={() => fetchDoctorDetails(patient)}
            style={{ marginTop: "16px" }}
          >
            <RefreshCw size={16} />
            Refresh Doctor Details
          </button>
        )}

        {/* LOADING */}
        {loading && (
          <div className="patient-doctor-message">
            <LoaderCircle size={20} />
            Loading your latest appointment and doctor details...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="patient-doctor-error">
            <strong>Doctor information unavailable</strong>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => fetchDoctorDetails(patient)}
            >
              Try Again
            </button>
          </div>
        )}

        {/* DOCTOR PROFILE */}
        {!loading && doctor && (
          <>
            <section className="patient-doctor-profile-card">
              <div className="patient-doctor-profile-top">
                <div className="patient-doctor-avatar">
                  <Stethoscope size={30} />
                </div>

                <div className="patient-doctor-profile-title">
                  <span className="patient-doctor-badge">
                    {appointment
                      ? "LATEST ACTIVE APPOINTMENT"
                      : "REGISTERED DOCTOR"}
                  </span>

                  <h2>{doctor.name || "Doctor"}</h2>

                  <p>
                    {doctor.specialization ||
                      doctor.department ||
                      "Medical Specialist"}
                  </p>

                  <span className="patient-doctor-department">
                    {doctor.department ||
                      appointment?.department ||
                      patient.department ||
                      "Department not available"}
                  </span>

                  {doctor.doctorId && (
                    <p>
                      Doctor ID: {doctor.doctorId}
                    </p>
                  )}
                </div>
              </div>

              {/* DOCTOR CONTACT AND AVAILABILITY */}
              <div className="patient-doctor-details-grid">
                <div className="patient-doctor-detail">
                  <MapPin size={18} />

                  <div>
                    <span>Consultation Room</span>
                    <strong>
                      {doctor.room ||
                        appointment?.doctorRoom ||
                        appointment?.room ||
                        "Contact reception"}
                    </strong>
                  </div>
                </div>

                <div className="patient-doctor-detail">
                  <Clock size={18} />

                  <div>
                    <span>Working Shift</span>
                    <strong>
                      {doctor.shift || "Contact reception"}
                    </strong>
                  </div>
                </div>

                <div className="patient-doctor-detail">
                  <Phone size={18} />

                  <div>
                    <span>Contact Number</span>
                    <strong>
                      {doctor.phone || "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="patient-doctor-detail">
                  <Mail size={18} />

                  <div>
                    <span>Email</span>
                    <strong>
                      {doctor.email || "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="patient-doctor-detail">
                  <Stethoscope size={18} />

                  <div>
                    <span>Experience</span>
                    <strong>
                      {doctor.experience != null
                        ? `${doctor.experience} years`
                        : "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="patient-doctor-detail">
                  <CalendarDays size={18} />

                  <div>
                    <span>Availability</span>
                    <strong>
                      {doctor.status || "Contact reception"}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* ACTIVE APPOINTMENT INFORMATION */}
            {appointment && (
              <section
                className="patient-doctor-note"
                style={{ marginTop: "20px" }}
              >
                <CalendarDays size={17} />

                <p>
                  <strong>Your appointment: </strong>
                  {appointment.appointmentDate
                    ? new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()
                    : "Date not available"}
                  {" at "}
                  {appointment.appointmentTime || "Time not available"}
                  {" · Status: "}
                  {appointment.status || "Not available"}
                </p>
              </section>
            )}

            <div className="patient-doctor-note">
              <Hospital size={17} />

              <p>
                For appointment changes or questions about your
                assigned doctor, please contact hospital reception.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PatientDoctor;
