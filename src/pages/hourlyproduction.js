import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";

const HourlyProductionForm = () => {
  const [lines, setLines] = useState([
    {
      lineNumber: "",
      articleName: "",
      SAM: "",
      operator: "",
      helper: "",
      shiftTime: 480,
      target100: "",
      target75: "",
      targetPerHour: "",
      hourlyData: Array.from({ length: 8 }, () => ({
        pieces: "",
        efficiency: "",
      })),
    },
    {
      lineNumber: "",
      articleName: "",
      SAM: "",
      operator: "",
      helper: "",
      shiftTime: 480,
      target100: "",
      target75: "",
      targetPerHour: "",
      hourlyData: Array.from({ length: 8 }, () => ({
        pieces: "",
        efficiency: "",
      })),
    },
    {
      lineNumber: "",
      articleName: "",
      SAM: "",
      operator: "",
      helper: "",
      shiftTime: 480,
      target100: "",
      target75: "",
      targetPerHour: "",
      hourlyData: Array.from({ length: 8 }, () => ({
        pieces: "",
        efficiency: "",
      })),
    },
  ]);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;

    if (["SAM", "operator", "helper"].includes(field)) {
      const SAM = parseFloat(updatedLines[index].SAM) || 0;
      const operator = parseInt(updatedLines[index].operator) || 0;
      const helper = parseInt(updatedLines[index].helper) || 0;

      if (SAM > 0) {
        const target100 = (480 * (operator + helper)) / SAM;
        const target75 = target100 * 0.75;
        const targetPerHour = target75 / 8;

        updatedLines[index].target100 = target100.toFixed(2);
        updatedLines[index].target75 = target75.toFixed(2);
        updatedLines[index].targetPerHour = targetPerHour.toFixed(2);
      } else {
        updatedLines[index].target100 = "";
        updatedLines[index].target75 = "";
        updatedLines[index].targetPerHour = "";
      }
    }

    setLines(updatedLines);
  };

  const handleHourlyChange = (lineIndex, hourIndex, value) => {
    const updatedLines = [...lines];
    const pieces = parseFloat(value) || 0;
    const SAM = parseFloat(updatedLines[lineIndex].SAM) || 0;
    const operator = parseInt(updatedLines[lineIndex].operator) || 0;
    const helper = parseInt(updatedLines[lineIndex].helper) || 0;

    if (!updatedLines[lineIndex].hourlyData[hourIndex]) {
      updatedLines[lineIndex].hourlyData[hourIndex] = {
        pieces: "",
        efficiency: "",
      };
    }

    const em = SAM * pieces;
    const am = (operator + helper) * 60;
    const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

    updatedLines[lineIndex].hourlyData[hourIndex] = {
      pieces,
      efficiency,
    };

    setLines(updatedLines);
  };

  const handleSubmit = async () => {
    const filteredLines = lines
      .map((line) => ({
        ...line,
        hourlyData: line.hourlyData.filter((hour) => hour.pieces), // Only keep data with pieces
      }))
      .filter((line) => line.lineNumber && line.articleName); // Only keep non-empty lines

    if (filteredLines.length === 0) {
      alert("Please fill data for at least one line.");
      return;
    }

    try {
      const response = await fetch("/api/hourlyproduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          lines: filteredLines,
        }),
      });

      if (response.ok) {
        alert("Data Saved Successfully!");
      } else {
        alert("Failed to Save Data.");
      }
    } catch (error) {
      alert("An error occurred while saving data.");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hourly Production Target
      </Typography>

      {/* Line Data */}
      <Table sx={{ marginBottom: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Field Name</TableCell>
            {lines.map((_, idx) => (
              <TableCell key={idx}>Line {idx + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            { label: "Line #", key: "lineNumber" },
            { label: "Article Name", key: "articleName" },
            { label: "SAM", key: "SAM" },
            { label: "Operator", key: "operator" },
            { label: "Helper", key: "helper" },
            { label: "Shift Time", key: "shiftTime" },
            { label: "Target 100%", key: "target100" },
            { label: "Target 75%", key: "target75" },
            { label: "Target/Hour", key: "targetPerHour" },
          ].map((field) => (
            <TableRow key={field.key}>
              <TableCell>{field.label}</TableCell>
              {lines.map((line, idx) => (
                <TableCell key={idx}>
                  {[
                    "lineNumber",
                    "articleName",
                    "SAM",
                    "operator",
                    "helper",
                  ].includes(field.key) ? (
                    <TextField
                      value={line[field.key]}
                      onChange={(e) =>
                        handleLineChange(idx, field.key, e.target.value)
                      }
                      placeholder={field.label}
                    />
                  ) : (
                    line[field.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Hourly Data */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hour</TableCell>
            {lines.map((_, idx) => (
              <TableCell key={idx}>Line {idx + 1} (Pieces)</TableCell>
            ))}
            {lines.map((_, idx) => (
              <TableCell key={idx}>Line {idx + 1} (Efficiency)</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {["8-9", "9-10", "10-11", "11-12", "12-1", "2-3", "3-4", "4-5"].map(
            (hour, hourIndex) => (
              <TableRow key={hour}>
                <TableCell>{hour}</TableCell>
                {lines.map((line, lineIndex) => (
                  <TableCell key={lineIndex}>
                    <TextField
                      type="number"
                      value={line.hourlyData[hourIndex]?.pieces || ""}
                      onChange={(e) =>
                        handleHourlyChange(lineIndex, hourIndex, e.target.value)
                      }
                      placeholder="Pieces"
                    />
                  </TableCell>
                ))}
                {lines.map((line, lineIndex) => (
                  <TableCell key={`${lineIndex}-${hourIndex}-efficiency`}>
                    {line.hourlyData[hourIndex]?.efficiency || "0"}%
                  </TableCell>
                ))}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      <Box sx={{ marginTop: 4, textAlign: "right" }}>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default HourlyProductionForm;
