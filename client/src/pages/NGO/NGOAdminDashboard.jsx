import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store";
import "./NGOAdminDashboard.css";

const NGOAdminDashboard = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dashboard data
  const [myNGOs, setMyNGOs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [eventStats, setEventStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    completed: 0,
  });

  // Event management
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (currentUser?.role !== "NGO_ADMIN") {
      setError("Access denied. NGO Admin privileges required.");
      return;
    }

    if (!currentUser?.verified) {
      setError(
        "Your NGO Admin account is pending verification by an administrator."
      );
      return;
    }

    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ngosRes, eventsRes] = await Promise.all([
        api.get("/ngos?createdBy=" + currentUser._id),
        api.get("/events/mine"),
      ]);

      setMyNGOs(ngosRes.data.data || []);
      setMyEvents(eventsRes.data || []);

      // Calculate event stats
      const events = eventsRes.data || [];
      setEventStats({
        total: events.length,
        published: events.filter((e) => e.status === "PUBLISHED").length,
        draft: events.filter((e) => e.status === "DRAFT").length,
        completed: events.filter((e) => e.status === "COMPLETED").length,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEventParticipants = async (eventId) => {
    try {
      const response = await api.get(`/participations/event/${eventId}`);
      setParticipants(response.data);
      setSelectedEvent(eventId);
    } catch (err) {
      setError("Failed to load participants");
    }
  };

  const markAttendance = async (participationId) => {
    try {
      await api.patch(`/participations/${participationId}/attendance`);
      setSuccess("Attendance marked successfully");
      loadEventParticipants(selectedEvent);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  const issueCertificate = async (participationId) => {
    try {
      await api.patch(`/participations/${participationId}/certificate`);
      setSuccess("Certificate issued successfully");
      loadEventParticipants(selectedEvent);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue certificate");
    }
  };

  const updateEventStatus = async (eventId, status) => {
    try {
      await api.put(`/events/${eventId}`, { status });
      setSuccess(`Event status updated to ${status}`);
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${eventId}`);
      setSuccess("Event deleted successfully");
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  if (currentUser?.role !== "NGO_ADMIN") {
    return (
      <div className="ngo-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need NGO Admin privileges to access this page.</p>
          <Link to="/ngo/register" className="btn btn-primary">
            Register Your NGO
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser?.verified) {
    return (
      <div className="ngo-dashboard">
        <div className="verification-pending">
          <h2>Verification Pending</h2>
          <p>
            Your NGO Admin account is pending verification by an administrator.
          </p>
          <p>You will be able to access the dashboard once verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ngo-dashboard">
      <div className="dashboard-header">
        <h1>NGO Admin Dashboard</h1>
        <p>Manage your NGOs and events</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === "ngos" ? "active" : ""}`}
          onClick={() => setActiveTab("ngos")}
        >
          My NGOs
        </button>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`tab ${activeTab === "participants" ? "active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{myNGOs.length}</div>
              <div className="stat-label">My NGOs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{eventStats.total}</div>
              <div className="stat-label">Total Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{eventStats.published}</div>
              <div className="stat-label">Published Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{eventStats.draft}</div>
              <div className="stat-label">Draft Events</div>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/ngo/register" className="action-btn">
                Register New NGO
              </Link>
              <Link to="/events/create" className="action-btn">
                Create Event
              </Link>
              <button
                onClick={() => setActiveTab("events")}
                className="action-btn"
              >
                Manage Events
              </button>
            </div>
          </div>

          {/* Recent Events */}
          <div className="recent-events">
            <h3>Recent Events</h3>
            <div className="events-list">
              {myEvents.slice(0, 5).map((event) => (
                <div key={event._id} className="event-item">
                  <h4>{event.title}</h4>
                  <p>
                    Status:{" "}
                    <span
                      className={`status-badge ${event.status.toLowerCase()}`}
                    >
                      {event.status}
                    </span>
                  </p>
                  <p>Date: {new Date(event.dateStart).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My NGOs Tab */}
      {activeTab === "ngos" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>My NGOs</h3>
            <Link to="/ngo/register" className="btn btn-primary">
              Register New NGO
            </Link>
          </div>

          <div className="ngos-grid">
            {myNGOs.map((ngo) => (
              <div key={ngo._id} className="ngo-card">
                <div className="ngo-header">
                  <h4>{ngo.name}</h4>
                  <span
                    className={`status-badge ${ngo.verificationStatus.toLowerCase()}`}
                  >
                    {ngo.verificationStatus}
                  </span>
                </div>
                <div className="ngo-info">
                  <p>
                    <strong>Email:</strong> {ngo.email}
                  </p>
                  <p>
                    <strong>Registration:</strong> {ngo.registrationNumber}
                  </p>
                  <p>
                    <strong>Focus Areas:</strong>{" "}
                    {ngo.focusAreas?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Credibility Score:</strong>{" "}
                    {ngo.credibilityScore || 0}
                  </p>
                </div>
                <div className="ngo-actions">
                  <button className="btn btn-secondary">View Details</button>
                  <button className="btn btn-primary">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>My Events</h3>
            <Link to="/events/create" className="btn btn-primary">
              Create New Event
            </Link>
          </div>

          <div className="events-grid">
            {myEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <h4>{event.title}</h4>
                  <span
                    className={`status-badge ${event.status.toLowerCase()}`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="event-info">
                  <p>
                    <strong>NGO:</strong> {event.ngo?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.dateStart).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {event.location?.text || "Online"}
                  </p>
                  <p>
                    <strong>Capacity:</strong>{" "}
                    {event.maxCapacity || "Unlimited"}
                  </p>
                </div>
                <div className="event-actions">
                  <button
                    onClick={() => loadEventParticipants(event._id)}
                    className="btn btn-secondary"
                  >
                    View Participants
                  </button>
                  <Link
                    to={`/events/update/${event._id}`}
                    className="btn btn-primary"
                  >
                    Edit
                  </Link>
                  {event.status === "DRAFT" && (
                    <button
                      onClick={() => updateEventStatus(event._id, "PUBLISHED")}
                      className="btn btn-success"
                    >
                      Publish
                    </button>
                  )}
                  {event.status === "PUBLISHED" && (
                    <button
                      onClick={() => updateEventStatus(event._id, "COMPLETED")}
                      className="btn btn-warning"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === "participants" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Event Participants</h3>
            {selectedEvent && <p>Showing participants for selected event</p>}
          </div>

          {!selectedEvent ? (
            <div className="no-selection">
              <p>Select an event from the Events tab to view participants</p>
            </div>
          ) : (
            <div className="participants-container">
              <div className="participants-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Registration Date</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participation) => (
                      <tr key={participation._id}>
                        <td>{participation.user?.name || "N/A"}</td>
                        <td>{participation.user?.email || "N/A"}</td>
                        <td>
                          <span
                            className={`status-badge ${participation.status.toLowerCase()}`}
                          >
                            {participation.status}
                          </span>
                        </td>
                        <td>
                          {new Date(
                            participation.registeredAt
                          ).toLocaleDateString()}
                        </td>
                        <td>{participation.pointsEarned || 0}</td>
                        <td>
                          <div className="participant-actions">
                            {participation.status === "REGISTERED" && (
                              <button
                                onClick={() =>
                                  markAttendance(participation._id)
                                }
                                className="btn btn-success btn-sm"
                              >
                                Mark Present
                              </button>
                            )}
                            {participation.status === "ATTENDED" &&
                              !participation.certificateIssued && (
                                <button
                                  onClick={() =>
                                    issueCertificate(participation._id)
                                  }
                                  className="btn btn-primary btn-sm"
                                >
                                  Issue Certificate
                                </button>
                              )}
                            {participation.certificateIssued && (
                              <span className="certificate-badge">
                                Certified
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NGOAdminDashboard;
