import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NGOForm.css"; // We will create this new CSS file

const NGOForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNumber: "",
    address: "",
    description: "",
    focusAreas: "",
    tags: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    socialLinks: {
      website: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      facebook: "",
    },
    logo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // A more robust handler for both top-level and nested state
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
    setError("");

    try {
      // Prepare the payload, converting comma-separated strings to arrays
      const payload = {
        ...formData,
        focusAreas: formData.focusAreas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await api.post("/ngos", payload);
      navigate("/dashboard?status=pending_verification");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to submit the form. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ngo-form-container">
      <form onSubmit={handleSubmit} className="ngo-form">
        <div className="form-header">
          <h2>Register Your NGO</h2>
          <p>
            Provide your organization's details for verification. All fields
            marked with * are required.
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <fieldset>
          <legend>Basic Information</legend>
          <div className="form-group">
            <label htmlFor="name">NGO Name *</label>
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
            <label htmlFor="registrationNumber">
              Official Registration Number *
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact Details</legend>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">Contact Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address">Full Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
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
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Mission & Focus</legend>
          <div className="form-group">
            <label htmlFor="description">Description / Mission Statement</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="focusAreas">Focus Areas (comma-separated)</label>
            <input
              type="text"
              id="focusAreas"
              name="focusAreas"
              value={formData.focusAreas}
              onChange={handleChange}
              placeholder="e.g., Education, Health, Environment"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Children, Rural Development, Water"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Online Presence</legend>
          <div className="form-group">
            <label htmlFor="logo">Logo URL</label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="socialLinks.website"
                value={formData.socialLinks.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="facebook">Facebook</label>
              <input
                type="url"
                id="facebook"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="twitter">Twitter (X)</label>
              <input
                type="url"
                id="twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="url"
                id="instagram"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
};

export default NGOForm;
