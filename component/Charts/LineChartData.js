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
} from "chart.js";
import { Box, Typography, TextField, Button, Grid, Grid2 } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartData = () => {
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
          backgroundColor: "rgba(0, 0, 255, 0.2)",
        },
        {
          label: "Line 2 Efficiency",
          data: data.map((entry) => entry.lines[1]?.averageEfficiency || 0),
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
        },
        {
          label: "Line 3 Efficiency",
          data: data.map((entry) => entry.lines[2]?.averageEfficiency || 0),
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
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
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Efficiency Trends from ${startDate || "Start"} to ${
          endDate || "End"
        }`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Efficiency (%)",
        },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Efficiency Trends
      </Typography>
      <Grid2 container spacing={2}>
        {/* Start Date */}
        <Grid2 item xs={12} md={5}>
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
        </Grid2>

        {/* End Date */}
        <Grid2 item xs={12} md={5}>
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
        </Grid2>

        {/* Fetch Button */}
        <Grid2 item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={fetchLineData}
          >
            Fetch Data
          </Button>
        </Grid2>
      </Grid2>

      {/* Line Chart */}
      <Box sx={{ mt: 5 }}>
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <Typography variant="body1" color="textSecondary">
            Select a date range to view the line chart.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LineChartData;
