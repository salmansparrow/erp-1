import React, { useEffect, useState } from "react";
import LineWiseEfficiency from "../../component/Charts/LineWiseEfficiency";
import HourlyProductionCharts from "../../component/Charts/HourlyProductionCharts";

const ChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedDates, setSelectedDates] = useState(["2025-01-04"]); // Default dates

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `/api/hourlyproduction?dates=${JSON.stringify(selectedDates)}`
      );
      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      alert("Failed to fetch chart data.");
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedDates]);

  if (chartData.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <HourlyProductionCharts />
      {/* <h1>Hourly Production Charts</h1>
      {chartData.map((production, index) => (
        <div key={index}>
          <h2>{`Date: ${production.date}`}</h2>
          <LineWiseEfficiency production={production} />
        </div>
      ))} */}
    </div>
  );
};

export default ChartPage;
