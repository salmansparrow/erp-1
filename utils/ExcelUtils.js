// ExcelUtils.js
import * as XLSX from "xlsx";

export const handleDownloadExcel = (selectedProduction) => {
  if (!selectedProduction) return;

  // Define the data for the Excel file
  const data = [
    ["Hourly Production & Efficiency Board"], // Title row
    [`Dated : ${selectedProduction.date}`], // Date row
    [],
    [
      "Production / Target",
      "",
      "Day Target @ 80%",
      "",
      "",
      "Achieved Efficiency",
    ],
    ["#VALUE!", "", "1208", "", "", "#VALUE!"],
    [],
    ["Line", "4", "", "5", "", "12"],
    [
      "Article",
      selectedProduction.lines[0]?.articleName || "",
      "",
      selectedProduction.lines[1]?.articleName || "",
      "",
      selectedProduction.lines[2]?.articleName || "",
    ],
    [
      "SAM",
      selectedProduction.lines[0]?.SAM || "",
      "",
      selectedProduction.lines[1]?.SAM || "",
      "",
      selectedProduction.lines[2]?.SAM || "",
    ],
    [
      "Operator",
      selectedProduction.lines[0]?.operator || "",
      "",
      selectedProduction.lines[1]?.operator || "",
      "",
      selectedProduction.lines[2]?.operator || "",
    ],
    [
      "Helper",
      selectedProduction.lines[0]?.helper || "",
      "",
      selectedProduction.lines[1]?.helper || "",
      "",
      selectedProduction.lines[2]?.helper || "",
    ],
    [
      "Shift Time",
      selectedProduction.lines[0]?.shiftTime || "",
      "",
      selectedProduction.lines[1]?.shiftTime || "",
      "",
      selectedProduction.lines[2]?.shiftTime || "",
    ],
    [
      "Target 100%",
      selectedProduction.lines[0]?.target100 || "",
      "",
      selectedProduction.lines[1]?.target100 || "",
      "",
      selectedProduction.lines[2]?.target100 || "",
    ],
    ["Target Efficiency", "80%", "", "80%", "", "80%"],
    [
      "Target 80%",
      selectedProduction.lines[0]?.target75 || "",
      "",
      selectedProduction.lines[1]?.target75 || "",
      "",
      selectedProduction.lines[2]?.target75 || "",
    ],
    [
      "Target / Hour",
      selectedProduction.lines[0]?.targetPerHour || "",
      "",
      selectedProduction.lines[1]?.targetPerHour || "",
      "",
      selectedProduction.lines[2]?.targetPerHour || "",
    ],
    [],
    ["Hours", "Output", "Effi %", "Output", "Effi %", "Output", "Effi %"],
  ];

  // Add hourly data
  const hours = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "Break",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  hours.forEach((hour, index) => {
    const row = [hour];
    selectedProduction.lines.forEach((line) => {
      const hourlyData = line.hourlyData[index] || {};
      const pieces = hourlyData.pieces || 0;
      const efficiency = hourlyData.efficiency || "0%";
      row.push(pieces, efficiency);
    });
    data.push(row);
  });

  // Add OT data
  data.push([]);
  data.push([
    "O.T Pieces",
    ...selectedProduction.lines.map((line) => line.otData?.otPieces || ""),
  ]);
  data.push([
    "O.T Hours",
    ...selectedProduction.lines.map((line) => line.otData?.otHours || ""),
  ]);
  data.push([
    "O.T MenPower",
    ...selectedProduction.lines.map((line) => line.otData?.otMenPower || ""),
  ]);
  data.push([
    "O.T Minutes",
    ...selectedProduction.lines.map((line) => line.otData?.otMinutes || ""),
  ]);

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Apply styling (merge cells for headers and alignment)
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge title row
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Merge date row
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // Merge production column
    { s: { r: 3, c: 2 }, e: { r: 3, c: 4 } }, // Merge day target column
    { s: { r: 3, c: 5 }, e: { r: 3, c: 6 } }, // Merge achieved efficiency column
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data");

  // Export workbook to file
  XLSX.writeFile(workbook, `Hourly_Production_${selectedProduction.date}.xlsx`);
};
