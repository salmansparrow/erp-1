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
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const AddBackdatedHourlyProductionForm = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
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
        isSaved: false,
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
        isSaved: false,
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
        isSaved: false,
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

    const em = SAM * pieces;
    const am = (operator + helper) * 60;
    const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

    updatedLines[lineIndex].hourlyData[hourIndex] = {
      ...updatedLines[lineIndex].hourlyData[hourIndex],
      pieces,
      efficiency,
    };

    setLines(updatedLines);
  };

  const handleSaveHourlyData = async (lineIndex, hourIndex) => {
    const hourlyData = lines[lineIndex].hourlyData[hourIndex];

    if (!hourlyData.pieces) {
      alert("Please enter the pieces for this hour.");
      return;
    }

    try {
      const payload = {
        hourlyData: [
          {
            lineNumber: lines[lineIndex].lineNumber,
            hourIndex,
            data: {
              pieces: hourlyData.pieces,
              efficiency: hourlyData.efficiency,
              em:
                parseFloat(lines[lineIndex].SAM) *
                parseFloat(hourlyData.pieces),
              am:
                (parseInt(lines[lineIndex].operator) +
                  parseInt(lines[lineIndex].helper)) *
                60,
            },
          },
        ],
        entryDate: selectedDate.format("YYYY-MM-DD"),
      };

      const response = await fetch("/api/hourlydata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Hourly data saved successfully!");
        const updatedLines = [...lines];
        updatedLines[lineIndex].hourlyData[hourIndex].isSaved = true;
        setLines(updatedLines);
      } else {
        const error = await response.json();
        alert(`Failed to save hourly data: ${error.message}`);
      }
    } catch (error) {
      alert("An error occurred while saving hourly data.");
      console.error(error);
    }
  };

  const handleSaveLines = async () => {
    const payload = {
      date: selectedDate.format("YYYY-MM-DD"),
      lines,
    };

    try {
      const response = await fetch("/api/hourlyproduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("All line data saved successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to save line data: ${error.message}`);
      }
    } catch (error) {
      alert("An error occurred while saving line data.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: { xs: 2, md: 5 },
          mt: {
            lg: 10,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: { xs: 2, md: 4 },
          }}
        >
          Add Backdated Hourly Production
        </Typography>

        {/* Date Picker */}
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
          <Typography variant="h6">Select Date</Typography>
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            disableFuture
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
          />
        </Paper>

        {/* Line Data Form */}
        <Box sx={{ overflowX: "auto", marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field Name</TableCell>
                {lines.map((_, idx) => (
                  <TableCell key={idx}>Line {idx + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {["lineNumber", "articleName", "SAM", "operator", "helper"].map(
                (key) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    {lines.map((line, idx) => (
                      <TableCell key={idx}>
                        <TextField
                          value={line[key]}
                          onChange={(e) =>
                            handleLineChange(idx, key, e.target.value)
                          }
                          fullWidth
                          size="small"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" onClick={handleSaveLines}>
              Save All Lines
            </Button>
          </Box>
        </Box>

        {/* Hourly Data Table */}
        <Box sx={{ overflowX: "auto", marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hour</TableCell>
                {lines.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <TableCell>Line {idx + 1} (Pieces)</TableCell>
                    <TableCell>Line {idx + 1} (Efficiency)</TableCell>
                    <TableCell>Action</TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                "8-9",
                "9-10",
                "10-11",
                "11-12",
                "12-1",
                "2-3",
                "3-4",
                "4-5",
              ].map((hour, hourIndex) => (
                <TableRow key={hour}>
                  <TableCell>{hour}</TableCell>
                  {lines.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <TableCell>
                        <TextField
                          value={line.hourlyData[hourIndex]?.pieces || ""}
                          onChange={(e) =>
                            handleHourlyChange(
                              lineIndex,
                              hourIndex,
                              e.target.value
                            )
                          }
                          fullWidth
                          size="small"
                          disabled={line.hourlyData[hourIndex]?.isSaved}
                        />
                      </TableCell>
                      <TableCell>
                        {line.hourlyData[hourIndex]?.efficiency || "0"}%
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleSaveHourlyData(lineIndex, hourIndex)
                          }
                          disabled={line.hourlyData[hourIndex]?.isSaved}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddBackdatedHourlyProductionForm;
