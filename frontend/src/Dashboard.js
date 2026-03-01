import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChartBox from "./Chart";
import { FaSearch } from "react-icons/fa";
import "./App.css";

function Dashboard() {

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {

    if (!text) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        text: text
      });

      setResult(res.data);

    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">

      <Sidebar />

      <div className="main">

        <h1>Fake News Detection Dashboard</h1>

        <div className="grid">

          <div className="card">

            <h3>Enter News</h3>

            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button onClick={analyze}>
              <FaSearch /> Analyze
            </button>

          </div>

          <div className="card">

            <h3>Result</h3>

            {loading && <div className="loader"></div>}

            {result && (
              <>
                <div className={
                  result.prediction === "Real"
                    ? "badge real"
                    : "badge fake"
                }>
                  {result.prediction}
                </div>

                <p>
                  Confidence:
                  {(result.confidence * 100).toFixed(2)}%
                </p>

                <p>
                  Explanation:
                  {result.explanation}
                </p>
              </>
            )}

          </div>

        </div>

        <ChartBox />

      </div>

    </div>
  );
}

export default Dashboard;