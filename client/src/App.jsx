import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import NGOForm from "./pages/NGO/NGOForm.jsx";
import NGOProfile from "./pages/NGO/NGOProfile.jsx";
import EventsList from "./pages/Events/EventsList.jsx";
import EventCreate from "./pages/Events/EventCreate.jsx";
import EventDetails from "./pages/Events/EventDetails.jsx";
import AdminView from "./pages/Admin/AdminView.jsx";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ngo/register" element={<NGOForm />} />
          <Route path="/ngo/:id" element={<NGOProfile />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/create" element={<EventCreate />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/admin" element={<AdminView />} />
        </Route>
      </Routes>
    </Router>
  );
}
