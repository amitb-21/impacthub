// client/src/store.js
import { create } from 'zustand'
import axios from 'axios';
import server from '../Environment';

const server_url = server;

const useAuthStore = create((set) => ({
  currentUser: null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${server_url}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      set({ currentUser: res.data.userId, loading: false });
    } catch (err) {
      set({ error: "Login Failed!", loading: false });
    }
  },
  signup: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${server_url}/signup`, {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      set({ currentUser: res.data.userId, loading: false });
    } catch (err) {
      set({ error: "Signup Failed!", loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ currentUser: null });
  }
}));

export default useAuthStore;