import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Collapse,
  TextField,
} from "@mui/material";

function ViewLineData() {
  const [lines, setLines] = useState([]);
  const [editingLineIndex, setEditingLineIndex] = useState(null);
  const [newHourlyData, setNewHourlyData] = useState([]);

  useEffect(() => {
    const fetchLines = async () => {
      const date = new Date().toISOString().split("T")[0]; // Today's date
      try {
        const response = await fetch(`/api/hourlyproduction?date=${date}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data);
          setLines(data.lines || []);
        } else {
          const error = await response.json();
          console.error("Error:", error.message);
          alert(`Error fetching data: ${error.message}`);
        }
      } catch (error) {
        console.error("Error fetching lines:", error);
        alert("Failed to fetch data.");
      }
    };

    fetchLines();
  }, []);

  const handleEditClick = (index) => {
    setEditingLineIndex(index);

    const totalHours = 8; // Total number of hours to show
    const existingHourlyData = lines[index].hourlyData.map((hour) => ({
      pieces: hour.pieces || "",
      em: hour.em || "",
      am: hour.am || "",
      efficiency: hour.efficiency || "",
    }));

    // Add empty entries for missing hours
    const fullHourlyData = Array.from(
      { length: totalHours },
      (_, hourIndex) => {
        return (
          existingHourlyData[hourIndex] || {
            pieces: "",
            em: "",
            am: "",
            efficiency: "",
          }
        );
      }
    );

    setNewHourlyData(fullHourlyData);
  };

  const handleHourlyChange = (hourIndex, field, value) => {
    const updatedHourlyData = [...newHourlyData];
    updatedHourlyData[hourIndex][field] = value;

    if (field === "pieces") {
      const pieces = parseFloat(value) || 0;
      const line = lines[editingLineIndex];

      // Calculate `em`, `am`, and `efficiency`
      const em = line.SAM ? pieces * line.SAM : 0; // Efficiency Minute
      const am = (line.operator + line.helper) * 60; // Available Minute
      const efficiency = am > 0 ? Math.round((em / am) * 100) : 0; // Efficiency Percentage

      updatedHourlyData[hourIndex].em = em.toFixed(2);
      updatedHourlyData[hourIndex].am = am.toFixed(2);
      updatedHourlyData[hourIndex].efficiency = efficiency;
    }

    setNewHourlyData(updatedHourlyData);
  };

  const handleSave = async (lineIndex) => {
    const currentLine = lines[lineIndex];

    // Filter only updated hourly data
    const updatedHourlyData = newHourlyData.filter(
      (hour) => hour.pieces !== "" && hour.pieces !== null
    );

    if (updatedHourlyData.length === 0) {
      alert("Please enter data for at least one hour.");
      return;
    }

    try {
      const response = await fetch(`/api/hourlyproduction`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          lineNumber: currentLine.lineNumber,
          updatedHourlyData, // Send full hourly data with calculated values
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update hourly data.");
      }

      const updatedData = await response.json();
      console.log("Updated Data from Backend:", updatedData);

      // Update the specific line's hourlyData in state
      setLines((prevLines) =>
        prevLines.map((line, idx) =>
          idx === lineIndex
            ? updatedData.production.lines.find(
                (l) => l.lineNumber === currentLine.lineNumber
              )
            : line
        )
      );

      setEditingLineIndex(null);
      alert("Hourly data updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        View Line Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Line #</TableCell>
            <TableCell>Article Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>{line.lineNumber}</TableCell>
                <TableCell>{line.articleName}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <Collapse in={editingLineIndex === index}>
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="subtitle1">
                        Edit Hourly Data for Line {line.lineNumber}
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
                            {newHourlyData.map((hourData, hourIndex) => (
                              <TableCell key={hourIndex}>
                                <TextField
                                  type="number"
                                  value={hourData.pieces}
                                  onChange={(e) =>
                                    handleHourlyChange(
                                      hourIndex,
                                      "pieces",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Pieces"
                                  disabled={
                                    editingLineIndex !== index &&
                                    hourData.pieces !== ""
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Box sx={{ textAlign: "right", marginTop: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSave(index)}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default ViewLineData;
