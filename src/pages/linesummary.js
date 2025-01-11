import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EnhancedLineChart = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState(null);

  const fetchLineData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }

    try {
      const response = await fetch(
        `/api/hourlyproduction/range?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        alert(`Error fetching data: ${error.message}`);
        return;
      }

      const data = await response.json();

      // Prepare chart data
      const labels = data.map((entry) => entry.date); // Dates as labels
      const datasets = [
        {
          label: "Line 1 Efficiency",
          data: data.map((entry) => entry.lines[0]?.averageEfficiency || 0),
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: true,
          tension: 0.4,
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 7,
          pieces: data.map((entry) => entry.lines[0]?.totalPieces || 0),
        },
        {
          label: "Line 2 Efficiency",
          data: data.map((entry) => entry.lines[1]?.averageEfficiency || 0),
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          fill: true,
          tension: 0.4,
          pointStyle: "triangle",
          pointRadius: 5,
          pointHoverRadius: 7,
          pieces: data.map((entry) => entry.lines[1]?.totalPieces || 0),
        },
        {
          label: "Line 3 Efficiency",
          data: data.map((entry) => entry.lines[2]?.averageEfficiency || 0),
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          fill: true,
          tension: 0.4,
          pointStyle: "rectRounded",
          pointRadius: 5,
          pointHoverRadius: 7,
          pieces: data.map((entry) => entry.lines[2]?.totalPieces || 0),
        },
      ];

      setChartData({ labels, datasets });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Efficiency Trends (${startDate || "Start"} to ${
          endDate || "End"
        })`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const efficiency = context.raw;
            const pieces = context.dataset.pieces[context.dataIndex]; // Access total pieces
            return `Efficiency: ${efficiency}%, Pieces: ${pieces}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Efficiency (%)",
          font: {
            size: 14,
          },
        },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <>
      <LayoutOfHourlyProduction>
        <Box sx={{ padding: 3, position: "relative", top: 50 }}>
          <Typography variant="h4" gutterBottom>
            Efficiency Trends
          </Typography>
          <Grid container spacing={2}>
            {/* Start Date */}
            <Grid item xs={12} md={5}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={5}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Fetch Button */}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={fetchLineData}
              >
                Fetch Data
              </Button>
            </Grid>
          </Grid>

          {/* Line Chart */}
          <Box sx={{ mt: 5, height: { xs: 300, md: 500 } }}>
            {chartData ? (
              <Line data={chartData} options={options} />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Select a date range to view the line chart.
              </Typography>
            )}
          </Box>
        </Box>
      </LayoutOfHourlyProduction>
    </>
  );
};

export default EnhancedLineChart;
