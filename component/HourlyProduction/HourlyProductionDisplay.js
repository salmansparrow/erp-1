import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const HourlyProductionDisplay = () => {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const response = await fetch("/api/hourlyproduction");
        if (response.ok) {
          const data = await response.json();
          setProductions(data);
        } else {
          const errorData = await response.json();
          alert(`Error fetching data: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error fetching production data:", error);
        alert("An error occurred while fetching production data.");
      }
    };

    fetchProductionData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hourly Production Data
      </Typography>
      {productions.map((production) => (
        <Box key={production.date} sx={{ marginBottom: 4 }}>
          <Typography variant="h6">{`Date: ${production.date}`}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Line #</TableCell>
                <TableCell>Article Name</TableCell>
                <TableCell>SAM</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Helper</TableCell>
                <TableCell>Shift Time</TableCell>
                <TableCell>Target 100%</TableCell>
                <TableCell>Target 75%</TableCell>
                <TableCell>Target/Hour</TableCell>
                <TableCell>Hourly Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {production.lines.map((line, lineIndex) => (
                <TableRow key={lineIndex}>
                  <TableCell>{line.lineNumber || "N/A"}</TableCell>
                  <TableCell>{line.articleName || "N/A"}</TableCell>
                  <TableCell>{line.SAM || 0}</TableCell>
                  <TableCell>{line.operator || 0}</TableCell>
                  <TableCell>{line.helper || 0}</TableCell>
                  <TableCell>{line.shiftTime || 0}</TableCell>
                  <TableCell>{line.target100 || 0}</TableCell>
                  <TableCell>{line.target75 || 0}</TableCell>
                  <TableCell>{line.targetPerHour || 0}</TableCell>
                  <TableCell>
                    {line.hourlyData && line.hourlyData.length > 0 ? (
                      line.hourlyData.map((hour, hourIndex) => (
                        <div key={hourIndex}>
                          <strong>{hour?.hour || "N/A"}:</strong>{" "}
                          {hour?.pieces || 0} pcs, {hour?.efficiency || 0}%
                          efficiency
                        </div>
                      ))
                    ) : (
                      <div>No hourly data</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}
    </Box>
  );
};

export default HourlyProductionDisplay;
