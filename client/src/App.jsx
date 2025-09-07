import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Public Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import EventList from "./pages/Events/EventsList";
import NGOList from "./pages/NGO/NGOList";
import Testimonials from "./pages/Dashboard/Testimonial";

import UserProfile from "./pages/User/UserProfile";

// NGO Pages
import NGOForm from "./pages/NGO/NGOForm";

// Admin Pages
import AdminPanel from "./pages/Admin/AdminPanel";

// NGO Admin Pages
import NGOAdminDashboard from "./pages/NGO/NGOAdminDashboard";
import EventForm from "./pages/Events/EventForm";

// Dashboard Router
import DashboardRouter from "./components/routing/DashboardRouter";

// Role-based route protection component
import RoleProtectedRoute from "./components/common/RoleProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/events" element={<EventList />} />
            {/* Temporarily commented out until EventDetails component is created */}
            {/* <Route path="/events/:id" element={<EventDetails />} /> */}
            <Route path="/ngos" element={<NGOList />} />
            {/* Temporarily commented out until NGODetails component is created */}
            {/* <Route path="/ngos/:id" element={<NGODetails />} /> */}
            <Route path="/testimonials" element={<Testimonials />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Universal Dashboard Route - routes to appropriate dashboard based on role */}
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* User Routes */}
              <Route path="/profile" element={<UserProfile />} />

              {/* NGO Registration (accessible by all authenticated users) */}
              <Route path="/ngo/register" element={<NGOForm />} />

              {/* Admin Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* NGO Admin Routes */}
              <Route
                element={
                  <RoleProtectedRoute allowedRoles={["NGO_ADMIN", "ADMIN"]} />
                }
              >
                <Route path="/ngo-dashboard" element={<NGOAdminDashboard />} />
                <Route path="/events/create" element={<EventForm />} />
                <Route path="/events/update/:id" element={<EventForm />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
