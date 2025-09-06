import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store";
import "./Dashboard.css";

const Dashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser);


  return (
    <div className="landing-container">
      <div className="landing-section hero">
        <div className="hero-text">
          <h1>
            When volunteers and NGOs unite, small actions turn into lasting
            change.
          </h1>
          <p>
            ImpactHub is the bridge between dedicated volunteers and verified
            NGOs, making it easier than ever to create meaningful impact
            together.
          </p>
          <Link to="/signup" className="cta-button">
            Join Us Now
          </Link>
        </div>
      </div>

      <div className="landing-section projects-section">
        <h2>Some of Our Featured Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-image image1"></div>
            <h3>Clean Water Initiative, Bihar</h3>
            <p>
              Providing safe and accessible drinking water to rural communities
              by installing filtration systems and maintaining wells.
            </p>
          </div>
          <div className="project-card">
            <div className="project-image image2"></div>
            <h3>Education for All, Delhi</h3>
            <p>
              Bringing quality education to underprivileged children through
              mentorship, tutoring, and interactive learning sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="landing-section stats-section">
        <h2>Our Impact Together</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span>1,200+</span>
            <p>Verified NGOs</p>
          </div>
          <div className="stat-item">
            <span>15,000+</span>
            <p>Active Volunteers</p>
          </div>
          <div className="stat-item">
            <span>75,000+</span>
            <p>Volunteering Hours</p>
          </div>
          <div className="stat-item">
            <span>10,000+</span>
            <p>Lives Impacted</p>
          </div>
        </div>
      </div>

      <div className="landing-section join-us-section">
        <h2>Ready to Make a Difference?</h2>
        <ol className="steps-list">
          <li>
            <Link to="/signup">Create an account</Link> as a Volunteer or an
            NGO.
          </li>
          <li>NGOs can register and get verified to post events.</li>
          <li>Volunteers can discover and join projects in their area.</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
