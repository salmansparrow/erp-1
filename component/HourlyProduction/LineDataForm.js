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
} from "@mui/material";

const LineDataForm = ({
  lines,
  handleLineChange,
  handleSaveLines,
  handleFetchPreviousData,
}) => {
  return (
    <Box>
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
                    ].includes(field.key) && !line.isLineSaved ? (
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
  );
};

export default LineDataForm;