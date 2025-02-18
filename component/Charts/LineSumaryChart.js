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
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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
  const [availableLines, setAvailableLines] = useState([]); // For dynamically fetched lines
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Updated color palette with 3 colors
  const colorPalette = [
    "rgba(0, 123, 255, 0.5)", // Blue
    "rgba(255, 0, 0, 0.5)", // Red
    "rgba(255, 165, 0, 0.5)", // Orange
  ];

  const fetchLineData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates!");
      return;
    }

    try {
      const response = await fetch(
        `/api/hourlyproduction/range?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        setError(`Error fetching data: ${error.message}`);
        return;
      }

      const data = await response.json();

      // Fetch available lines (could be a part of the response or another API call)
      const linesFromAPI = data[0]?.lines || []; // Assuming the first entry has line data
      setAvailableLines(linesFromAPI); // Set the dynamic line data

      // Dynamically generate labels and datasets
      const labels = data.map((entry) => entry.date); // Dates as labels

      // **Earned aur Available Minutes ka sum calculate karo**

      // Dynamically generate datasets for each available line
      const datasets = linesFromAPI.map((line, index) => {
        const lineData = data.map((entry) => {
          const lineEfficiency = entry.lines.find(
            (entryLine) => entryLine.lineNumber === line.lineNumber
          );
          return lineEfficiency ? lineEfficiency.averageEfficiency : 0;
        });

        return {
          label: `${line.name || `Line ${line.lineNumber}`} Efficiency`, // Use dynamic line name
          data: lineData,
          borderColor: colorPalette[index % colorPalette.length], // Cycle through color palette
          backgroundColor: colorPalette[index % colorPalette.length], // Apply same color for background
          fill: false,
        };
      });

      setChartData({ labels, datasets });
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data.");
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
    <Box
      sx={{
        padding: { xs: 2, md: 5 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        position: "relative",
        top: 50,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.8rem", md: "2.5rem" },
          textAlign: "center",
          marginBottom: 2,
          fontWeight: 600,
        }}
      >
        Efficiency Trends
      </Typography>

      <Card
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 500,
          boxShadow: 3,
          padding: 2,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Select Start Date and End Date:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={fetchLineData}
              sx={{ alignSelf: "center" }}
            >
              Fetch Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Typography variant="h6" color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      {chartData && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            marginTop: 4,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 2,
            borderRadius: 2,
            height: isMobile ? "400px" : "600px",
          }}
        >
          <Line data={chartData} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default EnhancedLineChart;
