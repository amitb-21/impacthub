import React, { useState, useEffect } from "react";
import useAuthStore from "../../store";
import api from "../../services/api";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    interests: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    avatar: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        bio: currentUser.bio || "",
        interests: Array.isArray(currentUser.interests)
          ? currentUser.interests.join(", ")
          : currentUser.interests || "",
        location: {
          city: currentUser.location?.city || "",
          state: currentUser.location?.state || "",
          country: currentUser.location?.country || "",
        },
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Convert interests string to array
      const interestsArray = formData.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean);

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        interests: interestsArray,
        location: formData.location,
        avatar: formData.avatar,
      };

      // Call the /auth/me endpoint to update profile
      const response = await api.put("/auth/profile", updateData);

      // Update the user state in Zustand store
      setCurrentUser(response.data.user);

      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setMessage(errorMsg);
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>{currentUser.name}</h2>
          <p className="user-role">{currentUser.role.replace("_", " ")}</p>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-number">{currentUser.points || 0}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="stat">
              <span className="stat-number">{currentUser.level || 1}</span>
              <span className="stat-label">Level</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {currentUser.badges?.length || 0}
              </span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        </div>
      </div>

      {currentUser.badges && currentUser.badges.length > 0 && (
        <div className="badges-section">
          <h3>Your Badges</h3>
          <div className="badges-list">
            {currentUser.badges.map((badge, index) => (
              <span key={index} className="badge">
                {badge.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="profile-form-section">
        <div className="section-header">
          <h3>Profile Details</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setMessage("");
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled // Email is never editable
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interests">Interests (comma separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g., Environment, Education, Health"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar URL</label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <fieldset disabled={!isEditing}>
            <legend>Location</legend>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="Your city"
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="Your state"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  placeholder="Your country"
                />
              </div>
            </div>
          </fieldset>

          {isEditing && (
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "Updating..." : "Save Changes"}
            </button>
          )}
        </form>

        {message && (
          <div
            className={`message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Notifications Section */}
      {currentUser.notifications && currentUser.notifications.length > 0 && (
        <div className="notifications-section">
          <h3>Recent Notifications</h3>
          <div className="notifications-list">
            {currentUser.notifications
              .slice(0, 5)
              .map((notification, index) => (
                <div
                  key={index}
                  className={`notification ${
                    notification.read ? "read" : "unread"
                  }`}
                >
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
