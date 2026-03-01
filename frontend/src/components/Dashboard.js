import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const API = "http://127.0.0.1:8000";

  const analyzeNews = async () => {
    try {
      const res = await axios.post(`${API}/predict`, { text });
      setResult(res.data);
    } catch {
      alert("Backend error");
    }
  };

  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Navbar />

        {/* INPUT CARD */}
        <motion.div
          className="card glow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Fake News Detection</h2>

          <textarea
            rows="4"
            placeholder="Paste news text..."
            onChange={(e) => setText(e.target.value)}
          />

          <button onClick={analyzeNews} className="primary-btn">
            Analyze News
          </button>
        </motion.div>

        {/* RESULT */}
        {result && (
          <div className="result-grid">

            <motion.div
              className="card"
              whileHover={{ scale: 1.03 }}
            >
              <h3>Prediction</h3>

              <h1
                className={
                  result.prediction === "Fake" ? "fake" : "real"
                }
              >
                {result.prediction}
              </h1>

              <p>Confidence: {result.confidence}%</p>

              <div>
                {result.keywords.map((k, i) => (
                  <span key={i} className="keyword">
                    {k}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="card"
              whileHover={{ scale: 1.03 }}
            >
              <h3>AI Insight</h3>

              <p>
                This prediction is based on linguistic patterns,
                semantic structure and trained ML signals.
              </p>
            </motion.div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;