import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import useAuthStore from "./store";

// Initialize auth state when app loads
const initializeApp = async () => {
  const initializeAuth = useAuthStore.getState().initializeAuth;
  await initializeAuth();
};

// Initialize the app
initializeApp();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
