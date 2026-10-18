
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Stethoscope,
  MapPin,
  UserRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

const API = "http://localhost:5000/api";

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

function dateKey(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${dateKey(value)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? dateKey(value)
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function PatientAppointments() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [reason, setReason] = useState("");

  const patientId = patient?.patientId || patient?.id || "";

  const selectedDoctor = doctors.find(
    (doctor) => doctor.doctorId === doctorId
  );

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const loadData = useCallback(async (id) => {
    setLoading(true);
    setError("");

    try {
      const [doctorResponse, appointmentResponse] = await Promise.all([
        fetch(`${API}/doctors`),
        fetch(
          `${API}/appointments/patient/${encodeURIComponent(id)}`
        ),
      ]);

      const doctorData = await doctorResponse.json();
      const appointmentData = await appointmentResponse.json();

      if (!doctorResponse.ok || !doctorData.success) {
        throw new Error(
          doctorData.message || "Unable to load doctors."
        );
      }

      if (!appointmentResponse.ok || !appointmentData.success) {
        throw new Error(
          appointmentData.message || "Unable to load appointments."
        );
      }

      setDoctors(doctorData.doctors || []);
      setAppointments(appointmentData.appointments || []);
    } catch (err) {
      console.error("Patient appointments loading error:", err);
      setError(
        err.message ||
          "Unable to connect to the hospital server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("patientLoggedIn");
    const storedUser = localStorage.getItem("patientUser");

    if (loggedIn !== "true" || !storedUser) {
      navigate("/patient-login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const id = user.patientId || user.id;

      if (!id) {
        setError("Your patient ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      setPatient(user);
      loadData(id);
    } catch {
      localStorage.removeItem("patientLoggedIn");
      localStorage.removeItem("patientUser");
      navigate("/patient-login");
    }
  }, [navigate, loadData]);

  const bookedSlots = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.doctorId === doctorId &&
          dateKey(appointment.appointmentDate) === appointmentDate &&
          !["Cancelled", "Completed"].includes(appointment.status)
      )
      .map((appointment) => appointment.appointmentTime);
  }, [appointments, doctorId, appointmentDate]);

  const availableDoctors = useMemo(
    () =>
      doctors.filter(
        (doctor) =>
          !["On Leave", "Offline"].includes(doctor.status)
      ),
    [doctors]
  );

  const upcomingAppointments = useMemo(() => {
    return [...appointments]
      .filter(
        (appointment) =>
          !["Cancelled", "Completed"].includes(appointment.status)
      )
      .sort((a, b) => {
        const first = `${dateKey(a.appointmentDate)} ${a.appointmentTime}`;
        const second = `${dateKey(b.appointmentDate)} ${b.appointmentTime}`;
        return first.localeCompare(second);
      });
  }, [appointments]);

  const handleBooking = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!patientId) {
      setError("Your patient ID is missing. Please sign in again.");
      return;
    }

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setError("Please select an appointment date and time.");
      return;
    }

    if (appointmentDate < minDate) {
      setError("Please choose today or a future date.");
      return;
    }

    if (bookedSlots.includes(appointmentTime)) {
      setError(
        "That time slot is already booked. Please choose another slot."
      );
      return;
    }

    try {
      setSubmitting(true);

      const existingIds = appointments
        .map((appointment) => appointment.appointmentId)
        .filter(Boolean);

      const nextNumber =
        Math.max(
          0,
          ...existingIds.map((id) => {
            const match = id.match(/(\d+)$/);
            return match ? Number(match[1]) : 0;
          })
        ) + 1;

      const payload = {
        appointmentId: `APT-${String(nextNumber).padStart(5, "0")}`,
        patientId,
        doctorId: selectedDoctor.doctorId,
        department: selectedDoctor.department,
        appointmentDate,
        appointmentTime,
        appointmentType,
        room: selectedDoctor.room || "",
        reason: reason.trim(),
        status: "Confirmed",
      };

      const response = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Appointment booking failed."
        );
      }

      setMessage("Appointment booked successfully.");
      setReason("");
      setAppointmentTime("");

      await loadData(patientId);
    } catch (err) {
      console.error("Appointment booking error:", err);
      setError(
        err.message ||
          "Unable to book the appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!patient) {
    return (
      <div className="patient-appointments-loading">
        Checking patient login...
      </div>
    );
  }

  return (
    <div className="patient-appointments-page">
      <header className="patient-appointments-header">
        <div className="patient-appointments-brand">
          <div className="patient-appointments-brand-icon">
            <CalendarDays size={23} />
          </div>
          <div>
            <strong>AI POWERED</strong>
            <span>HOSPITAL PATIENT SERVICES</span>
          </div>
        </div>

        <button
          className="patient-appointments-back"
          onClick={() => navigate("/patient-home")}
        >
          <ArrowLeft size={16} />
          Patient Home
        </button>
      </header>

      <main className="patient-appointments-main">
        <div className="patient-appointments-title">
          <div className="patient-appointments-title-icon">
            <CalendarDays size={24} />
          </div>
          <div>
            <p>YOUR HEALTHCARE</p>
            <h1>Appointments</h1>
            <span>
              Choose a doctor and book a suitable appointment time.
            </span>
          </div>
        </div>

        <section className="patient-appointments-identity">
          <div className="patient-appointments-avatar">
            <UserRound size={21} />
          </div>
          <div>
            <span>Booking for</span>
            <strong>{patient.name}</strong>
            <small>Patient ID: {patientId}</small>
          </div>
          <div className="patient-appointments-identity-note">
            <CheckCircle2 size={16} />
            Logged-in patient
          </div>
        </section>

        {error && (
          <div className="patient-appointments-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="patient-appointments-alert success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <section className="patient-booking-card">
          <div className="patient-booking-heading">
            <div>
              <h2>Book an Appointment</h2>
              <p>
                Select a doctor, date, and available time slot.
              </p>
            </div>
            <span className="patient-booking-step">NEW BOOKING</span>
          </div>

          {loading ? (
            <div className="patient-appointments-loading-inline">
              <RefreshCw size={18} />
              Loading doctors and appointments...
            </div>
          ) : (
            <form
              className="patient-booking-form"
              onSubmit={handleBooking}
            >
              <div className="patient-booking-field">
                <label htmlFor="booking-doctor">Choose Doctor</label>
                <select
                  id="booking-doctor"
                  value={doctorId}
                  onChange={(event) => {
                    setDoctorId(event.target.value);
                    setAppointmentTime("");
                  }}
                  required
                >
                  <option value="">Select a doctor</option>
                  {availableDoctors.map((doctor) => (
                    <option
                      key={doctor.doctorId}
                      value={doctor.doctorId}
                    >
                      {doctor.name} — {doctor.department}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="patient-selected-doctor">
                  <div className="patient-selected-doctor-icon">
                    <Stethoscope size={21} />
                  </div>
                  <div>
                    <strong>{selectedDoctor.name}</strong>
                    <span>
                      {selectedDoctor.specialization ||
                        selectedDoctor.department}
                    </span>
                    <small>
                      <MapPin size={12} />
                      {selectedDoctor.room || "Room to be confirmed"}
                    </small>
                  </div>
                </div>
              )}

              <div className="patient-booking-row">
                <div className="patient-booking-field">
                  <label htmlFor="booking-date">Appointment Date</label>
                  <input
                    id="booking-date"
                    type="date"
                    value={appointmentDate}
                    min={minDate}
                    onChange={(event) => {
                      setAppointmentDate(event.target.value);
                      setAppointmentTime("");
                    }}
                    required
                  />
                </div>

                <div className="patient-booking-field">
                  <label htmlFor="booking-type">Appointment Type</label>
                  <select
                    id="booking-type"
                    value={appointmentType}
                    onChange={(event) =>
                      setAppointmentType(event.target.value)
                    }
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Pre-Procedure">Pre-Procedure</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
              </div>

              <div className="patient-booking-field">
                <label>Available Time Slots</label>

                {!doctorId || !appointmentDate ? (
                  <p className="patient-booking-hint">
                    Choose a doctor and date to see available slots.
                  </p>
                ) : (
                  <div className="patient-time-slots">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = appointmentTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          className={[
                            "patient-time-slot",
                            isSelected ? "selected" : "",
                            isBooked ? "booked" : "",
                          ].filter(Boolean).join(" ")}
                          onClick={() => setAppointmentTime(slot)}
                          aria-pressed={isSelected}
                        >
                          <Clock3 size={13} />
                          {slot}
                          {isBooked && <span>Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="patient-booking-field">
                <label htmlFor="booking-reason">
                  Reason for Visit
                </label>
                <textarea
                  id="booking-reason"
                  rows={3}
                  maxLength={500}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Briefly describe why you need the appointment (optional)"
                />
              </div>

              <button
                type="submit"
                className="patient-booking-submit"
                disabled={
                  submitting ||
                  !doctorId ||
                  !appointmentDate ||
                  !appointmentTime
                }
              >
                <CalendarDays size={17} />
                {submitting
                  ? "Booking Appointment..."
                  : "Confirm Appointment"}
              </button>

              <p className="patient-booking-disclaimer">
                Available slots are based on current appointment records.
                The server verifies bookings to prevent double-booking.
              </p>
            </form>
          )}
        </section>

        <section className="patient-my-appointments">
          <div className="patient-my-appointments-heading">
            <div>
              <h2>My Appointments</h2>
              <p>Bookings associated with your patient account.</p>
            </div>
            <button
              type="button"
              className="patient-appointments-refresh"
              onClick={() => loadData(patientId)}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="patient-appointments-loading-inline">
              Loading your appointments...
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="patient-appointments-empty">
              <ClipboardList size={30} />
              <h3>No appointments yet</h3>
              <p>Your confirmed bookings will appear here.</p>
            </div>
          ) : (
            <div className="patient-appointment-list">
              {upcomingAppointments.map((appointment) => {
                const doctor = doctors.find(
                  (item) => item.doctorId === appointment.doctorId
                );

                return (
                  <article
                    className="patient-appointment-item"
                    key={appointment._id || appointment.appointmentId}
                  >
                    <div className="patient-appointment-item-icon">
                      <CalendarDays size={20} />
                    </div>

                    <div className="patient-appointment-item-info">
                      <strong>
                        {doctor?.name || appointment.doctorId}
                      </strong>
                      <span>
                        {appointment.department} ·{" "}
                        {appointment.appointmentType}
                      </span>
                      <small>
                        {formatDate(appointment.appointmentDate)} at{" "}
                        {appointment.appointmentTime}
                      </small>
                      <small>
                        {appointment.room
                          ? `Room: ${appointment.room}`
                          : "Room to be confirmed"}
                      </small>
                    </div>

                    <span
                      className={`patient-appointment-status ${String(
                        appointment.status || "Scheduled"
                      ).toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {appointment.status || "Scheduled"}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PatientAppointments;
