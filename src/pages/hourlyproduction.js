import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from "@mui/material";

const HourlyProductionForm = () => {
  const [lines, setLines] = useState([
    {
      lineNumber: "",
      articleName: "",
      SAM: "",
      operator: "",
      helper: "",
      shiftTime: 8,
      target100: 0,
      target75: 0,
      targetPerHour: 0,
      hourlyData: Array(8).fill({ pieces: "", em: "", am: "" }), // Hourly breakdown
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;

    // Recalculate targets with fixed shift time (480 minutes)
    if (["SAM", "operator", "helper"].includes(field)) {
      const SAM = parseFloat(updatedLines[index].SAM) || 0;
      const operator = parseInt(updatedLines[index].operator) || 0;
      const helper = parseInt(updatedLines[index].helper) || 0;

      const shiftTime = 480; // Fixed shift time in minutes

      if (SAM > 0) {
        const target100 = (shiftTime * (operator + helper)) / SAM;
        const target75 = target100 * 0.75;
        const targetPerHour = target75 / 8; // Convert minutes to hours

        updatedLines[index].target100 = target100.toFixed(2);
        updatedLines[index].target75 = target75.toFixed(2);
        updatedLines[index].targetPerHour = targetPerHour.toFixed(2);
      } else {
        updatedLines[index].target100 = 0;
        updatedLines[index].target75 = 0;
        updatedLines[index].targetPerHour = 0;
      }
    }

    setLines(updatedLines);
  };

  const handleHourlyChange = (lineIndex, hourIndex, field, value) => {
    const updatedLines = [...lines];
    updatedLines[lineIndex].hourlyData[hourIndex][field] = value;
    setLines(updatedLines);
  };

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        lineNumber: "",
        articleName: "",
        SAM: "",
        operator: "",
        helper: "",
        shiftTime: 8,
        target100: 0,
        target75: 0,
        targetPerHour: 0,
        hourlyData: Array(8).fill({ pieces: "", em: "", am: "" }),
      },
    ]);
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", lines);
    // Navigate to the chart page or handle API submission
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hourly Production Target
      </Typography>

      <Paper sx={{ padding: 2, marginTop: 2 }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <TextField
                      value={line.lineNumber}
                      onChange={(e) =>
                        handleInputChange(index, "lineNumber", e.target.value)
                      }
                      placeholder="Line #"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={line.articleName}
                      onChange={(e) =>
                        handleInputChange(index, "articleName", e.target.value)
                      }
                      placeholder="Article Name"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={line.SAM}
                      onChange={(e) =>
                        handleInputChange(index, "SAM", e.target.value)
                      }
                      placeholder="SAM"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={line.operator}
                      onChange={(e) =>
                        handleInputChange(index, "operator", e.target.value)
                      }
                      placeholder="Operator"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={line.helper}
                      onChange={(e) =>
                        handleInputChange(index, "helper", e.target.value)
                      }
                      placeholder="Helper"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>480</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{Math.round(line.target100)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{Math.round(line.target75)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{Math.round(line.targetPerHour)}</Typography>
                  </TableCell>
                </TableRow>

                {/* Hourly Breakdown */}
                <TableRow>
                  <TableCell colSpan={9}>
                    <Collapse in={true}>
                      <Box sx={{ marginTop: 2 }}>
                        <Typography variant="subtitle1">
                          Hourly Breakdown for Line{" "}
                          {line.lineNumber || index + 1}
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
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
                                <TableCell key={hourIndex}>{hour}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              {line.hourlyData.map((hourData, hourIndex) => (
                                <React.Fragment key={hourIndex}>
                                  <TableCell>
                                    <TextField
                                      type="number"
                                      value={hourData.pieces}
                                      onChange={(e) =>
                                        handleHourlyChange(
                                          index,
                                          hourIndex,
                                          "pieces",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Pieces"
                                    />
                                    <TextField
                                      type="number"
                                      value={hourData.em}
                                      onChange={(e) =>
                                        handleHourlyChange(
                                          index,
                                          hourIndex,
                                          "em",
                                          e.target.value
                                        )
                                      }
                                      placeholder="EM"
                                    />
                                    <TextField
                                      type="number"
                                      value={hourData.am}
                                      onChange={(e) =>
                                        handleHourlyChange(
                                          index,
                                          hourIndex,
                                          "am",
                                          e.target.value
                                        )
                                      }
                                      placeholder="AM"
                                    />
                                  </TableCell>
                                </React.Fragment>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ marginTop: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={handleAddLine}
            sx={{ marginRight: 2 }}
          >
            Add Line
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default HourlyProductionForm;
