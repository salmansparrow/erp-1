import React, { useState, useEffect } from "react";
import HourlyProductionCharts from "../../component/Charts/HourlyProductionCharts";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ChartPage = ({
  availableDates = [],
  initialChartData = null,
  initialSelectedDate = null,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [chartData, setChartData] = useState(initialChartData);
  const [windowWidth, setWindowWidth] = useState(null);

  // Resize listener for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth); // Initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch chart data on date selection
  const fetchChartData = async (date) => {
    try {
      const response = await fetch(
        `/api/hourlyproduction?dates=${JSON.stringify([date])}`
      );
      if (!response.ok) {
        const error = await response.json();
        console.error("Error fetching chart data:", error);
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
    if (selectedDate && selectedDate !== initialSelectedDate) {
      fetchChartData(selectedDate);
    }
  }, [selectedDate]);

  const isDateAvailable = (date) => {
    const formattedDate =
      date instanceof Date ? date.toLocaleDateString("en-CA") : null;
    return formattedDate && availableDates.includes(formattedDate);
  };

  const handleDateChange = (value) => {
    if (value instanceof Date) {
      const formattedDate = value.toLocaleDateString("en-CA");
      setSelectedDate(formattedDate);
    }
  };

  return (
    <LayoutOfHourlyProduction>
      <Box sx={{ mt: { lg: 10, xs: 8 }, px: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select a Date:
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
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              {selectedDate ? (
                chartData ? (
                  <HourlyProductionCharts
                    production={chartData}
                    key={windowWidth}
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
      <style jsx>{`
        .available-date {
          background-color: #4caf50;
          color: white;
        }
      `}</style>
    </LayoutOfHourlyProduction>
  );
};

export async function getServerSideProps(context) {
  const selectedDate = context.query.date || null;

  try {
    // Fetch available dates
    const datesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hourlyproduction`
    );
    if (!datesResponse.ok) {
      throw new Error("Failed to fetch available dates.");
    }
    const availableDatesData = await datesResponse.json();
    const availableDates = availableDatesData.map((item) =>
      new Date(item.date).toLocaleDateString("en-CA")
    );

    // Fetch initial chart data if a date is selected
    let initialChartData = null;
    if (selectedDate) {
      const chartResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/hourlyproduction?dates=${JSON.stringify([selectedDate])}`
      );
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        initialChartData = chartData[0] || null;
      }
    }

    return {
      props: {
        availableDates,
        initialChartData,
        initialSelectedDate: selectedDate || null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        availableDates: [],
        initialChartData: null,
        initialSelectedDate: null,
      },
    };
  }
}

export default ChartPage;
