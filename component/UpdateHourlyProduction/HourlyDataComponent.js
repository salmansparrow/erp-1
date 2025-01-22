import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";

const HourlyDataComponent = ({
  productionData,
  handleHourlyChange,
  handleSaveHourlyData,
}) => {
  if (!productionData || !productionData.lines) return null;

  return (
    <Box>
      <Typography variant="h6">Hourly Data</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hour</TableCell>
            {productionData.lines.map((_, idx) => (
              <>
                <TableCell key={`pieces-${idx}`}>{`Line ${
                  idx + 1
                } (Pieces)`}</TableCell>
                <TableCell key={`efficiency-${idx}`}>{`Line ${
                  idx + 1
                } (Efficiency)`}</TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {["8-9", "9-10", "10-11", "11-12", "12-1", "2-3", "3-4", "4-5"].map(
            (hour, hourIndex) => (
              <TableRow key={hour}>
                <TableCell>{hour}</TableCell>
                {productionData.lines.map((line, idx) => (
                  <>
                    <TableCell key={`pieces-${hourIndex}-${idx}`}>
                      <TextField
                        value={line.hourlyData[hourIndex]?.pieces || ""}
                        onChange={(e) =>
                          handleHourlyChange(idx, hourIndex, e.target.value)
                        }
                        placeholder="Pieces"
                      />
                    </TableCell>
                    <TableCell key={`efficiency-${hourIndex}-${idx}`}>
                      {Math.round(line.hourlyData[hourIndex]?.efficiency || 0)}%
                    </TableCell>
                  </>
                ))}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSaveHourlyData(hourIndex)}
                  >
                    Save Hour
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HourlyDataComponent;
