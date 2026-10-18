
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UserRound,
  UsersRound,
  Stethoscope,
  Activity,
  Search,
  Star,
  MapPin,
  Clock3,
  Phone,
  Mail,
  X,
  ArrowRight,
  CheckCircle2,
  UserX,
  Plus,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/doctors";

const EMPTY_FORM = {
  doctorId: "",
  name: "",
  department: "",
  specialization: "",
  qualification: "",
  experience: "",
  phone: "",
  email: "",
  room: "",
  shift: "",
  status: "Available",
};

// Matches the exact storage keys used by Login.jsx.
function getAuthSession() {
  for (const storage of [localStorage, sessionStorage]) {
    const rawUser = storage.getItem("hospitalUser");
    const token = storage.getItem("hospitalToken");

    if (!rawUser || !token) {
      continue;
    }

    try {
      const user = JSON.parse(rawUser);

      if (user?.role === "admin") {
        return { token, user };
      }
    } catch {
      // Ignore malformed session data and check the other storage.
    }
  }

  return { token: null, user: null };
}

function formatDoctor(doctor) {
  const name = doctor.name || "Unknown Doctor";
  const rawStatus = doctor.status || "Offline";

  return {
    id: doctor.doctorId || "",
    name,
    department: doctor.department || "General",
    specialization: doctor.specialization || "General",
    qualification: doctor.qualification || "Medical Professional",
    experience: doctor.experience || 0,
    phone: doctor.phone || "Not available",
    email: doctor.email || "Not available",
    room: doctor.room || "Not assigned",
    shift: doctor.shift || "Not assigned",
    status:
      rawStatus === "Available" || rawStatus === "Busy"
        ? "On Duty"
        : "Off Duty",
    availability:
      rawStatus === "Available"
        ? "Available"
        : rawStatus === "Busy"
          ? "Busy"
          : "Unavailable",
    patients: doctor.patientsAssigned || 0,
    appointmentsToday: doctor.appointmentsToday || 0,
    initials: name
      .replace(/^Dr\.?\s*/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    rating: doctor.rating || 4.8,
    location: doctor.location || "Main Hospital",
  };
}

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [doctorForm, setDoctorForm] = useState({ ...EMPTY_FORM });
  const [createdLogin, setCreatedLogin] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch doctors.");
      }

      const data = await response.json();
      setDoctors((data.doctors || []).map(formatDoctor));
    } catch (err) {
      console.error("Doctor fetch error:", err);
      setError(
        "Unable to load doctors. Check that the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const departments = useMemo(
    () => ["All", ...new Set(doctors.map((doctor) => doctor.department))],
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search) ||
        doctor.id.toLowerCase().includes(search) ||
        doctor.specialization.toLowerCase().includes(search) ||
        doctor.department.toLowerCase().includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        doctor.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || doctor.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [doctors, searchTerm, departmentFilter, statusFilter]);

  const onDutyDoctors = doctors.filter(
    (doctor) => doctor.status === "On Duty"
  ).length;

  const availableDoctors = doctors.filter(
    (doctor) => doctor.availability === "Available"
  ).length;

  const totalPatients = doctors.reduce(
    (total, doctor) => total + doctor.patients,
    0
  );

  const openAddDoctor = () => {
    setDoctorForm({ ...EMPTY_FORM });
    setFormError("");
    setSuccessMessage("");
    setCreatedLogin(null);
    setShowAddDoctor(true);
  };

  const closeAddDoctor = () => {
    if (submitting) return;

    setShowAddDoctor(false);
    setFormError("");
    setCreatedLogin(null);
    setSuccessMessage("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setDoctorForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddDoctor = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const { token, user } = getAuthSession();

    if (!token || !user) {
      setFormError(
        "Admin session not found. Please log out and sign in again using your Admin account."
      );
      return;
    }

    if (user.role !== "admin") {
      setFormError("Only Admin users can register doctors.");
      return;
    }

    if (
      !doctorForm.doctorId.trim() ||
      !doctorForm.name.trim() ||
      !doctorForm.department.trim() ||
      !doctorForm.specialization.trim()
    ) {
      setFormError(
        "Doctor ID, name, department and specialization are required."
      );
      return;
    }

    const payload = {
      ...doctorForm,
      doctorId: doctorForm.doctorId.trim(),
      name: doctorForm.name.trim(),
      department: doctorForm.department.trim(),
      specialization: doctorForm.specialization.trim(),
      qualification: doctorForm.qualification.trim(),
      experience: Number(doctorForm.experience || 0),
      phone: doctorForm.phone.trim(),
      email: doctorForm.email.trim(),
      room: doctorForm.room.trim(),
      shift: doctorForm.shift.trim(),
    };

    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your Admin session is invalid or expired. Log out and sign in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "The backend denied Admin access. Confirm the account role in MongoDB and log in again."
          );
        }

        throw new Error(
          data.message || "Unable to register doctor."
        );
      }

      if (
        !data.login?.username ||
        !data.login?.temporaryPassword
      ) {
        // A request may have created records even if credentials
        // were not returned, so never automatically retry it.
        await fetchDoctors();

        throw new Error(
          "The server did not return login credentials. Check MongoDB before trying again."
        );
      }

      setCreatedLogin(data.login);
      setSuccessMessage(
        "Doctor profile and linked login account created successfully."
      );

      await fetchDoctors();
    } catch (err) {
      console.error("Doctor registration error:", err);
      setFormError(err.message || "Unable to register doctor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="doctors-page">
        <div className="doctor-empty-state">
          <Activity size={30} />
          <h3>Loading doctors...</h3>
          <p>Fetching medical staff from the hospital database.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-page">
        <div className="doctor-empty-state">
          <UserX size={30} />
          <h3>Unable to load doctors</h3>
          <p>{error}</p>
          <button type="button" onClick={fetchDoctors}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      {/* PAGE HEADER */}
      <div className="doctors-page-header">
        <div className="doctors-title-row">
          <div className="doctors-title-icon">
            <Stethoscope size={25} />
          </div>

          <div>
            <h1>Doctor Management</h1>
            <p>Manage doctors, availability and patient assignments</p>
          </div>
        </div>

        <div className="doctors-live-status">
          <span />
          LIVE STATUS
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="doctors-summary-grid">
        <div className="doctor-stat-card">
          <div className="doctor-stat-icon blue">
            <UsersRound size={22} />
          </div>
          <div>
            <span>Total Doctors</span>
            <strong>{doctors.length}</strong>
            <small>Registered medical staff</small>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Doctors On Duty</span>
            <strong>{onDutyDoctors}</strong>
            <small>Currently working</small>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon cyan">
            <Activity size={22} />
          </div>
          <div>
            <span>Available Doctors</span>
            <strong>{availableDoctors}</strong>
            <small>Ready for assignment</small>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon purple">
            <UserRound size={22} />
          </div>
          <div>
            <span>Patients Assigned</span>
            <strong>{totalPatients}</strong>
            <small>Across all doctors</small>
          </div>
        </div>
      </div>

      {/* DOCTOR DIRECTORY */}
      <section className="doctor-directory">
        <div
          className="doctor-directory-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2>Medical Staff Directory</h2>
            <p>View and manage hospital doctors</p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="doctor-directory-count">
              {filteredDoctors.length} Doctors
            </div>

            <button
              type="button"
              onClick={openAddDoctor}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 15px",
                border: "1px solid #0891b2",
                borderRadius: 8,
                background: "#06b6d4",
                color: "#071525",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={17} />
              Add Doctor
            </button>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="doctor-filter-bar">
          <div className="doctor-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search doctors, specialization, department..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department === "All" ? "All Departments" : department}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>

        {/* DOCTOR TABLE */}
        <div className="doctor-table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Patients</th>
                <th>Availability</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <div className="doctor-table-person">
                      <div className="doctor-avatar">
                        {doctor.initials}
                      </div>
                      <div>
                        <strong>{doctor.name}</strong>
                        <small>{doctor.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="doctor-specialization">
                      {doctor.specialization}
                    </span>
                  </td>

                  <td>
                    <span className="doctor-department">
                      {doctor.department}
                    </span>
                  </td>

                  <td>
                    <strong className="doctor-experience">
                      {doctor.experience} yrs
                    </strong>
                  </td>

                  <td>
                    <div className="doctor-patient-count">
                      <UserRound size={13} />
                      {doctor.patients}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`doctor-availability ${doctor.availability
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <i />
                      {doctor.availability}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`doctor-status ${doctor.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <i />
                      {doctor.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="doctor-view-button"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      View <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDoctors.length === 0 && (
            <div className="doctor-empty-state">
              <UserX size={30} />
              <h3>No doctors found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* ADD DOCTOR MODAL */}
      {showAddDoctor && (
        <div
          className="doctor-modal-overlay"
          onClick={closeAddDoctor}
        >
          <div
            className="doctor-modal"
            style={{
              width: "min(760px, 95vw)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="doctor-modal-close"
              onClick={closeAddDoctor}
              disabled={submitting}
              aria-label="Close registration form"
            >
              <X size={19} />
            </button>

            {!createdLogin ? (
              <>
                <h2>Register New Doctor</h2>
                <p>
                  Add a doctor profile and create its linked login account.
                </p>

                <form onSubmit={handleAddDoctor}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                      marginTop: 20,
                    }}
                  >
                    {[
                      ["doctorId", "Doctor ID", "DOC-1011", true],
                      ["name", "Full Name", "Dr. Test Doctor", true],
                      ["department", "Department", "Cardiology", true],
                      [
                        "specialization",
                        "Specialization",
                        "Cardiology",
                        true,
                      ],
                      [
                        "qualification",
                        "Qualification",
                        "MBBS, MD",
                        false,
                      ],
                      [
                        "experience",
                        "Experience (years)",
                        "5",
                        false,
                      ],
                      ["phone", "Phone", "Phone number", false],
                      [
                        "email",
                        "Email",
                        "doctor@example.com",
                        false,
                      ],
                      ["room", "Room", "C-101", false],
                      ["shift", "Shift", "Morning", false],
                    ].map(([key, label, placeholder, required]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 7,
                        }}
                      >
                        <span>{label}</span>
                        <input
                          name={key}
                          type={key === "experience" ? "number" : "text"}
                          min={key === "experience" ? 0 : undefined}
                          step={key === "experience" ? 1 : undefined}
                          required={required}
                          placeholder={placeholder}
                          value={doctorForm[key]}
                          onChange={handleFormChange}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px 12px",
                            background: "#101c2e",
                            color: "#e5edf8",
                            border: "1px solid #2b3b51",
                            borderRadius: 7,
                          }}
                        />
                      </label>
                    ))}

                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                      }}
                    >
                      <span>Status</span>
                      <select
                        name="status"
                        value={doctorForm.status}
                        onChange={handleFormChange}
                        style={{
                          padding: "11px 12px",
                          background: "#101c2e",
                          color: "#e5edf8",
                          border: "1px solid #2b3b51",
                          borderRadius: 7,
                        }}
                      >
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </label>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      style={{ color: "#fb7185", marginTop: 16 }}
                    >
                      {formError}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 24,
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeAddDoctor}
                      disabled={submitting}
                    >
                      Cancel
                    </button>

                    <button type="submit" disabled={submitting}>
                      {submitting ? "Registering..." : "Register Doctor"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <h2 style={{ color: "#34d399" }}>
                  Doctor Registered Successfully!
                </h2>

                <p>{successMessage}</p>

                <div
                  style={{
                    marginTop: 20,
                    padding: 18,
                    background: "#101c2e",
                    border: "1px solid #2b3b51",
                    borderRadius: 9,
                    overflowWrap: "anywhere",
                  }}
                >
                  <p>
                    <strong>Username:</strong> {createdLogin.username}
                  </p>

                  <p>
                    <strong>Temporary password:</strong>{" "}
                    {createdLogin.temporaryPassword}
                  </p>

                  <p style={{ color: "#fbbf24", fontSize: 13 }}>
                    Save these credentials securely. This password is
                    returned only by the creation response.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(
                          `Username: ${createdLogin.username}\nTemporary password: ${createdLogin.temporaryPassword}`
                        );
                      }
                    }}
                  >
                    Copy credentials
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddDoctor(false);
                    setCreatedLogin(null);
                    setSuccessMessage("");
                  }}
                  style={{ marginTop: 20 }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOCTOR DETAIL MODAL */}
      {selectedDoctor && (
        <div
          className="doctor-modal-overlay"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="doctor-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="doctor-modal-close"
              onClick={() => setSelectedDoctor(null)}
              aria-label="Close doctor details"
            >
              <X size={19} />
            </button>

            <div className="doctor-modal-profile">
              <div className="doctor-modal-avatar">
                {selectedDoctor.initials}
              </div>

              <div>
                <span className="doctor-modal-id">
                  {selectedDoctor.id}
                </span>
                <h2>{selectedDoctor.name}</h2>
                <p>{selectedDoctor.specialization}</p>
                <div className="doctor-modal-rating">
                  <Star size={14} fill="currentColor" />
                  {selectedDoctor.rating}
                </div>
              </div>
            </div>

            <div className="doctor-modal-details">
              <div>
                <MapPin size={16} />
                <span>
                  <small>Location</small>
                  <strong>{selectedDoctor.location}</strong>
                </span>
              </div>

              <div>
                <Clock3 size={16} />
                <span>
                  <small>Shift</small>
                  <strong>{selectedDoctor.shift}</strong>
                </span>
              </div>

              <div>
                <Phone size={16} />
                <span>
                  <small>Phone</small>
                  <strong>{selectedDoctor.phone}</strong>
                </span>
              </div>

              <div>
                <Mail size={16} />
                <span>
                  <small>Email</small>
                  <strong>{selectedDoctor.email}</strong>
                </span>
              </div>
            </div>

            <div className="doctor-modal-performance">
              <div>
                <span>Department</span>
                <strong>{selectedDoctor.department}</strong>
              </div>

              <div>
                <span>Experience</span>
                <strong>{selectedDoctor.experience} Years</strong>
              </div>

              <div>
                <span>Patients</span>
                <strong>{selectedDoctor.patients}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong
                  className={
                    selectedDoctor.status === "On Duty"
                      ? "modal-status-on"
                      : "modal-status-off"
                  }
                >
                  {selectedDoctor.status}
                </strong>
              </div>
            </div>

            <div className="doctor-modal-actions">
              <button type="button">
                <Phone size={16} />
                Contact Doctor
              </button>

              <button type="button">
                <UserRound size={16} />
                View Patients
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
