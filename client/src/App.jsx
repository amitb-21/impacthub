import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import NGOForm from "./pages/NGO/NGOForm";
import NGOProfile from "./pages/NGO/NGOProfile";
import EventsList from "./pages/Events/EventsList";
import EventDetails from "./pages/Events/EventDetails";
import AdminView from "./pages/Admin/AdminView";
import Testimonial from "./pages/Dashboard/Testimonial";
import NGOList from "./pages/NGO/NGOList";
import ProtectedRoute from "./components/common/ProtectedRoute";
import EventCreate from "./pages/Events/EventCreate";
import NGOAdminDashboard from "./pages/NGO/NGOAdminDashboard";
import UserProfile from "./pages/User/UserProfile"; 

// Global Styles
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="py-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/ngos" element={<NGOList />} />
          <Route path="/ngo/:id" element={<NGOProfile />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/register"
            element={
              <ProtectedRoute>
                <NGOForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute ngoAdminOnly>
                <EventCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute ngoAdminOnly>
                <NGOAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
