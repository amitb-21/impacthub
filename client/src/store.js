import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Direct API calls without using the api service to avoid circular imports
const API_BASE_URL = import.meta.env.VITE_API_URL;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      currentUser: null,
      token: null,
      error: null,
      loading: false,

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }

          const { token, user } = await response.json();
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          console.log('Login successful:', { user: user.name, role: user.role });
          
          set({ 
            currentUser: user, 
            token, 
            loading: false, 
            error: null 
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage = error.message || 'Login failed';
          set({ 
            error: errorMessage, 
            loading: false,
            currentUser: null,
            token: null
          });
          return false;
        }
      },

      signup: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
          }
          
          console.log('Signup successful');
          set({ loading: false, error: null });
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          const errorMessage = error.message || 'Signup failed';
          set({ 
            error: errorMessage, 
            loading: false 
          });
          return false;
        }
      },

      logout: () => {
        console.log('Logging out user');
          localStorage.removeItem("token");
          set({ currentUser: null, token: null, error: null });
      },
  
    // Action to update currentUser from anywhere (e.g., after profile update)
    setCurrentUser: (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user));
      set({ currentUser: user });
    },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state from token
      initializeAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const user = await response.json();
              console.log('Auth initialized with user:', user.name);
              set({ 
                currentUser: user, 
                token,
                error: null 
              });
            } else {
              // Token is invalid
              console.log('Token invalid, clearing auth state');
              localStorage.removeItem('token');
              set({ 
                currentUser: null, 
                token: null,
                error: null 
              });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem('token');
            set({ 
              currentUser: null, 
              token: null,
              error: null 
            });
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;