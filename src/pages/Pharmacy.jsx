import { useMemo, useState } from "react";

import {
  Pill,
  Search,
  PackageCheck,
  AlertTriangle,
  XCircle,
  Boxes,
  CalendarDays,
  FileText,
  Truck,
  X,
  ArrowRight,
} from "lucide-react";

import medicines from "../data/medicines";

function Pharmacy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    "All",
    ...new Set(
      medicines.map((medicine) => medicine.category)
    ),
  ];

  /* =========================
     FILTER MEDICINES
  ========================= */

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        medicine.name.toLowerCase().includes(search) ||
        medicine.id.toLowerCase().includes(search) ||
        medicine.category.toLowerCase().includes(search) ||
        medicine.supplier.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" ||
        medicine.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        medicine.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  /* =========================
     SUMMARY
  ========================= */

  const totalMedicines = medicines.length;

  const inStockMedicines = medicines.filter(
    (medicine) => medicine.status === "In Stock"
  ).length;

  const lowStockMedicines = medicines.filter(
    (medicine) => medicine.status === "Low Stock"
  ).length;

  const outOfStockMedicines = medicines.filter(
    (medicine) => medicine.status === "Out of Stock"
  ).length;

  /* =========================
     STOCK PERCENTAGE
  ========================= */

  const getStockPercentage = (medicine) => {
    if (medicine.minimumStock <= 0) {
      return 100;
    }

    const percentage =
      (medicine.stock /
        (medicine.minimumStock * 4)) *
      100;

    return Math.min(
      Math.max(Math.round(percentage), 0),
      100
    );
  };

  return (
    <div className="pharmacy-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="pharmacy-page-header">

        <div className="pharmacy-title-row">

          <div className="pharmacy-title-icon">
            <Pill size={25} />
          </div>

          <div>
            <h1>
              Pharmacy Management
            </h1>

            <p>
              Monitor medicine inventory, stock levels and expiry
            </p>
          </div>

        </div>

        <div className="pharmacy-live-status">
          <span></span>
          INVENTORY ONLINE
        </div>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="pharmacy-summary-grid">

        <div className="pharmacy-stat-card">

          <div className="pharmacy-stat-icon blue">
            <Boxes size={22} />
          </div>

          <div>
            <span>Total Medicines</span>

            <strong>
              {totalMedicines}
            </strong>

            <small>
              Active inventory items
            </small>
          </div>

        </div>

        <div className="pharmacy-stat-card">

          <div className="pharmacy-stat-icon green">
            <PackageCheck size={22} />
          </div>

          <div>
            <span>In Stock</span>

            <strong>
              {inStockMedicines}
            </strong>

            <small>
              Stock level healthy
            </small>
          </div>

        </div>

        <div className="pharmacy-stat-card">

          <div className="pharmacy-stat-icon orange">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Low Stock</span>

            <strong>
              {lowStockMedicines}
            </strong>

            <small>
              Reorder recommended
            </small>
          </div>

        </div>

        <div className="pharmacy-stat-card">

          <div className="pharmacy-stat-icon red">
            <XCircle size={22} />
          </div>

          <div>
            <span>Out of Stock</span>

            <strong>
              {outOfStockMedicines}
            </strong>

            <small>
              Immediate attention
            </small>
          </div>

        </div>

      </div>

      {/* =========================
          INVENTORY ALERT
      ========================= */}

      {outOfStockMedicines > 0 && (
        <div className="pharmacy-alert">

          <div className="pharmacy-alert-icon">
            <AlertTriangle size={17} />
          </div>

          <div>

            <strong>
              Inventory Alert
            </strong>

            <p>
              {outOfStockMedicines} medicine
              {outOfStockMedicines > 1 ? "s are" : " is"}{" "}
              currently out of stock and require immediate
              replenishment.
            </p>

          </div>

        </div>
      )}

      {/* =========================
          INVENTORY DIRECTORY
      ========================= */}

      <section className="pharmacy-directory">

        <div className="pharmacy-directory-header">

          <div>

            <h2>
              Medicine Inventory
            </h2>

            <p>
              View medicine stock, expiry and supplier information
            </p>

          </div>

          <div className="pharmacy-directory-count">
            {filteredMedicines.length} Medicines
          </div>

        </div>

        {/* FILTERS */}

        <div className="pharmacy-filter-bar">

          <div className="pharmacy-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search medicine, category or supplier..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category === "All"
                  ? "All Categories"
                  : category}
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

            <option value="In Stock">
              In Stock
            </option>

            <option value="Low Stock">
              Low Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

          </select>

        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="pharmacy-table-wrapper">

          <table className="pharmacy-table">

            <thead>

              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Stock Level</th>
                <th>Expiry</th>
                <th>Supplier</th>
                <th>Status</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {filteredMedicines.map((medicine) => {

                const stockPercentage =
                  getStockPercentage(medicine);

                return (
                  <tr key={medicine.id}>

                    {/* MEDICINE */}

                    <td>

                      <div className="pharmacy-medicine">

                        <div className="pharmacy-medicine-icon">
                          <Pill size={16} />
                        </div>

                        <div>

                          <strong>
                            {medicine.name}
                          </strong>

                          <small>
                            {medicine.id}
                            {" · "}
                            {medicine.form}
                          </small>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td>

                      <span
                        className={`pharmacy-category ${medicine.category
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {medicine.category}
                      </span>

                    </td>

                    {/* STOCK */}

                    <td>

                      <div className="pharmacy-stock">

                        <strong>
                          {medicine.stock}
                        </strong>

                        <small>
                          {medicine.unit}
                        </small>

                      </div>

                    </td>

                    {/* STOCK LEVEL */}

                    <td>

                      <div className="pharmacy-stock-level">

                        <div className="pharmacy-stock-bar">

                          <span
                            className={medicine.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            style={{
                              width: `${stockPercentage}%`,
                            }}
                          ></span>

                        </div>

                        <small>
                          Min: {medicine.minimumStock}
                        </small>

                      </div>

                    </td>

                    {/* EXPIRY */}

                    <td>

                      <div className="pharmacy-expiry">

                        <CalendarDays size={13} />

                        {medicine.expiryDate}

                      </div>

                    </td>

                    {/* SUPPLIER */}

                    <td>

                      <div className="pharmacy-supplier">

                        <Truck size={13} />

                        {medicine.supplier}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`pharmacy-status ${medicine.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >

                        <i></i>

                        {medicine.status}

                      </span>

                    </td>

                    {/* VIEW */}

                    <td>

                      <button
                        type="button"
                        className="pharmacy-view-button"
                        onClick={() =>
                          setSelectedMedicine(medicine)
                        }
                      >

                        View

                        <ArrowRight size={14} />

                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

          {filteredMedicines.length === 0 && (
            <div className="pharmacy-empty-state">

              <Pill size={30} />

              <h3>
                No medicines found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>
          )}

        </div>

      </section>

      {/* =========================
          PHARMACY OPERATIONS
      ========================= */}

      <div className="pharmacy-operation-grid">

        {/* LOW STOCK */}

        <section className="pharmacy-operation-card">

          <div className="pharmacy-operation-header">

            <div className="pharmacy-operation-icon orange">
              <AlertTriangle size={18} />
            </div>

            <div>

              <h2>
                Low Stock Alerts
              </h2>

              <p>
                Medicines requiring replenishment
              </p>

            </div>

          </div>

          <div className="pharmacy-alert-list">

            {medicines
              .filter(
                (medicine) =>
                  medicine.status === "Low Stock"
              )
              .map((medicine) => (

                <div
                  className="pharmacy-alert-item"
                  key={medicine.id}
                >

                  <div>

                    <strong>
                      {medicine.name}
                    </strong>

                    <small>
                      Current stock:{" "}
                      {medicine.stock}{" "}
                      {medicine.unit}
                    </small>

                  </div>

                  <span>
                    Reorder
                  </span>

                </div>

              ))}

          </div>

        </section>

        {/* INVENTORY OVERVIEW */}

        <section className="pharmacy-operation-card">

          <div className="pharmacy-operation-header">

            <div className="pharmacy-operation-icon blue">
              <CalendarDays size={18} />
            </div>

            <div>

              <h2>
                Inventory Overview
              </h2>

              <p>
                Current pharmacy operations
              </p>

            </div>

          </div>

          <div className="pharmacy-overview-list">

            <div>

              <span>
                Active categories
              </span>

              <strong>
                {categories.length - 1}
              </strong>

            </div>

            <div>

              <span>
                Total stock units
              </span>

              <strong>
                {medicines
                  .reduce(
                    (total, medicine) =>
                      total + medicine.stock,
                    0
                  )
                  .toLocaleString()}
              </strong>

            </div>

            <div>

              <span>
                Critical stock items
              </span>

              <strong className="critical">
                {outOfStockMedicines}
              </strong>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          MEDICINE DETAILS MODAL
      ========================= */}

      {selectedMedicine && (

        <div
          className="pharmacy-modal-overlay"
          onClick={() =>
            setSelectedMedicine(null)
          }
        >

          <div
            className="pharmacy-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="pharmacy-modal-close"
              onClick={() =>
                setSelectedMedicine(null)
              }
            >
              <X size={19} />
            </button>

            {/* HEADER */}

            <div className="pharmacy-modal-header">

              <div className="pharmacy-modal-icon">
                <Pill size={25} />
              </div>

              <div>

                <span>
                  {selectedMedicine.id}
                </span>

                <h2>
                  {selectedMedicine.name}
                </h2>

                <p>
                  {selectedMedicine.category}
                  {" · "}
                  {selectedMedicine.form}
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="pharmacy-modal-status">

              <span>
                Current Status
              </span>

              <strong
                className={selectedMedicine.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              >

                <i></i>

                {selectedMedicine.status}

              </strong>

            </div>

            {/* DETAILS */}

            <div className="pharmacy-modal-grid">

              <div>

                <Boxes size={16} />

                <span>

                  <small>
                    Current Stock
                  </small>

                  <strong>
                    {selectedMedicine.stock}{" "}
                    {selectedMedicine.unit}
                  </strong>

                </span>

              </div>

              <div>

                <AlertTriangle size={16} />

                <span>

                  <small>
                    Minimum Stock
                  </small>

                  <strong>
                    {selectedMedicine.minimumStock}{" "}
                    {selectedMedicine.unit}
                  </strong>

                </span>

              </div>

              <div>

                <CalendarDays size={16} />

                <span>

                  <small>
                    Expiry Date
                  </small>

                  <strong>
                    {selectedMedicine.expiryDate}
                  </strong>

                </span>

              </div>

              <div>

                <FileText size={16} />

                <span>

                  <small>
                    Batch Number
                  </small>

                  <strong>
                    {selectedMedicine.batchNumber}
                  </strong>

                </span>

              </div>

            </div>

            {/* SUPPLIER */}

            <div className="pharmacy-modal-supplier">

              <Truck size={16} />

              <span>

                <small>
                  Supplier
                </small>

                <strong>
                  {selectedMedicine.supplier}
                </strong>

              </span>

            </div>

            {/* PRICE */}

            <div className="pharmacy-modal-price">

              <span>
                Unit Price
              </span>

              <strong>
                ₹{selectedMedicine.price.toFixed(2)}
              </strong>

            </div>

            {/* ACTIONS */}

            <div className="pharmacy-modal-actions">

              <button type="button">

                <Boxes size={16} />

                Update Stock

              </button>

              <button type="button">

                <Truck size={16} />

                Reorder Medicine

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Pharmacy;