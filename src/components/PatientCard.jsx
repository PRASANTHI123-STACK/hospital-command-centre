import {
  UserRound,
  BedDouble,
  HeartPulse,
  Activity,
  ArrowRight,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

function PatientCard({ patient, onSelect }) {
  return (
    <div className="patient-list-card">

      <div className="patient-card-main">

        {/* Avatar */}
        <div className="patient-avatar">
          <UserRound size={24} />
        </div>

        {/* Patient information */}
        <div className="patient-basic-info">

          <div className="patient-name-row">
            <h3>{patient.name}</h3>

            <span className="patient-id">
              {patient.id}
            </span>
          </div>

          <div className="patient-meta">

            <span>
              {patient.age} years
            </span>

            <span>
              {patient.gender}
            </span>

            <span>
              <BedDouble size={13} />
              {patient.room}
            </span>

          </div>

        </div>

        {/* Department */}
        <div className="patient-department">
          <span>Department</span>
          <strong>{patient.department}</strong>
        </div>

        {/* Vitals */}
        <div className="patient-mini-vitals">

          <div>
            <HeartPulse size={14} />
            <strong>{patient.heartRate}</strong>
            <small>bpm</small>
          </div>

          <div>
            <Activity size={14} />
            <strong>{patient.oxygenLevel}%</strong>
            <small>SpO₂</small>
          </div>

        </div>

        {/* Status */}
        <StatusBadge status={patient.status} />

        {/* Button */}
        <button
          className="patient-view-button"
          onClick={() => onSelect(patient)}
        >
          View

          <ArrowRight size={15} />
        </button>

      </div>

    </div>
  );
}

export default PatientCard;