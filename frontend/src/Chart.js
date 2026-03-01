import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartBox() {

  const data = {
    labels: ["Real", "Fake"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#00ff9d", "#ff4d4d"]
      }
    ]
  };

  return (
    <div className="card">

      <h3>Statistics</h3>

      <Doughnut data={data} />

    </div>
  );
}

export default ChartBox;