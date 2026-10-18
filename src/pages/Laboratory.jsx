import { useMemo, useState } from "react";
import {
  FlaskConical,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Activity,
  Eye,
  X,
  CalendarDays,
  UserRound,
  Building2,
  FileText,
  TestTube2,
  ArrowRight,
} from "lucide-react";

import laboratoryTests from "../data/laboratory";

function Laboratory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTest, setSelectedTest] = useState(null);

  const departments = [
    "All",
    ...new Set(
      laboratoryTests.map((test) => test.department)
    ),
  ];

  const statuses = [
    "All",
    ...new Set(
      laboratoryTests.map((test) => test.resultStatus)
    ),
  ];

  const priorities = [
    "All",
    ...new Set(
      laboratoryTests.map((test) => test.priority)
    ),
  ];

  const filteredTests = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return laboratoryTests.filter((test) => {
      const matchesSearch =
        test.patientName
          .toLowerCase()
          .includes(search) ||
        test.patientId
          .toLowerCase()
          .includes(search) ||
        test.testName
          .toLowerCase()
          .includes(search) ||
        test.testCode
          .toLowerCase()
          .includes(search) ||
        test.doctor
          .toLowerCase()
          .includes(search) ||
        test.id
          .toLowerCase()
          .includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        test.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        test.resultStatus === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        test.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    searchTerm,
    departmentFilter,
    statusFilter,
    priorityFilter,
  ]);

  const totalTests = laboratoryTests.length;

  const pendingTests = laboratoryTests.filter(
    (test) => test.resultStatus === "Pending"
  ).length;

  const completedTests = laboratoryTests.filter(
    (test) => test.resultStatus === "Completed"
  ).length;

  const criticalResults = laboratoryTests.filter(
    (test) => test.resultStatus === "Critical"
  ).length;

  const processingTests = laboratoryTests.filter(
    (test) => test.resultStatus === "Pending"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "completed";

      case "Critical":
        return "critical";

      case "Pending":
        return "pending";

      default:
        return "";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "critical";

      case "High":
        return "high";

      case "Medium":
        return "medium";

      case "Low":
        return "low";

      default:
        return "";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  return (
    <div className="laboratory-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="laboratory-page-header">

        <div className="laboratory-title-row">

          <div className="laboratory-title-icon">
            <FlaskConical size={25} />
          </div>

          <div>
            <h1>Laboratory</h1>

            <p>
              Manage laboratory tests, results and diagnostic activity
            </p>
          </div>

        </div>

        <div className="laboratory-live-status">
          <span></span>
          LAB LIVE
        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="laboratory-summary-grid">

        <div className="laboratory-stat-card">

          <div className="laboratory-stat-icon blue">
            <FlaskConical size={22} />
          </div>

          <div>
            <span>Total Tests</span>
            <strong>{totalTests}</strong>
            <small>Laboratory orders</small>
          </div>

        </div>

        <div className="laboratory-stat-card">

          <div className="laboratory-stat-icon orange">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Pending Tests</span>
            <strong>{pendingTests}</strong>
            <small>Awaiting results</small>
          </div>

        </div>

        <div className="laboratory-stat-card">

          <div className="laboratory-stat-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTests}</strong>
            <small>Results available</small>
          </div>

        </div>

        <div className="laboratory-stat-card">

          <div className="laboratory-stat-icon red">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Critical Results</span>
            <strong>{criticalResults}</strong>
            <small>Immediate review</small>
          </div>

        </div>

      </div>

      {/* =====================================================
          LABORATORY WORKSPACE
          ===================================================== */}

      <section className="laboratory-panel">

        <div className="laboratory-panel-header">

          <div>
            <h2>Laboratory Test Management</h2>

            <p>
              Monitor diagnostic tests and laboratory results
            </p>
          </div>

          <div className="laboratory-test-count">
            <Activity size={14} />
            {filteredTests.length} Tests
          </div>

        </div>

        {/* ===================================================
            FILTERS
            =================================================== */}

        <div className="laboratory-filter-bar">

          <div className="laboratory-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search patient, test, doctor or ID..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <div className="laboratory-filter">

            <Filter size={14} />

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
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

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status === "All"
                  ? "All Results"
                  : status}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
          >
            {priorities.map((priority) => (
              <option
                key={priority}
                value={priority}
              >
                {priority === "All"
                  ? "All Priorities"
                  : priority}
              </option>
            ))}
          </select>

          {(searchTerm ||
            departmentFilter !== "All" ||
            statusFilter !== "All" ||
            priorityFilter !== "All") && (
            <button
              type="button"
              className="laboratory-clear-filter"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}

        </div>

        {/* ===================================================
            TABLE
            =================================================== */}

        <div className="laboratory-table-wrapper">

          <table className="laboratory-table">

            <thead>
              <tr>
                <th>TEST ID</th>
                <th>PATIENT</th>
                <th>TEST</th>
                <th>DEPARTMENT</th>
                <th>SAMPLE</th>
                <th>RESULT</th>
                <th>PRIORITY</th>
                <th>ORDERED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredTests.map((test) => (

                <tr key={test.id}>

                  <td>
                    <span className="laboratory-test-id">
                      {test.id}
                    </span>
                  </td>

                  <td>

                    <div className="laboratory-patient">

                      <div className="laboratory-patient-avatar">
                        {test.patientName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {test.patientName}
                        </strong>

                        <small>
                          {test.patientId} • {test.age} yrs
                        </small>
                      </div>

                    </div>

                  </td>

                  <td>

                    <div className="laboratory-test-name">

                      <strong>
                        {test.testName}
                      </strong>

                      <small>
                        {test.testCode}
                      </small>

                    </div>

                  </td>

                  <td>
                    <span className="laboratory-department">
                      {test.department}
                    </span>
                  </td>

                  <td>
                    <span className="laboratory-sample">
                      {test.sampleType}
                    </span>
                  </td>

                  <td>

                    <span
                      className={`laboratory-status ${getStatusClass(
                        test.resultStatus
                      )}`}
                    >
                      {test.resultStatus}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`laboratory-priority ${getPriorityClass(
                        test.priority
                      )}`}
                    >
                      {test.priority}
                    </span>

                  </td>

                  <td>

                    <div className="laboratory-date">

                      <strong>
                        {test.orderedDate}
                      </strong>

                      <small>
                        {test.orderedTime}
                      </small>

                    </div>

                  </td>

                  <td>

                    <button
                      type="button"
                      className="laboratory-view-button"
                      title="View test details"
                      onClick={() =>
                        setSelectedTest(test)
                      }
                    >
                      <Eye size={15} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredTests.length === 0 && (

          <div className="laboratory-empty">

            <FlaskConical size={32} />

            <h3>No laboratory tests found</h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </section>

      {/* =====================================================
          LOWER INFORMATION CARDS
          ===================================================== */}

      <div className="laboratory-overview-grid">

        {/* Critical Results */}

        <section className="laboratory-overview-card">

          <div className="laboratory-overview-header">

            <div className="laboratory-overview-icon red">
              <AlertTriangle size={18} />
            </div>

            <div>
              <h2>Critical Lab Results</h2>

              <p>
                Results requiring immediate clinical review
              </p>
            </div>

          </div>

          <div className="laboratory-critical-list">

            {laboratoryTests
              .filter(
                (test) =>
                  test.resultStatus === "Critical"
              )
              .map((test) => (

                <div
                  className="laboratory-critical-item"
                  key={test.id}
                  onClick={() =>
                    setSelectedTest(test)
                  }
                >

                  <div className="laboratory-critical-icon">
                    <AlertTriangle size={14} />
                  </div>

                  <div>

                    <strong>
                      {test.testName}
                    </strong>

                    <small>
                      {test.patientName} • {test.result}
                    </small>

                  </div>

                  <ArrowRight size={14} />

                </div>

              ))}

          </div>

        </section>

        {/* Lab Activity */}

        <section className="laboratory-overview-card">

          <div className="laboratory-overview-header">

            <div className="laboratory-overview-icon blue">
              <Activity size={18} />
            </div>

            <div>
              <h2>Laboratory Activity</h2>

              <p>
                Current diagnostic workflow status
              </p>
            </div>

          </div>

          <div className="laboratory-activity-list">

            <div>
              <span>Total tests</span>
              <strong>{totalTests}</strong>
            </div>

            <div>
              <span>Completed</span>
              <strong className="green">
                {completedTests}
              </strong>
            </div>

            <div>
              <span>Pending / Processing</span>
              <strong className="orange">
                {processingTests}
              </strong>
            </div>

            <div>
              <span>Critical results</span>
              <strong className="red">
                {criticalResults}
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          TEST DETAILS MODAL
          ===================================================== */}

      {selectedTest && (

        <div
          className="laboratory-modal-overlay"
          onClick={() =>
            setSelectedTest(null)
          }
        >

          <div
            className="laboratory-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="laboratory-modal-close"
              onClick={() =>
                setSelectedTest(null)
              }
            >
              <X size={18} />
            </button>

            {/* Modal Header */}

            <div className="laboratory-modal-header">

              <div
                className={`laboratory-modal-icon ${getStatusClass(
                  selectedTest.resultStatus
                )}`}
              >
                <TestTube2 size={23} />
              </div>

              <div>

                <span>
                  {selectedTest.id}
                </span>

                <h2>
                  {selectedTest.testName}
                </h2>

                <p>
                  {selectedTest.testCode}
                </p>

              </div>

            </div>

            {/* Result Banner */}

            <div
              className={`laboratory-result-banner ${getStatusClass(
                selectedTest.resultStatus
              )}`}
            >

              <div>

                <span>Result Status</span>

                <strong>
                  {selectedTest.resultStatus}
                </strong>

              </div>

              <div>

                <span>Priority</span>

                <strong>
                  {selectedTest.priority}
                </strong>

              </div>

            </div>

            {/* Patient Information */}

            <div className="laboratory-modal-section">

              <div className="laboratory-section-title">
                <UserRound size={15} />
                Patient Information
              </div>

              <div className="laboratory-detail-grid">

                <div>
                  <small>Patient</small>
                  <strong>
                    {selectedTest.patientName}
                  </strong>
                </div>

                <div>
                  <small>Patient ID</small>
                  <strong>
                    {selectedTest.patientId}
                  </strong>
                </div>

                <div>
                  <small>Age / Gender</small>
                  <strong>
                    {selectedTest.age} / {selectedTest.gender}
                  </strong>
                </div>

                <div>
                  <small>Doctor</small>
                  <strong>
                    {selectedTest.doctor}
                  </strong>
                </div>

              </div>

            </div>

            {/* Test Information */}

            <div className="laboratory-modal-section">

              <div className="laboratory-section-title">
                <FileText size={15} />
                Test Information
              </div>

              <div className="laboratory-detail-grid">

                <div>
                  <small>Department</small>
                  <strong>
                    {selectedTest.department}
                  </strong>
                </div>

                <div>
                  <small>Sample Type</small>
                  <strong>
                    {selectedTest.sampleType}
                  </strong>
                </div>

                <div>
                  <small>Sample Status</small>
                  <strong>
                    {selectedTest.sampleStatus}
                  </strong>
                </div>

                <div>
                  <small>Technician</small>
                  <strong>
                    {selectedTest.technician}
                  </strong>
                </div>

              </div>

            </div>

            {/* Result */}

            <div className="laboratory-modal-section">

              <div className="laboratory-section-title">
                <FlaskConical size={15} />
                Laboratory Result
              </div>

              <div className="laboratory-result-box">

                <div>
                  <span>Result</span>
                  <strong>
                    {selectedTest.result}
                  </strong>
                </div>

                <div>
                  <span>Reference Range</span>
                  <strong>
                    {selectedTest.referenceRange}
                  </strong>
                </div>

              </div>

              <div className="laboratory-remarks">

                <span>Remarks</span>

                <p>
                  {selectedTest.remarks}
                </p>

              </div>

            </div>

            {/* Date */}

            <div className="laboratory-modal-date">

              <CalendarDays size={15} />

              <span>
                Ordered: {selectedTest.orderedDate} at{" "}
                {selectedTest.orderedTime}
              </span>

              {selectedTest.resultTime !== "-" && (
                <>
                  <span>•</span>

                  <span>
                    Result: {selectedTest.resultTime}
                  </span>
                </>
              )}

            </div>

            <button
              type="button"
              className="laboratory-modal-done"
              onClick={() =>
                setSelectedTest(null)
              }
            >
              Close Details
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Laboratory;