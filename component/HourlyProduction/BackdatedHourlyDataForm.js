import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const BackdatedHourlyDataForm = ({
  lines,
  handleHourlyChange,
  handleSaveHourlyData,
}) => (
  <Box sx={{ overflowX: "auto" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Hour</TableCell>
          {lines.map((_, idx) => (
            <React.Fragment key={idx}>
              <TableCell>Line {idx + 1} (Pieces)</TableCell>
              <TableCell>Line {idx + 1} (Efficiency)</TableCell>
            </React.Fragment>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {["8-9", "9-10", "10-11", "11-12", "12-1", "2-3", "3-4", "4-5"].map(
          (hour, hourIndex) => (
            <TableRow key={hour}>
              <TableCell>{hour}</TableCell>
              {lines.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  <TableCell>
                    <TextField
                      value={line.hourlyData[hourIndex]?.pieces || ""}
                      onChange={(e) =>
                        handleHourlyChange(lineIndex, hourIndex, e.target.value)
                      }
                      placeholder="Pieces"
                      fullWidth
                      size="small"
                      type="number"
                      disabled={line.hourlyData[hourIndex]?.isSaved} // Check isSaved correctly
                    />
                  </TableCell>
                  <TableCell>
                    {line.hourlyData[hourIndex]?.efficiency || "0"}%
                  </TableCell>
                </React.Fragment>
              ))}
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleSaveHourlyData(hourIndex)}
                  disabled={lines.every(
                    (line) => line.hourlyData[hourIndex]?.isSaved
                  )} // Disable Save button if all lines for this hour are saved
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  </Box>
);

export default BackdatedHourlyDataForm;
