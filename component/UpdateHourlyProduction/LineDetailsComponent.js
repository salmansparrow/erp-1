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

const LineDetailsComponent = ({
  productionData,
  handleLineDetailsChange,
  handleSaveLineDetails,
}) => {
  if (!productionData || !productionData.lines) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Line Details
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            {productionData.lines.map((line, index) => (
              <TableCell key={index}>{`Line ${line.lineNumber}`}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Editable Fields */}
          {["articleName", "SAM", "operator", "helper"].map((field) => (
            <TableRow key={field}>
              <TableCell>{field}</TableCell>
              {productionData.lines.map((line, index) => (
                <TableCell key={index}>
                  <TextField
                    value={line[field] || ""}
                    onChange={(e) =>
                      handleLineDetailsChange(index, field, e.target.value)
                    }
                    placeholder={field}
                    fullWidth
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Calculated Fields */}
          <TableRow>
            <TableCell>Shift Time</TableCell>
            {productionData.lines.map((line, index) => (
              <TableCell key={index}>{line.shiftTime || "480"} mins</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Target 100%</TableCell>
            {productionData.lines.map((line, index) => (
              <TableCell key={index}>{line.target100 || "0"}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Target 75%</TableCell>
            {productionData.lines.map((line, index) => (
              <TableCell key={index}>{line.target75 || "0"}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Target/Hour</TableCell>
            {productionData.lines.map((line, index) => (
              <TableCell key={index}>{line.targetPerHour || "0"}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveLineDetails}
        >
          Save Line Details
        </Button>
      </Box>
    </Box>
  );
};

export default LineDetailsComponent;
