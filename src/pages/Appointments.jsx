import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  UsersRound,
  CheckCircle2,
  Search,
  UserRound,
  Stethoscope,
  MapPin,
  X,
  ArrowRight,
  Phone,
  CalendarClock,
  Plus,
} from "lucide-react";

function Appointments() {
  // =========================================================
  // CURRENT LOGGED-IN PATIENT
  // Temporary for prototype
  // Later this will come from patient login/session
  // =========================================================

  const currentPatient = {
    patientId: "P10234",
    name: "Ramesh Kumar",
    age: 56,
  };

  // =========================================================
  // STATE
  // =========================================================

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  // Booking modal
  const [showBookingModal, setShowBookingModal] =
    useState(false);

  // Booking form
  const [bookingData, setBookingData] = useState({
    patientId: "P10234",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "Consultation",
    reason: "",
  });

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  const [bookingSuccess, setBookingSuccess] =
    useState("");

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        appointmentsResponse,
        patientsResponse,
        doctorsResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:5000/api/appointments"
        ),
        fetch(
          "http://localhost:5000/api/patients"
        ),
        fetch(
          "http://localhost:5000/api/doctors"
        ),
      ]);

      if (
        !appointmentsResponse.ok ||
        !patientsResponse.ok ||
        !doctorsResponse.ok
      ) {
        throw new Error(
          "Failed to load appointment data"
        );
      }

      const appointmentsData =
        await appointmentsResponse.json();

      const patientsData =
        await patientsResponse.json();

      const doctorsData =
        await doctorsResponse.json();

      setAppointments(
        appointmentsData.appointments || []
      );

      setPatients(
        patientsData.patients || []
      );

      setDoctors(
        doctorsData.doctors || []
      );
    } catch (err) {
      console.error(
        "Appointments API error:",
        err
      );

      setError(
        "Unable to load appointment data from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // =========================================================
  // FORMAT APPOINTMENTS FOR UI
  // =========================================================

  const formattedAppointments = useMemo(() => {
    return appointments.map((appointment) => {
      const patient = patients.find(
        (item) =>
          item.patientId ===
          appointment.patientId
      );

      const doctor = doctors.find(
        (item) =>
          item.doctorId ===
          appointment.doctorId
      );

      return {
        id: appointment.appointmentId,

        patientName:
          patient?.name ||
          appointment.patientId ||
          "Unknown Patient",

        patientId:
          appointment.patientId,

        patientAge:
          patient?.age || "-",

        doctor:
          doctor?.name ||
          appointment.doctorId ||
          "Unknown Doctor",

        date: formatDate(
          appointment.appointmentDate
        ),

        rawDate:
          appointment.appointmentDate,

        time:
          appointment.appointmentTime,

        type:
          appointment.appointmentType,

        department:
          appointment.department ||
          doctor?.department ||
          "General",

        status:
          appointment.status,

        room:
          appointment.room || "-",

        reason:
          appointment.reason ||
          "No reason provided",

        notes:
          appointment.notes || "",
      };
    });
  }, [
    appointments,
    patients,
    doctors,
  ]);

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(
        formattedAppointments.map(
          (appointment) =>
            appointment.department
        )
      ),
    ];
  }, [formattedAppointments]);

  // =========================================================
  // FILTER APPOINTMENTS
  // =========================================================

  const filteredAppointments = useMemo(() => {
    return formattedAppointments.filter(
      (appointment) => {
        const search =
          searchTerm.toLowerCase();

        const matchesSearch =
          appointment.patientName
            .toLowerCase()
            .includes(search) ||
          appointment.patientId
            .toLowerCase()
            .includes(search) ||
          appointment.doctor
            .toLowerCase()
            .includes(search) ||
          appointment.id
            .toLowerCase()
            .includes(search);

        const matchesDepartment =
          departmentFilter === "All" ||
          appointment.department ===
            departmentFilter;

        const matchesStatus =
          statusFilter === "All" ||
          appointment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus
        );
      }
    );
  }, [
    formattedAppointments,
    searchTerm,
    departmentFilter,
    statusFilter,
  ]);

  // =========================================================
  // SUMMARY COUNTS
  // =========================================================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-` +
    `${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const todayAppointments =
    formattedAppointments.filter(
      (appointment) => {
        if (!appointment.rawDate) {
          return false;
        }

        const date = new Date(
          appointment.rawDate
        );

        const dateString =
          `${date.getFullYear()}-` +
          `${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-` +
          `${String(
            date.getDate()
          ).padStart(2, "0")}`;

        return (
          dateString === todayString
        );
      }
    ).length;

  const confirmedAppointments =
    formattedAppointments.filter(
      (appointment) =>
        appointment.status ===
        "Confirmed"
    ).length;

  const waitingAppointments =
    formattedAppointments.filter(
      (appointment) =>
        appointment.status ===
        "Waiting"
    ).length;

  const completedAppointments =
    formattedAppointments.filter(
      (appointment) =>
        appointment.status ===
        "Completed"
    ).length;

  // =========================================================
  // SELECTED DOCTOR
  // =========================================================

  const selectedDoctor = doctors.find(
    (doctor) =>
      doctor.doctorId ===
      bookingData.doctorId
  );

  // =========================================================
  // BOOKING FORM CHANGE
  // =========================================================

  const handleBookingChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setBookingData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setBookingError("");
    setBookingSuccess("");
  };

  // =========================================================
  // GENERATE APPOINTMENT ID
  // =========================================================

  const generateAppointmentId = () => {
    const numbers =
      appointments
        .map((appointment) => {
          const match =
            appointment.appointmentId?.match(
              /APT-(\d+)/
            );

          return match
            ? Number(match[1])
            : 0;
        })
        .filter(Boolean);

    const highestNumber =
      numbers.length > 0
        ? Math.max(...numbers)
        : 10000;

    return `APT-${
      highestNumber + 1
    }`;
  };

  // =========================================================
  // BOOK APPOINTMENT
  // =========================================================

  const handleBookAppointment = async (
    event
  ) => {
    event.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    if (
      !bookingData.doctorId ||
      !bookingData.appointmentDate ||
      !bookingData.appointmentTime ||
      !bookingData.appointmentType
    ) {
      setBookingError(
        "Please fill all required fields."
      );

      return;
    }

    // Re-check availability before submitting; backend validation remains authoritative.
    const chosenDoctor = doctors.find(
      (doctor) => doctor.doctorId === bookingData.doctorId
    );

    if (!chosenDoctor) {
      setBookingError("Please select a valid doctor.");
      return;
    }

    if (["On Leave", "Offline"].includes(String(chosenDoctor.status || "").trim())) {
      setBookingError("This doctor is currently unavailable. Please select another doctor.");
      return;
    }

    try {
      setBookingLoading(true);

      const appointmentId =
        generateAppointmentId();

      const appointmentPayload = {
        appointmentId,

        // Automatically use logged-in patient
        patientId:
          currentPatient.patientId,

        doctorId:
          bookingData.doctorId,

        department:
          selectedDoctor?.department ||
          "",

        appointmentDate:
          bookingData.appointmentDate,

        appointmentTime:
          bookingData.appointmentTime,

        appointmentType:
          bookingData.appointmentType,

        room:
          selectedDoctor?.room ||
          "",

        reason:
          bookingData.reason ||
          "General consultation",

        status: "Confirmed",

        notes: "",
      };

      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            appointmentPayload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to book appointment."
        );
      }

      setBookingSuccess(
        `Appointment ${appointmentId} booked successfully.`
      );

      // Refresh from MongoDB
      await fetchData();

      // Reset booking form
      setBookingData({
        patientId:
          currentPatient.patientId,
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentType:
          "Consultation",
        reason: "",
      });

      // Close modal
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess("");
      }, 1200);
    } catch (err) {
      console.error(
        "Book appointment error:",
        err
      );

      setBookingError(
        err.message
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================================
  // OPEN BOOKING MODAL
  // =========================================================

  const openBookingModal = () => {
    setBookingError("");
    setBookingSuccess("");

    setBookingData({
      patientId:
        currentPatient.patientId,
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentType:
        "Consultation",
      reason: "",
    });

    setShowBookingModal(true);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="appointments-page">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="appointments-page-header">

        <div className="appointments-title-row">

          <div className="appointments-title-icon">
            <CalendarDays size={25} />
          </div>

          <div>
            <h1>
              Appointment Management
            </h1>

            <p>
              Manage patient appointments,
              schedules and consultations
            </p>
          </div>

        </div>

        <div className="appointments-live-status">
          <span></span>
          LIVE SCHEDULE
        </div>

      </div>


      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (
        <div className="appointment-empty-state">

          <CalendarDays size={30} />

          <h3>
            Loading appointments...
          </h3>

          <p>
            Fetching appointment data
            from the hospital database.
          </p>

        </div>
      )}


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {!loading && error && (
        <div className="appointment-empty-state">

          <CalendarDays size={30} />

          <h3>
            Unable to load appointments
          </h3>

          <p>{error}</p>

        </div>
      )}


      {!loading && !error && (
        <>

          {/* ================================================= */}
          {/* SUMMARY CARDS */}
          {/* ================================================= */}

          <div className="appointments-summary-grid">

            <div className="appointment-stat-card">

              <div className="appointment-stat-icon blue">
                <CalendarDays size={22} />
              </div>

              <div>
                <span>
                  Today's Appointments
                </span>

                <strong>
                  {todayAppointments}
                </strong>

                <small>
                  Scheduled for today
                </small>
              </div>

            </div>


            <div className="appointment-stat-card">

              <div className="appointment-stat-icon green">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <span>
                  Confirmed
                </span>

                <strong>
                  {confirmedAppointments}
                </strong>

                <small>
                  Confirmed appointments
                </small>
              </div>

            </div>


            <div className="appointment-stat-card">

              <div className="appointment-stat-icon orange">
                <Clock3 size={22} />
              </div>

              <div>
                <span>
                  Waiting
                </span>

                <strong>
                  {waitingAppointments}
                </strong>

                <small>
                  Patients waiting
                </small>
              </div>

            </div>


            <div className="appointment-stat-card">

              <div className="appointment-stat-icon purple">
                <UsersRound size={22} />
              </div>

              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {completedAppointments}
                </strong>

                <small>
                  Completed consultations
                </small>
              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* APPOINTMENT DIRECTORY */}
          {/* ================================================= */}

          <section className="appointment-directory">

            <div className="appointment-directory-header">

              <div>

                <h2>
                  Appointment Schedule
                </h2>

                <p>
                  View and manage patient appointments
                </p>

              </div>


              <div className="appointment-header-actions">

                <button
                  type="button"
                  className="book-appointment-button"
                  onClick={
                    openBookingModal
                  }
                >
                  <Plus size={16} />
                  Book Appointment
                </button>

                <div className="appointment-directory-count">
                  {
                    filteredAppointments.length
                  }{" "}
                  Appointments
                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* SEARCH + FILTERS */}
            {/* ================================================= */}

            <div className="appointment-filter-bar">

              <div className="appointment-search">

                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search patient, doctor or appointment ID..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>


              <select
                value={
                  departmentFilter
                }
                onChange={(event) =>
                  setDepartmentFilter(
                    event.target.value
                  )
                }
              >

                {departments.map(
                  (department) => (

                    <option
                      key={department}
                      value={department}
                    >
                      {department ===
                      "All"
                        ? "All Departments"
                        : department}
                    </option>

                  )
                )}

              </select>


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Waiting">
                  Waiting
                </option>

                <option value="Urgent">
                  Urgent
                </option>

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>


            {/* ================================================= */}
            {/* APPOINTMENT TABLE */}
            {/* ================================================= */}

            <div className="appointment-table-wrapper">

              <table className="appointment-table">

                <thead>

                  <tr>

                    <th>
                      Appointment
                    </th>

                    <th>
                      Patient
                    </th>

                    <th>
                      Doctor
                    </th>

                    <th>
                      Date & Time
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Status
                    </th>

                    <th></th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAppointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.id
                        }
                      >

                        <td>

                          <span className="appointment-id">
                            {
                              appointment.id
                            }
                          </span>

                        </td>


                        <td>

                          <div className="appointment-patient">

                            <div className="appointment-avatar">
                              <UserRound
                                size={16}
                              />
                            </div>

                            <div>

                              <strong>
                                {
                                  appointment.patientName
                                }
                              </strong>

                              <small>
                                {
                                  appointment.patientId
                                }{" "}
                                ·{" "}
                                {
                                  appointment.patientAge
                                }{" "}
                                yrs
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="appointment-doctor">

                            <Stethoscope
                              size={14}
                            />

                            <span>
                              {
                                appointment.doctor
                              }
                            </span>

                          </div>

                        </td>


                        <td>

                          <div className="appointment-time">

                            <strong>
                              {
                                appointment.time
                              }
                            </strong>

                            <small>
                              {
                                appointment.date
                              }
                            </small>

                          </div>

                        </td>


                        <td>

                          <span className="appointment-type">
                            {
                              appointment.type
                            }
                          </span>

                        </td>


                        <td>

                          <span className="appointment-department">
                            {
                              appointment.department
                            }
                          </span>

                        </td>


                        <td>

                          <span
                            className={`appointment-status ${appointment.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >

                            <i></i>

                            {
                              appointment.status
                            }

                          </span>

                        </td>


                        <td>

                          <button
                            type="button"
                            className="appointment-view-button"
                            onClick={() =>
                              setSelectedAppointment(
                                appointment
                              )
                            }
                          >

                            View

                            <ArrowRight
                              size={14}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>


              {filteredAppointments.length ===
                0 && (

                <div className="appointment-empty-state">

                  <CalendarDays
                    size={30}
                  />

                  <h3>
                    No appointments found
                  </h3>

                  <p>
                    Try changing your
                    search or filters.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* ================================================= */}
          {/* BOOK APPOINTMENT MODAL */}
          {/* ================================================= */}

          {showBookingModal && (

            <div
              className="appointment-modal-overlay"
              onClick={() =>
                setShowBookingModal(
                  false
                )
              }
            >

              <div
                className="appointment-modal booking-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                {/* CLOSE */}

                <button
                  type="button"
                  className="appointment-modal-close"
                  onClick={() =>
                    setShowBookingModal(
                      false
                    )
                  }
                >
                  <X size={19} />
                </button>


                {/* HEADER */}

                <div className="appointment-modal-header">

                  <div className="appointment-modal-icon">
                    <CalendarDays
                      size={25}
                    />
                  </div>

                  <div>

                    <span className="appointment-modal-id">
                      NEW APPOINTMENT
                    </span>

                    <h2>
                      Book Appointment
                    </h2>

                    <p>
                      Schedule a consultation
                      with a doctor
                    </p>

                  </div>

                </div>


                <form
                  onSubmit={
                    handleBookAppointment
                  }
                >

                  {/* ======================================= */}
                  {/* CURRENT PATIENT */}
                  {/* ======================================= */}

                  <div className="booking-form-group">

                    <label>
                      Patient
                    </label>

                    <div className="current-patient-field">

                      <div>

                        <strong>
                          {
                            currentPatient.name
                          }
                        </strong>

                        <span>
                          {
                            currentPatient.patientId
                          }{" "}
                          ·{" "}
                          {
                            currentPatient.age
                          }{" "}
                          years
                        </span>

                      </div>

                      <span className="patient-locked">
                        LOGGED IN
                      </span>

                    </div>

                  </div>


                  {/* ======================================= */}
                  {/* DOCTOR */}
                  {/* ======================================= */}

                  <div className="booking-form-group">

                    <label>
                      Doctor
                      <span>*</span>
                    </label>

                    <select
                      name="doctorId"
                      value={
                        bookingData.doctorId
                      }
                      onChange={
                        handleBookingChange
                      }
                      required
                    >

                      <option value="">
                        Select Doctor
                      </option>

                      {doctors.map((doctor) => {
                        const unavailable = ["On Leave", "Offline"].includes(
                          String(doctor.status || "").trim()
                        );

                        return (
                          <option
                            key={doctor.doctorId}
                            value={doctor.doctorId}
                            disabled={unavailable}
                          >
                            {doctor.name} — {doctor.department || "General"} — {unavailable ? "Unavailable" : doctor.status || "Available"}
                          </option>
                        );
                      })}

                    </select>

                  </div>


                  {/* ======================================= */}
                  {/* DEPARTMENT + ROOM */}
                  {/* ======================================= */}

                  <div className="booking-form-row">

                    <div className="booking-form-group">

                      <label>
                        Department
                      </label>

                      <input
                        type="text"
                        value={
                          selectedDoctor?.department ||
                          ""
                        }
                        placeholder="Auto selected"
                        readOnly
                      />

                    </div>


                    <div className="booking-form-group">

                      <label>
                        Room
                      </label>

                      <input
                        type="text"
                        value={
                          selectedDoctor?.room ||
                          ""
                        }
                        placeholder="Auto selected"
                        readOnly
                      />

                    </div>

                  </div>


                  {/* ======================================= */}
                  {/* DATE + TIME */}
                  {/* ======================================= */}

                  <div className="booking-form-row">

                    <div className="booking-form-group">

                      <label>
                        Date
                        <span>*</span>
                      </label>

                      <input
                        type="date"
                        name="appointmentDate"
                        value={
                          bookingData.appointmentDate
                        }
                        onChange={
                          handleBookingChange
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split(
                              "T"
                            )[0]
                        }
                        required
                      />

                    </div>


                    <div className="booking-form-group">

                      <label>
                        Time
                        <span>*</span>
                      </label>

                      <input
                        type="time"
                        name="appointmentTime"
                        value={
                          bookingData.appointmentTime
                        }
                        onChange={
                          handleBookingChange
                        }
                        required
                      />

                    </div>

                  </div>


                  {/* ======================================= */}
                  {/* APPOINTMENT TYPE */}
                  {/* ======================================= */}

                  <div className="booking-form-group">

                    <label>
                      Appointment Type
                      <span>*</span>
                    </label>

                    <select
                      name="appointmentType"
                      value={
                        bookingData.appointmentType
                      }
                      onChange={
                        handleBookingChange
                      }
                      required
                    >

                      <option value="Consultation">
                        Consultation
                      </option>

                      <option value="Follow-up">
                        Follow-up
                      </option>

                      <option value="Emergency">
                        Emergency
                      </option>

                      <option value="Pre-Procedure">
                        Pre-Procedure
                      </option>

                      <option value="Review">
                        Review
                      </option>

                    </select>

                  </div>


                  {/* ======================================= */}
                  {/* REASON */}
                  {/* ======================================= */}

                  <div className="booking-form-group">

                    <label>
                      Appointment Reason
                    </label>

                    <textarea
                      name="reason"
                      value={
                        bookingData.reason
                      }
                      onChange={
                        handleBookingChange
                      }
                      placeholder="Enter reason for appointment..."
                      rows="3"
                    />

                  </div>


                  {/* ======================================= */}
                  {/* ERROR */}
                  {/* ======================================= */}

                  {bookingError && (

                    <div className="booking-message error">
                      {
                        bookingError
                      }
                    </div>

                  )}


                  {/* ======================================= */}
                  {/* SUCCESS */}
                  {/* ======================================= */}

                  {bookingSuccess && (

                    <div className="booking-message success">
                      {
                        bookingSuccess
                      }
                    </div>

                  )}


                  {/* ======================================= */}
                  {/* ACTIONS */}
                  {/* ======================================= */}

                  <div className="booking-form-actions">

                    <button
                      type="button"
                      className="booking-cancel-button"
                      onClick={() =>
                        setShowBookingModal(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="book-appointment-submit"
                      disabled={
                        bookingLoading
                      }
                    >

                      {bookingLoading
                        ? "Booking..."
                        : "Book Appointment"}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* APPOINTMENT DETAIL MODAL */}
          {/* ================================================= */}

          {selectedAppointment && (

            <div
              className="appointment-modal-overlay"
              onClick={() =>
                setSelectedAppointment(
                  null
                )
              }
            >

              <div
                className="appointment-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <button
                  type="button"
                  className="appointment-modal-close"
                  onClick={() =>
                    setSelectedAppointment(
                      null
                    )
                  }
                >
                  <X size={19} />
                </button>


                <div className="appointment-modal-header">

                  <div className="appointment-modal-icon">
                    <CalendarDays
                      size={25}
                    />
                  </div>

                  <div>

                    <span className="appointment-modal-id">
                      {
                        selectedAppointment.id
                      }
                    </span>

                    <h2>
                      Appointment Details
                    </h2>

                    <p>
                      {
                        selectedAppointment.type
                      }
                    </p>

                  </div>

                </div>


                {/* PATIENT */}

                <div className="appointment-modal-section">

                  <h3>
                    Patient Information
                  </h3>

                  <div className="appointment-detail-row">

                    <div className="appointment-detail-avatar">
                      <UserRound
                        size={20}
                      />
                    </div>

                    <div>

                      <strong>
                        {
                          selectedAppointment.patientName
                        }
                      </strong>

                      <span>
                        {
                          selectedAppointment.patientId
                        }{" "}
                        ·{" "}
                        {
                          selectedAppointment.patientAge
                        }{" "}
                        years
                      </span>

                    </div>

                  </div>

                </div>


                {/* APPOINTMENT DETAILS */}

                <div className="appointment-modal-grid">

                  <div>

                    <CalendarClock
                      size={16}
                    />

                    <span>

                      <small>
                        Date
                      </small>

                      <strong>
                        {
                          selectedAppointment.date
                        }
                      </strong>

                    </span>

                  </div>


                  <div>

                    <Clock3
                      size={16}
                    />

                    <span>

                      <small>
                        Time
                      </small>

                      <strong>
                        {
                          selectedAppointment.time
                        }
                      </strong>

                    </span>

                  </div>


                  <div>

                    <Stethoscope
                      size={16}
                    />

                    <span>

                      <small>
                        Doctor
                      </small>

                      <strong>
                        {
                          selectedAppointment.doctor
                        }
                      </strong>

                    </span>

                  </div>


                  <div>

                    <MapPin
                      size={16}
                    />

                    <span>

                      <small>
                        Room
                      </small>

                      <strong>
                        {
                          selectedAppointment.room
                        }
                      </strong>

                    </span>

                  </div>

                </div>


                {/* REASON */}

                <div className="appointment-reason">

                  <span>
                    Appointment Reason
                  </span>

                  <p>
                    {
                      selectedAppointment.reason
                    }
                  </p>

                </div>


                {/* STATUS */}

                <div className="appointment-modal-status">

                  <span>
                    Current Status
                  </span>

                  <strong
                    className={
                      selectedAppointment.status
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )
                    }
                  >

                    <i></i>

                    {
                      selectedAppointment.status
                    }

                  </strong>

                </div>


                {/* ACTIONS */}

                <div className="appointment-modal-actions">

                  <button type="button">

                    <CalendarClock
                      size={16}
                    />

                    Reschedule

                  </button>


                  <button type="button">

                    <Phone
                      size={16}
                    />

                    Contact Patient

                  </button>

                </div>

              </div>

            </div>

          )}

        </>
      )}

    </div>
  );
}

export default Appointments;