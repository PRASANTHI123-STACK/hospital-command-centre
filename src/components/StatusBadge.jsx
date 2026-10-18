function StatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`patient-status ${statusClass}`}>
      <span className="status-dot"></span>

      {status}
    </span>
  );
}

export default StatusBadge;