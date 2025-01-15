import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Chart } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FloorSummaryChart() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchSummaryData = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/summary/floorsummary?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setSummaryData([]);
        return;
      }
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching floor summary data:", error);
      setError("An error occurred while fetching floor summary data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (startDate && endDate) {
      fetchSummaryData(startDate, endDate);
    } else {
      setError("Please select both start and end dates.");
    }
  };

  const createComboChartData = () => {
    if (!Array.isArray(summaryData) || summaryData.length === 0) {
      return null;
    }

    return {
      labels: summaryData.map((entry) => entry.date), // Dates as labels
      datasets: [
        {
          type: "bar",
          label: "Total Production",
          data: summaryData.map((entry) => entry.totalProduction),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          yAxisID: "y", // Bar chart uses primary Y-axis
        },
        {
          type: "line",
          label: "Efficiency (%)",
          data: summaryData.map((entry) => entry.efficiency),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          yAxisID: "y1", // Line chart uses secondary Y-axis
        },
      ],
    };
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
        Floor Summary
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
              onClick={handleFetch}
              sx={{ alignSelf: "center" }}
            >
              Fetch Summary
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {Array.isArray(summaryData) && summaryData.length > 0 && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "900px",
            marginTop: 4,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 2,
            borderRadius: 2,
            width: "100%",
            maxWidth: "900px",
            marginTop: 4,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 2,
            borderRadius: 2,
            height: isMobile ? "400px" : "600px", // Adjust height based on screen size
          }}
        >
          <Chart
            type="bar"
            data={createComboChartData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  type: "linear",
                  display: true,
                  position: "left",
                  title: {
                    display: true,
                    text: "Total Production (Pieces)",
                  },
                },
                y1: {
                  type: "linear",
                  display: true,
                  position: "right",
                  title: {
                    display: true,
                    text: "Efficiency (%)",
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default FloorSummaryChart;
