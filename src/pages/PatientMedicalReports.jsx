
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Hospital,
  FileText,
  CalendarDays,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function PatientMedicalReports() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("patientLoggedIn");
    const storedUser = localStorage.getItem("patientUser");

    if (loggedIn !== "true" || !storedUser) {
      navigate("/patient-login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
      setPatient(user);
    } catch {
      navigate("/patient-login");
      return;
    }

    const loadReports = async () => {
      try {
        // This endpoint must return reports belonging to this patient.
        const response = await fetch(
          `http://localhost:5000/api/reports/patient/${encodeURIComponent(
            user.patientId || user.id
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load medical reports."
          );
        }

        setReports(data.reports || []);
      } catch (err) {
        console.error("Medical reports error:", err);
        setError(
          "Medical reports could not be loaded. The patient reports API may not be configured yet."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [navigate]);

  if (!patient) {
    return (
      <div className="patient-reports-loading">
        Checking patient login...
      </div>
    );
  }

  return (
    <div className="patient-reports-page">
      <header className="patient-reports-header">
        <div className="patient-reports-brand">
          <div className="patient-reports-logo">
            <Hospital size={23} />
          </div>
          <div>
            <strong>AI POWERED</strong>
            <span>HOSPITAL PATIENT SERVICES</span>
          </div>
        </div>

        <button
          className="patient-reports-back"
          onClick={() => navigate("/patient-home")}
        >
          <ArrowLeft size={16} />
          Patient Home
        </button>
      </header>

      <main className="patient-reports-main">
        <div className="patient-reports-title">
          <div className="patient-reports-title-icon">
            <FileText size={24} />
          </div>
          <div>
            <p>YOUR HEALTHCARE RECORDS</p>
            <h1>Medical Reports</h1>
            <span>
              View medical reports associated with your patient account.
            </span>
          </div>
        </div>

        <section className="patient-reports-patient">
          <div>
            <span>Patient Name</span>
            <strong>{patient.name}</strong>
          </div>
          <div>
            <span>Patient ID</span>
            <strong>{patient.patientId || patient.id}</strong>
          </div>
        </section>

        <section className="patient-reports-section">
          <div className="patient-reports-section-heading">
            <div>
              <h2>Your Reports</h2>
              <p>
                Reports available for your patient record
              </p>
            </div>

            <button
              className="patient-reports-refresh"
              onClick={() => window.location.reload()}
              title="Refresh reports"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {loading && (
            <div className="patient-reports-message">
              <RefreshCw size={19} />
              Loading your medical reports...
            </div>
          )}

          {!loading && error && (
            <div className="patient-reports-message error">
              <AlertCircle size={20} />
              <div>
                <strong>Reports unavailable</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="patient-reports-empty">
              <FileText size={34} />
              <h3>No medical reports available</h3>
              <p>
                There are currently no reports available for
                your patient account. Please contact hospital
                reception if you expect to see a report here.
              </p>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="patient-reports-list">
              {reports.map((report) => (
                <article
                  className="patient-report-card"
                  key={report._id || report.reportId}
                >
                  <div className="patient-report-icon">
                    <FileText size={22} />
                  </div>

                  <div className="patient-report-info">
                    <h3>
                      {report.title ||
                        report.reportName ||
                        report.reportType ||
                        "Medical Report"}
                    </h3>

                    <p>
                      {report.description ||
                        report.department ||
                        "Hospital medical record"}
                    </p>

                    <span>
                      <CalendarDays size={13} />
                      {report.reportDate
                        ? new Date(
                            report.reportDate
                          ).toLocaleDateString()
                        : report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                  </div>

                  {report.fileUrl ? (
                    <a
                      className="patient-report-download"
                      href={report.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={15} />
                      View report
                    </a>
                  ) : (
                    <span className="patient-report-status">
                      <CheckCircle2 size={14} />
                      Record
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="patient-reports-notice">
          <AlertCircle size={17} />
          <p>
            Medical reports contain private health information.
            Only access records belonging to your own patient account.
          </p>
        </div>
      </main>
    </div>
  );
}

export default PatientMedicalReports;
