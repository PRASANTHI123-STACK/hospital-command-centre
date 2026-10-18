import { useMemo, useState } from "react";

import {
  BrainCircuit,
  Search,
  UserRound,
  Activity,
  HeartPulse,
  Droplets,
  Thermometer,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

import aiPredictions from "../data/aiPredictions";

function DiseasePrediction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedPrediction, setSelectedPrediction] =
    useState(null);

  const filteredPredictions = useMemo(() => {
    return aiPredictions.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.patientName
          .toLowerCase()
          .includes(search) ||
        item.patientId
          .toLowerCase()
          .includes(search) ||
        item.doctor
          .toLowerCase()
          .includes(search) ||
        item.prediction
          .toLowerCase()
          .includes(search);

      const matchesRisk =
        riskFilter === "All" ||
        item.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter]);

  const totalPredictions = aiPredictions.length;

  const highRisk = aiPredictions.filter(
    (item) =>
      item.riskLevel === "High" ||
      item.riskLevel === "Severe"
  ).length;

  const mediumRisk = aiPredictions.filter(
    (item) => item.riskLevel === "Medium"
  ).length;

  const lowRisk = aiPredictions.filter(
    (item) => item.riskLevel === "Low"
  ).length;

  return (
    <div className="ai-prediction-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="ai-prediction-header">

        <div className="ai-prediction-title-row">

          <div className="ai-prediction-title-icon">
            <BrainCircuit size={26} />
          </div>

          <div>

            <h1>
              AI Disease Prediction
            </h1>

            <p>
              AI-assisted risk assessment and clinical insights
            </p>

          </div>

        </div>

        <div className="ai-live-status">
          <span></span>
          AI ENGINE ONLINE
        </div>

      </div>

      {/* =========================
          AI DISCLAIMER
      ========================= */}

      <div className="ai-disclaimer">

        <div className="ai-disclaimer-icon">
          <ShieldAlert size={18} />
        </div>

        <div>
          <strong>
            AI Decision Support
          </strong>

          <p>
            Predictions shown here are demonstration outputs
            and should not replace professional clinical judgment.
          </p>
        </div>

      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="ai-summary-grid">

        <div className="ai-stat-card">

          <div className="ai-stat-icon blue">
            <BrainCircuit size={21} />
          </div>

          <div>
            <span>Total Predictions</span>
            <strong>{totalPredictions}</strong>
            <small>AI assessments today</small>
          </div>

        </div>

        <div className="ai-stat-card">

          <div className="ai-stat-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>High Risk</span>
            <strong>{highRisk}</strong>
            <small>Requires review</small>
          </div>

        </div>

        <div className="ai-stat-card">

          <div className="ai-stat-icon orange">
            <Activity size={21} />
          </div>

          <div>
            <span>Medium Risk</span>
            <strong>{mediumRisk}</strong>
            <small>Under monitoring</small>
          </div>

        </div>

        <div className="ai-stat-card">

          <div className="ai-stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Low Risk</span>
            <strong>{lowRisk}</strong>
            <small>Routine monitoring</small>
          </div>

        </div>

      </div>

      {/* =========================
          PREDICTION WORKSPACE
      ========================= */}

      <section className="ai-workspace">

        <div className="ai-workspace-header">

          <div>

            <h2>
              Patient Risk Assessment
            </h2>

            <p>
              Review AI-generated disease risk assessments
            </p>

          </div>

          <div className="ai-prediction-count">
            {filteredPredictions.length} Assessments
          </div>

        </div>

        {/* FILTERS */}

        <div className="ai-filter-bar">

          <div className="ai-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search patient, doctor or prediction..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <select
            value={riskFilter}
            onChange={(event) =>
              setRiskFilter(event.target.value)
            }
          >

            <option value="All">
              All Risk Levels
            </option>

            <option value="Severe">
              Severe
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>

          </select>

        </div>

        {/* =========================
            PREDICTION CARDS
        ========================= */}

        <div className="ai-prediction-grid">

          {filteredPredictions.map((item) => (

            <div
              className="ai-prediction-card"
              key={item.id}
            >

              <div className="ai-card-top">

                <div className="ai-patient-info">

                  <div className="ai-patient-avatar">
                    <UserRound size={18} />
                  </div>

                  <div>

                    <strong>
                      {item.patientName}
                    </strong>

                    <small>
                      {item.patientId}
                      {" · "}
                      {item.age} yrs
                      {" · "}
                      {item.gender}
                    </small>

                  </div>

                </div>

                <span
                  className={`ai-risk-badge ${item.riskLevel.toLowerCase()}`}
                >
                  {item.riskLevel}
                </span>

              </div>

              <div className="ai-card-prediction">

                <div className="ai-prediction-icon">
                  <BrainCircuit size={19} />
                </div>

                <div>

                  <span>
                    AI Prediction
                  </span>

                  <strong>
                    {item.prediction}
                  </strong>

                </div>

              </div>

              <div className="ai-confidence">

                <div>

                  <span>
                    Risk Probability
                  </span>

                  <strong>
                    {item.probability}%
                  </strong>

                </div>

                <div className="ai-confidence-bar">

                  <span
                    className={item.riskLevel.toLowerCase()}
                    style={{
                      width: `${item.probability}%`,
                    }}
                  ></span>

                </div>

                <small>
                  AI confidence: {item.confidence}%
                </small>

              </div>

              <div className="ai-card-vitals">

                <div>
                  <HeartPulse size={14} />
                  <span>
                    {item.vitals.heartRate} bpm
                  </span>
                </div>

                <div>
                  <Activity size={14} />
                  <span>
                    {item.vitals.systolicBP}/
                    {item.vitals.diastolicBP}
                  </span>
                </div>

                <div>
                  <Droplets size={14} />
                  <span>
                    {item.vitals.oxygen}%
                  </span>
                </div>

                <div>
                  <Thermometer size={14} />
                  <span>
                    {item.vitals.temperature}°F
                  </span>
                </div>

              </div>

              <div className="ai-card-footer">

                <div>

                  <small>
                    Assigned Doctor
                  </small>

                  <strong>
                    {item.doctor}
                  </strong>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPrediction(item)
                  }
                >
                  View Analysis
                  <ArrowRight size={14} />
                </button>

              </div>

            </div>

          ))}

        </div>

        {filteredPredictions.length === 0 && (

          <div className="ai-empty-state">

            <BrainCircuit size={30} />

            <h3>
              No predictions found
            </h3>

            <p>
              Try changing your search or risk filter.
            </p>

          </div>

        )}

      </section>

      {/* =========================
          AI INSIGHTS
      ========================= */}

      <section className="ai-insights-panel">

        <div className="ai-insights-header">

          <div className="ai-insights-icon">
            <Sparkles size={19} />
          </div>

          <div>

            <h2>
              AI Clinical Intelligence
            </h2>

            <p>
              Overview of current AI-generated risk signals
            </p>

          </div>

        </div>

        <div className="ai-insight-grid">

          <div className="ai-insight-item">

            <div className="ai-insight-number">
              02
            </div>

            <div>

              <strong>
                High-risk assessments
              </strong>

              <p>
                Patients requiring closer clinical review
              </p>

            </div>

          </div>

          <div className="ai-insight-item">

            <div className="ai-insight-number">
              04
            </div>

            <div>

              <strong>
                Active monitoring signals
              </strong>

              <p>
                AI indicators currently being monitored
              </p>

            </div>

          </div>

          <div className="ai-insight-item">

            <div className="ai-insight-number">
              89%
            </div>

            <div>

              <strong>
                Average AI confidence
              </strong>

              <p>
                Across current demonstration assessments
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedPrediction && (

        <div
          className="ai-modal-overlay"
          onClick={() =>
            setSelectedPrediction(null)
          }
        >

          <div
            className="ai-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="ai-modal-close"
              onClick={() =>
                setSelectedPrediction(null)
              }
            >
              <X size={19} />
            </button>

            {/* MODAL HEADER */}

            <div className="ai-modal-header">

              <div className="ai-modal-icon">
                <BrainCircuit size={25} />
              </div>

              <div>

                <span>
                  {selectedPrediction.id}
                </span>

                <h2>
                  {selectedPrediction.patientName}
                </h2>

                <p>
                  {selectedPrediction.patientId}
                  {" · "}
                  {selectedPrediction.department}
                </p>

              </div>

            </div>

            {/* RISK */}

            <div className="ai-modal-risk">

              <div>

                <span>
                  AI Risk Assessment
                </span>

                <strong>
                  {selectedPrediction.prediction}
                </strong>

              </div>

              <div
                className={`ai-modal-risk-value ${selectedPrediction.riskLevel.toLowerCase()}`}
              >
                {selectedPrediction.probability}%
              </div>

            </div>

            {/* PATIENT DETAILS */}

            <div className="ai-modal-section">

              <h3>
                Patient Information
              </h3>

              <div className="ai-modal-info-grid">

                <div>
                  <UserRound size={15} />
                  <span>
                    <small>Patient</small>
                    <strong>
                      {selectedPrediction.patientName}
                    </strong>
                  </span>
                </div>

                <div>
                  <Stethoscope size={15} />
                  <span>
                    <small>Doctor</small>
                    <strong>
                      {selectedPrediction.doctor}
                    </strong>
                  </span>
                </div>

              </div>

            </div>

            {/* VITALS */}

            <div className="ai-modal-section">

              <h3>
                Current Vitals
              </h3>

              <div className="ai-modal-vitals">

                <div>
                  <HeartPulse size={15} />
                  <span>
                    Heart Rate
                    <strong>
                      {selectedPrediction.vitals.heartRate} bpm
                    </strong>
                  </span>
                </div>

                <div>
                  <Activity size={15} />
                  <span>
                    Blood Pressure
                    <strong>
                      {selectedPrediction.vitals.systolicBP}/
                      {selectedPrediction.vitals.diastolicBP}
                    </strong>
                  </span>
                </div>

                <div>
                  <Droplets size={15} />
                  <span>
                    Oxygen
                    <strong>
                      {selectedPrediction.vitals.oxygen}%
                    </strong>
                  </span>
                </div>

                <div>
                  <Thermometer size={15} />
                  <span>
                    Temperature
                    <strong>
                      {selectedPrediction.vitals.temperature}°F
                    </strong>
                  </span>
                </div>

              </div>

            </div>

            {/* SYMPTOMS */}

            <div className="ai-modal-section">

              <h3>
                Reported Symptoms
              </h3>

              <div className="ai-symptom-list">

                {selectedPrediction.symptoms.map(
                  (symptom) => (
                    <span key={symptom}>
                      {symptom}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* INSIGHTS */}

            <div className="ai-modal-section">

              <h3>
                AI-Generated Insights
              </h3>

              <div className="ai-insight-list">

                {selectedPrediction.insights.map(
                  (insight, index) => (

                    <div key={index}>

                      <Sparkles size={14} />

                      <span>
                        {insight}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            <div className="ai-modal-footer">

              <span>
                AI confidence:{" "}
                <strong>
                  {selectedPrediction.confidence}%
                </strong>
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedPrediction(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default DiseasePrediction;