import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles

// Register necessary components
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

function FloorSummaryChart() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchSummaryData = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/summary/floorsummary?date=${date.toISOString().split("T")[0]}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setSummaryData(null);
        setChartData(null);
        return;
      }
      const data = await response.json();
      setSummaryData(data);

      // Prepare chart data
      setChartData({
        labels: [
          "Total Pieces",
          "Average Efficiency",
          "Total Operators",
          "Total Helpers",
        ],
        datasets: [
          {
            label: `Floor Summary for ${date.toISOString().split("T")[0]}`,
            data: [
              data.totalPieces,
              parseFloat(data.averageEfficiency),
              data.totalOperators,
              data.totalHelpers,
            ],
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching floor summary data:", error);
      setError("An error occurred while fetching floor summary data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchSummaryData(date);
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
            Select a Date:
          </Typography>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="custom-calendar"
          />
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

      {chartData && (
        <Box
          sx={{
            width: "100%",
            maxWidth: isMobile ? "100%" : "900px",
            marginTop: 4,
            padding: 3,
            backgroundColor: "white",
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              height: isMobile ? 300 : 500, // Adjust height based on screen size
            }}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Disable default aspect ratio
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Values",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default FloorSummaryChart;
