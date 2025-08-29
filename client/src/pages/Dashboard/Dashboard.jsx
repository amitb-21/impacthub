import React from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>
        <h1>Dashboard Page</h1>
        <Card>
          <Badge label="Impact" />
          <Loader />
        </Card>
      </main>
      <Footer />
    </div>
  );
}
