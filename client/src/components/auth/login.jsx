import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/logo.jpeg";
import { Link } from "react-router-dom";
import server from "../../../Environment";

const server_url = server;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${server_url}/login`, {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
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

        {/* Main login form */}
        <div className="login-card">
          <div className="login-header">
            <Box sx={{ padding: 1 }}>
              <PageHeader>
                <PageHeader.TitleArea variant="large">
                  <PageHeader.Title>Welcome Back</PageHeader.Title>
                </PageHeader.TitleArea>
              </PageHeader>
            </Box>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <div className="login-form">
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

            <Button
              variant="primary"
              className="login-btn"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          <div className="login-footer">
            <div className="pass-box">
              <p className="signup-text">
                New to ImpactHub? 
                <Link to="/signup">Create an account</Link>
              </p>
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;