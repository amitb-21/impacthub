import React, { useState, useEffect } from "react";
import api from "../../services/api";
import useAuthStore from "../../store";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dashboard Data
  const [metrics, setMetrics] = useState({
    users: 0,
    ngos: 0,
    events: 0,
    participants: 0,
  });

  // Users Management
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // NGO Management
  const [ngos, setNgos] = useState([]);
  const [ngoSearchTerm, setNgoSearchTerm] = useState("");

  // Verification Reports
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") {
      setError("Access denied. Admin privileges required.");
      return;
    }
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, usersRes, ngosRes, reportsRes] = await Promise.all([
        api.get("/dashboard/metrics"),
        api.get("/admin/users"),
        api.get("/ngos"),
        api.get("/verification-reports"),
      ]);

      setMetrics(metricsRes.data);
      setUsers(usersRes.data);
      setNgos(ngosRes.data.data || []);
      setReports(reportsRes.data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    }
  };

  const promoteToNGOAdmin = async (userId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/users/${userId}/promote`);
      setSuccess("User promoted to NGO Admin successfully");
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    } finally {
      setLoading(false);
    }
  };

  const verifyNGOAdmin = async (userId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/users/${userId}/verify`);
      setSuccess("NGO Admin verified successfully");
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify NGO Admin");
    } finally {
      setLoading(false);
    }
  };

  const verifyNGO = async (ngoId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/ngos/${ngoId}/verify`);
      setSuccess("NGO verified successfully");
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify NGO");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess("User deleted successfully");
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredNGOs = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(ngoSearchTerm.toLowerCase())
  );

  const pendingNGOs = filteredNGOs.filter(
    (ngo) => ngo.verificationStatus === "PENDING"
  );
  const verifiedNGOs = filteredNGOs.filter(
    (ngo) => ngo.verificationStatus === "VERIFIED"
  );

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, NGOs, and system operations</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users Management
        </button>
        <button
          className={`tab ${activeTab === "ngos" ? "active" : ""}`}
          onClick={() => setActiveTab("ngos")}
        >
          NGO Management
        </button>
        <button
          className={`tab ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Verification Reports
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="tab-content">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-number">{metrics.users}</div>
              <div className="metric-label">Total Users</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{metrics.ngos}</div>
              <div className="metric-label">Total NGOs</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{metrics.events}</div>
              <div className="metric-label">Total Events</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{metrics.participants}</div>
              <div className="metric-label">Total Participants</div>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button
                onClick={() => setActiveTab("users")}
                className="action-btn"
              >
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab("ngos")}
                className="action-btn"
              >
                Verify NGOs
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className="action-btn"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === "users" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Users Management</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Points</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.verified ? "verified" : "pending"
                        }`}
                      >
                        {user.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>{user.points || 0}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {user.role === "USER" && (
                          <button
                            onClick={() => promoteToNGOAdmin(user._id)}
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            Promote to NGO Admin
                          </button>
                        )}
                        {user.role === "NGO_ADMIN" && !user.verified && (
                          <button
                            onClick={() => verifyNGOAdmin(user._id)}
                            className="btn btn-success"
                            disabled={loading}
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="btn btn-danger"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NGO Management Tab */}
      {activeTab === "ngos" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>NGO Management</h3>
            <input
              type="text"
              placeholder="Search NGOs..."
              value={ngoSearchTerm}
              onChange={(e) => setNgoSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="ngo-sections">
            {/* Pending NGOs */}
            <div className="ngo-section">
              <h4>Pending Verification ({pendingNGOs.length})</h4>
              <div className="ngo-grid">
                {pendingNGOs.map((ngo) => (
                  <div key={ngo._id} className="ngo-card pending">
                    <div className="ngo-info">
                      <h5>{ngo.name}</h5>
                      <p>{ngo.email}</p>
                      <p>Registration: {ngo.registrationNumber}</p>
                      <p className="ngo-description">{ngo.description}</p>
                    </div>
                    <div className="ngo-actions">
                      <button
                        onClick={() => verifyNGO(ngo._id)}
                        className="btn btn-success"
                        disabled={loading}
                      >
                        Verify
                      </button>
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified NGOs */}
            <div className="ngo-section">
              <h4>Verified NGOs ({verifiedNGOs.length})</h4>
              <div className="ngo-grid">
                {verifiedNGOs.map((ngo) => (
                  <div key={ngo._id} className="ngo-card verified">
                    <div className="ngo-info">
                      <h5>{ngo.name}</h5>
                      <p>{ngo.email}</p>
                      <p>Registration: {ngo.registrationNumber}</p>
                      <p className="ngo-description">{ngo.description}</p>
                      <div className="ngo-stats">
                        <span>Score: {ngo.credibilityScore || 0}</span>
                        <span>
                          Rating: {ngo.rating?.average?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="ngo-actions">
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Verification Reports</h3>
            <button className="btn btn-primary">Create New Report</button>
          </div>

          <div className="reports-container">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-header">
                  <h4>{report.ngo?.name || "Unknown NGO"}</h4>
                  <span
                    className={`status-badge ${report.status.toLowerCase()}`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="report-content">
                  <p>
                    <strong>Credibility Score:</strong>{" "}
                    {report.credibilityScore}
                  </p>
                  <p>
                    <strong>Summary:</strong> {report.summary}
                  </p>
                  <p>
                    <strong>Reviewed By:</strong>{" "}
                    {report.reviewedBy?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="report-actions">
                  <button className="btn btn-secondary">View Details</button>
                  <button className="btn btn-primary">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
