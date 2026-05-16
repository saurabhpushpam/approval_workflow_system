function FilterBar({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label>Status</label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Request Type</label>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Leave">Leave</option>
          <option value="Expense">Expense</option>
          <option value="General">General</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;