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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HourlyProductionCharts = ({ production }) => {
  const hours = production.lines[0]?.hourlyData.map((data) => data.hour);

  const datasets = production.lines.map((line, index) => ({
    label: `Line ${line.lineNumber}`,
    data: line.hourlyData.map((data) => data.pieces),
    backgroundColor: `hsl(${(index + 1) * 60}, 70%, 50%)`,
  }));

  const chartData = {
    labels: hours,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Hourly Production for ${production.date}`,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default HourlyProductionCharts;
