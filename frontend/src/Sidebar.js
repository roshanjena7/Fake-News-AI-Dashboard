import React from "react";
import { FaBrain, FaChartBar } from "react-icons/fa";

function Sidebar() {

  return (
    <div className="sidebar">

      <h2><FaBrain /> FakeNews AI</h2>

      <ul>
        <li className="active">Dashboard</li>
        <li>Analytics</li>
        <li>Reports</li>
      </ul>

    </div>
  );
}

export default Sidebar;