import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./NGOList.css";

const NGOList = () => {
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNgos = async () => {
      setLoading(true);
      try {
        const response = await api.get("/ngos");
        setNgos(response.data.data);
      } catch (err) {
        setError("Failed to fetch NGOs.");
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ngo-list-container">
      <div className="ngo-list-header">
        <h1>Find an NGO</h1>
        <p>
          Search for NGOs by name and get involved in a cause you care about.
        </p>
        <div className="ngo-list-actions">
          <input
            type="text"
            placeholder="Search for an NGO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/ngo/register" className="register-ngo-btn">
            Register Your NGO
          </Link>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="ngo-list">
        {filteredNgos.map((ngo) => (
          <div key={ngo._id} className="ngo-card">
            <h3>{ngo.name}</h3>
            <p>{ngo.description}</p>
            <Link to={`/ngo/${ngo._id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOList;
