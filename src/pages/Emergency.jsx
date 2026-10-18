import { useState } from "react";
import {
  Siren,
  AlertTriangle,
  Clock3,
  Activity,
  BedDouble,
  Ambulance,
  UserRound,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  X,
} from "lucide-react";

import emergencies from "../data/emergencies";

function Emergency() {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");

  const activeEmergencies = emergencies.filter(
    (item) => item.status !== "Resolved"
  );

  const criticalCount = emergencies.filter(
    (item) => item.priority === "Critical"
  ).length;

  const respondingCount = emergencies.filter(
    (item) => item.status === "Responding"
  ).length;

  const availableBeds = 12;

  const filteredEmergencies =
    priorityFilter === "All"
      ? emergencies
      : emergencies.filter(
          (item) => item.priority === priorityFilter
        );

  return (
    <div className="emergency-page">

      {/* PAGE HEADER */}
      <div className="emergency-page-header">
        <div>
          <div className="emergency-title-row">
            <div className="emergency-title-icon">
              <Siren size={25} />
            </div>

            <div>
              <h1>Emergency Command Centre</h1>
              <p>
                Real-time emergency response and critical patient management
              </p>
            </div>
          </div>
        </div>

        <div className="emergency-live-status">
          <span></span>
          LIVE MONITORING
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="emergency-summary-grid">

        <div className="emergency-stat-card critical-card">
          <div className="emergency-stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Critical Emergencies</span>
            <strong>{criticalCount}</strong>
            <small>Immediate attention required</small>
          </div>
        </div>

        <div className="emergency-stat-card">
          <div className="emergency-stat-icon orange">
            <Activity size={22} />
          </div>

          <div>
            <span>Active Emergencies</span>
            <strong>{activeEmergencies.length}</strong>
            <small>Currently being handled</small>
          </div>
        </div>

        <div className="emergency-stat-card">
          <div className="emergency-stat-icon blue">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Teams Responding</span>
            <strong>{respondingCount}</strong>
            <small>Emergency teams active</small>
          </div>
        </div>

        <div className="emergency-stat-card">
          <div className="emergency-stat-icon green">
            <BedDouble size={22} />
          </div>

          <div>
            <span>Emergency Beds</span>
            <strong>{availableBeds}</strong>
            <small>Currently available</small>
          </div>
        </div>

      </div>

      {/* COMMAND CENTRE GRID */}
      <div className="emergency-command-grid">
        {/* LIVE EMERGENCY INTELLIGENCE */}
<section className="emergency-intelligence">

  <div className="emergency-intelligence-header">
    <div>
      <h2>Live Emergency Intelligence</h2>
      <p>Real-time hospital emergency response overview</p>
    </div>

    <div className="intelligence-live">
      <span></span>
      LIVE DATA
    </div>
  </div>

  <div className="intelligence-metrics">

    <div className="intelligence-metric">
      <div className="intelligence-metric-top">
        <span>Average Response Time</span>
        <Clock3 size={17} />
      </div>

      <strong>04:36</strong>

      <div className="intelligence-progress">
        <span style={{ width: "72%" }}></span>
      </div>

      <small>18% faster than yesterday</small>
    </div>

    <div className="intelligence-metric">
      <div className="intelligence-metric-top">
        <span>Ambulance Availability</span>
        <Ambulance size={17} />
      </div>

      <strong>4 / 6</strong>

      <div className="intelligence-progress">
        <span style={{ width: "67%" }}></span>
      </div>

      <small>2 ambulances currently responding</small>
    </div>

    <div className="intelligence-metric">
      <div className="intelligence-metric-top">
        <span>Emergency Bed Capacity</span>
        <BedDouble size={17} />
      </div>

      <strong>12 / 20</strong>

      <div className="intelligence-progress">
        <span style={{ width: "60%" }}></span>
      </div>

      <small>60% emergency capacity available</small>
    </div>

    <div className="intelligence-metric">
      <div className="intelligence-metric-top">
        <span>Response Performance</span>
        <Activity size={17} />
      </div>

      <strong>94%</strong>

      <div className="intelligence-progress">
        <span style={{ width: "94%" }}></span>
      </div>

      <small>Within recommended response target</small>
    </div>

  </div>

  <div className="intelligence-bottom-grid">

    {/* EMERGENCY TREND */}
    <div className="intelligence-panel">

      <div className="intelligence-panel-title">
        <div>
          <h3>Emergency Trend</h3>
          <span>Emergency cases — last 7 days</span>
        </div>

        <Activity size={18} />
      </div>

      <div className="trend-chart">

        <div className="trend-y-axis">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>

        <div className="trend-chart-area">

          <div className="trend-grid-line line-1"></div>
          <div className="trend-grid-line line-2"></div>
          <div className="trend-grid-line line-3"></div>
          <div className="trend-grid-line line-4"></div>

          <svg
            viewBox="0 0 700 180"
            preserveAspectRatio="none"
            className="trend-svg"
          >
            <defs>
              <linearGradient
                id="emergencyTrendGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopOpacity="0.35" />
                <stop offset="100%" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M0 135 L100 112 L200 120 L300 82 L400 95 L500 55 L600 70 L700 35 L700 180 L0 180 Z"
              fill="url(#emergencyTrendGradient)"
            />

            <polyline
              points="0,135 100,112 200,120 300,82 400,95 500,55 600,70 700,35"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle cx="0" cy="135" r="4" fill="currentColor" />
            <circle cx="100" cy="112" r="4" fill="currentColor" />
            <circle cx="200" cy="120" r="4" fill="currentColor" />
            <circle cx="300" cy="82" r="4" fill="currentColor" />
            <circle cx="400" cy="95" r="4" fill="currentColor" />
            <circle cx="500" cy="55" r="4" fill="currentColor" />
            <circle cx="600" cy="70" r="4" fill="currentColor" />
            <circle cx="700" cy="35" r="4" fill="currentColor" />
          </svg>

          <div className="trend-days">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

        </div>

      </div>

    </div>

    {/* ALERT TIMELINE */}
    <div className="intelligence-panel">

      <div className="intelligence-panel-title">
        <div>
          <h3>Recent Alert Timeline</h3>
          <span>Latest emergency activity</span>
        </div>

        <AlertTriangle size={18} />
      </div>

      <div className="alert-timeline">

        <div className="timeline-item critical">
          <div className="timeline-dot"></div>

          <div>
            <strong>Critical emergency reported</strong>
            <p>Mahesh Rao — ICU-05</p>
            <small>2 minutes ago</small>
          </div>
        </div>

        <div className="timeline-item high">
          <div className="timeline-dot"></div>

          <div>
            <strong>Emergency team dispatched</strong>
            <p>Neurology Team → ICU-07</p>
            <small>8 minutes ago</small>
          </div>
        </div>

        <div className="timeline-item medium">
          <div className="timeline-dot"></div>

          <div>
            <strong>Patient under monitoring</strong>
            <p>Ramesh Kumar — ICU-12</p>
            <small>14 minutes ago</small>
          </div>
        </div>

        <div className="timeline-item resolved">
          <div className="timeline-dot"></div>

          <div>
            <strong>Emergency successfully resolved</strong>
            <p>Anitha Rao — GEN-31</p>
            <small>24 minutes ago</small>
          </div>
        </div>

      </div>

    </div>

  </div>

</section>

        {/* ACTIVE EMERGENCIES */}
        <section className="emergency-panel emergency-active-panel">


          <div className="emergency-panel-header">
            <div>
              <h2>Active Emergency Cases</h2>
              <p>Patients requiring emergency response</p>
            </div>

            <div className="emergency-case-count">
              {activeEmergencies.length} Active
            </div>
          </div>

          <div className="emergency-case-list">

            {activeEmergencies.map((emergency) => (

              <div
                className={`emergency-case-card ${
                  emergency.priority.toLowerCase()
                }`}
                key={emergency.id}
              >

                <div className="emergency-case-priority">
                  <span></span>
                  {emergency.priority}
                </div>

                <div className="emergency-case-main">

                  <div className="emergency-patient-icon">
                    <UserRound size={22} />
                  </div>

                  <div className="emergency-patient-info">

                    <div className="emergency-patient-name">
                      <h3>{emergency.patientName}</h3>
                      <span>{emergency.patientId}</span>
                    </div>

                    <p>{emergency.emergencyType}</p>

                    <div className="emergency-patient-meta">
                      <span>
                        <MapPin size={13} />
                        {emergency.location}
                      </span>

                      <span>
                        <Clock3 size={13} />
                        {emergency.responseTime}
                      </span>

                      <span>
                        <UserRound size={13} />
                        {emergency.assignedDoctor}
                      </span>
                    </div>

                  </div>

                  <div className="emergency-case-status">
                    <span>{emergency.status}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEmergency(emergency)
                      }
                    >
                      View
                      <ArrowRight size={15} />
                    </button>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* EMERGENCY OPERATIONS */}
        <section className="emergency-panel emergency-operations-panel">

          <div className="emergency-panel-header">
            <div>
              <h2>Emergency Operations</h2>
              <p>Current hospital response status</p>
            </div>
          </div>

          <div className="operation-item">
            <div className="operation-icon ambulance">
              <Ambulance size={21} />
            </div>

            <div>
              <strong>Ambulances</strong>
              <span>4 Available</span>
            </div>

            <b>4/6</b>
          </div>

          <div className="operation-item">
            <div className="operation-icon doctor">
              <UserRound size={21} />
            </div>

            <div>
              <strong>Emergency Doctors</strong>
              <span>8 On Duty</span>
            </div>

            <b>8/10</b>
          </div>

          <div className="operation-item">
            <div className="operation-icon bed">
              <BedDouble size={21} />
            </div>

            <div>
              <strong>Emergency Beds</strong>
              <span>12 Available</span>
            </div>

            <b>12/20</b>
          </div>

          <div className="operation-item">
            <div className="operation-icon team">
              <Activity size={21} />
            </div>

            <div>
              <strong>Response Teams</strong>
              <span>3 Active</span>
            </div>

            <b>3/5</b>
          </div>

        </section>

      </div>

      {/* FILTER + ALL CASES */}
      <section className="emergency-panel emergency-all-panel">

        <div className="emergency-panel-header">

          <div>
            <h2>Emergency Response Log</h2>
            <p>Recent emergency incidents and response activity</p>
          </div>

          <div className="emergency-filter-group">

            {["All", "Critical", "High", "Medium"].map((filter) => (

              <button
                type="button"
                key={filter}
                className={
                  priorityFilter === filter ? "active" : ""
                }
                onClick={() => setPriorityFilter(filter)}
              >
                {filter}
              </button>

            ))}

          </div>

        </div>

        <div className="emergency-table-wrapper">

          <table className="emergency-table">

            <thead>
              <tr>
                <th>Emergency ID</th>
                <th>Patient</th>
                <th>Emergency</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredEmergencies.map((emergency) => (

                <tr key={emergency.id}>

                  <td>
                    <span className="emergency-id">
                      {emergency.id}
                    </span>
                  </td>

                  <td>
                    <strong>{emergency.patientName}</strong>
                    <small>{emergency.patientId}</small>
                  </td>

                  <td>{emergency.emergencyType}</td>

                  <td>
                    <span
                      className={`priority-badge ${emergency.priority.toLowerCase()}`}
                    >
                      {emergency.priority}
                    </span>
                  </td>

                  <td>{emergency.location}</td>

                  <td>{emergency.assignedDoctor}</td>

                  <td>
                    <span
                      className={`response-status ${emergency.status.toLowerCase()}`}
                    >
                      <i></i>
                      {emergency.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* EMERGENCY MODAL */}
      {selectedEmergency && (

        <div
          className="emergency-modal-overlay"
          onClick={() => setSelectedEmergency(null)}
        >

          <div
            className="emergency-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="emergency-modal-close"
              onClick={() => setSelectedEmergency(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-emergency-icon">
              <Siren size={28} />
            </div>

            <div className="modal-emergency-title">
              <span>{selectedEmergency.priority} PRIORITY</span>
              <h2>{selectedEmergency.patientName}</h2>
              <p>{selectedEmergency.patientId}</p>
            </div>

            <div className="modal-emergency-grid">

              <div>
                <span>Emergency</span>
                <strong>{selectedEmergency.emergencyType}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedEmergency.location}</strong>
              </div>

              <div>
                <span>Doctor</span>
                <strong>{selectedEmergency.assignedDoctor}</strong>
              </div>

              <div>
                <span>Response Team</span>
                <strong>{selectedEmergency.assignedTeam}</strong>
              </div>

            </div>

            <div className="modal-emergency-description">
              <span>Emergency Description</span>
              <p>{selectedEmergency.description}</p>
            </div>

            <div className="modal-emergency-actions">

              <button type="button">
                <Phone size={17} />
                Contact Team
              </button>

              <button type="button">
                <CheckCircle2 size={17} />
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Emergency;