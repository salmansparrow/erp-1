import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const BackdatedLineDataForm = ({
  selectedDate,
  setSelectedDate,
  lines,
  handleLineChange,
  handleSaveLines,
  handleFetchPreviousData,
}) => {
  const [disabledDates, setDisabledDates] = useState();

  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await fetch("/api/backdate/fetchbackdatedata");
        if (response.ok) {
          const data = await response.json();
          setDisabledDates(data);
        } else {
          console.error("Failed to fetch disabled dates.");
        }
      } catch (error) {
        console.error("Error fetching disabled dates:", error);
      }
    };
    fetchDisabledDates();
  }, []);

  const isDateDisabled = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return disabledDates.includes(formattedDate);
  };

  const handleDateChange = (newDate) => {
    if (isDateDisabled(dayjs(newDate))) {
      alert("This date already has data. Please select another date.");
      return;
    }
    setSelectedDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginBottom: 4,
            textAlign: {
              xs: "center",
              md: "right",
            },
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            disableFuture
            shouldDisableDate={(date) => isDateDisabled(dayjs(date))}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
          />
        </Paper>
        <Box sx={{ marginBottom: 4, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchPreviousData}
          >
            Load Previous Data
          </Button>
        </Box>
        <Box sx={{ overflowX: "auto", marginBottom: 4 }}>
          <Table sx={{ minWidth: { xs: 600, sm: "100%" } }}>
            <TableHead>
              <TableRow>
                <TableCell>Field Name</TableCell>
                {lines.map((_, idx) => (
                  <TableCell key={idx}>Line {idx + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { label: "Line #", key: "lineNumber" },
                { label: "Article Name", key: "articleName" },
                { label: "SAM", key: "SAM" },
                { label: "Operator", key: "operator" },
                { label: "Helper", key: "helper" },
                { label: "Shift Time", key: "shiftTime" },
                { label: "Target 100%", key: "target100" },
                { label: "Target 75%", key: "target75" },
                { label: "Target/Hour", key: "targetPerHour" },
              ].map((field) => (
                <TableRow key={field.key}>
                  <TableCell>{field.label}</TableCell>
                  {lines.map((line, idx) => (
                    <TableCell key={idx}>
                      {[
                        "lineNumber",
                        "articleName",
                        "SAM",
                        "operator",
                        "helper",
                      ].includes(field.key) ? (
                        <TextField
                          value={line[field.key]}
                          onChange={(e) =>
                            handleLineChange(idx, field.key, e.target.value)
                          }
                          placeholder={field.label}
                          fullWidth
                          size="small"
                        />
                      ) : (
                        line[field.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ marginBottom: 4, textAlign: "right" }}>
          <Button variant="contained" onClick={handleSaveLines}>
            Save All Lines
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BackdatedLineDataForm;
