import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HandHeart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import useAuthStore from "../../store";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            ImpactHub <HandHeart />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            {click ? <X /> : <Menu />}
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/events"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Events
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/ngos" className="nav-links" onClick={closeMobileMenu}>
                NGOs
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/testimonial"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Testimonials
              </Link>
            </li>

            {currentUser ? (
              // Logged in user menu
              <>
                <li className="nav-item dropdown">
                  <span className="nav-links">
                    Actions <ChevronDown size={20} />
                  </span>
                  <div className="dropdown-content">
                    <Link to="/ngo/register" onClick={closeMobileMenu}>
                      Register NGO
                    </Link>
                    {currentUser.role === "NGO_ADMIN" && (
                      <Link to="/events/create" onClick={closeMobileMenu}>
                        Create Event
                      </Link>
                    )}
                    {currentUser.role === "ADMIN" && (
                      <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                </li>

                <li className="nav-item">
                  <Link
                    to="/profile"
                    className="nav-links nav-profile"
                    onClick={closeMobileMenu}
                  >
                    <UserIcon className="avatar" />
                    <span>{currentUser.name}</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-links logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span className="logout-text">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              // Not logged in user menu
              <>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
