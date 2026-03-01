import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics() {
  const [stats, setStats] = useState({ fake: 0, real: 0 });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/stats")
      .then(res => setStats(res.data));
  }, []);

  const data = {
    labels: ["Real", "Fake"],
    datasets: [
      {
        data: [stats.real, stats.fake],
        backgroundColor: ["#00ffaa", "#ff4d6d"]
      }
    ]
  };

  return (
    <div className="page">
      <h2>Analytics Dashboard</h2>
      <Doughnut data={data} />
    </div>
  );
}

export default Analytics;