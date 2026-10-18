
import { useEffect, useState } from "react";

import {
  Search,
  Filter,
  UsersRound,
  Activity,
  HeartPulse,
  AlertTriangle,
  X,
  ArrowLeft,
  UserRound,
  BedDouble,
  Clock3,
} from "lucide-react";

import PatientCard from "../components/PatientCard";

function PatientMonitoring() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  // ==========================================
  // FETCH REGISTERED PATIENTS FROM MONGODB
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPatients() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/patients",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load patients. Server error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.patients)) {
          throw new Error("Invalid patient data received from MongoDB API.");
        }

        const normalizedPatients = data.patients.map((patient) => ({
          ...patient,

          // Match the existing PatientCard component.
          id: patient.patientId,

          // Match the existing patient details UI.
          oxygenLevel: patient.oxygenSaturation,

          // Do not use createdAt as an admission date.
          admitDate: patient.admitDate || null,

          // These fields are not currently in the Patient schema.
          riskScore: patient.riskScore ?? null,
          notes: patient.notes || null,
        }));

        setPatients(normalizedPatients);

        // Keep the selected patient in sync after a refresh.
        setSelectedPatient((current) => {
          if (!current) return null;

          return (
            normalizedPatients.find(
              (patient) => patient.id === current.id
            ) || null
          );
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Patient loading error:", err);
          setError(
            err.message || "Unable to load patient records."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPatients();

    return () => controller.abort();
  }, []);

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (patient.name || "").toLowerCase().includes(search) ||
      (patient.id || "").toLowerCase().includes(search) ||
      (patient.room || "").toLowerCase().includes(search);

    const matchesRisk =
      riskFilter === "All" ||
      patient.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // ==========================================
  // SELECTED PATIENT DETAILS
  // ==========================================
  if (selectedPatient) {
    const patient = selectedPatient;

    const hasRiskScore =
      typeof patient.riskScore === "number" &&
      Number.isFinite(patient.riskScore);

    const hasRecordedVitals =
      patient.heartRate != null ||
      Boolean(patient.bloodPressure) ||
      patient.oxygenLevel != null ||
      patient.temperature != null;

    return (
      <div className="patient-monitoring-page">
        <button
          type="button"
          className="patient-back-button"
          onClick={() => setSelectedPatient(null)}
        >
          <ArrowLeft size={17} />
          Back to Patients
        </button>

        {/* PATIENT REGISTRATION DETAILS */}
        <div className="patient-detail-header">
          <div className="patient-large-avatar">
            <UserRound size={34} />
          </div>

          <div className="patient-detail-name">
            <div>
              <h1>{patient.name || "Name not recorded"}</h1>
              <span>Patient ID: {patient.id}</span>
            </div>

            <div className="patient-detail-meta">
              <span>
                Age: {patient.age != null ? patient.age : "Not recorded"}
              </span>

              <span>{patient.gender || "Not recorded"}</span>

              <span>
                <BedDouble size={14} />
                Room: {patient.room || "Not assigned"}
              </span>

              <span>
                <Clock3 size={14} />
                Admission date:{" "}
                {patient.admitDate
                  ? new Date(patient.admitDate).toLocaleDateString()
                  : "Not recorded"}
              </span>
            </div>
          </div>

          <div className="patient-detail-status">
            <span>Record Status</span>
            <strong>{patient.status || "Not recorded"}</strong>
          </div>
        </div>

        {/* VITALS */}
        <div className="patient-vitals-grid">
          <div className="vital-card heart">
            <div className="vital-icon">
              <HeartPulse size={22} />
            </div>

            <span>Heart Rate</span>

            <strong>
              {patient.heartRate != null
                ? patient.heartRate
                : "Not recorded"}
              {patient.heartRate != null && <small> bpm</small>}
            </strong>

            <div className="vital-normal">
              {patient.heartRate != null
                ? "Value stored in patient record"
                : "Awaiting measurement"}
            </div>
          </div>

          <div className="vital-card pressure">
            <div className="vital-icon">
              <Activity size={22} />
            </div>

            <span>Blood Pressure</span>

            <strong>
              {patient.bloodPressure || "Not recorded"}
              {patient.bloodPressure && <small> mmHg</small>}
            </strong>

            <div className="vital-normal">
              {patient.bloodPressure
                ? "Value stored in patient record"
                : "Awaiting measurement"}
            </div>
          </div>

          <div className="vital-card oxygen">
            <div className="vital-icon">
              <Activity size={22} />
            </div>

            <span>Oxygen Level</span>

            <strong>
              {patient.oxygenLevel != null
                ? patient.oxygenLevel
                : "Not recorded"}
              {patient.oxygenLevel != null && <small>% SpO₂</small>}
            </strong>

            <div className="vital-normal">
              {patient.oxygenLevel != null
                ? "Value stored in patient record"
                : "Awaiting measurement"}
            </div>
          </div>

          <div className="vital-card temperature">
            <div className="vital-icon">
              <Activity size={22} />
            </div>

            <span>Temperature</span>

            <strong>
              {patient.temperature != null
                ? patient.temperature
                : "Not recorded"}
              {patient.temperature != null && <small> °C</small>}
            </strong>

            <div className="vital-normal">
              {patient.temperature != null
                ? "Value stored in patient record"
                : "Awaiting measurement"}
            </div>
          </div>
        </div>

        {/* ECG DEMONSTRATION */}
        <div className="patient-panel ecg-panel">
          <div className="panel-title">
            <div>
              <h2>ECG Monitor</h2>
              <span>
                Illustrative waveform — not connected to a medical device
              </span>
            </div>

            <span className="monitor-live">
              <i></i>
              DEMO
            </span>
          </div>

          <div className="ecg-monitor">
            <div className="ecg-grid"></div>

            <svg
              viewBox="0 0 1000 180"
              preserveAspectRatio="none"
              role="img"
              aria-label="Illustrative ECG waveform, not live clinical data"
            >
              <polyline
                points="
                  0,95 70,95 90,95 110,65 125,125
                  145,95 210,95 230,95 245,40 260,145
                  280,95 350,95 370,95 390,70 405,120
                  420,95 490,95 510,95 530,45 545,140
                  565,95 630,95 650,95 670,65 685,125
                  705,95 780,95 800,95 820,40 835,145
                  855,95 920,95 940,95 960,70 975,120
                  1000,95
                "
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* RISK ASSESSMENT AND CLINICAL INFORMATION */}
        <div className="patient-bottom-grid">
          <div className="patient-panel risk-panel">
            <div className="panel-title">
              <div>
                <h2>Risk Assessment</h2>
                <span>Recorded assessment information</span>
              </div>

              <Activity size={19} />
            </div>

            <div className="risk-content">
              <div className="risk-gauge">
                <div
                  className="risk-gauge-fill"
                  style={{
                    transform: `rotate(${
                      -90 +
                      (hasRiskScore ? patient.riskScore : 0) * 1.8
                    }deg)`,
                  }}
                ></div>

                <div className="risk-gauge-center">
                  <strong>
                    {hasRiskScore
                      ? `${patient.riskScore}%`
                      : "N/A"}
                  </strong>

                  <span>Risk Score</span>
                </div>
              </div>

              <div
                className={`risk-label ${
                  hasRiskScore && patient.riskLevel
                    ? patient.riskLevel.toLowerCase()
                    : ""
                }`}
              >
                {hasRiskScore
                  ? `${patient.riskLevel || "Recorded"} Risk`
                  : "Not assessed"}
              </div>
            </div>

            <div className="risk-warning">
              <AlertTriangle size={15} />

              <span>
                {hasRiskScore
                  ? "A score exists in the record. Verify its source, date and clinical validity."
                  : "No risk score is recorded. An authorized clinician must assess the patient."}
              </span>
            </div>
          </div>

          <div className="patient-panel notes-panel">
            <div className="panel-title">
              <div>
                <h2>Clinical Information</h2>
                <span>Information saved in the patient record</span>
              </div>

              <UserRound size={19} />
            </div>

            <div className="doctor-note">
              <div className="doctor-note-avatar">
                {(patient.doctor || "U")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {patient.doctor || "Doctor not assigned"}
                </strong>

                <span>
                  {patient.department || "Department not recorded"}
                </span>
              </div>
            </div>

            <p className="doctor-note-text">
              {patient.notes ||
                patient.symptoms ||
                "No clinical notes have been saved."}
            </p>

            <div className="doctor-note-footer">
              {patient.notes
                ? "Saved clinical notes"
                : patient.symptoms
                  ? "Symptoms recorded in the patient record — not verified as doctor notes"
                  : "No clinical notes available"}
            </div>

            {hasRecordedVitals && (
              <div className="risk-warning">
                <AlertTriangle size={15} />
                <span>
                  Values are stored in the database. Their measurement
                  time and clinical validity must be verified before use.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PATIENT LIST
  // ==========================================
  return (
    <div className="patient-monitoring-page">
      {loading && (
        <p role="status">Loading registered patients...</p>
      )}

      {error && (
        <div
          role="alert"
          style={{ color: "#ff6670", marginBottom: "16px" }}
        >
          {error}

          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginLeft: "12px" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="patient-page-header">
        <div className="page-title-with-icon">
          <div className="page-title-icon">
            <UsersRound size={21} />
          </div>

          <div>
            <h1>Patient Monitoring</h1>
            <p>Registered patients and available clinical information</p>
          </div>
        </div>

        <div className="monitoring-live-status">
          <i></i>
          Patient Records
        </div>
      </div>

      {/* SUMMARY */}
      <div className="patient-summary-grid">
        <div className="patient-summary-card">
          <div className="summary-icon blue">
            <UsersRound size={20} />
          </div>

          <div>
            <span>Total Patients</span>
            <strong>{patients.length}</strong>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="summary-icon green">
            <Activity size={20} />
          </div>

          <div>
            <span>Stable Records</span>
            <strong>
              {
                patients.filter(
                  (patient) => patient.status === "Stable"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="summary-icon orange">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>High / Severe Risk Labels</span>
            <strong>
              {
                patients.filter(
                  (patient) =>
                    patient.riskLevel === "High" ||
                    patient.riskLevel === "Severe"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="summary-icon red">
            <HeartPulse size={20} />
          </div>

          <div>
            <span>Critical Status Records</span>
            <strong>
              {
                patients.filter(
                  (patient) => patient.status === "Critical"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="patient-toolbar">
        <div className="patient-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search patient name, ID or room..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="clear-search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="patient-filter">
          <Filter size={16} />

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="Severe">Severe</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* PATIENT CARDS */}
      <div className="patient-list">
        {!loading && !error && filteredPatients.length > 0 &&
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onSelect={setSelectedPatient}
            />
          ))}

        {!loading && !error && filteredPatients.length === 0 && (
          <div className="no-patients">
            <UsersRound size={35} />

            <h3>No patients found</h3>

            <p>
              Try changing your search or risk filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMonitoring;
