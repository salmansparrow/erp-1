import React, { useEffect, useState } from "react";
import HourlyProductionCharts from "../../component/Charts/HourlyProductionCharts";

const ChartPage = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Fetch available dates from API
  const fetchAvailableDates = async () => {
    try {
      const response = await fetch("/api/hourlyproduction");
      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }
      const data = await response.json();
      const dates = data.map((production) => production.date);
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      alert("Failed to fetch available dates.");
    }
  };

  // Fetch chart data for the selected date
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
      setChartData(data[0]); // Get the first chart data
    } catch (error) {
      console.error("Error fetching chart data:", error);
      alert("Failed to fetch chart data.");
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchChartData(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar for Dates */}
      <div
        style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
      >
        <h3>Available Dates</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {availableDates.map((date) => (
            <li key={date} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => setSelectedDate(date)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: selectedDate === date ? "#ccc" : "#fff",
                  border: "1px solid #000",
                }}
              >
                {date}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chart Area */}
      <div style={{ width: "80%", padding: "10px" }}>
        {selectedDate ? (
          chartData ? (
            <HourlyProductionCharts production={chartData} />
          ) : (
            <div>Loading chart for {selectedDate}...</div>
          )
        ) : (
          <div>Please select a date to view the chart.</div>
        )}
      </div>
    </div>
  );
};

export default ChartPage;
