import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HourlyProductionDisplay = () => {
  const [productions, setProductions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProduction, setSelectedProduction] = useState(null);

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

  const handleDateChange = (date) => {
    setSelectedDate(date.toLocaleDateString("en-CA"));
    const production = productions.find(
      (prod) => prod.date === date.toLocaleDateString("en-CA")
    );
    setSelectedProduction(production || null);
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 9; i <= 12; i++) {
      hours.push(`${i}:00 AM`);
    }
    for (let i = 1; i <= 5; i++) {
      if (i === 2) continue; // Skip 2:00 PM for the break
      hours.push(`${i}:00 PM`);
    }
    return hours;
  };

  const hours = generateHours();

  // Helper function to calculate total pieces and average efficiency

  const calculateTotals = (hourlyData = []) => {
    const totalPieces = hourlyData.reduce((sum, hour) => {
      return sum + (hour?.pieces || 0); // Check if hour is defined and get pieces
    }, 0);

    const totalEfficiency = hourlyData.reduce((sum, hour) => {
      return sum + (hour?.efficiency || 0); // Check if hour is defined and get efficiency
    }, 0);

    const avgEfficiency =
      hourlyData.length > 0
        ? (totalEfficiency / hourlyData.length).toFixed(2)
        : 0;

    return { totalPieces, avgEfficiency };
  };

  return (
    <Box sx={{ padding: 5, position: "relative", top: 60 }}>
      <Typography variant="h4" gutterBottom>
        Hourly Production Data
      </Typography>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select a Date
        </Typography>
        <Calendar
          onChange={handleDateChange}
          tileDisabled={({ date }) => {
            const formattedDate = date.toLocaleDateString("en-CA");
            return !productions.some((prod) => prod.date === formattedDate);
          }}
        />
      </Paper>

      {selectedProduction ? (
        <Box>
          {/* Total Production and Efficiency */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#e9ecef",
                  }}
                  colSpan={selectedProduction.lines.length * 2 + 1} // Spans across the table
                >
                  {`Date: ${selectedProduction.date}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  Total Production
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  Total Efficiency
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {/* Calculate Total Production */}
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: "#f0f8ff",
                  }}
                >
                  {selectedProduction.lines.reduce((total, line) => {
                    const { totalPieces } = calculateTotals(line.hourlyData);
                    const otPieces = line.otData?.otPieces || 0;
                    return total + totalPieces + otPieces;
                  }, 0)}{" "}
                  {/* Total Production */}
                </TableCell>

                {/* Calculate Total Efficiency */}
                <TableCell
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: "#f0f8ff",
                  }}
                >
                  {(() => {
                    let totalEM = 0;
                    let totalAM = 0;
                    selectedProduction.lines.forEach((line) => {
                      const { totalPieces } = calculateTotals(line.hourlyData);
                      const otPieces = line.otData?.otPieces || 0;
                      const SAM = line.SAM || 0;

                      const EM = (totalPieces + otPieces) * SAM;
                      const availableMinutes =
                        (line.operator + line.helper) * line.shiftTime;
                      const otMinutes = line.otData?.otMinutes || 0;
                      const AM = availableMinutes + otMinutes;

                      totalEM += EM;
                      totalAM += AM;
                    });

                    return totalAM > 0
                      ? ((totalEM / totalAM) * 100).toFixed(2)
                      : 0;
                  })()}{" "}
                  % {/* Total Efficiency */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" gutterBottom>
            {`Date: ${selectedProduction.date}`}
          </Typography>
          <Table sx={{ border: "2px solid black", borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid black" }}>Line</TableCell>
                {selectedProduction.lines.map((line, idx) => (
                  <TableCell
                    key={idx}
                    colSpan={2}
                    sx={{
                      border: "1px solid black",
                      textAlign: "center",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    {line.lineNumber || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
              {[
                { label: "Article", key: "articleName" },
                { label: "SAM", key: "SAM" },
                { label: "Operator", key: "operator" },
                { label: "Helper", key: "helper" },
                { label: "Shift Time", key: "shiftTime" },
                { label: "Available Minutes", key: "availableMinutes" }, // New column
                { label: "Target 100%", key: "target100" },
                { label: "Target 75%", key: "target75" },
                { label: "Target / Hour", key: "targetPerHour" },
              ].map((field, fieldIdx) => (
                <TableRow key={fieldIdx}>
                  <TableCell sx={{ border: "1px solid black" }}>
                    {field.label}
                  </TableCell>
                  {selectedProduction.lines.map((line, lineIdx) => {
                    // Calculate Available Minutes
                    let value = line[field.key] || 0;
                    if (field.key === "availableMinutes") {
                      value =
                        (line.operator + line.helper) * line.shiftTime || 0;
                    }
                    return (
                      <TableCell
                        key={lineIdx}
                        colSpan={2}
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {/* Add OT Data Row */}
              {selectedProduction.lines.some((line) => line.otData) && (
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid black", fontWeight: "bold" }}
                  >
                    OT Data (After 5:00 PM)
                  </TableCell>

                  {selectedProduction.lines.map((line, lineIdx) => {
                    const { otHours, otMenPower, otPieces, otMinutes } =
                      line.otData || {};
                    return (
                      <React.Fragment key={lineIdx}>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            backgroundColor: "#f0f8ff",
                          }}
                          colSpan={2}
                        >
                          <Typography variant="body2">
                            Hours: {otHours || 0}, Men Power: {otMenPower || 0}
                          </Typography>
                          <Typography variant="body2">
                            Pieces: {otPieces || 0}, Minutes: {otMinutes || 0}
                          </Typography>
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              )}

              <TableRow>
                <TableCell sx={{ border: "1px solid black" }}>Hours</TableCell>
                {selectedProduction.lines.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      Output
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      Effi %
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {hours.map((hour, hourIdx) => (
                <TableRow key={hourIdx}>
                  <TableCell sx={{ border: "1px solid black" }}>
                    {hour}
                  </TableCell>
                  {selectedProduction.lines.map((line, lineIdx) => {
                    const hourlyData = line.hourlyData[hourIdx] || {};
                    return (
                      <React.Fragment key={lineIdx}>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {hourlyData.pieces || 0}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {hourlyData.efficiency || 0}%
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              ))}

              <TableRow>
                <TableCell
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  Totals
                </TableCell>
                {selectedProduction.lines.map((line, lineIdx) => {
                  const { totalPieces, avgEfficiency } = calculateTotals(
                    line.hourlyData
                  );
                  return (
                    <React.Fragment key={lineIdx}>
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {totalPieces}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {avgEfficiency}%
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>

              {/* OT Pieces and Efficiency Row */}
              {selectedProduction.lines.some((line) => line.otData) && (
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid black", fontWeight: "bold" }}
                  >
                    OT Data
                  </TableCell>
                  {selectedProduction.lines.map((line, lineIdx) => {
                    const { otPieces, otMinutes, otHours, otMenPower } =
                      line.otData || {};
                    const SAM = line.SAM || 0;

                    // Calculate OT Efficiency
                    const otEfficiency =
                      otMinutes > 0
                        ? ((otPieces * SAM) / (otMenPower * 60 * otHours)) * 100
                        : 0;

                    return (
                      <React.Fragment key={lineIdx}>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {otPieces || 0}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {otEfficiency.toFixed(2)}%
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              )}
              {/* Grand Totals and Efficiency */}
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  Grand Total
                </TableCell>
                {selectedProduction.lines.map((line, lineIdx) => {
                  const hourlyData = line.hourlyData || []; // Ensure default empty array
                  const { totalPieces, avgEfficiency } =
                    calculateTotals(hourlyData);

                  const otData = line.otData || {}; // Ensure default object
                  const otPieces = otData.otPieces || 0;
                  const SAM = line.SAM || 0;

                  // Grand Total Pieces
                  const grandTotalPieces = totalPieces + otPieces;

                  // Effective Minutes (EM)
                  const EM = grandTotalPieces * SAM;

                  // Available Minutes (AM)
                  const availableMinutes =
                    (line.operator + line.helper) * line.shiftTime;
                  const otMinutes = otData.otMinutes || 0;
                  const AM = availableMinutes + otMinutes;

                  // Grand Efficiency
                  const grandEfficiency =
                    AM > 0 ? ((EM / AM) * 100).toFixed(2) : 0;

                  return (
                    <React.Fragment key={lineIdx}>
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                          fontWeight: "bold",
                          backgroundColor: "#f0f8ff",
                        }}
                      >
                        {grandTotalPieces} {/* Grand Total Pieces */}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                          fontWeight: "bold",
                          backgroundColor: "#f0f8ff",
                        }}
                      >
                        {grandEfficiency}% {/* Grand Efficiency */}
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      ) : selectedDate ? (
        <Typography variant="body1">
          No production data available for the selected date.
        </Typography>
      ) : (
        <Typography variant="body1">
          Please select a date to view the production data.
        </Typography>
      )}
    </Box>
  );
};

export default HourlyProductionDisplay;
