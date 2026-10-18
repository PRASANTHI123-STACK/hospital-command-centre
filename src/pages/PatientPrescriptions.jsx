
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  RefreshCw,
  CalendarDays,
  UserRound,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Clock3,
  FileText,
} from "lucide-react";

const API = "http://localhost:5000/api";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PatientPrescriptions() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientId = patient?.patientId || patient?.id || "";

  const loadPrescriptions = useCallback(async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/prescriptions/patient/${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load prescriptions."
        );
      }

      setPrescriptions(data.prescriptions || []);
    } catch (err) {
      console.error("Load prescriptions error:", err);
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
        setError(
          "Patient ID is missing. Please sign in again."
        );
        setLoading(false);
        return;
      }

      setPatient(user);
      loadPrescriptions(id);
    } catch {
      localStorage.removeItem("patientLoggedIn");
      localStorage.removeItem("patientUser");
      navigate("/patient-login");
    }
  }, [navigate, loadPrescriptions]);

  const activeCount = prescriptions.filter(
    (prescription) => prescription.status === "Active"
  ).length;

  const medicineCount = prescriptions.reduce(
    (total, prescription) =>
      total + (prescription.medicines?.length || 0),
    0
  );

  if (!patient) {
    return (
      <div className="patient-prescriptions-loading">
        Checking patient login...
      </div>
    );
  }

  return (
    <div className="patient-prescriptions-page">
      <header className="patient-prescriptions-header">
        <div className="patient-prescriptions-brand">
          <div className="patient-prescriptions-brand-icon">
            <Pill size={23} />
          </div>

          <div>
            <strong>AI POWERED</strong>
            <span>HOSPITAL PATIENT SERVICES</span>
          </div>
        </div>

        <button
          type="button"
          className="patient-prescriptions-back"
          onClick={() => navigate("/patient-home")}
        >
          <ArrowLeft size={16} />
          Patient Home
        </button>
      </header>

      <main className="patient-prescriptions-main">
        <div className="patient-prescriptions-title">
          <div className="patient-prescriptions-title-icon">
            <Pill size={25} />
          </div>

          <div>
            <p>YOUR MEDICATION RECORDS</p>
            <h1>Prescriptions</h1>
            <span>
              View prescriptions recorded for your patient account.
            </span>
          </div>
        </div>

        <section className="patient-prescriptions-identity">
          <div className="patient-prescriptions-avatar">
            <UserRound size={21} />
          </div>

          <div>
            <span>Patient Name</span>
            <strong>{patient.name || "Patient"}</strong>
            <small>Patient ID: {patientId}</small>
          </div>

          <div className="patient-prescriptions-secure">
            <CheckCircle2 size={15} />
            Patient account
          </div>
        </section>

        <section className="patient-prescriptions-stats">
          <article className="patient-prescription-stat">
            <div className="patient-prescription-stat-icon cyan">
              <ClipboardList size={19} />
            </div>
            <div>
              <span>Total Prescriptions</span>
              <strong>{prescriptions.length}</strong>
            </div>
          </article>

          <article className="patient-prescription-stat">
            <div className="patient-prescription-stat-icon green">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <span>Active Prescriptions</span>
              <strong>{activeCount}</strong>
            </div>
          </article>

          <article className="patient-prescription-stat">
            <div className="patient-prescription-stat-icon purple">
              <Pill size={19} />
            </div>
            <div>
              <span>Listed Medicines</span>
              <strong>{medicineCount}</strong>
            </div>
          </article>
        </section>

        <section className="patient-prescriptions-list-card">
          <div className="patient-prescriptions-list-heading">
            <div>
              <h2>My Prescriptions</h2>
              <p>
                Medication details entered by your healthcare provider.
              </p>
            </div>

            <button
              type="button"
              className="patient-prescriptions-refresh"
              onClick={() => loadPrescriptions(patientId)}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="patient-prescriptions-alert error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="patient-prescriptions-loading-inline">
              <RefreshCw size={18} />
              Loading prescriptions from MongoDB...
            </div>
          ) : error ? (
            <div className="patient-prescriptions-empty">
              <AlertCircle size={30} />
              <h3>Prescriptions unavailable</h3>
              <p>
                Check the backend connection and try refreshing.
              </p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="patient-prescriptions-empty">
              <Pill size={32} />
              <h3>No prescriptions available</h3>
              <p>
                Prescriptions will appear here after your healthcare
                provider records them.
              </p>
            </div>
          ) : (
            <div className="patient-prescriptions-list">
              {prescriptions.map((prescription) => (
                <article
                  className="patient-prescription-card"
                  key={
                    prescription._id ||
                    prescription.prescriptionId
                  }
                >
                  <div className="patient-prescription-card-header">
                    <div className="patient-prescription-card-icon">
                      <FileText size={22} />
                    </div>

                    <div className="patient-prescription-card-title">
                      <strong>
                        Prescription {prescription.prescriptionId}
                      </strong>

                      <span>
                        {prescription.diagnosis ||
                          "Medication prescription"}
                      </span>
                    </div>

                    <span
                      className={`patient-prescription-status ${String(
                        prescription.status || "Active"
                      ).toLowerCase()}`}
                    >
                      {prescription.status || "Active"}
                    </span>
                  </div>

                  <div className="patient-prescription-meta">
                    <span>
                      <Stethoscope size={14} />
                      {prescription.doctorName}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {formatDate(prescription.prescribedDate)}
                    </span>

                    {prescription.department && (
                      <span>
                        <UserRound size={14} />
                        {prescription.department}
                      </span>
                    )}
                  </div>

                  <div className="patient-prescription-medicines-heading">
                    <Pill size={16} />
                    Prescribed Medicines
                  </div>

                  <div className="patient-prescription-medicines">
                    {(prescription.medicines || []).map(
                      (medicine, index) => (
                        <div
                          className="patient-prescription-medicine"
                          key={`${prescription._id}-${index}`}
                        >
                          <div className="patient-prescription-medicine-top">
                            <strong>{medicine.medicineName}</strong>
                            <span>{medicine.dosage}</span>
                          </div>

                          <div className="patient-prescription-medicine-details">
                            <span>
                              <Clock3 size={13} />
                              {medicine.frequency}
                            </span>
                            <span>
                              Duration: {medicine.duration}
                            </span>
                          </div>

                          {medicine.instructions && (
                            <p>
                              <strong>Instructions:</strong>{" "}
                              {medicine.instructions}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {prescription.validUntil && (
                    <div className="patient-prescription-validity">
                      <CalendarDays size={14} />
                      Valid until {formatDate(prescription.validUntil)}
                    </div>
                  )}

                  {prescription.notes && (
                    <div className="patient-prescription-notes">
                      <strong>Doctor's Notes</strong>
                      <p>{prescription.notes}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="patient-prescriptions-notice">
          <AlertCircle size={16} />
          <span>
            Follow your healthcare provider's instructions. Do not start,
            stop, or change medication based only on this page. Contact
            your healthcare provider or pharmacist if you have questions.
          </span>
        </div>
      </main>
    </div>
  );
}

export default PatientPrescriptions;
