import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import server from "../../../Environment";
import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

const server_url = server;
import logo from "../../assets/logo.jpeg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${server_url}/signup`, {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background decoration */}
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-container">
        {/* Logo section */}
        <div className="login-logo-container">
          <div className="logo-wrapper">
            <img className="logo-login" src={logo} alt="Logo" />
          </div>
          <h2 className="brand-name">ImpactHub</h2>
        </div>

        {/* Main signup form */}
        <div className="login-card">
          <div className="login-header">
            <Box sx={{ padding: 1 }}>
              <PageHeader>
                <PageHeader.TitleArea variant="large">
                  <PageHeader.Title>Create Account</PageHeader.Title>
                </PageHeader.TitleArea>
              </PageHeader>
            </Box>
            <p className="login-subtitle">Join our community today</p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label className={`form-label ${focusedField === 'name' || name ? 'active' : ''}`}>
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  autoComplete="off"
                  name="Name"
                  id="Name"
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label className={`form-label ${focusedField === 'email' || email ? 'active' : ''}`}>
                Email address
              </label>
              <div className="input-wrapper">
                <input
                  autoComplete="off"
                  name="Email"
                  id="Email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label className={`form-label ${focusedField === 'password' || password ? 'active' : ''}`}>
                Password
              </label>
              <div className="input-wrapper">
                <input
                  autoComplete="off"
                  name="Password"
                  id="Password"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label active">Choose your role</label>
              <div className="role-selection">
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    id="admin"
                    value="ADMIN"
                    checked={role === "ADMIN"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="admin" className="role-label">
                    <span className="role-title">NGO Admin</span>
                    <span className="role-description">Manage projects and volunteers</span>
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    id="volunteer"
                    value="VOLUNTEER"
                    checked={role === "VOLUNTEER"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="volunteer" className="role-label">
                    <span className="role-title">Volunteer</span>
                    <span className="role-description">Join projects and make impact</span>
                  </label>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="login-btn"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          <div className="login-footer">
            <div className="pass-box">
              <p className="signup-text">
                Already have an account? 
                <Link to="/auth">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;