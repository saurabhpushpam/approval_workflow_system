import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);

      toast.success("Registration Successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="auth-banner">Approval Workflow</span>
        <h2>Create your account.</h2>
        <p className="subtitle">
          Pick a role — managers can approve or reject requests.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleChange}>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <button type="submit" className="primary-btn full-btn">
            Create account
          </button>
        </form>

        <p className="auth-link">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
