import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  UsersRound,
  BedDouble,
  Siren,
  CalendarDays,
  Pill,
  Activity,
  Search,
  FileText,
  Download,
  Eye,
  X,
  Star,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import reports from "../data/reports";

function Reports() {
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const departments = [
    "All",
    ...reports.departmentPerformance.map(
      (item) => item.department
    ),
  ];

  const filteredReports = useMemo(() => {
    const search = reportSearch.toLowerCase();

    return reports.reportTypes.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(search) ||
        report.category.toLowerCase().includes(search) ||
        report.id.toLowerCase().includes(search);

      return matchesSearch;
    });
  }, [reportSearch]);

  const filteredDepartments =
    departmentFilter === "All"
      ? reports.departmentPerformance
      : reports.departmentPerformance.filter(
          (item) =>
            item.department === departmentFilter
        );

  const overview = reports.overview;

  const appointmentColors = [
    "#38bdf8",
    "#34d399",
    "#fb923c",
    "#a78bfa",
    "#ef4444",
  ];

  return (
    <div className="reports-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="reports-page-header">

        <div className="reports-title-row">

          <div className="reports-title-icon">
            <BarChart3 size={25} />
          </div>

          <div>
            <h1>
              Reports & Analytics
            </h1>

            <p>
              Hospital performance, operational insights and analytics
            </p>
          </div>

        </div>

        <div className="reports-live-status">
          <span></span>
          ANALYTICS ONLINE
        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="reports-summary-grid">

        <div className="reports-stat-card">

          <div className="reports-stat-icon blue">
            <UsersRound size={22} />
          </div>

          <div>
            <span>Total Patients</span>

            <strong>
              {overview.totalPatients.toLocaleString()}
            </strong>

            <small>
              Current hospital patients
            </small>
          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon green">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Total Admissions</span>

            <strong>
              {overview.totalAdmissions}
            </strong>

            <small>
              Current reporting period
            </small>
          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon orange">
            <BedDouble size={22} />
          </div>

          <div>
            <span>Bed Occupancy</span>

            <strong>
              {overview.bedOccupancy}%
            </strong>

            <small>
              Hospital capacity utilization
            </small>
          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon red">
            <Siren size={22} />
          </div>

          <div>
            <span>Emergency Cases</span>

            <strong>
              {overview.emergencyCases}
            </strong>

            <small>
              Emergency cases monitored
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          PATIENT TREND + APPOINTMENT STATUS
      ================================================= */}

      <div className="reports-main-grid">

        {/* PATIENT TREND */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>
              <h2>
                Patient & Admission Trends
              </h2>

              <p>
                Monthly hospital activity overview
              </p>
            </div>

            <div className="reports-panel-badge">
              9 Months
            </div>

          </div>

          <div className="reports-chart">
            <ResponsiveContainer
              width="100%"
              height={270}
            >
              <LineChart
                data={reports.monthlyPatients}
              >

                <CartesianGrid
                  stroke="#1b293b"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  stroke="#60738a"
                  tick={{
                    fill: "#708198",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  stroke="#60738a"
                  tick={{
                    fill: "#708198",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101c2d",
                    border: "1px solid #26384e",
                    borderRadius: "8px",
                    color: "#dce6ef",
                    fontSize: "10px",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  name="Patients"
                />

                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  name="Admissions"
                />

                <Line
                  type="monotone"
                  dataKey="discharges"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  name="Discharges"
                />

              </LineChart>
            </ResponsiveContainer>
          </div>

        </section>

        {/* APPOINTMENT STATUS */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>
              <h2>
                Appointment Status
              </h2>

              <p>
                Current appointment distribution
              </p>
            </div>

            <CalendarDays size={19} />

          </div>

          <div className="reports-pie-wrapper">

            <ResponsiveContainer
              width="100%"
              height={220}
            >
              <PieChart>

                <Pie
                  data={reports.appointmentStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                >

                  {reports.appointmentStatus.map(
                    (entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={
                          appointmentColors[index]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#101c2d",
                    border: "1px solid #26384e",
                    borderRadius: "8px",
                    fontSize: "10px",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

            <div className="reports-pie-center">
              <strong>
                {overview.appointments}
              </strong>

              <span>
                Total
              </span>
            </div>

          </div>

          <div className="reports-status-list">

            {reports.appointmentStatus.map(
              (item, index) => (

                <div key={item.status}>

                  <span>

                    <i
                      style={{
                        background:
                          appointmentColors[index],
                      }}
                    ></i>

                    {item.status}

                  </span>

                  <strong>
                    {item.count}
                  </strong>

                </div>

              )
            )}

          </div>

        </section>

      </div>

      {/* =================================================
          WEEKLY ACTIVITY
      ================================================= */}

      <section className="reports-panel reports-weekly-panel">

        <div className="reports-panel-header">

          <div>

            <h2>
              Weekly Hospital Activity
            </h2>

            <p>
              Admissions, discharges and appointments
            </p>

          </div>

          <Activity size={19} />

        </div>

        <div className="reports-chart">

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <BarChart
              data={reports.weeklyActivity}
            >

              <CartesianGrid
                stroke="#1b293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
                stroke="#60738a"
                tick={{
                  fill: "#708198",
                  fontSize: 10,
                }}
              />

              <YAxis
                stroke="#60738a"
                tick={{
                  fill: "#708198",
                  fontSize: 10,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#101c2d",
                  border: "1px solid #26384e",
                  borderRadius: "8px",
                  fontSize: "10px",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "10px",
                }}
              />

              <Bar
                dataKey="admissions"
                fill="#38bdf8"
                name="Admissions"
                radius={[3, 3, 0, 0]}
              />

              <Bar
                dataKey="discharges"
                fill="#34d399"
                name="Discharges"
                radius={[3, 3, 0, 0]}
              />

              <Bar
                dataKey="appointments"
                fill="#a78bfa"
                name="Appointments"
                radius={[3, 3, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>

      {/* =================================================
          DEPARTMENT PERFORMANCE
      ================================================= */}

      <section className="reports-panel">

        <div className="reports-panel-header">

          <div>

            <h2>
              Department Performance
            </h2>

            <p>
              Compare hospital departments
            </p>

          </div>

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(
                event.target.value
              )
            }
            className="reports-department-filter"
          >

            {departments.map((department) => (

              <option
                key={department}
                value={department}
              >
                {department === "All"
                  ? "All Departments"
                  : department}
              </option>

            ))}

          </select>

        </div>

        <div className="reports-department-grid">

          {filteredDepartments.map(
            (department) => (

              <div
                className="reports-department-card"
                key={department.department}
              >

                <div className="reports-department-top">

                  <div className="reports-department-icon">
                    <Activity size={17} />
                  </div>

                  <div>

                    <strong>
                      {department.department}
                    </strong>

                    <small>
                      {department.patients} patients
                    </small>

                  </div>

                  <span>
                    {department.performance}%
                  </span>

                </div>

                <div className="reports-department-stat">

                  <div>

                    <span>
                      Appointments
                    </span>

                    <strong>
                      {department.appointments}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Occupancy
                    </span>

                    <strong>
                      {department.occupancy}%
                    </strong>

                  </div>

                </div>

                <div className="reports-performance-bar">

                  <span
                    style={{
                      width: `${department.performance}%`,
                    }}
                  ></span>

                </div>

                <small className="reports-performance-label">
                  Performance score
                </small>

              </div>

            )
          )}

        </div>

      </section>

      {/* =================================================
          DOCTOR PERFORMANCE + BED OCCUPANCY
      ================================================= */}

      <div className="reports-secondary-grid">

        {/* DOCTORS */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>

              <h2>
                Top Doctor Performance
              </h2>

              <p>
                Highest performing doctors
              </p>

            </div>

            <Star size={18} />

          </div>

          <div className="reports-doctor-list">

            {reports.doctorPerformance.map(
              (doctor, index) => (

                <div
                  className="reports-doctor-item"
                  key={doctor.doctor}
                >

                  <div className="reports-doctor-rank">
                    {index + 1}
                  </div>

                  <div className="reports-doctor-info">

                    <strong>
                      {doctor.doctor}
                    </strong>

                    <small>
                      {doctor.department}
                      {" · "}
                      {doctor.patients} patients
                    </small>

                  </div>

                  <div className="reports-doctor-rating">

                    <Star size={12} />

                    <strong>
                      {doctor.rating}
                    </strong>

                  </div>

                  <div className="reports-doctor-efficiency">
                    {doctor.efficiency}%
                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* BED OCCUPANCY */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>

              <h2>
                Bed Occupancy
              </h2>

              <p>
                Occupancy by bed type
              </p>

            </div>

            <BedDouble size={18} />

          </div>

          <div className="reports-bed-list">

            {reports.bedOccupancy.map(
              (bed) => {

                const percentage =
                  Math.round(
                    (bed.occupied /
                      bed.total) *
                      100
                  );

                return (

                  <div
                    className="reports-bed-item"
                    key={bed.type}
                  >

                    <div className="reports-bed-row">

                      <span>
                        {bed.type}
                      </span>

                      <strong>
                        {bed.occupied}/{bed.total}
                      </strong>

                    </div>

                    <div className="reports-bed-bar">

                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></span>

                    </div>

                    <div className="reports-bed-meta">

                      <small>
                        Occupied {bed.occupied}
                      </small>

                      <small>
                        Available {bed.available}
                      </small>

                      <small>
                        Reserved {bed.reserved}
                      </small>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </section>

      </div>

      {/* =================================================
          PHARMACY SUMMARY
      ================================================= */}

      <section className="reports-pharmacy-card">

        <div className="reports-pharmacy-left">

          <div className="reports-pharmacy-icon">
            <Pill size={20} />
          </div>

          <div>

            <h2>
              Pharmacy Inventory
            </h2>

            <p>
              Current medicine inventory status
            </p>

          </div>

        </div>

        <div className="reports-pharmacy-stats">

          <div>
            <span>Total</span>
            <strong>
              {reports.pharmacySummary.totalMedicines}
            </strong>
          </div>

          <div className="green">
            <span>In Stock</span>
            <strong>
              {reports.pharmacySummary.inStock}
            </strong>
          </div>

          <div className="orange">
            <span>Low Stock</span>
            <strong>
              {reports.pharmacySummary.lowStock}
            </strong>
          </div>

          <div className="red">
            <span>Out of Stock</span>
            <strong>
              {reports.pharmacySummary.outOfStock}
            </strong>
          </div>

          <div>
            <span>Inventory Value</span>
            <strong>
              ₹{reports.pharmacySummary.inventoryValue.toLocaleString()}
            </strong>
          </div>

        </div>

      </section>

      {/* =================================================
          REPORT LIBRARY
      ================================================= */}

      <section className="reports-library">

        <div className="reports-library-header">

          <div>

            <h2>
              Report Library
            </h2>

            <p>
              Generate and access hospital reports
            </p>

          </div>

          <div className="reports-library-count">
            {filteredReports.length} Reports
          </div>

        </div>

        <div className="reports-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search reports..."
            value={reportSearch}
            onChange={(event) =>
              setReportSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="reports-library-list">

          {filteredReports.map(
            (report) => (

              <div
                className="reports-library-item"
                key={report.id}
              >

                <div className="reports-library-icon">
                  <FileText size={17} />
                </div>

                <div className="reports-library-info">

                  <strong>
                    {report.name}
                  </strong>

                  <small>
                    {report.id}
                    {" · "}
                    {report.category}
                  </small>

                </div>

                <div className="reports-library-date">

                  <span>
                    Last generated
                  </span>

                  <strong>
                    {report.lastGenerated}
                  </strong>

                </div>

                <span className="reports-ready">
                  <i></i>
                  {report.status}
                </span>

                <div className="reports-library-actions">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReport(report)
                    }
                    aria-label="View report"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    aria-label="Download report"
                  >
                    <Download size={15} />
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {filteredReports.length === 0 && (

          <div className="reports-empty">
            <FileText size={30} />

            <h3>
              No reports found
            </h3>

            <p>
              Try changing your search.
            </p>
          </div>

        )}

      </section>

      {/* =================================================
          REPORT MODAL
      ================================================= */}

      {selectedReport && (

        <div
          className="reports-modal-overlay"
          onClick={() =>
            setSelectedReport(null)
          }
        >

          <div
            className="reports-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="reports-modal-close"
              onClick={() =>
                setSelectedReport(null)
              }
            >
              <X size={18} />
            </button>

            <div className="reports-modal-header">

              <div className="reports-modal-icon">
                <FileText size={23} />
              </div>

              <div>

                <span>
                  {selectedReport.id}
                </span>

                <h2>
                  {selectedReport.name}
                </h2>

                <p>
                  {selectedReport.category}
                </p>

              </div>

            </div>

            <div className="reports-modal-status">

              <span>
                Report Status
              </span>

              <strong>
                <i></i>
                {selectedReport.status}
              </strong>

            </div>

            <div className="reports-modal-grid">

              <div>

                <FileText size={16} />

                <span>

                  <small>
                    Report ID
                  </small>

                  <strong>
                    {selectedReport.id}
                  </strong>

                </span>

              </div>

              <div>

                <BarChart3 size={16} />

                <span>

                  <small>
                    Category
                  </small>

                  <strong>
                    {selectedReport.category}
                  </strong>

                </span>

              </div>

              <div>

                <CalendarDays size={16} />

                <span>

                  <small>
                    Last Generated
                  </small>

                  <strong>
                    {selectedReport.lastGenerated}
                  </strong>

                </span>

              </div>

              <div>

                <Activity size={16} />

                <span>

                  <small>
                    Availability
                  </small>

                  <strong>
                    Ready
                  </strong>

                </span>

              </div>

            </div>

            <div className="reports-modal-actions">

              <button type="button">

                <Eye size={16} />

                Open Report

              </button>

              <button type="button">

                <Download size={16} />

                Download Report

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Reports;