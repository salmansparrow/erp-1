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
                  <TableCell>{line.lineNumber}</TableCell>
                  <TableCell>{line.articleName}</TableCell>
                  <TableCell>{line.SAM}</TableCell>
                  <TableCell>{line.operator}</TableCell>
                  <TableCell>{line.helper}</TableCell>
                  <TableCell>{line.shiftTime}</TableCell>
                  <TableCell>{line.target100}</TableCell>
                  <TableCell>{line.target75}</TableCell>
                  <TableCell>{line.targetPerHour}</TableCell>
                  <TableCell>
                    {line.hourlyData.map((hour, hourIndex) => (
                      <div key={hourIndex}>
                        <strong>{hour.hour}:</strong> {hour.pieces} pcs,{" "}
                        {hour.efficiency}% efficiency
                      </div>
                    ))}
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
