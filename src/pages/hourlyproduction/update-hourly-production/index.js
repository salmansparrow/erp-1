import React, { useEffect, useState } from "react";
import CalendarComponent from "../../../../component/UpdateHourlyProduction/CalendarComponent ";
import LineDetailsComponent from "../../../../component/UpdateHourlyProduction/LineDetailsComponent";
import HourlyDataComponent from "../../../../component/UpdateHourlyProduction/HourlyDataComponent";
import OTFormComponent from "../../../../component/UpdateHourlyProduction/OTFormComponent";
import { Box, Button, Typography } from "@mui/material";
import LayoutOfHourlyProduction from "../../../../component/Layout/Layout";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateHourlyProductionWithCalendar = () => {
  const router = useRouter();
  const { date } = router.query; // Extract `date` from URL
  const [selectedDate, setSelectedDate] = useState(date || null);
  const [productionData, setProductionData] = useState({ date: "", lines: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otData, setOtData] = useState([]);
  const [showOTForm, setShowOTForm] = useState(false);

  // Fetch production data for the selected date
  const fetchProductionData = async (date) => {
    setLoading(true);
    setError(null);
    // Reset states when fetching new data
    setProductionData({ date, lines: [] });
    setOtData([]); // Reset OT data
    try {
      const response = await fetch(
        `/api/hourlyproduction/?dates=${JSON.stringify([date])}`
      );
      if (response.status === 404) {
        setProductionData({ date, lines: [] }); // No production data for this date
        setOtData([]);
        setError("No production data found for the selected date.");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch production data.");

      const data = await response.json();
      const fetchedOtData =
        data[0]?.lines.map((line) => ({
          hours: line.otData?.otHours || "",
          menPower: line.otData?.otMenPower || "",
          pieces: line.otData?.otPieces || "",
          minutes: line.otData?.otMinutes || 0,
        })) || [];
      setProductionData(data[0] || { date, lines: [] });
      setOtData(fetchedOtData);
    } catch (error) {
      console.error("Error fetching production data:", error);
      setError("Failed to fetch production data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when `date` changes
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
      fetchProductionData(date);
    }
  }, [date]);

  // Handle date change from the calendar
  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    setSelectedDate(formattedDate);

    // Reset states when switching dates
    setProductionData({ date: formattedDate, lines: [] });
    setOtData([]);

    // Update the URL to reflect the selected date
    router.push(
      `/hourlyproduction/update-hourly-production/${formattedDate}`,
      undefined,
      {
        shallow: true,
      }
    );

    fetchProductionData(formattedDate);
  };

  // Toggle OT form visibility
  const toggleOTForm = () => {
    setShowOTForm((prev) => !prev);
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
        toast.success(`OT Data for Line ${lineIndex + 1} Saved Successfully!`, {
          position: "top-center",
          autoClose: 3000,
        });

        // Clear saved OT data fields
        setOtData((prev) =>
          prev.map((item, idx) =>
            idx === lineIndex
              ? { hours: "", menPower: "", pieces: "", minutes: 0 }
              : item
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to Save OT Data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving OT data:", error);
      alert("An error occurred while saving OT data.");
    }
  };

  // Handle changes in line details
  const handleLineDetailsChange = (lineIndex, field, value) => {
    const updatedProduction = { ...productionData };
    const line = updatedProduction.lines[lineIndex];
    line[field] = value;

    // Recalculate targets and shift time
    const SAM = parseFloat(line.SAM) || 0;
    const operator = parseInt(line.operator) || 0;
    const helper = parseInt(line.helper) || 0;

    if (SAM > 0) {
      const shiftTime = 480; // Default shift time in minutes
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

  // Handle hourly data changes
  const handleHourlyChange = (lineIndex, hourIndex, value) => {
    const updatedProduction = { ...productionData };
    const line = updatedProduction.lines[lineIndex];

    const pieces = value === "" ? "" : Number(value);
    const SAM = parseFloat(line.SAM) || 0;
    const operator = parseInt(line.operator) || 0;
    const helper = parseInt(line.helper) || 0;

    const efficiency =
      operator + helper > 0
        ? ((pieces * SAM) / ((operator + helper) * 60)) * 100
        : 0;

    if (!line.hourlyData) {
      line.hourlyData = Array.from({ length: 8 }, () => ({
        pieces: "",
        efficiency: "",
      }));
    }

    line.hourlyData[hourIndex] = {
      pieces,
      efficiency: efficiency.toFixed(2),
    };

    setProductionData(updatedProduction);
  };

  // Save updated line details
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
        toast.success("Line details updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
        });
      } else {
        const error = await response.json();
        toast.error(`Failed to update line details: ${error.message}`, {
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
      console.error("Error updating line details:", error);
      toast.error("Failed to update line details.", {
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
  };

  // Save hourly data
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
        toast.success(
          `Hourly data for hour ${hourIndex + 1} saved successfully!`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "custom-toast",
          }
        );
      } else {
        const error = await response.json();
        toast.error(`Failed to update hourly data: ${error.message}`, {
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
      console.error("Error updating hourly data:", error);
      toast.error("Failed to update hourly data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <LayoutOfHourlyProduction>
        <Box sx={{ padding: 3, position: "relative", top: 50 }}>
          <Typography variant="h4">Update Hourly Production</Typography>
          <CalendarComponent onDateChange={handleDateChange} />
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {productionData.lines.length > 0 && (
            <>
              <LineDetailsComponent
                productionData={productionData}
                handleLineDetailsChange={handleLineDetailsChange}
                handleSaveLineDetails={handleSaveLineDetails}
              />
              <HourlyDataComponent
                productionData={productionData}
                handleHourlyChange={handleHourlyChange}
                handleSaveHourlyData={handleSaveHourlyData}
              />
              <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={toggleOTForm}
                >
                  {showOTForm ? "Close OT Form" : "Add OT"}
                </Button>
              </Box>
              {showOTForm && (
                <OTFormComponent
                  productionData={productionData}
                  otData={otData}
                  handleOTChange={handleOTChange}
                  handleSaveOTForLine={handleSaveOTForLine}
                />
              )}
            </>
          )}
        </Box>
        <ToastContainer />
      </LayoutOfHourlyProduction>
    </>
  );
};

export default UpdateHourlyProductionWithCalendar;
