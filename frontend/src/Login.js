import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API = "http://127.0.0.1:8000";

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">

      {/* Background Glow */}
      <div className="bg-blur"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>FakeNews AI</h1>
        <p>AI Powered Fake News Detection</p>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </motion.div>

    </div>
  );
}

export default Login;