import React, { useEffect, useState } from "react";
import HourlyProductionCharts from "../../component/Charts/HourlyProductionCharts";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ChartPage = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);

  // API se available dates fetch karna
  const fetchAvailableDates = async () => {
    try {
      const response = await fetch("/api/hourlyproduction");
      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }
      const data = await response.json();
      const dates = data.map((production) =>
        new Date(production.date).toLocaleDateString("en-CA")
      ); // Fix timezone issue
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      alert("Failed to fetch available dates.");
    }
  };

  // Selected date ka chart data fetch karna
  const fetchChartData = async (date) => {
    try {
      const response = await fetch(
        `/api/hourlyproduction?dates=${JSON.stringify([date])}`
      );
      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }
      const data = await response.json();
      setChartData(data[0]);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      alert("Failed to fetch chart data.");
    }
  };

  useEffect(() => {
    fetchAvailableDates();

    // Add event listener for window resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth); // Initialize width on the client-side
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchChartData(selectedDate);
    }
  }, [selectedDate]);

  // Calendar me available dates highlight karna
  const isDateAvailable = (date) => {
    const formattedDate =
      date instanceof Date ? date.toLocaleDateString("en-CA") : null;
    return formattedDate && availableDates.includes(formattedDate);
  };

  const handleDateChange = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value.toLocaleDateString("en-CA"));
    }
  };

  return (
    <LayoutOfHourlyProduction>
      <Box
        sx={{
          mt: { lg: 10, xs: 8 },
          px: 2,
        }}
      >
        <Grid container spacing={3}>
          {/* Calendar Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select a Date
              </Typography>
              <Calendar
                onChange={handleDateChange}
                tileClassName={({ date }) =>
                  isDateAvailable(date) ? "available-date" : null
                }
                tileDisabled={({ date }) => !isDateAvailable(date)}
              />
            </Paper>
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              {selectedDate ? (
                chartData ? (
                  <HourlyProductionCharts
                    production={chartData}
                    key={windowWidth} // Re-render chart on resize
                  />
                ) : (
                  <Typography variant="body1">
                    Loading chart for {selectedDate}...
                  </Typography>
                )
              ) : (
                <Typography variant="body1">
                  Please select a date to view the chart.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Styles for Calendar */}
      <style jsx>{`
        .available-date {
          background-color: #4caf50;
          color: white;
        }
      `}</style>
    </LayoutOfHourlyProduction>
  );
};

export default ChartPage;
