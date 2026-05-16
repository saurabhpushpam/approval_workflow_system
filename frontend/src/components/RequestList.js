import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import StatusBadge from "./StatusBadge";
import FilterBar from "./FilterBar";

function RequestList({ requests, fetchRequests, onNewRequest }) {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const handleStatus = async (id, status) => {
    try {
      setActionLoading(id);
      console.log("Updating request", id, "to status", status);
      await api.put(`/requests/${id}/status`, { status });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update request status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter((item) => {
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    const typeMatch = typeFilter ? item.requestType === typeFilter : true;
    return statusMatch && typeMatch;
  });

  const totalRequests = requests.length;
  const pendingCount = requests.filter(
    (item) => item.status === "Pending",
  ).length;
  const approvedCount = requests.filter(
    (item) => item.status === "Approved",
  ).length;
  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected",
  ).length;

  return (
    <>
      <div className="dashboard-header">
        <div>
          <span className="page-label">Approval Workflow</span>
          <h2>Requests</h2>
        </div>
        {onNewRequest && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onNewRequest}
          >
            + New request
          </button>
        )}
      </div>

      <div className="dashboard-action-bar">
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{totalRequests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pendingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{approvedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value">{rejectedCount}</div>
        </div>
      </div>

      <div className="card request-table-card">
        <div className="table-header">
          <h3>All requests</h3>
          <span className="request-count">{filteredRequests.length} items</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Title</th>
                <th>Description</th>
                <th>User</th>
                <th>Type</th>
                <th>Status</th>
                {user?.role === "Manager" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((item) => (
                <tr key={item.id}>
                  {/* <td>{item.id}</td> */}
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.requestedByName}</td>
                  <td>{item.requestType}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  {user?.role === "Manager" && (
                    <td>
                      {item.status === "Pending" ? (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            disabled={actionLoading === item.id}
                            onClick={() => handleStatus(item.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            disabled={actionLoading === item.id}
                            onClick={() => handleStatus(item.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="finalized-text">Finalized</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default RequestList;
