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
  // Define hours including the break statically
  const hours = [
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm (Break)", // Static entry for break
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
  ];

  // Adjust datasets to include a break time with empty data
  const datasets =
    production.lines.map((line, index) => {
      const lineData = line.hourlyData.map(
        (data) => (data?.pieces > 0 ? data.efficiency : 0) // Show efficiency as 0 if pieces are 0
      );

      // Insert a null value for the break time
      lineData.splice(4, 0, null); // Insert null at index 4 (for 1 PM - 2 PM)

      return {
        label: `Line ${line.lineNumber || `Unknown`}`,
        data: lineData,
        backgroundColor: `hsl(${(index + 1) * 60}, 70%, 50%)`,
      };
    }) || []; // Default to an empty array if no data

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
        text: `Hourly Production Efficiency for ${production.date || "N/A"}`,
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
            return efficiency === null
              ? "Break Time" // Show "Break Time" for null values
              : `Efficiency: ${efficiency}%`;
          },
        },
      },
      datalabels: {
        anchor: "center",
        align: "center",
        formatter: (value) => (value === null ? "" : `${value}%`), // No label for break time
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
