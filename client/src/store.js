import { create } from "zustand";
import api from "./services/api";

const useAuthStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // Action to clear the error message
  clearError: () => set({ error: null }),

  signup: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/register", { username, email, password });
      set({ loading: false });
      return true; // Indicate success
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred.";
      set({ error: errorMsg, loading: false });
      return false; // Indicate failure
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      set({ currentUser: data.user, token: data.token, loading: false });
      return true; // Indicate success
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid email or password.";
      set({ error: errorMsg, loading: false });
      return false; // Indicate failure
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    delete api.defaults.headers.common["Authorization"];
    set({ currentUser: null, token: null });
  },
}));

// Set the initial auth token if it exists
const initialToken = localStorage.getItem("token");
if (initialToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

export default useAuthStore;