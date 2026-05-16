import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await api.post("/auth/login", formData);

      login(response.data.user, response.data.token);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="auth-banner">Approval Workflow</span>
        <h2>Welcome back.</h2>
        <p className="subtitle">Sign in to manage requests and approvals.</p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="primary-btn full-btn">
            Sign in
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
