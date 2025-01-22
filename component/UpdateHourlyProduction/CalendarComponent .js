import { Box, Typography } from "@mui/material";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
function CalendarComponent({ onDateChange }) {
  return (
    <>
      <Box
        sx={{
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select a Date:
        </Typography>
        <Calendar onChange={onDateChange} />
      </Box>
    </>
  );
}

export default CalendarComponent;
