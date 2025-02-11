import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LineDataForm from "../../../component/HourlyProduction/LineDataForm";
import HourlyDataForm from "../../../component/HourlyProduction/HourlyDataForm";
import LayoutOfHourlyProduction from "../../../component/Layout/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      targetEfficiency: "", // Added this
      target: "",
      targetLabel: "Target", // 👈 Label update hoga
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

    if (["SAM", "operator", "helper", "targetEfficiency"].includes(field)) {
      const SAM = parseFloat(updatedLines[index].SAM) || 0;
      const operator = parseInt(updatedLines[index].operator) || 0;
      const helper = parseInt(updatedLines[index].helper) || 0;
      const targetEfficiency =
        parseFloat(updatedLines[index].targetEfficiency) || 85;

      if (SAM > 0 && operator + helper > 0) {
        const target100 = (480 * (operator + helper)) / SAM;
        const target = (target100 * targetEfficiency) / 100;
        const targetPerHour = target / 8;

        updatedLines[index].target100 = target100.toFixed(2);
        updatedLines[index].target = Math.round(target.toFixed(2)); // 👈 Target update
        updatedLines[index].targetPerHour = targetPerHour.toFixed(2);
      } else {
        updatedLines[index].target100 = "";
        updatedLines[index].target = "";
        updatedLines[index].targetPerHour = "";
        updatedLines[index].targetLabel = "Target";
      }
    }

    if (field === "targetEfficiency") {
      updatedLines[index].targetLabel = "Target";
    }

    setLines(updatedLines);
    console.log("Updated Line Data:", updatedLines[index]); // ✅ Debugging
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
      toast.error("Please fill in at least one valid line of data.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast-error",
      });

      return;
    }
    const payload = {
      date: new Date().toISOString().split("T")[0],
      lines: linesToSave.map((line) => ({
        ...line,
        targetEfficiency: line.targetEfficiency, // 👈 Include targetEfficiency
        hourlyData: [],
      })),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("/api/hourlyproduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success("Line Data saved Successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
        });
        setLines((prevLines) =>
          prevLines.map((line) => ({
            ...line,
            isLineSaved: true,
          }))
        );
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save line data: ${errorData.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast-error",
        });
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
        toast.success("Hourly Data Saved Successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
        });

        setLines((prevLines) =>
          prevLines.map((line) => {
            line.hourlyData[hourIndex].isSaved = true;
            return line;
          })
        );
      } else {
        const errorData = await response.json();
        toast.error(`Failed to Save Hourly Data: ${errorData.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast-error",
        });
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
      <ToastContainer />
    </LayoutOfHourlyProduction>
  );
};

export default HourlyProductionPage;
