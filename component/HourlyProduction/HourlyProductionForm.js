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
      isLineSaved: false,
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
      isLineSaved: false,
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
      isLineSaved: false,
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
    const pieces = value === "" ? "" : Number(value); // Allow 0 as a valid value
    const SAM = parseFloat(updatedLines[lineIndex].SAM) || 0;
    const operator = parseInt(updatedLines[lineIndex].operator) || 0;
    const helper = parseInt(updatedLines[lineIndex].helper) || 0;

    if (!updatedLines[lineIndex].hourlyData[hourIndex]) {
      updatedLines[lineIndex].hourlyData[hourIndex] = {
        pieces: "",
        efficiency: "",
      };
    }

    const em = SAM * (pieces || 0);
    const am = (operator + helper) * 60;
    const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

    updatedLines[lineIndex].hourlyData[hourIndex] = {
      pieces,
      efficiency,
    };

    setLines(updatedLines);
  };

  const handleSaveLines = async () => {
    const linesToSave = lines.filter(
      (line) => line.lineNumber && line.articleName
    );

    if (linesToSave.length === 0) {
      alert("Please fill in at least one valid line of data.");
      return;
    }

    const payload = {
      date: new Date().toISOString().split("T")[0],
      lines: linesToSave.map((line) => ({
        ...line,
        hourlyData: [],
      })),
    };

    try {
      const response = await fetch("/api/hourlyproduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Line Data Saved Successfully!");
        setLines((prevLines) =>
          prevLines.map((line) => ({
            ...line,
            isLineSaved: true,
          }))
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to save line data: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while saving line data.");
    }
  };

  const handleSaveHourlyData = async (hourIndex) => {
    const hourlyDataToSave = lines.map((line) => ({
      lineNumber: line.lineNumber,
      hourIndex,
      data: {
        pieces: line.hourlyData[hourIndex]?.pieces,
        em:
          parseFloat(line.SAM) *
            parseFloat(line.hourlyData[hourIndex]?.pieces) || 0,
        am: (parseInt(line.operator) + parseInt(line.helper)) * 60 || 0,
        efficiency: line.hourlyData[hourIndex]?.efficiency,
      },
    }));

    try {
      const response = await fetch("/api/hourlydata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hourlyData: hourlyDataToSave }),
      });

      if (response.ok) {
        alert("Hourly Data Saved Successfully!");
        setLines((prevLines) =>
          prevLines.map((line) => {
            line.hourlyData[hourIndex].isSaved = true;
            return line;
          })
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to Save Hourly Data: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while saving hourly data.");
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 5, position: "relative", top: 50 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          textAlign: "center",
          marginBottom: { xs: 2, md: 4 },
        }}
      >
        Hourly Production Target
      </Typography>

      <Box sx={{ overflowX: "auto", marginBottom: 4 }}>
        <Table sx={{ minWidth: { xs: 600, sm: "100%" } }}>
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
                    ].includes(field.key) && !line.isLineSaved ? (
                      <TextField
                        value={line[field.key]}
                        onChange={(e) =>
                          handleLineChange(idx, field.key, e.target.value)
                        }
                        placeholder={field.label}
                        fullWidth
                        size="small"
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
      </Box>

      <Box sx={{ marginBottom: 4, textAlign: "right" }}>
        <Button variant="contained" onClick={handleSaveLines}>
          Save All Lines
        </Button>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hour</TableCell>
              {lines.map((_, idx) => (
                <React.Fragment key={idx}>
                  <TableCell>Line {idx + 1} (Pieces)</TableCell>
                  <TableCell>Line {idx + 1} (Efficiency)</TableCell>
                </React.Fragment>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {["8-9", "9-10", "10-11", "11-12", "12-1", "2-3", "3-4", "4-5"].map(
              (hour, hourIndex) => (
                <TableRow key={hour}>
                  <TableCell>{hour}</TableCell>
                  {lines.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <TableCell>
                        {line.hourlyData[hourIndex]?.isSaved ? (
                          <Typography>
                            {line.hourlyData[hourIndex]?.pieces}
                          </Typography>
                        ) : (
                          <TextField
                            value={
                              line.hourlyData[hourIndex]?.pieces === 0
                                ? "0" // Ensure "0" is displayed
                                : line.hourlyData[hourIndex]?.pieces || "" // Handle empty string
                            }
                            onChange={(e) =>
                              handleHourlyChange(
                                lineIndex,
                                hourIndex,
                                e.target.value
                              )
                            }
                            placeholder="Pieces"
                            fullWidth
                            size="small"
                            type="number"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {line.hourlyData[hourIndex]?.efficiency || "0"}%
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleSaveHourlyData(hourIndex)}
                      disabled={lines.some(
                        (line) =>
                          line.hourlyData[hourIndex]?.pieces === "" ||
                          line.hourlyData[hourIndex]?.isSaved
                      )}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default HourlyProductionForm;
