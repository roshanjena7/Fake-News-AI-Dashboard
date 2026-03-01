import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Reports from "./components/Reports";
import Login from "./Login";

import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "app dark" : "app light"}>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={token ? <Dashboard toggleTheme={() => setDark(!dark)} /> : <Navigate to="/login" />}
          />

          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />

          <Route path="/login" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;