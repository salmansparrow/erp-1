import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BackdatedLineDataForm from "../../component/HourlyProduction/BackdatedLineDataForm";
import BackdatedHourlyDataForm from "../../component/HourlyProduction/BackdatedHourlyDataForm";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackdatedHourlyProductionPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
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
        isSaved: false,
      })),
    }))
  );

  const handleDateChange = (date) => {
    // Format the date and set it to `selectedDate`

    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);

    // Reset all fields when date changes
    setLines(
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
          isSaved: false,
        })),
      }))
    );

    // Optionally clear any errors or previous state related to the old date
    toast.info("Fields reset for the selected date.", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;

    if (["SAM", "operator", "helper"].includes(field)) {
      const SAM = parseFloat(updatedLines[index].SAM) || 0;
      const operator = parseInt(updatedLines[index].operator) || 0;
      const helper = parseInt(updatedLines[index].helper) || 0;

      if (SAM > 0) {
        const shiftTime = 480; // 8 hours shift
        const target100 = (shiftTime * (operator + helper)) / SAM;
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

    // ✅ Allow user to input "0" correctly
    const pieces = value === "" ? "" : value;

    // const pieces = parseFloat(value) || 0;
    const SAM = parseFloat(updatedLines[lineIndex].SAM) || 0;
    const operator = parseInt(updatedLines[lineIndex].operator) || 0;
    const helper = parseInt(updatedLines[lineIndex].helper) || 0;

    // const em = SAM * pieces;
    const em = SAM * (parseFloat(value) || 0); // "0" should work fine now
    const am = (operator + helper) * 60;
    const efficiency = am > 0 ? Math.round((em / am) * 100) : 0;

    updatedLines[lineIndex].hourlyData[hourIndex] = { pieces, efficiency };
    setLines(updatedLines);
  };

  const handleSaveLines = async () => {
    if (!selectedDate) {
      toast.error("Please select a date for backdated data entry.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const linesToSave = lines.filter(
      (line) => line.lineNumber && line.articleName
    );
    if (linesToSave.length === 0) {
      toast.error("Please fill in at least one valid line of data.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      date: selectedDate.format("YYYY-MM-DD"),
      lines: linesToSave.map((line) => ({
        ...line,
        hourlyData: [],
      })),
    };

    try {
      const response = await fetch("/api/backdate/backdatedlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Backdated Line Data saved successfully!", {
          position: "top-center",
          autoClose: 3000,
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
        });
      }
    } catch (error) {
      toast.error("An error occurred while saving line data.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleSaveHourlyData = async (hourIndex) => {
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
      const response = await fetch("/api/backdate/backdatedhourlydata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate.format("YYYY-MM-DD"),
          hourlyData: hourlyDataToSave,
        }),
      });

      if (response.ok) {
        toast.success("Hourly Data saved successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        setLines((prevLines) =>
          prevLines.map((line) => {
            line.hourlyData[hourIndex].isSaved = true; // Mark as saved
            return line;
          })
        );
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save hourly data: ${errorData.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while saving hourly data.", {
        position: "top-center",
        autoClose: 3000,
      });
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
      <Box sx={{ padding: { xs: 2, md: 5 }, position: "relative", top: 50 }}>
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
          Backdated Hourly Production Management
        </Typography>
        <BackdatedLineDataForm
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          lines={lines}
          handleLineChange={handleLineChange}
          handleSaveLines={handleSaveLines}
          handleFetchPreviousData={handleFetchPreviousData}
        />
        <BackdatedHourlyDataForm
          lines={lines}
          handleHourlyChange={handleHourlyChange}
          handleSaveHourlyData={handleSaveHourlyData}
        />
      </Box>
      <ToastContainer />
    </LayoutOfHourlyProduction>
  );
};

export default BackdatedHourlyProductionPage;
