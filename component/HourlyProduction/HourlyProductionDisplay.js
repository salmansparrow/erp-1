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
  Button,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  calculateTotals,
  generateHours,
  tableHeaders,
} from "../../utils/utils";
import { handleDownloadExcel } from "../../utils/ExcelUtils";

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

  const hours = generateHours();

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownloadExcel(selectedProduction)}
            sx={{ marginBottom: 3 }}
          >
            Download as Excel
          </Button>

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
              {tableHeaders.map((field, fieldIdx) => (
                <TableRow key={fieldIdx}>
                  <TableCell sx={{ border: "1px solid black" }}>
                    {field.label}
                  </TableCell>
                  {selectedProduction.lines.map((line, lineIdx) => {
                    let value = line[field.key] || 0;

                    // Shift Minutes Calculation
                    if (field.key === "shiftMinutes") {
                      value = (line.operator + line.helper) * line.shiftTime;
                    }

                    // Total Available Minutes = Shift Minutes + OT Minutes
                    else if (field.key === "totalAvailableMinutes") {
                      const shiftMinutes =
                        (line.operator + line.helper) * line.shiftTime;
                      const otMinutes = line.otData?.otMinutes || 0;
                      value = shiftMinutes + otMinutes;
                    }

                    // Earned Minutes = SAM * (Total Pieces + OT Pieces)
                    else if (field.key === "earnedMinutes") {
                      const { totalPieces } = calculateTotals(line.hourlyData);
                      const otPieces = line.otData?.otPieces || 0;
                      value = line.SAM * (totalPieces + otPieces);
                    }

                    // OT Data Handling
                    else if (field.key === "otPieces") {
                      value = line.otData?.otPieces || 0;
                    } else if (field.key === "otHours") {
                      value = line.otData?.otHours || 0;
                    } else if (field.key === "otMenPower") {
                      value = line.otData?.otMenPower || 0;
                    } else if (field.key === "otMinutes") {
                      value = line.otData?.otMinutes || 0;
                    }

                    return (
                      <TableCell
                        key={lineIdx}
                        colSpan={2}
                        sx={{ border: "1px solid black", textAlign: "center" }}
                      >
                        {field.key === "earnedMinutes"
                          ? value.toFixed(2) // Earned Minutes ko 2 decimal places mein show karein
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {/* Render Hourly Data */}
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

              {/* Render Totals */}
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  Totals
                </TableCell>
                {selectedProduction.lines.map((line, lineIdx) => {
                  const { totalPieces } = calculateTotals(line.hourlyData);

                  const target100 = line.target100;
                  const avgEfficiency =
                    target100 > 0 ? (totalPieces / target100) * 100 : 0;

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
                        {avgEfficiency.toFixed(2)}%
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>

              {/* Render OT Data */}
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

              {/* Render Grand Totals */}
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
                  const { totalPieces } = calculateTotals(line.hourlyData);

                  const otPieces = line.otData?.otPieces || 0;
                  const grandTotalPieces = totalPieces + otPieces;

                  const SAM = line.SAM || 0;
                  const EM = grandTotalPieces * SAM;
                  const availableMinutes =
                    (line.operator + line.helper) * line.shiftTime;
                  const otMinutes = line.otData?.otMinutes || 0;
                  const AM = availableMinutes + otMinutes;

                  const shiftMinutes =
                    (line.operator + line.helper) * line.shiftTime;
                  const totalAvailableMinutes = shiftMinutes + otMinutes;
                  const earnedMinutes = SAM * (totalPieces + otPieces);

                  // Ensure totalAvailableMinutes is not zero
                  const grandEfficiency =
                    totalAvailableMinutes > 0
                      ? (earnedMinutes / totalAvailableMinutes) * 100
                      : 0;

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
                        {grandTotalPieces}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          textAlign: "center",
                          fontWeight: "bold",
                          backgroundColor: "#f0f8ff",
                        }}
                      >
                        {grandEfficiency.toFixed(2)}%
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
