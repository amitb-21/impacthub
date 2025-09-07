import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store";
import "./EventForm.css";

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { currentUser } = useAuthStore();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    ngo: "",
    title: "",
    description: "",
    category: "other",
    tags: "",
    dateStart: "",
    dateEnd: "",
    isOnline: false,
    location: {
      text: "",
      city: "",
      state: "",
      country: "",
    },
    coordinates: {
      lat: "",
      lng: "",
    },
    requirements: "",
    maxCapacity: "",
    status: "DRAFT",
    coverImage: "",
  });

  const [myNGOs, setMyNGOs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "environment",
    "education",
    "health",
    "poverty",
    "disaster-relief",
    "community-development",
    "animal-welfare",
    "elderly-care",
    "child-welfare",
    "other",
  ];

  useEffect(() => {
    if (currentUser?.role !== "NGO_ADMIN" || !currentUser?.verified) {
      setError("Access denied. Verified NGO Admin privileges required.");
      return;
    }

    loadMyNGOs();
    if (isEdit) {
      loadEventData();
    }
  }, [currentUser, id, isEdit]);

  const loadMyNGOs = async () => {
    try {
      const response = await api.get("/ngos?createdBy=" + currentUser._id);
      const verifiedNGOs = (response.data.data || []).filter(
        (ngo) => ngo.verificationStatus === "VERIFIED"
      );
      setMyNGOs(verifiedNGOs);

      // Auto-select first NGO if creating new event
      if (!isEdit && verifiedNGOs.length > 0) {
        setFormData((prev) => ({ ...prev, ngo: verifiedNGOs[0]._id }));
      }
    } catch (err) {
      setError("Failed to load your NGOs");
    }
  };

  const loadEventData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/events/${id}`);
      const event = response.data;

      setFormData({
        ngo: event.ngo?._id || "",
        title: event.title || "",
        description: event.description || "",
        category: event.category || "other",
        tags: Array.isArray(event.tags) ? event.tags.join(", ") : "",
        dateStart: event.dateStart
          ? new Date(event.dateStart).toISOString().slice(0, 16)
          : "",
        dateEnd: event.dateEnd
          ? new Date(event.dateEnd).toISOString().slice(0, 16)
          : "",
        isOnline: event.isOnline || false,
        location: {
          text: event.location?.text || "",
          city: event.location?.city || "",
          state: event.location?.state || "",
          country: event.location?.country || "",
        },
        coordinates: {
          lat: event.coordinates?.lat || "",
          lng: event.coordinates?.lng || "",
        },
        requirements: event.requirements || "",
        maxCapacity: event.maxCapacity || "",
        status: event.status || "DRAFT",
        coverImage: event.coverImage || "",
      });
    } catch (err) {
      setError("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare the payload
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        maxCapacity: formData.maxCapacity
          ? parseInt(formData.maxCapacity, 10)
          : null,
        coordinates:
          formData.coordinates.lat && formData.coordinates.lng
            ? {
                lat: parseFloat(formData.coordinates.lat),
                lng: parseFloat(formData.coordinates.lng),
              }
            : null,
      };

      // Remove empty coordinates
      if (!payload.coordinates) {
        delete payload.coordinates;
      }

      let response;
      if (isEdit) {
        response = await api.put(`/events/${id}`, payload);
        setSuccess("Event updated successfully!");
      } else {
        response = await api.post("/events", payload);
        setSuccess("Event created successfully!");
      }

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/ngo-dashboard");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "create"} event. Please try again.`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== "NGO_ADMIN" || !currentUser?.verified) {
    return (
      <div className="event-form-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need verified NGO Admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (myNGOs.length === 0) {
    return (
      <div className="event-form-container">
        <div className="no-ngos">
          <h2>No Verified NGOs</h2>
          <p>You need to have at least one verified NGO to create events.</p>
          <p>Please register your NGO and wait for verification.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-form-container">
      <div className="form-header">
        <h2>{isEdit ? "Update Event" : "Create New Event"}</h2>
        <p>Fill in the details for your volunteer event</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <fieldset>
          <legend>Basic Information</legend>

          <div className="form-group">
            <label htmlFor="ngo">Select NGO *</label>
            <select
              id="ngo"
              name="ngo"
              value={formData.ngo}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Choose an NGO</option>
              {myNGOs.map((ngo) => (
                <option key={ngo._id} value={ngo._id}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder="Describe your event and what volunteers will do"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., cleanup, youth, weekend"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Date & Time</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateStart">Start Date & Time *</label>
              <input
                type="datetime-local"
                id="dateStart"
                name="dateStart"
                value={formData.dateStart}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateEnd">End Date & Time</label>
              <input
                type="datetime-local"
                id="dateEnd"
                name="dateEnd"
                value={formData.dateEnd}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Location</legend>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isOnline"
                checked={formData.isOnline}
                onChange={handleChange}
                disabled={loading}
              />
              This is an online event
            </label>
          </div>

          {!formData.isOnline && (
            <>
              <div className="form-group">
                <label htmlFor="locationText">Location Description</label>
                <input
                  type="text"
                  id="locationText"
                  name="location.text"
                  value={formData.location.text}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Central Park, Conference Room A"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lat">Latitude (optional)</label>
                  <input
                    type="number"
                    step="any"
                    id="lat"
                    name="coordinates.lat"
                    value={formData.coordinates.lat}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 40.7128"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lng">Longitude (optional)</label>
                  <input
                    type="number"
                    step="any"
                    id="lng"
                    name="coordinates.lng"
                    value={formData.coordinates.lng}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>Additional Details</legend>

          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              disabled={loading}
              rows="3"
              placeholder="What skills, equipment, or preparation do volunteers need?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxCapacity">Maximum Participants</label>
            <input
              type="number"
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              disabled={loading}
              min="1"
              placeholder="Leave empty for unlimited"
            />
          </div>
        </fieldset>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/ngo-dashboard")}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
