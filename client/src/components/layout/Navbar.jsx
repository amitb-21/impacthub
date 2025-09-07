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
              <Link
                to="/testimonial"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Testimonials
              </Link>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item dropdown">
                  <span className="nav-links">
                    Menu <ChevronDown size={20} />
                  </span>
                  <div className="dropdown-content">
                    <Link to="/ngos" onClick={closeMobileMenu}>
                      Find an NGO
                    </Link>
                    <Link to="/ngo/register" onClick={closeMobileMenu}>
                      Register Your NGO
                    </Link>
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
                    className="nav-links-mobile logout-btn"
                    onClick={handleLogout}
                  >
                    Logout <LogOut />
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
