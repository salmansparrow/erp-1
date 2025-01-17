import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LineDataForm from "../../../component/HourlyProduction/LineDataForm";
import HourlyDataForm from "../../../component/HourlyProduction/HourlyDataForm";
import LayoutOfHourlyProduction from "../../../component/Layout/Layout";

const HourlyProductionPage = () => {
  const [lines, setLines] = useState(
    Array.from({ length: 3 }, () => ({
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
    }))
  );

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
    const pieces = value === "" ? "" : Number(value);

    const SAM = parseFloat(updatedLines[lineIndex].SAM) || 0;
    const operator = parseInt(updatedLines[lineIndex].operator) || 0;
    const helper = parseInt(updatedLines[lineIndex].helper) || 0;

    const em = SAM * pieces;
    const am = (operator + helper) * 60;
    const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

    updatedLines[lineIndex].hourlyData[hourIndex] = { pieces, efficiency };
    setLines(updatedLines);
  };

  const handleSaveLines = async () => {
    // Logic for saving lines
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
        alert("Line Data saved Successfully!");
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
      alert("An error occrred while saving line data");
    }
  };

  const handleSaveHourlyData = async (hourIndex) => {
    // Logic for saving hourly data
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

  const handleFetchPreviousData = async () => {
    // Logic for fetching previous data
    try {
      const response = await fetch("/api/hourlyproduction/previous");
      if (!response.ok) {
        const error = response.json();
        alert(`Failed to fetch previous data: ${error.message}`);
        return;
      }
      const previousData = await response.json();
      // Populate the form with the fetched data
      setLines(
        previousData.lines.map((line) => ({
          ...line,
          isLineSaved: false, // Allow modifications
          hourlyData: Array.from({ length: 8 }, () => ({
            pieces: "",
            efficiency: "",
          })),
        }))
      );
    } catch (error) {
      alert("An error occurred while fetching previous data.");
    }
  };

  return (
    <LayoutOfHourlyProduction>
      <Box sx={{ padding: { xs: 2, md: 5, position: "relative", top: 50 } }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1rem",
              md: "1.5rem",
            },
          }}
        >
          Hourly Production Management
        </Typography>
        <LineDataForm
          lines={lines}
          handleLineChange={handleLineChange}
          handleSaveLines={handleSaveLines}
          handleFetchPreviousData={handleFetchPreviousData}
        />
        <HourlyDataForm
          lines={lines}
          handleHourlyChange={handleHourlyChange}
          handleSaveHourlyData={handleSaveHourlyData}
        />
      </Box>
    </LayoutOfHourlyProduction>
  );
};

export default HourlyProductionPage;
