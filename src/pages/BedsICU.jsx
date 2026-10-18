import { useMemo, useState } from "react";

import {
  BedDouble,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Search,
  UserRound,
  Stethoscope,
  MapPin,
  X,
  ArrowRight,
  CalendarDays,
  Building2,
} from "lucide-react";

import beds from "../data/beds";

function BedsICU() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBed, setSelectedBed] = useState(null);

  /* =========================
     BED TYPES
  ========================= */

  const bedTypes = [
    "All",
    ...new Set(beds.map((bed) => bed.type)),
  ];

  /* =========================
     FILTERED BEDS
  ========================= */

  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        bed.bedNumber.toLowerCase().includes(search) ||
        bed.ward.toLowerCase().includes(search) ||
        bed.room.toLowerCase().includes(search) ||
        (bed.patientName &&
          bed.patientName.toLowerCase().includes(search)) ||
        (bed.patientId &&
          bed.patientId.toLowerCase().includes(search));

      const matchesType =
        typeFilter === "All" ||
        bed.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        bed.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [searchTerm, typeFilter, statusFilter]);

  /* =========================
     BED SUMMARY
  ========================= */

  const totalBeds = beds.length;

  const availableBeds = beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const occupiedBeds = beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const reservedBeds = beds.filter(
    (bed) => bed.status === "Reserved"
  ).length;

  const occupancyPercentage = Math.round(
    (occupiedBeds / totalBeds) * 100
  );

  /* =========================
     ICU SUMMARY
  ========================= */

  const icuBeds = beds.filter(
    (bed) => bed.type === "ICU"
  );

  const icuOccupied = icuBeds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const icuAvailable = icuBeds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const icuReserved = icuBeds.filter(
    (bed) => bed.status === "Reserved"
  ).length;

  const icuOccupancyPercentage =
    icuBeds.length > 0
      ? Math.round(
          (icuOccupied / icuBeds.length) * 100
        )
      : 0;

  return (
    <div className="beds-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="beds-page-header">

        <div className="beds-title-row">

          <div className="beds-title-icon">
            <BedDouble size={25} />
          </div>

          <div>
            <h1>Beds & ICU Management</h1>

            <p>
              Monitor bed availability, occupancy and ICU capacity
            </p>
          </div>

        </div>

        <div className="beds-live-status">
          <span></span>
          LIVE CAPACITY
        </div>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="beds-summary-grid">

        {/* TOTAL */}

        <div className="bed-stat-card">

          <div className="bed-stat-icon blue">
            <BedDouble size={22} />
          </div>

          <div>
            <span>Total Beds</span>

            <strong>{totalBeds}</strong>

            <small>
              Hospital capacity
            </small>
          </div>

        </div>

        {/* AVAILABLE */}

        <div className="bed-stat-card">

          <div className="bed-stat-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Available Beds</span>

            <strong>{availableBeds}</strong>

            <small>
              Ready for admission
            </small>
          </div>

        </div>

        {/* OCCUPIED */}

        <div className="bed-stat-card">

          <div className="bed-stat-icon orange">
            <Activity size={22} />
          </div>

          <div>
            <span>Occupied Beds</span>

            <strong>{occupiedBeds}</strong>

            <small>
              {occupancyPercentage}% occupancy
            </small>
          </div>

        </div>

        {/* RESERVED */}

        <div className="bed-stat-card">

          <div className="bed-stat-icon purple">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Reserved Beds</span>

            <strong>{reservedBeds}</strong>

            <small>
              Upcoming admissions
            </small>
          </div>

        </div>

      </div>

      {/* =========================
          CAPACITY OVERVIEW
      ========================= */}

      <div className="beds-overview-grid">

        {/* HOSPITAL CAPACITY */}

        <section className="beds-overview-card">

          <div className="beds-overview-header">

            <div>

              <h2>
                Hospital Bed Capacity
              </h2>

              <p>
                Current occupancy overview
              </p>

            </div>

            <strong>
              {occupancyPercentage}%
            </strong>

          </div>

          <div className="bed-capacity-bar">

            <span
              style={{
                width: `${occupancyPercentage}%`,
              }}
            ></span>

          </div>

          <div className="bed-capacity-legend">

            <div>
              <span className="legend-dot occupied"></span>

              Occupied

              <strong>
                {occupiedBeds}
              </strong>
            </div>

            <div>
              <span className="legend-dot available"></span>

              Available

              <strong>
                {availableBeds}
              </strong>
            </div>

            <div>
              <span className="legend-dot reserved"></span>

              Reserved

              <strong>
                {reservedBeds}
              </strong>
            </div>

          </div>

        </section>

        {/* ICU CAPACITY */}

        <section className="beds-overview-card icu-overview-card">

          <div className="beds-overview-header">

            <div>

              <h2>
                ICU Capacity
              </h2>

              <p>
                Critical care bed availability
              </p>

            </div>

            <Activity size={20} />

          </div>

          <div className="icu-capacity">

            <div
              className="icu-ring"
              style={{
                background: `
                  radial-gradient(
                    circle,
                    #0d1727 55%,
                    transparent 56%
                  ),
                  conic-gradient(
                    #ef4444 0 ${icuOccupancyPercentage}%,
                    #243246 ${icuOccupancyPercentage}% 100%
                  )
                `,
              }}
            >

              <div>

                <strong>
                  {icuBeds.length}
                </strong>

                <span>
                  Total ICU
                </span>

              </div>

            </div>

            <div className="icu-info">

              <div>

                <span>
                  Occupied
                </span>

                <strong>
                  {icuOccupied}
                </strong>

              </div>

              <div>

                <span>
                  Available
                </span>

                <strong>
                  {icuAvailable}
                </strong>

              </div>

              <div>

                <span>
                  Reserved
                </span>

                <strong>
                  {icuReserved}
                </strong>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          BED DIRECTORY
      ========================= */}

      <section className="bed-directory">

        <div className="bed-directory-header">

          <div>

            <h2>
              Bed Directory
            </h2>

            <p>
              View current bed allocation and patient assignments
            </p>

          </div>

          <div className="bed-directory-count">
            {filteredBeds.length} Beds
          </div>

        </div>

        {/* FILTERS */}

        <div className="bed-filter-bar">

          <div className="bed-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search bed, ward, room or patient..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >

            {bedTypes.map((type) => (

              <option
                key={type}
                value={type}
              >
                {type === "All"
                  ? "All Bed Types"
                  : type}
              </option>

            ))}

          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Occupied">
              Occupied
            </option>

            <option value="Reserved">
              Reserved
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div className="bed-table-wrapper">

          <table className="bed-table">

            <thead>

              <tr>

                <th>
                  Bed
                </th>

                <th>
                  Ward / Room
                </th>

                <th>
                  Type
                </th>

                <th>
                  Patient
                </th>

                <th>
                  Doctor
                </th>

                <th>
                  Condition
                </th>

                <th>
                  Status
                </th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {filteredBeds.map((bed) => (

                <tr key={bed.id}>

                  {/* BED */}

                  <td>

                    <div className="bed-number">

                      <div className="bed-table-icon">
                        <BedDouble size={16} />
                      </div>

                      <div>

                        <strong>
                          {bed.bedNumber}
                        </strong>

                        <small>
                          {bed.id}
                        </small>

                      </div>

                    </div>

                  </td>

                  {/* LOCATION */}

                  <td>

                    <div className="bed-location">

                      <strong>
                        {bed.ward}
                      </strong>

                      <small>

                        <MapPin size={11} />

                        {bed.room}
                        {" · "}
                        {bed.floor}

                      </small>

                    </div>

                  </td>

                  {/* TYPE */}

                  <td>

                    <span
                      className={`bed-type ${bed.type
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {bed.type}
                    </span>

                  </td>

                  {/* PATIENT */}

                  <td>

                    {bed.patientName ? (

                      <div className="bed-patient">

                        <div className="bed-patient-avatar">
                          <UserRound size={14} />
                        </div>

                        <div>

                          <strong>
                            {bed.patientName}
                          </strong>

                          <small>
                            {bed.patientId}
                            {" · "}
                            {bed.patientAge} yrs
                          </small>

                        </div>

                      </div>

                    ) : (

                      <span className="bed-unassigned">
                        No patient assigned
                      </span>

                    )}

                  </td>

                  {/* DOCTOR */}

                  <td>

                    {bed.doctor ? (

                      <div className="bed-doctor">

                        <Stethoscope size={14} />

                        {bed.doctor}

                      </div>

                    ) : (

                      <span className="bed-unassigned">
                        —
                      </span>

                    )}

                  </td>

                  {/* CONDITION */}

                  <td>

                    <span
                      className={`bed-condition ${
                        bed.condition
                          ? bed.condition
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                          : "none"
                      }`}
                    >
                      {bed.condition || "—"}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`bed-status ${bed.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >

                      <i></i>

                      {bed.status}

                    </span>

                  </td>

                  {/* VIEW */}

                  <td>

                    <button
                      type="button"
                      className="bed-view-button"
                      onClick={() =>
                        setSelectedBed(bed)
                      }
                    >

                      View

                      <ArrowRight size={14} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY */}

          {filteredBeds.length === 0 && (

            <div className="bed-empty-state">

              <BedDouble size={30} />

              <h3>
                No beds found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =========================
          BED DETAILS MODAL
      ========================= */}

      {selectedBed && (

        <div
          className="bed-modal-overlay"
          onClick={() =>
            setSelectedBed(null)
          }
        >

          <div
            className="bed-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="bed-modal-close"
              onClick={() =>
                setSelectedBed(null)
              }
            >

              <X size={19} />

            </button>

            {/* HEADER */}

            <div className="bed-modal-header">

              <div className="bed-modal-icon">
                <BedDouble size={26} />
              </div>

              <div>

                <span>
                  {selectedBed.id}
                </span>

                <h2>
                  {selectedBed.bedNumber}
                </h2>

                <p>
                  {selectedBed.ward}
                  {" · "}
                  {selectedBed.room}
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="bed-modal-status-row">

              <span>
                Current Status
              </span>

              <strong
                className={selectedBed.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              >

                <i></i>

                {selectedBed.status}

              </strong>

            </div>

            {/* DETAILS */}

            <div className="bed-modal-grid">

              <div>

                <Building2 size={16} />

                <span>

                  <small>
                    Bed Type
                  </small>

                  <strong>
                    {selectedBed.type}
                  </strong>

                </span>

              </div>

              <div>

                <MapPin size={16} />

                <span>

                  <small>
                    Location
                  </small>

                  <strong>
                    {selectedBed.floor}
                  </strong>

                </span>

              </div>

              <div>

                <UserRound size={16} />

                <span>

                  <small>
                    Patient
                  </small>

                  <strong>
                    {selectedBed.patientName ||
                      "Unassigned"}
                  </strong>

                </span>

              </div>

              <div>

                <Stethoscope size={16} />

                <span>

                  <small>
                    Doctor
                  </small>

                  <strong>
                    {selectedBed.doctor ||
                      "Unassigned"}
                  </strong>

                </span>

              </div>

            </div>

            {/* CONDITION */}

            {selectedBed.condition && (

              <div className="bed-modal-condition">

                <span>
                  Patient Condition
                </span>

                <strong>
                  {selectedBed.condition}
                </strong>

              </div>

            )}

            {/* ADMISSION */}

            {selectedBed.admissionDate && (

              <div className="bed-modal-admission">

                <CalendarDays size={15} />

                <span>

                  Admission Date:{" "}

                  <strong>
                    {selectedBed.admissionDate}
                  </strong>

                </span>

              </div>

            )}

            {/* ACTIONS */}

            <div className="bed-modal-actions">

              <button type="button">

                <UserRound size={16} />

                Patient Details

              </button>

              <button type="button">

                <Activity size={16} />

                Update Bed Status

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default BedsICU;