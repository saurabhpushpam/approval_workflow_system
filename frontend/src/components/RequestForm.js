import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

function RequestForm({ fetchRequests, onCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestType: "Leave",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/requests", formData);

      toast.success("Request Created Successfully");

      setFormData({
        title: "",
        description: "",
        requestType: "Leave",
      });

      fetchRequests();
      onCreated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="form-header">
        <h2>Create Request</h2>
        {onCancel && (
          <button
            type="button"
            className="secondary-close-btn"
            onClick={onCancel}
          >
            Close
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Request Type</label>

          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
          >
            <option value="Leave">Leave</option>
            <option value="Expense">Expense</option>
            <option value="General">General</option>
          </select>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Submitting..." : "Create Request"}
        </button>
      </form>
    </div>
  );
}

export default RequestForm;
