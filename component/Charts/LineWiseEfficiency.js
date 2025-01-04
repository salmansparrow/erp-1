import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineWiseEfficiency = ({ production }) => {
  // X-axis labels: Hours
  const hours = production.lines[0].hourlyData.map((data) => data.hour);

  // Y-axis data: Pieces for each line
  const datasets = production.lines.map((line, index) => ({
    label: `Line ${line.lineNumber}`,
    data: line.hourlyData.map((data) => data.pieces),
    backgroundColor: `hsl(${(index + 1) * 60}, 70%, 50%)`,
  }));

  const chartData = {
    labels: hours, // Hours on X-axis
    datasets: datasets, // Lines' production data
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Hourly Production (Date: ${production.date})`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hours",
        },
      },
      y: {
        title: {
          display: true,
          text: "Pieces",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default LineWiseEfficiency;
