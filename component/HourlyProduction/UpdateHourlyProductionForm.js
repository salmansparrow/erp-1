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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const UpdateHourlyProductionWithCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductionData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/hourlyproduction/?dates=${JSON.stringify([date])}`
      );
      if (response.status === 404) {
        setProductionData(null);
        setError("No production data found for the selected date.");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch production data.");
      const data = await response.json();
      setProductionData(data[0]);
    } catch (error) {
      console.error("Error fetching production data:", error);
      setError("Failed to fetch production data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    setSelectedDate(formattedDate);
    fetchProductionData(formattedDate);
  };

  const handleLineDetailsChange = (lineIndex, field, value) => {
    const updatedProduction = { ...productionData };
    updatedProduction.lines[lineIndex][field] = value;

    // Recalculate Targets
    const line = updatedProduction.lines[lineIndex];
    const SAM = parseFloat(line.SAM) || 0;
    const operator = parseInt(line.operator) || 0;
    const helper = parseInt(line.helper) || 0;

    if (SAM > 0) {
      const shiftTime = 480;
      const target100 = (shiftTime * (operator + helper)) / SAM;
      const target75 = target100 * 0.75;
      const targetPerHour = target75 / 8;

      line.shiftTime = shiftTime;
      line.target100 = target100.toFixed(2);
      line.target75 = target75.toFixed(2);
      line.targetPerHour = targetPerHour.toFixed(2);
    } else {
      line.shiftTime = 0;
      line.target100 = "";
      line.target75 = "";
      line.targetPerHour = "";
    }

    setProductionData(updatedProduction);
  };

  const handleHourlyChange = (lineIndex, hourIndex, value) => {
    const updatedProduction = { ...productionData };
    const line = updatedProduction.lines[lineIndex];

    const pieces = parseFloat(value) || 0;
    const SAM = parseFloat(line.SAM) || 0;
    const operator = parseInt(line.operator) || 0;
    const helper = parseInt(line.helper) || 0;

    const efficiency =
      operator + helper > 0
        ? ((pieces * SAM) / ((operator + helper) * 60)) * 100
        : 0;

    line.hourlyData[hourIndex] = {
      pieces,
      efficiency: efficiency.toFixed(2),
    };

    setProductionData(updatedProduction);
  };

  const handleSaveLineDetails = async () => {
    try {
      const payload = {
        date: productionData.date,
        lines: productionData.lines,
      };

      const response = await fetch("/api/hourlyproduction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Line details updated successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to update line details: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating line details:", error);
      alert("Failed to update line details.");
    }
  };

  const handleSaveHourlyData = async (hourIndex) => {
    try {
      const payload = {
        date: productionData.date,
        lines: productionData.lines.map((line) => {
          const SAM = parseFloat(line.SAM) || 0;
          const operator = parseInt(line.operator) || 0;
          const helper = parseInt(line.helper) || 0;

          return {
            lineNumber: line.lineNumber,
            hourlyData: line.hourlyData.map((hour, idx) => {
              if (idx === hourIndex) {
                const pieces = parseFloat(hour.pieces) || 0;
                const em = SAM * pieces;
                const am = (operator + helper) * 60;
                // const efficiency = am > 0 ? ((em / am) * 100).toFixed(2) : 0;
                const efficiency = am > 0 ? Math.round((em / am) * 100) : 0; // Round efficiency

                return {
                  ...hour,
                  em: em.toFixed(2),
                  am: am.toFixed(2),
                  efficiency,
                };
              }
              return hour;
            }),
          };
        }),
      };

      const response = await fetch("/api/hourlyproduction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Hour ${hourIndex + 1} data saved successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update hourly data: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating hourly data:", error);
      alert("Failed to update hourly data.");
    }
  };

  return (
    <Box sx={{ padding: 3, position: "relative", top: 50 }}>
      <Typography variant="h4" gutterBottom>
        Update Hourly Production
      </Typography>

      {/* Calendar */}
      <Box sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" gutterBottom>
          Select a Date:
        </Typography>
        <Calendar onChange={handleDateChange} />
      </Box>

      {loading && <Typography>Loading data...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {productionData && (
        <>
          {/* Line Details Form */}
          <Box>
            <Typography variant="h6">Line Details</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  {productionData.lines.map((line, index) => (
                    <TableCell
                      key={index}
                    >{`Line ${line.lineNumber}`}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {["articleName", "SAM", "operator", "helper"].map((field) => (
                  <TableRow key={field}>
                    <TableCell>{field}</TableCell>
                    {productionData.lines.map((line, index) => (
                      <TableCell key={index}>
                        <TextField
                          value={line[field] || ""}
                          onChange={(e) =>
                            handleLineDetailsChange(
                              index,
                              field,
                              e.target.value
                            )
                          }
                          placeholder={field}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>Shift Time</TableCell>
                  {productionData.lines.map((line, index) => (
                    <TableCell key={index}>{line.shiftTime || "480"}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Target 100%</TableCell>
                  {productionData.lines.map((line, index) => (
                    <TableCell key={index}>{line.target100 || "0"}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Target 75%</TableCell>
                  {productionData.lines.map((line, index) => (
                    <TableCell key={index}>{line.target75 || "0"}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Target/Hour</TableCell>
                  {productionData.lines.map((line, index) => (
                    <TableCell key={index}>
                      {line.targetPerHour || "0"}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveLineDetails}
              >
                Save Line Details
              </Button>
            </Box>
          </Box>

          {/* Hourly Data Form */}
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6">Hourly Data</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hour</TableCell>
                  {productionData.lines.map((_, idx) => (
                    <>
                      <TableCell key={`pieces-${idx}`}>
                        {`Line ${idx + 1} (Pieces)`}
                      </TableCell>

                      <TableCell key={`efficiency-${idx}`}>
                        {`Line ${idx + 1}  (Efficiency)`}
                      </TableCell>
                    </>
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
                    {productionData.lines.map((line, idx) => (
                      <>
                        <TableCell key={`pieces-${hourIndex}-${idx}`}>
                          <TextField
                            value={line.hourlyData[hourIndex]?.pieces || ""}
                            onChange={(e) =>
                              handleHourlyChange(idx, hourIndex, e.target.value)
                            }
                            placeholder="Pieces"
                          />
                        </TableCell>
                        <TableCell key={`efficiency-${hourIndex}-${idx}`}>
                          {Math.round(
                            line.hourlyData[hourIndex]?.efficiency || 0
                          )}
                          %
                        </TableCell>
                      </>
                    ))}
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleSaveHourlyData(hourIndex)}
                      >
                        Save Hour
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UpdateHourlyProductionWithCalendar;
