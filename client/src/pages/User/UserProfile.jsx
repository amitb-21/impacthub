import React, { useState, useEffect } from "react";
import useAuthStore from "../../store";
import api from "../../services/api";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser, login: updateUserState } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        skills: Array.isArray(currentUser.skills)
          ? currentUser.skills.join(", ")
          : "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim());
      const updatedData = {
        name: formData.name,
        skills: skillsArray,
      };

      const response = await api.put("/users/profile", updatedData);

      // Update the user state in Zustand store
      updateUserState({ ...currentUser, ...response.data.user });

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <p>Update your name and skills here.</p>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            disabled // Email is not editable
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills (comma separated)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., teaching, web development, fundraising"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UserProfile;
