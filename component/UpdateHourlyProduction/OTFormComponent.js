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

const OTFormComponent = ({
  productionData,
  otData,
  handleOTChange,
  handleSaveOTForLine,
}) => {
  if (!productionData || !productionData.lines) return null;

  return (
    <Box>
      <Typography variant="h6">OT Data</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Line</TableCell>
            <TableCell>OT Hours</TableCell>
            <TableCell>OT Men Power</TableCell>
            <TableCell>OT Pieces</TableCell>
            <TableCell>OT Minutes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productionData.lines.map((line, index) => (
            <TableRow key={index}>
              <TableCell>{`Line ${line.lineNumber}`}</TableCell>
              <TableCell>
                <TextField
                  value={otData[index]?.hours || ""}
                  onChange={(e) =>
                    handleOTChange(index, "hours", e.target.value)
                  }
                  type="number"
                  placeholder="OT Hours"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={otData[index]?.menPower || ""}
                  onChange={(e) =>
                    handleOTChange(index, "menPower", e.target.value)
                  }
                  type="number"
                  placeholder="OT Men Power"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={otData[index]?.pieces || ""}
                  onChange={(e) =>
                    handleOTChange(index, "pieces", e.target.value)
                  }
                  type="number"
                  placeholder="OT Pieces"
                />
              </TableCell>
              <TableCell>{otData[index]?.minutes || 0} Minutes</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveOTForLine(index)}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default OTFormComponent;
