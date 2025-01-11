import React, { useEffect, useState } from "react";
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
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth > 1200 ? 800 : window.innerWidth - 50, // Larger size for desktop
    height:
      window.innerWidth > 1200 ? 500 : window.innerWidth < 600 ? 400 : 450, // Larger size for desktop
  });

  // Update chart size dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      const width =
        window.innerWidth > 1200
          ? 800 // Large size for laptop/desktop
          : window.innerWidth - 50; // Small size for mobile/tablet
      const height =
        window.innerWidth > 1200
          ? 500 // Larger height for desktop
          : window.innerWidth < 600
          ? 400 // Smaller height for mobile
          : 450; // Medium height for tablets
      setChartSize({ width, height });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    maintainAspectRatio: false, // Allows dynamic resizing
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
          size:
            window.innerWidth > 1200 ? 16 : window.innerWidth < 600 ? 10 : 14, // Adjust font size based on screen size
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

  return (
    <div
      style={{
        width: chartSize.width,
        height: chartSize.height,
        margin: "0 auto",
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HourlyProductionCharts;
