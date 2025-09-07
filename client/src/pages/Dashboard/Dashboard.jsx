import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store";
import "./Dashboard.css";

import pic1 from "../../assets/pic1.jpg";
import pic2 from "../../assets/pic2.jpg";
import pic3 from "../../assets/pic3.jpg";
import pic4 from "../../assets/pic4.jpg";
import pic5 from "../../assets/pic5.jpg";
import pic6 from "../../assets/pic6.jpg";
import pic7 from "../../assets/pic7.jpg";
import pic8 from "../../assets/pic8.jpg";

const Dashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <div className="content-wrapper">
      <div className="details">
        <div className="projects">
          <h2>Some of Our Featured Projects</h2>
          <div className="project">
            <h3>Clean Water Initiative, Bihar</h3>
            <div className="images">
              <img
                src={pic1}
                alt="A child drinking water from a hand pump"
                className="project-image"
              />
              <img
                src={pic2}
                alt="Community members holding buckets for water"
                className="project-image"
              />
              <img
                src={pic3}
                alt="People collecting water from a tanker"
                className="project-image"
              />
              <img
                src={pic4}
                alt="Women collecting water from a muddy source"
                className="project-image"
              />
            </div>
            <div className="describe">
              <p>
                Providing safe and accessible drinking water to rural
                communities by installing filtration systems and maintaining
                wells.
              </p>
            </div>
          </div>
          <div className="project">
            <h3>Education for All, Delhi</h3>
            <div className="images">
              <img
                src={pic5}
                alt="School children in a damaged classroom environment"
                className="project-image"
              />
              <img
                src={pic6}
                alt="Students studying in a classroom"
                className="project-image"
              />
              <img
                src={pic7}
                alt="A group of students standing outside a school"
                className="project-image"
              />
              <img
                src={pic8}
                alt="A teacher instructing students in a classroom"
                className="project-image"
              />
            </div>
            <div className="describe">
              <p>
                Bringing quality education to underprivileged children through
                mentorship, tutoring, and interactive learning sessions.
              </p>
            </div>
          </div>
        </div>

        <div className="quickstats">
          <h2>Our Impact Together</h2>
          <ul>
            <li>
              <span>1,200+</span>
              <p>Verified NGOs</p>
            </li>
            <li>
              <span>15,000+</span>
              <p>Active Volunteers</p>
            </li>
            <li>
              <span>75,000+</span>
              <p>Volunteering Hours</p>
            </li>
            <li>
              <span>10,000+</span>
              <p>Lives Impacted</p>
            </li>
          </ul>
        </div>

        <div className="joinus">
          <h2>Ready to Make a Difference?</h2>
          <ul>
            <li>
              <Link to="/signup">Create an account</Link> as a Volunteer or an
              NGO.
            </li>
            <li>NGOs can register and get verified to post events.</li>
            <li>Volunteers can discover and join projects in their area.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
