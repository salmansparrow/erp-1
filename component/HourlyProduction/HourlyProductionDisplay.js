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
  calculateEarnedMinutes,
  calculateShiftMinutes,
  calculateTotalAvailableMinutes,
  calculateTotals,
  generateHours,
  tableHeaders,
  calculateOTEfficiency,
  calculateGrandEfficiency,
  calculateHourlyTotalPieces,
} from "../../utils/utils";
import { handleDownloadExcel } from "../../utils/ExcelUtils";

const HourlyProductionDisplay = () => {
  const [productions, setProductions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProduction, setSelectedProduction] = useState(null);

  const hourlyTotals = calculateHourlyTotalPieces(selectedProduction.lines);

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

          {/* Added section for new 3 cells */}
          <Table sx={{ border: "2px solid black", marginBottom: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  Production / Target
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  Day Target @
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  Achieved Efficiency
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid black", textAlign: "center" }}
                >
                  {selectedProduction.lines.reduce(
                    (sum, line) => sum + (line.totalPieces || 0),
                    0
                  )}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid black", textAlign: "center" }}
                >
                  {selectedProduction.lines.reduce(
                    (sum, line) => sum + (line.target || 0),
                    0
                  )}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid black", textAlign: "center" }}
                >
                  {(() => {
                    const totalEM = selectedProduction.lines.reduce(
                      (sum, line) =>
                        sum +
                        line.hourlyData.reduce(
                          (hourSum, hour) => hourSum + (hour.em || 0),
                          0
                        ),
                      0
                    );

                    const totalAM = selectedProduction.lines.reduce(
                      (sum, line) =>
                        sum +
                        line.hourlyData.reduce(
                          (hourSum, hour) => hourSum + (hour.am || 0),
                          0
                        ),
                      0
                    );

                    const achievedEfficiency =
                      totalAM > 0 ? (totalEM / totalAM) * 100 : 0;

                    return `${achievedEfficiency.toFixed(2)}%`;
                  })()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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
                    const hourlyDataemam = line.hourlyData || [];

                    // Sum EM values
                    const totalEM = hourlyDataemam.reduce(
                      (sum, hour) => sum + (hour.em || 0),
                      0
                    );

                    // Sum AM values
                    const totalAM = hourlyDataemam.reduce(
                      (sum, hour) => sum + (hour.am || 0),
                      0
                    );

                    // Fetch OT Data
                    const otMinutes = line.otData?.otMinutes || 0;

                    // ✅ OT Efficiency Calculation
                    if (field.key === "otEfficiency") {
                      value = calculateOTEfficiency(otMinutes, totalAM);
                    }

                    // Handle specific fields
                    if (field.key === "targetEfficiency") {
                      value = `${line.targetEfficiency || 85}%`;
                    } else if (field.key === "target") {
                      value = line.target || 0;
                    }

                    if (field.key === "otPieces") {
                      value = line.otData?.otPieces || 0;
                    }
                    if (field.key === "otHours") {
                      value = line.otData?.otHours || 0;
                    }
                    if (field.key === "otMenPower") {
                      value = line.otData?.otMenPower || 0;
                    }
                    if (field.key === "otMinutes") {
                      value = line.otData?.otMinutes || 0;
                    }

                    // Shift Minutes Calculation
                    if (field.key === "shiftMinutes") {
                      value = calculateShiftMinutes(
                        line.shiftTime,
                        line.operator,
                        line.helper
                      );
                    }

                    // Total Available Minutes Calculation
                    if (field.key === "totalAvailableMinutes") {
                      const shiftMinutes = calculateShiftMinutes(
                        line.shiftTime,
                        line.operator,
                        line.helper
                      );
                      value = calculateTotalAvailableMinutes(
                        shiftMinutes,
                        line.otData?.otMinutes || 0
                      );
                    }

                    // Target 100% Calculation (with Math.round)
                    if (field.key === "target100") {
                      value = Math.round(line.target100 || 0);
                    }

                    // Target / Hour Calculation (with Math.round)
                    if (field.key === "targetPerHour") {
                      value = Math.round(line.targetPerHour || 0);
                    }

                    // Earned Minutes Calculation (with Math.round)
                    if (field.key === "earnedMinutes") {
                      const totalLinePieces = calculateTotals(
                        line.hourlyData
                      ).totalPieces;
                      value = Math.round(
                        calculateEarnedMinutes(
                          line.SAM,
                          totalLinePieces,
                          line.otData?.otPieces || 0
                        )
                      );
                    }

                    return (
                      <TableCell
                        key={lineIdx}
                        colSpan={2}
                        sx={{ border: "1px solid black", textAlign: "center" }}
                      >
                        {value}
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
                          {Math.round(hourlyData.efficiency || 0)}%
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
                  const grandEfficiency = calculateGrandEfficiency(
                    earnedMinutes,
                    totalAvailableMinutes
                  );

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
