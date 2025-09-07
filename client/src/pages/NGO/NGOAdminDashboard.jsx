import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const NGOAdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get("/events/mine");
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

  return (
    <div>
      <h1>NGO Admin Dashboard</h1>
      <Link to="/events/create">Create New Event</Link>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      <div>
        {events.map((event) => (
          <div key={event._id}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <Link to={`/events/update/${event._id}`}>Update</Link>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOAdminDashboard;
