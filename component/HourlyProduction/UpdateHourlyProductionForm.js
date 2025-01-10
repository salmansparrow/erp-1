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
  const [showOTForm, setShowOTForm] = useState(false);
  const [otData, setOtData] = useState(
    productionData
      ? productionData.lines.map(() => ({
          hours: "",
          menPower: "",
          pieces: "",
          minutes: 0,
        }))
      : []
  );

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
        setOtData([]);
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch production data.");
      const data = await response.json();
      setProductionData(data[0]);

      const fetchedOtData = data[0].lines.map((line) => ({
        hours: line.otData?.otHours || "",
        menPower: line.otData?.otMenPower || "",
        pieces: line.otData?.otPieces || "",
        minutes: line.otData?.otMinutes || 0,
      }));
      setOtData(fetchedOtData);
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

  const toggleOTForm = () => {
    setShowOTForm(!showOTForm);
  };

  const handleOTChange = (lineIndex, field, value) => {
    const updatedOtData = [...otData];
    updatedOtData[lineIndex][field] = value;

    // Calculate OT Minutes
    const hours = parseFloat(updatedOtData[lineIndex].hours) || 0;
    const menPower = parseFloat(updatedOtData[lineIndex].menPower) || 0;
    updatedOtData[lineIndex].minutes = hours * menPower * 60;

    setOtData(updatedOtData);
  };

  const handleSaveOTForLine = async (lineIndex) => {
    try {
      const ot = otData[lineIndex];
      const payload = {
        date: selectedDate,
        lineNumber: productionData.lines[lineIndex].lineNumber,
        otHours: ot.hours || 0,
        otMenPower: ot.menPower || 0,
        otMinutes: ot.minutes || 0,
        otPieces: ot.pieces || 0,
      };

      console.log("Payload being sent to the API:", payload);

      const response = await fetch("/api/othours/overtime", {
        method: "PUT", // Changed from POST to PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`OT Data for Line ${lineIndex + 1} Saved Successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to Save OT Data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving OT data:", error);
      alert("An error occurred while saving OT data.");
    }
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

    const pieces = value === "" ? "" : Number(value); // Allow 0 as a valid value
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
        lines: productionData.lines.map((line) => ({
          lineNumber: line.lineNumber,
          hourlyData: line.hourlyData.map((hour, idx) => {
            if (idx === hourIndex) {
              const pieces = parseFloat(hour.pieces) || 0;
              const em = line.SAM * (pieces || 0);
              const am = (line.operator + line.helper) * 60 || 0;
              const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

              return {
                ...hour,
                pieces,
                efficiency,
                isSaved: true, // Save status
              };
            }
            return hour;
          }),
        })),
      };

      const response = await fetch("/api/hourlyproduction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Hour ${hourIndex + 1} data saved successfully!`);
        setProductionData((prevData) => {
          const updatedData = { ...prevData };
          updatedData.lines = updatedData.lines.map((line) => ({
            ...line,
            hourlyData: line.hourlyData.map((hour, idx) => {
              if (idx === hourIndex) {
                return { ...hour, isSaved: true }; // Mark as saved
              }
              return hour;
            }),
          }));
          return updatedData;
        });
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
                            value={
                              line.hourlyData[hourIndex]?.pieces === 0
                                ? "0" // Ensure "0" is displayed
                                : line.hourlyData[hourIndex]?.pieces || "" // Handle empty string
                            }
                            onChange={(e) =>
                              handleHourlyChange(idx, hourIndex, e.target.value)
                            }
                            placeholder="Pieces"
                            disabled={
                              line.hourlyData[hourIndex]?.isSaved || false
                            } // Disable if saved
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
                        color={
                          productionData.lines.some(
                            (line) => line.hourlyData[hourIndex]?.isSaved
                          )
                            ? "success" // Change button color if saved
                            : "primary"
                        }
                        onClick={() => handleSaveHourlyData(hourIndex)}
                        disabled={productionData.lines.every(
                          (line) => line.hourlyData[hourIndex]?.isSaved
                        )} // Disable if already saved
                      >
                        {productionData.lines.some(
                          (line) => line.hourlyData[hourIndex]?.isSaved
                        )
                          ? "Saved"
                          : "Save Hour"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Add OT Button */}
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleOTForm}
            >
              {showOTForm ? "Close OT Form" : "Add OT"}
            </Button>
          </Box>
          {/* OT Form */}
          {showOTForm && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">OT Data</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Line</TableCell>
                    <TableCell>OT Hours</TableCell>
                    <TableCell>OT Men Power</TableCell>
                    <TableCell>OT Pieces</TableCell>
                    <TableCell>OT Minutes</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productionData.lines.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell>{`Line ${line.lineNumber}`}</TableCell>
                      <TableCell>
                        <TextField
                          value={otData[index]?.hours || ""}
                          onChange={(e) =>
                            handleOTChange(index, "hours", e.target.value)
                          }
                          type="number"
                          placeholder="OT Hours"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={otData[index]?.menPower || ""}
                          onChange={(e) =>
                            handleOTChange(index, "menPower", e.target.value)
                          }
                          type="number"
                          placeholder="OT Men Power"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={otData[index]?.pieces || ""}
                          onChange={(e) =>
                            handleOTChange(index, "pieces", e.target.value)
                          }
                          type="number"
                          placeholder="OT Pieces"
                        />
                      </TableCell>
                      <TableCell>
                        {otData[index]?.minutes || 0} Minutes
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveOTForLine(index)}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UpdateHourlyProductionWithCalendar;
