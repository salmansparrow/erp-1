import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemButton } from "@mui/material";
import LineWiseEfficiency from "./LineWiseEfficiency";

const HourlyProductionCharts = () => {
  const [productions, setProductions] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const response = await fetch(`/api/hourlyproduction`);
        if (response.ok) {
          const data = await response.json();
          setProductions(data);
          setDates(data.map((prod) => prod.date)); // Extract all dates
        } else {
          console.error("Failed to fetch production data");
        }
      } catch (error) {
        console.error("Error fetching production data:", error);
      }
    };

    fetchProductionData();
  }, []);

  const scrollToChart = (date) => {
    const element = document.getElementById(`chart-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar for Links */}
      <Box sx={{ width: "10%", padding: 2, borderRight: "1px solid #ccc" }}>
        <Typography variant="h6" gutterBottom>
          Available Dates
        </Typography>
        <List>
          {dates.map((date) => (
            <ListItem key={date} disablePadding>
              <ListItemButton onClick={() => scrollToChart(date)}>
                {date}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content for Charts */}
      <Box sx={{ width: "80%", padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Hourly Production Charts
        </Typography>
        {productions.map((production) => (
          <Box
            key={production.date}
            id={`chart-${production.date}`}
            sx={{ marginBottom: 5 }}
          >
            <Typography variant="h5" gutterBottom>
              {`Date: ${production.date}`}
            </Typography>
            <LineWiseEfficiency production={production} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HourlyProductionCharts;
