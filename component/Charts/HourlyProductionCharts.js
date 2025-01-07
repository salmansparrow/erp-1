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
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);

const HourlyProductionCharts = ({ production }) => {
  const hours = production.lines[0]?.hourlyData.map((_, index) => {
    const startHour = 9 + index + (index >= 4 ? 1 : 0); // Skip 1:00 pm to 2:00 pm
    const isPM = startHour >= 12;
    const hour12Format = startHour > 12 ? startHour - 12 : startHour;
    const suffix = isPM ? "pm" : "am";
    return `${hour12Format}:00 ${suffix}`;
  });

  const datasets = production.lines.map((line, index) => ({
    label: `Line ${line.lineNumber}`,
    data: line.hourlyData.map((data) => data.efficiency), // Use efficiency for bar height
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
        text: `Hourly Production Efficiency for ${production.date}`,
      },
      annotation: {
        annotations: {
          benchmark: {
            type: "line",
            yMin: 80,
            yMax: 80,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "Benchmark 80%",
              enabled: true,
              position: "end",
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const efficiency = context.raw;
            return `Efficiency: ${efficiency}%`;
          },
        },
      },
      datalabels: {
        anchor: "center",
        align: "center",
        formatter: (value) => `${value}%`,
        color: "white",
        font: {
          weight: "bold",
          size: 14,
        },
        rotation: 270, // Rotate the text vertically
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Efficiency (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default HourlyProductionCharts;
