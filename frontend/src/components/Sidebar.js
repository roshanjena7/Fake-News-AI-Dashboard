import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">

      <h2 className="logo">🧠 FakeNews</h2>

      <Link to="/">Dashboard</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/reports">Reports</Link>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Sidebar;