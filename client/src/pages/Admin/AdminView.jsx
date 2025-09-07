import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminView() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNgos = async () => {
      setLoading(true);
      try {
        const response = await api.get("/ngos?status=PENDING");
        setNgos(response.data.data);
      } catch (err) {
        setError("Failed to fetch NGOs for verification.");
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  const handleVerify = async (ngoId) => {
    try {
      await api.patch(`/ngos/${ngoId}/verify`);
      setNgos(ngos.filter((ngo) => ngo._id !== ngoId));
    } catch (err) {
      setError("Failed to verify NGO.");
    }
  };

  return (
    <div>
      <h1>Admin Verification Panel</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div>
        {ngos.map((ngo) => (
          <div key={ngo._id}>
            <h3>{ngo.name}</h3>
            <button onClick={() => handleVerify(ngo._id)}>Verify</button>
          </div>
        ))}
      </div>
    </div>
  );
}
