import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react"; // Import an icon
import useAuthStore from "../../store";
import "./auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, loading, error } = useAuthStore((state) => ({
    signup: state.signup,
    loading: state.loading,
    error: state.error,
  }));

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(name, email, password, "USER");
    if (!useAuthStore.getState().error) {
      navigate("/");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        {/* Logo removed and icon added */}
        <UserPlus className="logo-icon" size={48} />
      </div>
      <div className="login-box-wrapper">
        <form className="login-box" onSubmit={handleSignup}>
          <h2>Join ImpactHub</h2>
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
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
              placeholder="Create a password"
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            className="submit-btn signup-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="pass-box">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="signup">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
