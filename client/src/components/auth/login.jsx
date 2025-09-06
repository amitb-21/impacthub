import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react"; // Import an icon
import useAuthStore from "../../store";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore((state) => ({
    login: state.login,
    loading: state.loading,
    error: state.error,
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!useAuthStore.getState().error) {
      navigate("/");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        {/* Logo removed and icon added */}
        <LogIn className="logo-icon" size={48} />
      </div>
      <div className="login-box-wrapper">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Welcome Back!</h2>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            className="submit-btn login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="pass-box">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
