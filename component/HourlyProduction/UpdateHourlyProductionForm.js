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
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProductionData = async (date) => {
    setLoading(true);
    setError(null); // Reset error state
    setSuccessMessage(""); // Reset success state
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
      setProductionData(data[0]); // Assuming single date data
    } catch (error) {
      console.error("Error fetching production data:", error);
      setError("Failed to fetch production data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA"); // 'YYYY-MM-DD' format
    setSelectedDate(formattedDate);
    fetchProductionData(formattedDate);
  };

  const handleFieldChange = (lineIndex, field, value) => {
    const updatedProduction = { ...productionData };
    updatedProduction.lines[lineIndex][field] = value;
    setProductionData(updatedProduction);
  };

  const handleHourlyChange = (lineIndex, hourIndex, field, value) => {
    const updatedProduction = { ...productionData };
    updatedProduction.lines[lineIndex].hourlyData[hourIndex][field] = value;
    setProductionData(updatedProduction);
  };

  const handleSave = async () => {
    try {
      for (const line of productionData.lines) {
        const payload = {
          date: productionData.date,
          lineNumber: line.lineNumber,
          updatedHourlyData: line.hourlyData,
        };

        const response = await fetch("/api/hourlyproduction", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          alert(`Failed to update line ${line.lineNumber}: ${error.message}`);
          return;
        }
      }
      alert("All lines updated successfully!");
    } catch (error) {
      console.error("Error updating production data:", error);
      alert("Failed to update production data.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Hourly Production
      </Typography>

      {/* Calendar */}
      <Box
        sx={{
          marginBottom: 4,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select a Date:
        </Typography>
        <Calendar onChange={handleDateChange} />
      </Box>

      {/* Feedback Messages */}
      {loading && <Typography>Loading data...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && (
        <Typography color="success">{successMessage}</Typography>
      )}

      {/* Production Data Table */}
      {productionData ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            {`Date: ${productionData.date}`}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                {productionData.lines.map((line, index) => (
                  <TableCell key={index}>{`Line ${line.lineNumber}`}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Line Details */}
              {["articleName", "SAM", "operator", "helper", "shiftTime"].map(
                (field) => (
                  <TableRow key={field}>
                    <TableCell>{field}</TableCell>
                    {productionData.lines.map((line, index) => (
                      <TableCell key={index}>
                        <TextField
                          value={line[field] || ""}
                          onChange={(e) =>
                            handleFieldChange(index, field, e.target.value)
                          }
                          placeholder={field}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )}
              {/* Hourly Data */}
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
                  {productionData.lines.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <TableCell>
                        <TextField
                          value={line.hourlyData[hourIndex]?.pieces || ""}
                          onChange={(e) =>
                            handleHourlyChange(
                              lineIndex,
                              hourIndex,
                              "pieces",
                              e.target.value
                            )
                          }
                          placeholder="Pieces"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={line.hourlyData[hourIndex]?.efficiency || ""}
                          onChange={(e) =>
                            handleHourlyChange(
                              lineIndex,
                              hourIndex,
                              "efficiency",
                              e.target.value
                            )
                          }
                          placeholder="Efficiency"
                        />
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: "50%" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      ) : selectedDate ? (
        <Typography>No data available for this date.</Typography>
      ) : null}
    </Box>
  );
};

export default UpdateHourlyProductionWithCalendar;
