
import { useEffect, useState } from "react";
import {
  ClipboardList,
  UserRound,
  Activity,
  Save,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

import "../styles/doctor-examination.css";

const API = "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("hospitalToken") ||
  sessionStorage.getItem("hospitalToken");

const getAuthHeaders = () => {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const emptyForm = {
  patientId: "",
  doctorName: "",
  doctorId: "",
  department: "",
  examinedAt: "",
  heartRate: "",
  bloodPressure: "",
  oxygenSaturation: "",
  temperature: "",
  temperatureUnit: "C",
  symptoms: "",
  clinicalFindings: "",
  notes: "",
};

const ACTIVE_STATUSES = [
  "Scheduled",
  "Confirmed",
  "Waiting",
  "In Progress",
  "Urgent",
];

function DoctorExamination() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [history, setHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD LOGGED-IN DOCTOR
  // ==========================================
  useEffect(() => {
    let staff = {};

    try {
      staff = JSON.parse(
        localStorage.getItem("hospitalUser") ||
          sessionStorage.getItem("hospitalUser") ||
          "{}"
      );
    } catch {
      staff = {};
    }

    setForm((current) => ({
      ...current,
      doctorName:
        staff.name ||
        staff.doctorName ||
        staff.fullName ||
        "",
      doctorId:
        staff.doctorId ||
        staff.employeeId ||
        "",
      department: staff.department || "",
    }));
  }, []);

  // ==========================================
  // LOAD ONLY ASSIGNED PATIENTS
  // Requires GET /api/patients/assigned
  // The backend must authenticate and authorize.
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();

    async function loadAssignedPatients() {
      try {
        setLoadingPatients(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "Your session has expired. Please log in again."
          );
        }

        const response = await fetch(`${API}/patients/assigned/doctor`, {
  headers: getAuthHeaders(),
});
            

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load your assigned patients."
          );
        }

        setPatients(
          Array.isArray(data.patients) ? data.patients : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setPatients([]);
          setError(err.message || "Unable to load assigned patients.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPatients(false);
        }
      }
    }

    loadAssignedPatients();

    return () => controller.abort();
  }, []);

  const selectedPatient = patients.find(
    (patient) => patient.patientId === form.patientId
  );

  // ==========================================
  // LOAD SELECTED PATIENT'S APPOINTMENTS
  // ==========================================
  useEffect(() => {
    if (!form.patientId) {
      setAppointments([]);
      setLoadingAppointments(false);
      return;
    }

    const controller = new AbortController();

    async function loadAppointments() {
      try {
        setLoadingAppointments(true);

        const response = await fetch(
          `${API}/appointments/patient/${encodeURIComponent(
            form.patientId
          )}`,
          {
            headers: getAuthHeaders(),
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load patient appointments."
          );
        }

        setAppointments(
          Array.isArray(data.appointments)
            ? data.appointments
            : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setAppointments([]);
          setError(
            err.message || "Unable to load patient appointments."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAppointments(false);
        }
      }
    }

    loadAppointments();

    return () => controller.abort();
  }, [form.patientId]);

  // Select the first active appointment returned by the API.
  const bookedAppointment = appointments.find((appointment) =>
    ACTIVE_STATUSES.includes(appointment.status)
  );

  // ==========================================
  // LOAD EXAMINATION HISTORY
  // ==========================================
  useEffect(() => {
    if (!form.patientId) {
      setHistory([]);
      setLoadingHistory(false);
      return;
    }

    const controller = new AbortController();

    async function loadHistory() {
      try {
        setLoadingHistory(true);

        const response = await fetch(
          `${API}/examinations/patient/${encodeURIComponent(
            form.patientId
          )}`,
          {
            headers: getAuthHeaders(),
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load examination history."
          );
        }

        setHistory(
          Array.isArray(data.examinations)
            ? data.examinations
            : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setHistory([]);
          setError(
            err.message || "Unable to load examination history."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [form.patientId]);

  // ==========================================
  // HANDLE FORM CHANGES
  // ==========================================
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  // ==========================================
  // SAVE EXAMINATION
  // ==========================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!getToken()) {
      setError("Please log in again to continue.");
      return;
    }

    if (!form.patientId) {
      setError("Please select an assigned patient.");
      return;
    }

    // Ensure the selected patient came from the assigned-patient list.
    if (!selectedPatient) {
      setError(
        "This patient is not in your assigned-patient list. Refresh and try again."
      );
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      // The server must determine doctor identity from the JWT.
      // Do not trust doctorName or doctorId submitted by the browser.
      const payload = {
        patientId: form.patientId,
        examinedAt: form.examinedAt || undefined,
        heartRate: form.heartRate,
        bloodPressure: form.bloodPressure,
        oxygenSaturation: form.oxygenSaturation,
        temperature: form.temperature,
        temperatureUnit: form.temperatureUnit,
        symptoms: form.symptoms,
        clinicalFindings: form.clinicalFindings,
        notes: form.notes,
      };

      const response = await fetch(`${API}/examinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save examination."
        );
      }

      setMessage("Examination saved successfully.");

      // Refresh the patient's examination history.
      const historyResponse = await fetch(
        `${API}/examinations/patient/${encodeURIComponent(
          form.patientId
        )}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const historyData = await historyResponse.json();

      if (historyResponse.ok && historyData.success) {
        setHistory(
          Array.isArray(historyData.examinations)
            ? historyData.examinations
            : []
        );
      }

      // Clear the examination fields but keep the selected patient.
      setForm((current) => ({
        ...emptyForm,
        patientId: current.patientId,
        doctorName: current.doctorName,
        doctorId: current.doctorId,
        department: current.department,
      }));
    } catch (err) {
      setError(err.message || "Unable to save examination.");
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // PAGE UI
  // ==========================================
  return (
    <div className="examination-page">
      <header className="examination-header">
        <div className="examination-title-icon">
          <ClipboardList size={25} />
        </div>

        <div>
          <span className="examination-eyebrow">
            CLINICAL WORKFLOW
          </span>
          <h1>Doctor Examination</h1>
          <p>
            Examine assigned patients and review previous records.
          </p>
        </div>
      </header>

      {error && (
        <div
          className="examination-message error"
          role="alert"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {message && (
        <div
          className="examination-message success"
          role="status"
        >
          {message}
        </div>
      )}

      <form className="examination-form" onSubmit={handleSubmit}>
        {/* PATIENT AND CLINICIAN */}
        <section className="examination-section">
          <div className="examination-section-heading">
            <UserRound size={20} />
            <div>
              <h2>Patient and Clinician</h2>
              <p>
                Select a patient assigned to your account.
              </p>
            </div>
          </div>

          <div className="examination-form-grid">
            <label className="examination-field">
              <span>Assigned Patient *</span>

              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
                disabled={loadingPatients}
              >
                <option value="">
                  {loadingPatients
                    ? "Loading assigned patients..."
                    : "Select a patient"}
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.patientId}
                    value={patient.patientId}
                  >
                    {patient.name} — {patient.patientId}
                  </option>
                ))}
              </select>
            </label>

            <label className="examination-field">
              <span>Logged-in Doctor</span>
              <input
                value={form.doctorName}
                readOnly
                placeholder="Authenticated doctor"
              />
            </label>

            <label className="examination-field">
              <span>Doctor ID</span>
              <input
                value={form.doctorId}
                readOnly
                placeholder="Linked doctor ID"
              />
            </label>

            <label className="examination-field">
              <span>Department</span>
              <input
                value={form.department}
                readOnly
                placeholder="Doctor department"
              />
            </label>

            <label className="examination-field">
              <span>Examination Date and Time</span>
              <input
                type="datetime-local"
                name="examinedAt"
                value={form.examinedAt}
                onChange={handleChange}
              />
              <small>
                Leave blank to use the server's current time.
              </small>
            </label>
          </div>

          {!loadingPatients && patients.length === 0 && !error && (
            <div className="examination-empty">
              No assigned patients were found for this account.
            </div>
          )}

          {selectedPatient && (
            <div className="examination-patient-summary">
              <strong>{selectedPatient.name}</strong>
              <span>ID: {selectedPatient.patientId}</span>
              <span>
                Age: {selectedPatient.age ?? "Not recorded"}
              </span>
              <span>
                Gender: {selectedPatient.gender || "Not recorded"}
              </span>
              <span>
                Department: {selectedPatient.department || "Not recorded"}
              </span>
            </div>
          )}
        </section>

        {/* BOOKED APPOINTMENT */}
        <section className="examination-section">
          <div className="examination-section-heading">
            <CalendarDays size={20} />
            <div>
              <h2>Booked Appointment</h2>
              <p>
                Appointment details for the selected patient.
              </p>
            </div>
          </div>

          {!form.patientId ? (
            <div className="examination-empty">
              Select a patient to view appointment details.
            </div>
          ) : loadingAppointments ? (
            <div className="examination-empty">
              Loading appointment details...
            </div>
          ) : bookedAppointment ? (
            <div className="examination-patient-summary">
              <Stethoscope size={18} />

              <strong>
                {bookedAppointment.doctorName ||
                  "Doctor name unavailable"}
              </strong>

              <span>
                Doctor ID: {bookedAppointment.doctorId || "Not recorded"}
              </span>

              <span>
                Department:{" "}
                {bookedAppointment.doctorDepartment ||
                  bookedAppointment.department ||
                  "Not recorded"}
              </span>

              <span>
                Status: {bookedAppointment.status || "Not recorded"}
              </span>

              <span>
                Appointment:{" "}
                {bookedAppointment.appointmentDate
                  ? new Date(
                      bookedAppointment.appointmentDate
                    ).toLocaleDateString()
                  : "Date not recorded"}{" "}
                {bookedAppointment.appointmentTime || ""}
              </span>
            </div>
          ) : (
            <div className="examination-empty">
              No active appointment was found for this patient.
            </div>
          )}
        </section>

        {/* MEASURED VITALS */}
        <section className="examination-section">
          <div className="examination-section-heading">
            <Activity size={20} />
            <div>
              <h2>Measured Vitals</h2>
              <p>
                Enter actual measured values. Leave unmeasured fields empty.
              </p>
            </div>
          </div>

          <div className="examination-form-grid">
            <label className="examination-field">
              <span>Heart Rate (bpm)</span>
              <input
                type="number"
                name="heartRate"
                value={form.heartRate}
                onChange={handleChange}
                min="1"
                max="300"
                placeholder="Not measured"
              />
            </label>

            <label className="examination-field">
              <span>Blood Pressure (mmHg)</span>
              <input
                name="bloodPressure"
                value={form.bloodPressure}
                onChange={handleChange}
                placeholder="e.g. 120/80"
              />
            </label>

            <label className="examination-field">
              <span>Oxygen Saturation (%)</span>
              <input
                type="number"
                name="oxygenSaturation"
                value={form.oxygenSaturation}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="Not measured"
              />
            </label>

            <div className="examination-field">
              <span>Temperature</span>

              <div className="examination-temperature">
                <input
                  type="number"
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="Not measured"
                />

                <select
                  name="temperatureUnit"
                  value={form.temperatureUnit}
                  onChange={handleChange}
                  aria-label="Temperature unit"
                >
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* CLINICAL OBSERVATIONS */}
        <section className="examination-section">
          <div className="examination-section-heading">
            <ClipboardList size={20} />
            <div>
              <h2>Clinical Observations</h2>
              <p>
                Record the patient's reported symptoms and actual findings.
              </p>
            </div>
          </div>

          <div className="examination-form-grid single-column">
            <label className="examination-field">
              <span>Symptoms Reported</span>
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                rows="3"
                placeholder="Record symptoms reported by the patient"
              />
            </label>

            <label className="examination-field">
              <span>Clinical Findings</span>
              <textarea
                name="clinicalFindings"
                value={form.clinicalFindings}
                onChange={handleChange}
                rows="3"
                placeholder="Record findings observed during examination"
              />
            </label>

            <label className="examination-field">
              <span>Examination Notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional clinical notes"
              />
            </label>
          </div>
        </section>

        <div className="examination-form-footer">
          <p>
            Record only measurements and findings actually obtained
            during the examination.
          </p>

          <button
            type="submit"
            className="examination-save-button"
            disabled={
              saving ||
              loadingPatients ||
              patients.length === 0 ||
              !form.patientId
            }
          >
            {saving ? (
              <RefreshCw size={17} />
            ) : (
              <Save size={17} />
            )}
            {saving ? "Saving..." : "Save Examination"}
          </button>
        </div>
      </form>

      {/* EXAMINATION HISTORY */}
      <section className="examination-section examination-history">
        <div className="examination-section-heading">
          <ClipboardList size={20} />
          <div>
            <h2>Examination History</h2>
            <p>
              {form.patientId
                ? `Saved examinations for ${form.patientId}`
                : "Select a patient to view saved examinations."}
            </p>
          </div>
        </div>

        {loadingHistory && (
          <div className="examination-empty">
            Loading examination history...
          </div>
        )}

        {form.patientId &&
          !loadingHistory &&
          history.length === 0 && (
            <div className="examination-empty">
              No saved examinations were found for this patient.
            </div>
          )}

        {history.map((item) => (
          <article
            className="examination-history-card"
            key={item._id || item.examinationId}
          >
            <div className="examination-history-top">
              <div>
                <strong>
                  {item.doctorName || "Clinician not recorded"}
                </strong>
                <span>
                  {item.department || "Department not recorded"}
                </span>
              </div>

              <span className="examination-recorded-badge">
                {item.status || "Recorded"}
              </span>
            </div>

            <p>
              {item.examinedAt
                ? new Date(item.examinedAt).toLocaleString()
                : "Date not recorded"}
            </p>

            <div className="examination-history-vitals">
              <span>
                Heart rate: {item.heartRate ?? "Not recorded"}
                {item.heartRate != null ? " bpm" : ""}
              </span>

              <span>
                BP: {item.bloodPressure || "Not recorded"}
              </span>

              <span>
                Oxygen: {item.oxygenSaturation ?? "Not recorded"}
                {item.oxygenSaturation != null ? "%" : ""}
              </span>

              <span>
                Temperature: {item.temperature ?? "Not recorded"}
                {item.temperature != null
                  ? ` °${item.temperatureUnit || "C"}`
                  : ""}
              </span>
            </div>

            {item.symptoms && (
              <p>
                <strong>Symptoms:</strong> {item.symptoms}
              </p>
            )}

            {item.clinicalFindings && (
              <p>
                <strong>Clinical findings:</strong>{" "}
                {item.clinicalFindings}
              </p>
            )}

            {item.notes && (
              <p>
                <strong>Notes:</strong> {item.notes}
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export default DoctorExamination;
